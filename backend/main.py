from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
import io
import calendar 
from fastapi.responses import StreamingResponse

import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartMart API",
    description="API para gerenciamento de produtos e vendas da SmartMart",
    version="1.0.0"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CATEGORIAS ---

@app.post("/categories/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = crud.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Categoria já existente")
    return crud.create_category(db=db, category=category)

@app.get("/categories/", response_model=List[schemas.CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_categories(db, skip=skip, limit=limit)

@app.post("/categories/upload-csv")
async def upload_categories_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser CSV")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        df.columns = df.columns.str.strip().str.lower()
        
        added = 0
        errors = []
        
        for _, row in df.iterrows():
            try:
                if not crud.get_category_by_name(db, row['name']):
                    cat = schemas.CategoryCreate(name=str(row['name']))
                    crud.create_category(db, cat)
                    added += 1
            except Exception as e:
                errors.append(str(e))
                
        return {"message": "Categorias importadas", "added": added, "errors": errors}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")


# --- PRODUTOS ---

@app.post("/products/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.get("/products/", response_model=List[schemas.ProductResponse])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    search: str | None = None, 
    category_id: int | None = None,
    db: Session = Depends(get_db)
):
    return crud.get_products(db, skip=skip, limit=limit, search=search, category_id=category_id)

@app.get("/products/count")
def read_products_count(
    search: str | None = None,
    category_id: int | None = None,
    db: Session = Depends(get_db)
):
    count = crud.count_products(db, search=search, category_id=category_id)
    return {"total": count}

@app.get("/products/export-csv")
def export_products_csv(
    search: str | None = None,  
    category_id: int | None = None, 
    db: Session = Depends(get_db)
):
    products = crud.get_products(
        db, 
        skip=0, 
        limit=10000, 
        search=search, 
        category_id=category_id
    )
    
    data = []
    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "category": p.category.name if p.category else "Sem Categoria",
            "price": p.price
        })
    
    df = pd.DataFrame(data)
    stream = io.StringIO()
    df.to_csv(stream, index=False, sep=",")
    
    response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=products_export.csv"
    return response

@app.post("/products/upload-csv")
async def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")
    try:
        contents = await file.read()
        decoded_content = contents.decode('utf-8')
        try:
            df = pd.read_csv(io.StringIO(decoded_content), sep=',')
            if len(df.columns) < 2: raise ValueError("Separador incorreto")
        except:
            df = pd.read_csv(io.StringIO(decoded_content), sep=';')

        df.columns = df.columns.str.strip().str.lower()
        required_columns = {'name', 'price', 'category_id'}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            raise HTTPException(status_code=400, detail=f"Colunas faltando: {missing}")

        products_added = 0
        errors = []
        for index, row in df.iterrows():
            try:
                price_val = row['price']
                if isinstance(price_val, str): price_val = price_val.replace(',', '.')
                
                product_data = schemas.ProductCreate(
                    name=str(row['name']),
                    price=float(price_val),
                    category_id=int(row['category_id'])
                )
                crud.create_product(db=db, product=product_data)
                products_added += 1
            except Exception as e:
                errors.append(f"Linha {index + 1}: {str(e)}")
        return {"message": "Processamento concluído", "products_added": products_added, "errors": errors}
    except HTTPException as he: raise he
    except Exception as e: raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# --- VENDAS ---

@app.post("/sales/", response_model=schemas.SaleResponse)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    return crud.create_sale(db=db, sale=sale)

@app.get("/sales/", response_model=List[schemas.SaleResponse])
def read_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sales(db, skip=skip, limit=limit)

@app.post("/sales/upload-csv")
async def upload_sales_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Importa sales.csv - Suporta coluna 'date' convertendo para 'month'"""
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    try:
        contents = await file.read()
        decoded = contents.decode('utf-8-sig') 
        
        df = pd.read_csv(io.StringIO(decoded), sep=',')
        if len(df.columns) <= 1:
            df = pd.read_csv(io.StringIO(decoded), sep=';')
            
        df.columns = df.columns.str.strip().str.lower()
        
        has_month = 'month' in df.columns
        has_date = 'date' in df.columns

        if not (has_month or has_date):
            raise HTTPException(status_code=400, detail="O arquivo precisa ter uma coluna 'month' ou 'date'.")
        
        required = {'product_id', 'quantity', 'total_price'}
        if not required.issubset(df.columns):
            raise HTTPException(status_code=400, detail=f"Faltando colunas: {required - set(df.columns)}")

        added = 0
        errors = []

        for index, row in df.iterrows():
            try:
                month_val = ""
                if has_month:
                    month_val = str(row['month'])
                elif has_date:
                    date_val = pd.to_datetime(row['date'])
                    month_name = date_val.month_name()
                    month_val = month_name

                price_val = row['total_price']
                if isinstance(price_val, str):
                    price_val = float(price_val.replace('.', '').replace(',', '.'))
                
                sale_data = schemas.SaleCreate(
                    product_id=int(row['product_id']),
                    month=month_val, 
                    quantity=int(row['quantity']),
                    total_price=float(price_val)
                )
                crud.create_sale(db, sale_data)
                added += 1
            except Exception as e:
                errors.append(f"Linha {index}: {str(e)}")
            
        return {
            "message": "Processamento concluído", 
            "total_added": added, 
            "errors": errors[:5]
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# --- DASHBOARD ---

@app.get("/dashboard/metrics", response_model=schemas.DashboardResponse)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    return crud.get_dashboard_data(db)
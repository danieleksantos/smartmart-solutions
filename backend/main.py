from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import pandas as pd
import io

import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartMart API",
    description="API para gerenciamento de produtos e vendas da SmartMart",
    version="1.0.0"
)


@app.post("/categories/", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = crud.get_category_by_name(db, name=category.name)
    if db_category:
        raise HTTPException(status_code=400, detail="Categoria já existente")
    return crud.create_category(db=db, category=category)

@app.get("/categories/", response_model=List[schemas.CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_categories(db, skip=skip, limit=limit)


@app.post("/products/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@app.get("/products/", response_model=List[schemas.ProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_products(db, skip=skip, limit=limit)

@app.post("/products/upload-csv")
async def upload_products_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="O arquivo deve ser um CSV.")

    try:
        contents = await file.read()
        decoded_content = contents.decode('utf-8')

        try:
            df = pd.read_csv(io.StringIO(decoded_content), sep=',')
            if len(df.columns) < 2:
                raise ValueError("Separador incorreto")
        except:
            df = pd.read_csv(io.StringIO(decoded_content), sep=';')


        df.columns = df.columns.str.strip().str.lower()

        required_columns = {'name', 'price', 'category_id'}
        if not required_columns.issubset(df.columns):
            missing = required_columns - set(df.columns)
            raise HTTPException(status_code=400, detail=f"Colunas faltando no CSV: {missing}")

        products_added = 0
        errors = []

        for index, row in df.iterrows():
            try:
                price_val = row['price']
                if isinstance(price_val, str):
                    price_val = price_val.replace(',', '.')
                
                product_data = schemas.ProductCreate(
                    name=str(row['name']),
                    price=float(price_val),
                    category_id=int(row['category_id'])
                )
                
                crud.create_product(db=db, product=product_data)
                products_added += 1
                
            except Exception as e:
                errors.append(f"Linha {index + 1}: {str(e)}")

        return {
            "message": "Processamento concluído",
            "products_added": products_added,
            "errors": errors
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@app.post("/sales/", response_model=schemas.SaleResponse)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    return crud.create_sale(db=db, sale=sale)

@app.get("/sales/", response_model=List[schemas.SaleResponse])
def read_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sales(db, skip=skip, limit=limit)
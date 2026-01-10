from sqlalchemy.orm import Session
from sqlalchemy import func
import calendar 
import models, schemas

# --- CATEGORIAS ---
def get_category_by_name(db: Session, name: str):
    return db.query(models.Category).filter(models.Category.name == name).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- PRODUTOS ---
def get_products(db: Session, skip: int = 0, limit: int = 100, search: str | None = None, category_id: int | None = None):
    query = db.query(models.Product)
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    return query.offset(skip).limit(limit).all()


def get_product_by_name(db: Session, name: str):
    return db.query(models.Product).filter(models.Product.name == name).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(
        name=product.name,
        price=product.price,
        category_id=product.category_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    
    if db_product:
        if product.name is not None:
            db_product.name = product.name
        if product.price is not None:
            db_product.price = product.price
        if product.category_id is not None:
            db_product.category_id = product.category_id
            
        db.commit()
        db.refresh(db_product)
        
    return db_product

def count_products(db: Session, search: str | None = None, category_id: int | None = None):
    query = db.query(models.Product)
    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    return query.count()

# --- VENDAS ---
def get_sales(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Sale).offset(skip).limit(limit).all()

def create_sale(db: Session, sale: schemas.SaleCreate):
    db_sale = models.Sale(
        product_id=sale.product_id,
        month=sale.month,
        quantity=sale.quantity,
        total_price=sale.total_price
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

# --- DASHBOARD ---
def get_dashboard_data(db: Session):    
    results = db.query(
        models.Sale.month,
        func.sum(models.Sale.quantity).label("total_quantity"),
        func.sum(models.Sale.total_price).label("total_revenue")
    ).group_by(models.Sale.month).all()
    
    dashboard_data = []
    for row in results:
        dashboard_data.append({
            "month": row.month,
            "total_quantity": row.total_quantity,
            "total_revenue": row.total_revenue
        })

    month_map = {month: index for index, month in enumerate(calendar.month_name) if month}
    dashboard_data.sort(key=lambda x: month_map.get(x['month'], 100))

    cat_results = db.query(
        models.Sale.month,
        models.Category.name,
        func.sum(models.Sale.total_price)
    ).join(models.Product, models.Sale.product_id == models.Product.id)\
     .join(models.Category, models.Product.category_id == models.Category.id)\
     .group_by(models.Sale.month, models.Category.name).all()

    monthly_groups = {}
    for month, cat_name, total in cat_results:
        if month not in monthly_groups:
            monthly_groups[month] = {"month": month}
        monthly_groups[month][cat_name] = total

    category_breakdown = list(monthly_groups.values())
    category_breakdown.sort(key=lambda x: month_map.get(x['month'], 100))

    return {
        "sales_by_month": dashboard_data,
        "category_breakdown": category_breakdown
    }
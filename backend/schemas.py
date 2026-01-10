from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    price: float
    category_id: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


class SaleBase(BaseModel):
    product_id: int
    month: str
    quantity: int
    total_price: float

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


class DashboardMetric(BaseModel):
    month: str
    total_quantity: int
    total_revenue: float

class DashboardResponse(BaseModel):
    sales_by_month: List[DashboardMetric]
    category_breakdown: List[Dict[str, Any]]
from pydantic import BaseModel
from typing import List, Optional

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
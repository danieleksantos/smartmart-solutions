from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartMart API",
    description="API para gerenciamento de produtos e vendas da SmartMart",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"status": "running", "message": "SmartMart API is Online"}

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    return {"message": "Banco de dados conectado com sucesso!"}
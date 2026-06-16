from sqlalchemy import inspect, text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import auth_routes, transaction_routes, user_routes

Base.metadata.create_all(bind=engine)

with engine.begin() as connection:
    columns = [column["name"] for column in inspect(connection).get_columns("usuarios")]
    if "pix_key" not in columns:
        connection.execute(text("ALTER TABLE usuarios ADD COLUMN pix_key VARCHAR(160)"))

app = FastAPI(
    title="Gpay API",
    description="Banco digital fictício para estudos e portfólio.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(transaction_routes.router)


@app.get("/")
def home():
    return {"app": "Gpay", "status": "online"}

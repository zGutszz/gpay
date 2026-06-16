from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    cpf = Column(String(11), unique=True, nullable=False, index=True)
    email = Column(String(160), unique=True, nullable=False, index=True)
    telefone = Column(String(20), nullable=False)
    pix_key = Column(String(160), unique=True, nullable=True, index=True)
    senha_hash = Column(String(255), nullable=False)
    saldo = Column(Float, default=0.0, nullable=False)

    transacoes = relationship("Transacao", back_populates="usuario")


class Transacao(Base):
    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    tipo = Column(String(30), nullable=False)
    valor = Column(Float, nullable=False)
    descricao = Column(String(255), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow, nullable=False)

    usuario = relationship("Usuario", back_populates="transacoes")

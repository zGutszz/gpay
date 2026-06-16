from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models import Usuario
from app.schemas import Login, Token, UsuarioCreate

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UsuarioCreate, db: Session = Depends(get_db)):
    if db.query(Usuario).filter(Usuario.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Este email já está cadastrado.")

    if db.query(Usuario).filter(Usuario.cpf == payload.cpf).first():
        raise HTTPException(status_code=400, detail="Este CPF já está cadastrado.")

    user = Usuario(
        nome=payload.nome.strip(),
        cpf=payload.cpf,
        email=payload.email,
        telefone=payload.telefone.strip(),
        senha_hash=hash_password(payload.senha),
        saldo=0.0,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer", "usuario": user}


@router.post("/login", response_model=Token)
def login(payload: Login, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == payload.email).first()
    if not user or not verify_password(payload.senha, user.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
        )

    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer", "usuario": user}

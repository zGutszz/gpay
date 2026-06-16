from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Usuario
from app.schemas import PixKeyUpdate, UsuarioPublic

router = APIRouter(prefix="/users", tags=["Usuários"])


@router.get("/me", response_model=UsuarioPublic)
def get_profile(current_user: Usuario = Depends(get_current_user)):
    return current_user


@router.put("/me/pix-key", response_model=UsuarioPublic)
def update_pix_key(
    payload: PixKeyUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    existing = db.query(Usuario).filter(Usuario.pix_key == payload.pix_key, Usuario.id != current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Esta chave Pix já está cadastrada.")

    current_user.pix_key = payload.pix_key
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

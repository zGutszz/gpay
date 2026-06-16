from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Usuario
from app.schemas import DepositoCreate, TransacaoPublic, TransferenciaCreate, UsuarioPublic
from app.services.account_service import deposit, list_transactions, transfer

router = APIRouter(prefix="/transactions", tags=["Transações"])


@router.post("/deposit", response_model=UsuarioPublic)
def deposit_money(
    payload: DepositoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return deposit(db=db, user=current_user, value=payload.valor, description=payload.descricao)


@router.post("/transfer", response_model=UsuarioPublic)
def transfer_money(
    payload: TransferenciaCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return transfer(
        db=db,
        sender=current_user,
        recipient_email=payload.destinatario_email,
        value=payload.valor,
        description=payload.descricao,
    )


@router.get("/statement", response_model=list[TransacaoPublic])
def statement(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    return list_transactions(db=db, user_id=current_user.id)

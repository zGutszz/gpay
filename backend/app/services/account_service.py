from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import Transacao, Usuario


def create_transaction(
    db: Session,
    user_id: int,
    tipo: str,
    valor: float,
    descricao: str,
) -> Transacao:
    transaction = Transacao(
        usuario_id=user_id,
        tipo=tipo,
        valor=round(valor, 2),
        descricao=descricao.strip() or "Movimentação Gpay",
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def deposit(db: Session, user: Usuario, value: float, description: str) -> Usuario:
    user.saldo = round(user.saldo + value, 2)
    db.add(user)
    db.commit()
    db.refresh(user)
    create_transaction(db, user.id, "deposito", value, description)
    return user


def transfer(
    db: Session,
    sender: Usuario,
    recipient_email: str,
    value: float,
    description: str,
) -> Usuario:
    if sender.saldo < value:
        raise HTTPException(status_code=400, detail="Saldo insuficiente para concluir a transferência.")

    recipient = db.query(Usuario).filter(Usuario.email == recipient_email).first()
    if recipient is None:
        raise HTTPException(status_code=404, detail="Destinatário não encontrado.")

    if recipient.id == sender.id:
        raise HTTPException(status_code=400, detail="Você não pode transferir para sua própria conta.")

    sender.saldo = round(sender.saldo - value, 2)
    recipient.saldo = round(recipient.saldo + value, 2)
    db.add_all([sender, recipient])
    db.commit()
    db.refresh(sender)

    create_transaction(db, sender.id, "transferencia_enviada", value, description)
    create_transaction(
        db,
        recipient.id,
        "transferencia_recebida",
        value,
        f"Recebido de {sender.nome}",
    )
    return sender


def list_transactions(db: Session, user_id: int) -> list[Transacao]:
    return (
        db.query(Transacao)
        .filter(Transacao.usuario_id == user_id)
        .order_by(Transacao.criado_em.desc())
        .all()
    )

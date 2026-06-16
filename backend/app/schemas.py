from datetime import datetime
from re import fullmatch

from pydantic import BaseModel, Field, field_validator


def only_digits(value: str) -> str:
    return "".join(char for char in value if char.isdigit())


def is_valid_cpf(value: str) -> bool:
    cpf = only_digits(value)
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False

    for position in (9, 10):
        total = sum(int(cpf[index]) * ((position + 1) - index) for index in range(position))
        digit = (total * 10) % 11
        digit = 0 if digit == 10 else digit
        if digit != int(cpf[position]):
            return False
    return True


class UsuarioCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=120)
    cpf: str
    email: str
    senha: str = Field(min_length=6, max_length=72)
    telefone: str = Field(min_length=8, max_length=20)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            raise ValueError("Informe um email válido.")
        return email

    @field_validator("cpf")
    @classmethod
    def validate_cpf(cls, value: str) -> str:
        cpf = only_digits(value)
        if not is_valid_cpf(cpf):
            raise ValueError("Informe um CPF válido.")
        return cpf


class UsuarioPublic(BaseModel):
    id: int
    nome: str
    cpf: str
    email: str
    telefone: str
    pix_key: str | None = None
    saldo: float

    model_config = {"from_attributes": True}


class Login(BaseModel):
    email: str
    senha: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioPublic


class PixKeyUpdate(BaseModel):
    pix_key: str = Field(min_length=3, max_length=160)

    @field_validator("pix_key")
    @classmethod
    def normalize_pix_key(cls, value: str) -> str:
        return value.strip().lower()


class DepositoCreate(BaseModel):
    valor: float = Field(gt=0)
    descricao: str = Field(default="Depósito via Gpay", max_length=255)


class TransferenciaCreate(BaseModel):
    destinatario_email: str
    valor: float = Field(gt=0)
    descricao: str = Field(default="Transferência Gpay", max_length=255)

    @field_validator("destinatario_email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class TransacaoPublic(BaseModel):
    id: int
    usuario_id: int
    tipo: str
    valor: float
    descricao: str
    criado_em: datetime

    model_config = {"from_attributes": True}

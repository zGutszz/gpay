# Gpay

Gpay é um banco digital fictício criado para estudo e portfólio. O projeto simula uma carteira digital moderna com autenticação JWT, dashboard financeiro, cartão virtual, depósitos, transferências fake e extrato.

> Este projeto não é um banco real e não realiza operações financeiras reais.

## Tecnologias

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- JWT
- bcrypt
- Pydantic

### Frontend

- React + Vite
- JavaScript
- TailwindCSS
- Axios
- React Router
- Framer Motion

## Estrutura

```text
Gpay/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   ├── routes/
│   │   └── services/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Como Instalar

Clone o repositório e acesse a pasta:

```bash
git clone <url-do-repositorio>
cd Gpay
```

## Como Rodar o Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://localhost:8000
```

Documentação interativa:

```text
http://localhost:8000/docs
```

## Como Rodar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

## Funcionalidades

- Cadastro de usuário com nome, CPF, email, senha, telefone e saldo inicial
- Login com JWT
- Senhas criptografadas com bcrypt
- Validação de email e CPF
- Dashboard com saudação, saldo e cartão virtual
- Depósito fake
- Transferência fake entre usuários
- Pix fake usando email do destinatário
- Extrato de transações
- Bloqueio de saldo negativo
- Mensagens de erro amigáveis



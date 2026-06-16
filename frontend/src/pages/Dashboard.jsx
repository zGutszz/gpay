import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionModal from '../components/ActionModal'
import SocialFooter from '../components/SocialFooter'
import VirtualCard from '../components/VirtualCard'
import api from '../services/api'
import { getStoredUser, logout, saveUser } from '../services/auth'

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const emptyForm = {
  valor: '',
  descricao: '',
  destinatario_email: '',
}

function getErrorMessage(error) {
  const detail = error.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail[0]?.msg || 'Revise os dados e tente novamente.'
  }
  return detail || 'Não foi possível processar a transação.'
}

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getStoredUser())
  const [transactions, setTransactions] = useState([])
  const [activeAction, setActiveAction] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [pixKey, setPixKey] = useState(getStoredUser()?.pix_key || '')
  const [pixMessage, setPixMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [pixLoading, setPixLoading] = useState(false)
  const [error, setError] = useState('')

  const firstName = useMemo(() => user?.nome?.split(' ')[0] || 'usuário', [user])
  const sentTotal = transactions
    .filter((transaction) => transaction.tipo === 'transferencia_enviada')
    .reduce((total, transaction) => total + transaction.valor, 0)
  const receivedTotal = transactions
    .filter((transaction) => ['deposito', 'transferencia_recebida'].includes(transaction.tipo))
    .reduce((total, transaction) => total + transaction.valor, 0)
  const lastTransaction = transactions[0]

  async function loadDashboard() {
    const [profileResponse, statementResponse] = await Promise.all([
      api.get('/users/me'),
      api.get('/transactions/statement'),
    ])
    setUser(profileResponse.data)
    setPixKey(profileResponse.data.pix_key || '')
    saveUser(profileResponse.data)
    setTransactions(statementResponse.data)
  }

  useEffect(() => {
    let isMounted = true

    async function loadInitialData() {
      try {
        const [profileResponse, statementResponse] = await Promise.all([
          api.get('/users/me'),
          api.get('/transactions/statement'),
        ])

        if (!isMounted) {
          return
        }

        setUser(profileResponse.data)
        setPixKey(profileResponse.data.pix_key || '')
        saveUser(profileResponse.data)
        setTransactions(statementResponse.data)
      } catch {
        logout()
        navigate('/login')
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [navigate])

  function openAction(type) {
    setActiveAction(type)
    setForm({ ...emptyForm, descricao: type === 'deposit' ? 'Depósito Gpay' : 'Transferência Gpay' })
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        valor: Number(form.valor),
        descricao: form.descricao,
      }

      const endpoint = activeAction === 'deposit' ? '/transactions/deposit' : '/transactions/transfer'
      if (activeAction !== 'deposit') {
        payload.destinatario_email = form.destinatario_email
      }

      const { data } = await api.post(endpoint, payload)
      setUser(data)
      saveUser(data)
      await loadDashboard()
      setActiveAction(null)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  async function handlePixKeySubmit(event) {
    event.preventDefault()
    setPixLoading(true)
    setPixMessage('')

    try {
      const { data } = await api.put('/users/me/pix-key', { pix_key: pixKey })
      setUser(data)
      saveUser(data)
      setPixMessage('Chave Pix cadastrada com sucesso.')
    } catch (requestError) {
      setPixMessage(getErrorMessage(requestError))
    } finally {
      setPixLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-300">Gpay</p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">Olá, {firstName}</h1>
            <p className="mt-1 text-sm text-violet-100/60">Sua central financeira fictícia, organizada e pronta para demo.</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:bg-white/10"
          >
            Sair
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 text-left"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-violet-100/70">Saldo disponível</p>
                <p className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{currency.format(user?.saldo || 0)}</p>
              </div>
              <span className="w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Conta ativa
              </span>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ActionButton label="Depositar" onClick={() => openAction('deposit')} />
              <ActionButton label="Transferir" onClick={() => openAction('transfer')} />
              <ActionButton label="Pix" onClick={() => openAction('pix')} />
              <a
                href="#extrato"
                className="rounded-xl border border-violet-300/15 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-violet-100 transition hover:bg-violet-500/20"
              >
                Extrato
              </a>
            </div>
          </motion.div>

          <VirtualCard user={user} />
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric title="Entradas" value={currency.format(receivedTotal)} detail="Depósitos e recebimentos" />
          <Metric title="Saídas" value={currency.format(sentTotal)} detail="Transferências enviadas" />
          <Metric
            title="Última transação"
            value={lastTransaction ? currency.format(lastTransaction.valor) : 'R$ 0,00'}
            detail={lastTransaction ? lastTransaction.descricao : 'Sem movimentações'}
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="glass rounded-2xl p-6 text-left">
            <h2 className="text-2xl font-semibold text-white">Área Pix</h2>
            <p className="mt-1 text-sm text-violet-100/60">Cadastre uma chave para simular recebimentos e transferências.</p>

            <form onSubmit={handlePixKeySubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={pixKey}
                onChange={(event) => setPixKey(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-violet-300/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                placeholder="email, telefone ou chave aleatória"
                required
              />
              <button
                disabled={pixLoading}
                className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                {pixLoading ? 'Salvando...' : 'Cadastrar chave'}
              </button>
            </form>
            {pixMessage && <p className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-violet-100">{pixMessage}</p>}
          </div>

          <aside className="rounded-2xl border border-violet-300/15 bg-violet-950/30 p-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-300">Conta</p>
            <dl className="mt-5 space-y-4 text-sm">
              <Info label="Nome" value={user?.nome} />
              <Info label="Email" value={user?.email} />
              <Info label="CPF" value={user?.cpf} />
              <Info label="Chave Pix" value={user?.pix_key || 'Não cadastrada'} />
            </dl>
          </aside>
        </section>

        <section id="extrato" className="mt-6">
          <div className="glass rounded-2xl p-6 text-left">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">Extrato</h2>
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-200">
                {transactions.length} movimentações
              </span>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 && (
                <p className="rounded-xl border border-dashed border-violet-300/20 p-5 text-violet-100/70">
                  Nenhuma transação registrada.
                </p>
              )}
              {transactions.map((transaction) => (
                <article
                  key={transaction.id}
                  className="flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold capitalize text-white">{transaction.tipo.replaceAll('_', ' ')}</p>
                    <p className="mt-1 text-sm text-violet-100/60">{transaction.descricao}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-violet-200">{currency.format(transaction.valor)}</p>
                    <p className="mt-1 text-xs text-violet-100/50">
                      {new Date(transaction.criado_em).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <SocialFooter />

      <AnimatePresence>
        {activeAction && (
          <ActionModal
            type={activeAction}
            form={form}
            setForm={setForm}
            loading={loading}
            error={error}
            onClose={() => setActiveAction(null)}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-violet-300/15 bg-white/5 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:bg-violet-500/20"
    >
      {label}
    </button>
  )
}

function Metric({ title, value, detail }) {
  return (
    <article className="rounded-2xl border border-violet-300/15 bg-slate-900/45 p-5 text-left backdrop-blur">
      <p className="text-sm text-violet-100/60">{title}</p>
      <strong className="mt-2 block text-2xl text-white">{value}</strong>
      <span className="mt-1 block text-xs text-violet-100/45">{detail}</span>
    </article>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-violet-100/50">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-white">{value || '-'}</dd>
    </div>
  )
}

export default Dashboard

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SocialFooter from '../components/SocialFooter'
import api from '../services/api'
import { saveSession } from '../services/auth'

const initialForm = {
  nome: '',
  cpf: '',
  email: '',
  senha: '',
  telefone: '',
}

function getErrorMessage(error) {
  const detail = error.response?.data?.detail
  if (Array.isArray(detail)) {
    return detail[0]?.msg || 'Revise os dados e tente novamente.'
  }
  return detail || 'Não foi possível concluir a operação.'
}

function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login'
      const payload = isRegister ? form : { email: form.email, senha: form.senha }
      const { data } = await api.post(endpoint, payload)
      saveSession(data)
      navigate('/dashboard')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid w-full max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="flex flex-col justify-between rounded-2xl border border-violet-300/15 bg-violet-950/30 p-8 text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-violet-300">Gpay</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Seu banco na palma da sua mão
            </h1>
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm text-violet-100/75">Atualmente contamos com</p>
            <p className="mt-2 text-3xl font-semibold text-white">1.847 clientes</p>
            <p className="mt-1 text-sm text-violet-100/60">em nosso banco digital</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 text-left sm:p-8">
          <h2 className="text-3xl font-semibold text-white">{isRegister ? 'Criar conta' : 'Entrar na conta'}</h2>
          <p className="mt-2 text-sm text-violet-100/70">
            {isRegister ? 'Abra sua conta fictícia em poucos segundos.' : 'Acesse o dashboard financeiro fake.'}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {isRegister && (
              <>
                <Input label="Nome" value={form.nome} onChange={(nome) => setForm({ ...form, nome })} required />
                <Input label="CPF" value={form.cpf} onChange={(cpf) => setForm({ ...form, cpf })} required />
              </>
            )}
            <Input
              label="Email"
              value={form.email}
              onChange={(email) => setForm({ ...form, email })}
              type="email"
              required
            />
            {isRegister && (
              <Input
                label="Telefone"
                value={form.telefone}
                onChange={(telefone) => setForm({ ...form, telefone })}
                required
              />
            )}
            <Input
              label="Senha"
              value={form.senha}
              onChange={(senha) => setForm({ ...form, senha })}
              type="password"
              required
            />
          </div>

          {error && <p className="mt-5 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</p>}

          <button
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Aguarde...' : isRegister ? 'Cadastrar' : 'Entrar'}
          </button>

          <p className="mt-5 text-center text-sm text-violet-100/70">
            {isRegister ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
            <Link className="font-semibold text-violet-300 hover:text-violet-200" to={isRegister ? '/login' : '/cadastro'}>
              {isRegister ? 'Entrar' : 'Criar cadastro'}
            </Link>
          </p>
        </form>
      </motion.section>
      <SocialFooter />
    </main>
  )
}

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block text-sm text-violet-100/80">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="mt-2 w-full rounded-xl border border-violet-300/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400"
        {...props}
      />
    </label>
  )
}

export default AuthPage

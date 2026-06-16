import { motion } from 'framer-motion'

const labels = {
  deposit: {
    title: 'Depositar',
    description: 'Valor disponível na hora na sua conta Gpay.',
    submit: 'Confirmar depósito',
  },
  transfer: {
    title: 'Transferir',
    description: 'Envie saldo fake para outro usuário pelo email cadastrado.',
    submit: 'Enviar transferência',
  },
  pix: {
    title: 'Pix',
    description: 'Simulação de Pix usando a mesma conta Gpay de destino.',
    submit: 'Enviar Pix',
  },
}

function ActionModal({ type, form, setForm, loading, error, onClose, onSubmit }) {
  const content = labels[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass w-full max-w-md rounded-2xl p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{content.title}</h2>
            <p className="mt-1 text-sm text-violet-100/70">{content.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-slate-300 transition hover:bg-white/10"
            aria-label="Fechar"
          >
            x
          </button>
        </div>

        {(type === 'transfer' || type === 'pix') && (
          <label className="mb-4 block text-left text-sm text-violet-100/80">
            Email do destinatário
            <input
              value={form.destinatario_email}
              onChange={(event) => setForm({ ...form, destinatario_email: event.target.value })}
              className="mt-2 w-full rounded-xl border border-violet-300/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              placeholder="cliente@gpay.com"
              type="email"
              required
            />
          </label>
        )}

        <label className="mb-4 block text-left text-sm text-violet-100/80">
          Valor
          <input
            value={form.valor}
            onChange={(event) => setForm({ ...form, valor: event.target.value })}
            className="mt-2 w-full rounded-xl border border-violet-300/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            min="1"
            step="0.01"
            type="number"
            required
          />
        </label>

        <label className="mb-4 block text-left text-sm text-violet-100/80">
          Descrição
          <input
            value={form.descricao}
            onChange={(event) => setForm({ ...form, descricao: event.target.value })}
            className="mt-2 w-full rounded-xl border border-violet-300/15 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            placeholder="Ex: reserva do mês"
          />
        </label>

        {error && <p className="mb-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-100">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Processando...' : content.submit}
        </button>
      </motion.form>
    </div>
  )
}

export default ActionModal

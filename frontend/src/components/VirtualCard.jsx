import { motion } from 'framer-motion'

function VirtualCard({ user }) {
  const name = user?.nome || 'Cliente Gpay'

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-scene min-h-64"
      aria-label="Cartão virtual Gpay"
    >
      <div className="card-flip min-h-64">
        <div className="card-face card-front relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-700 via-purple-700 to-slate-950 p-6 text-left shadow-2xl">
          <div className="absolute right-6 top-6 h-20 w-20 rounded-full bg-violet-300/20 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="text-lg font-semibold">Gpay Black</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-violet-100">
              virtual
            </span>
          </div>

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-100/65">Titular</p>
            <strong className="mt-2 block truncate text-2xl font-semibold text-white">{name}</strong>
          </div>
        </div>

        <div className="card-face card-back relative flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-slate-950 via-violet-950 to-purple-800 p-6 text-left shadow-2xl">
          <div className="h-10 rounded-lg bg-slate-900/80" />
          <div>
            <p className="mb-5 font-mono text-xl tracking-[0.2em] text-white sm:text-2xl">4987 2310 8842 0916</p>
            <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-[0.18em] text-violet-100/70">
              <div>
                <p>Validade</p>
                <strong className="mt-1 block text-sm tracking-normal text-white">12/30</strong>
              </div>
              <div>
                <p>CVV</p>
                <strong className="mt-1 block text-sm tracking-normal text-white">742</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default VirtualCard

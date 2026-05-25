import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/contexts/auth-context"
import { APP_NAME } from "@/lib/constants"
import { Eye, EyeOff, Loader2, User, Mail, Phone, Lock, ArrowRight, Package } from "lucide-react"

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    setLoading(true)
    const result = await register(form)
    if (result.success) {
      navigate("/dashboard")
    } else {
      setError(result.message || "Gagal mendaftar")
    }
    setLoading(false)
  }

  return (
    <div className="bg-[var(--background)] min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop font-body-base text-[var(--text-primary)]">
      <div className="w-full max-w-md bg-[var(--surface)] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-[var(--border)] p-lg md:p-xl">
        <div className="text-center mb-xl">
          <div className="flex items-center justify-center gap-sm mb-sm text-[var(--primary)]">
            <Package size={32} />
            <h1 className="font-headline-md text-headline-md font-bold tracking-tight">{APP_NAME}</h1>
          </div>
          <p className="font-body-base text-body-base text-[var(--text-secondary)]">Buat akun baru untuk mulai mengelola titipan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          {error && (
            <div className="rounded-lg bg-[var(--destructive)]/10 px-md py-sm text-body-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          <div className="space-y-xs">
            <label className="block font-body-sm text-body-sm font-medium text-[var(--text-primary)]" htmlFor="fullName">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-[var(--text-muted)]">
                <User size={18} />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
                className="block w-full pl-xl pr-sm py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] font-body-sm text-body-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="block font-body-sm text-body-sm font-medium text-[var(--text-primary)]" htmlFor="email">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-[var(--text-muted)]">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="nama@email.com"
                required
                className="block w-full pl-xl pr-sm py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] font-body-sm text-body-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="block font-body-sm text-body-sm font-medium text-[var(--text-primary)]" htmlFor="phone">No. Telepon</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-[var(--text-muted)]">
                <Phone size={18} />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="08xx-xxxx-xxxx"
                required
                className="block w-full pl-xl pr-sm py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg font-data-inventory text-data-inventory text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="block font-body-sm text-body-sm font-medium text-[var(--text-primary)]" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-[var(--text-muted)]">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                className="block w-full pl-xl pr-xl py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] font-body-sm text-body-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-sm flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-xs">
            <label className="block font-body-sm text-body-sm font-medium text-[var(--text-primary)]" htmlFor="confirmPassword">Konfirmasi Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none text-[var(--text-muted)]">
                <Lock size={18} />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                placeholder="Ulangi password"
                required
                className="block w-full pl-xl pr-xl py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] font-body-sm text-body-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-sm flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-body-base text-body-base font-medium py-sm px-md rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center gap-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <><span>Daftar</span> <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-lg text-center">
          <p className="font-body-sm text-body-sm text-[var(--text-secondary)]">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium underline-offset-4 hover:underline transition-all">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

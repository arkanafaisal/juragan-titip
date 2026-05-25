import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/contexts/auth-context"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, LayoutDashboard } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login({ email, password })
    if (result.success) {
      navigate("/dashboard")
    } else {
      setError(result.message || "Gagal masuk")
    }
    setLoading(false)
  }

  return (
    <div className="bg-[var(--background)] min-h-screen flex flex-col font-body-base text-body-base text-[var(--text-primary)]">
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-[var(--primary)] rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-[var(--primary)] rounded-full blur-[100px] opacity-10"></div>
        </div>

        <div className="w-full max-w-[28rem] relative z-10">
          <div className="bg-[var(--surface)] opacity-90 backdrop-blur-sm border border-[var(--border)] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-lg md:p-xl">

            <div className="text-center mb-xl">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--surface-elevated)] mb-sm">
                <LayoutDashboard className="text-[var(--primary)]" size={24} />
              </div>
              <h1 className="font-headline-md text-headline-md text-[var(--text-primary)] mb-xs">{APP_NAME}</h1>
              <p className="font-body-sm text-body-sm text-[var(--text-secondary)]">{APP_DESCRIPTION}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              {error && (
                <div className="rounded-lg bg-[var(--destructive)]/10 px-md py-sm text-body-sm text-[var(--destructive)]">
                  {error}
                </div>
              )}

              <div className="space-y-xs">
                <label className="block font-label-caps text-label-caps text-[var(--text-secondary)]" htmlFor="email">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                    <Mail className="text-[var(--text-muted)]" size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    required
                    className="w-full pl-xl pr-sm py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg font-body-sm text-body-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all shadow-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label className="block font-label-caps text-label-caps text-[var(--text-secondary)]" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                    <Lock className="text-[var(--text-muted)]" size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-xl pr-xl py-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg font-body-sm text-body-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all shadow-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-sm flex items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-sm mb-lg">
                <label className="flex items-center gap-xs cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] bg-[var(--surface)] cursor-pointer" />
                  <span className="font-body-sm text-body-sm text-[var(--text-secondary)]">Ingat saya</span>
                </label>
                <a href="#" className="font-body-sm text-body-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">Lupa Password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-body-base text-body-base font-medium py-sm rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-sm mt-lg"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Masuk <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="relative my-lg">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-sm bg-[var(--surface)] text-[var(--text-secondary)] font-label-caps text-label-caps">atau</span>
              </div>
            </div>

            <div className="text-center">
              <p className="font-body-sm text-body-sm text-[var(--text-secondary)]">
                Belum punya akun?{" "}
                <Link to="/register" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium underline underline-offset-4 transition-colors">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-lg text-center">
            <p className="font-body-sm text-body-sm text-[var(--text-muted)]">
              Demo: ahmad@juragan.com / password
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-center w-full py-lg px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
          <p className="font-body-sm text-body-sm text-[var(--text-secondary)] mb-md md:mb-0">© 2026 JuraganTitip. All rights reserved.</p>
          <div className="flex gap-lg">
            <a href="#" className="font-body-sm text-body-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Support</a>
            <a href="#" className="font-body-sm text-body-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Privacy Policy</a>
            <a href="#" className="font-body-sm text-body-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

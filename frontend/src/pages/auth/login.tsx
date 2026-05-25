import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/contexts/auth-context"
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants"
import { Eye, EyeOff, Loader2 } from "lucide-react"

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white font-bold text-lg">
            JT
          </div>
          <h1 className="text-h1 text-[var(--text-primary)]">{APP_NAME}</h1>
          <p className="text-body text-[var(--text-secondary)] mt-1">
            {APP_DESCRIPTION}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border bg-[var(--surface)] p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-lg bg-[var(--color-destructive-50)] px-4 py-3 text-body-sm text-[var(--destructive)]">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-body-sm font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              required
              className="w-full rounded-lg border bg-[var(--background)] px-3 py-2.5 text-body text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-body-sm font-medium text-[var(--text-primary)]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border bg-[var(--background)] px-3 py-2.5 pr-10 text-body text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] px-4 py-2.5 text-body font-medium text-white hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 size={18} className="mx-auto animate-spin" />
            ) : (
              "Masuk"
            )}
          </button>

          <p className="text-center text-body-sm text-[var(--text-secondary)]">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Daftar di sini
            </Link>
          </p>

          <div className="border-t pt-3">
            <p className="text-caption text-[var(--text-muted)] text-center">
              Demo: ahmad@juragan.com / password
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

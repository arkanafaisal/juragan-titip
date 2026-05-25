// @ts-nocheck
import React, { useState } from "react";
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-md text-on-surface antialiased">
      {/* Login Canvas */}
      <main className="w-full max-w-[400px]">
        {/* Glassmorphism Card */}
        <div
          className="bg-surface rounded-xl shadow-sm border border-outline-variant p-5 flex flex-col gap-lg relative overflow-hidden">
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>

          {/* Branding Header */}
          <div className="flex flex-col items-center text-center mt-sm">
            <div
              className="w-12 h-12 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center mb-md shadow-sm">
              {/* Menggunakan Package dengan fill currentColor untuk meniru 'FILL' 1 dari Material Symbols */}
              <Package size={28} fill="currentColor" strokeWidth={1.5} />
            </div>
            <h1 className="font-h1 text-h1 text-text-primary mb-xs">JuraganTitip</h1>
            <p className="font-body text-body text-text-secondary">Sistem Manajemen Konsinyasi Terpadu</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-data-md text-data-md text-text-primary" htmlFor="email">Email</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-md text-text-secondary" size={20} />
                <input
                  className="w-full pl-10 pr-md py-2 bg-surface border border-outline-variant rounded-lg font-body text-body text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all shadow-sm"
                  id="email" placeholder="nama@perusahaan.com" type="email" />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-data-md text-data-md text-text-primary" htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-md text-text-secondary" size={20} />
                <input
                  className="w-full pl-10 pr-10 py-2 bg-surface border border-outline-variant rounded-lg font-body text-body text-on-surface placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all shadow-sm"
                  id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
                <button
                  className="absolute right-md text-text-secondary hover:text-text-primary transition-colors focus:outline-none flex items-center justify-center"
                  type="button" onClick={handleTogglePassword}>
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <a className="font-caption text-caption text-primary-container hover:underline focus:outline-none"
                  href="#">Lupa password?</a>
              </div>
            </div>

            {/* Primary Action */}
            <button
              className="mt-sm w-full py-2.5 bg-primary-container text-on-primary-container font-h3 text-h3 rounded-lg shadow-sm hover:opacity-90 active:scale-[0.97] transition-all duration-100 flex items-center justify-center gap-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container"
              type="submit">
              Masuk
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-xs pt-md border-t border-outline-variant border-opacity-50">
            <p className="font-body-sm text-body-sm text-text-secondary">
              Belum punya akun?
              <a className="text-primary-container font-data-md hover:underline focus:outline-none" href="#">Daftar di
                sini</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
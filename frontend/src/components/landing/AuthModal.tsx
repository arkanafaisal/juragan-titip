import { Store, X, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthModal } from '@/hooks/useAuthModal';

export type User = {
  username: string;
  email?: string;
};

export type AuthMode = 'login' | 'register' | null;

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (userData: User) => void;
}

export default function AuthModal({ initialMode, onClose, onSuccess }: AuthModalProps) {
  const { t } = useTranslation();
  const {
    mode,
    setMode,
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit
  } = useAuthModal({ initialMode, onSuccess });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 jt-bg-overlay backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          disabled={isSubmitting}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 jt-bg-surface hover:jt-bg-primary-soft jt-text-light hover:jt-text-primary rounded-full transition-colors focus:outline-none disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 sm:mb-6 text-center">
          <div className="mx-auto jt-bg-primary-soft w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-4">
            <Store className="h-5 w-5 sm:h-6 sm:w-6 jt-text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold jt-text-heading">
            {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
          </h2>
          <p className="text-xs sm:text-sm jt-text-muted mt-1 sm:mt-2">
            {mode === 'login' ? t('auth.loginDesc') : t('auth.registerDesc')}
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 jt-bg-primary-soft border jt-border-base rounded-xl flex items-center gap-2 jt-text-error text-xs font-bold animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'login' ? (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-bold jt-text-body mb-1">{t('auth.labelIdentifier')}</label>
                <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} disabled={isSubmitting} placeholder={t('auth.placeholderIdentifier')} className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 jt-bg-surface border ${errors.identifier ? 'border-red-500 focus:ring-red-500' : 'jt-border-base focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm disabled:opacity-60`} />
                {errors.identifier && <p className="jt-text-error text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.identifier}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold jt-text-body mb-1">{t('auth.labelPassword')}</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} placeholder={t('auth.placeholderPassword')} className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 jt-bg-surface border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'jt-border-base focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm disabled:opacity-60`} />
                {errors.password && <p className="jt-text-error text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.password}</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-bold jt-text-body mb-1">{t('auth.labelUsername')} <span className="jt-text-primary-light">*</span></label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} disabled={isSubmitting} placeholder={t('auth.placeholderUsername')} className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 jt-bg-surface border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'jt-border-base focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm disabled:opacity-60`} />
                {errors.username && <p className="jt-text-error text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.username}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold jt-text-body mb-1">{t('auth.labelEmail')} <span className="jt-text-light font-normal">{t('auth.labelOptional')}</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} placeholder={t('auth.placeholderEmail')} className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 jt-bg-surface border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'jt-border-base focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm disabled:opacity-60`} />
                {errors.email && <p className="jt-text-error text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold jt-text-body mb-1">{t('auth.labelPassword')} <span className="jt-text-primary-light">*</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} placeholder={t('auth.placeholderPassword')} className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 jt-bg-surface border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'jt-border-base focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm disabled:opacity-60`} />
                {errors.password && <p className="jt-text-error text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.password}</p>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-bold jt-text-body mb-1">{t('auth.labelConfirm')} <span className="jt-text-primary-light">*</span></label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} placeholder={t('auth.placeholderConfirm')} className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 jt-bg-surface border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'jt-border-base focus:border-rose-500 focus:ring-rose-500'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all text-sm disabled:opacity-60`} />
                {errors.confirmPassword && <p className="jt-text-error text-[11px] sm:text-xs font-semibold mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3"/>{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-10 sm:h-12 jt-bg-primary hover:jt-bg-primary-hover text-white rounded-full font-bold text-sm sm:text-base transition-colors shadow-md mt-4 sm:mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> {t('auth.btnSubmitting') || 'Processing...'}</> : (mode === 'login' ? t('auth.btnLogin') : t('auth.btnSignup'))}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm font-medium jt-text-muted">
          {mode === 'login' ? (
            <>{t('auth.noAccount')} <button type="button" disabled={isSubmitting} onClick={() => setMode('register')} className="jt-text-primary hover:underline disabled:opacity-50">{t('auth.linkSignup')}</button></>
          ) : (
            <>{t('auth.hasAccount')} <button type="button" disabled={isSubmitting} onClick={() => setMode('login')} className="jt-text-primary hover:underline disabled:opacity-50">{t('auth.linkLogin')}</button></>
          )}
        </div>
      </div>
    </div>
  );
}

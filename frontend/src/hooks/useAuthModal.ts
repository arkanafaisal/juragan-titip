import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@/utils/api';
import type { User } from '@/components/landing/AuthModal';

export type AuthFormData = {
  identifier?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type AuthErrors = Partial<AuthFormData>;

interface UseAuthModalProps {
  initialMode: 'login' | 'register';
  onSuccess: (userData: User) => void;
}

export function useAuthModal({ initialMode, onSuccess }: UseAuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode); 
  const [formData, setFormData] = useState<AuthFormData>({ identifier: '', username: '', email: undefined, password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof AuthErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    const newErrors: AuthErrors = {};

    if (mode === 'register') {
      if (!formData.username) newErrors.username = t('auth.errRequired');
      else if (formData.username.length > 20) newErrors.username = t('auth.errMax20');

      if (formData.email && formData.email.length > 255) newErrors.email = t('auth.errMax255');

      if (!formData.password) newErrors.password = t('auth.errRequired');
      else if (formData.password.length < 6) newErrors.password = t('auth.errMin6');
      else if (formData.password.length > 255) newErrors.password = t('auth.errMax255');

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errMismatch');
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      setIsSubmitting(true);
      try {
        const response = await api.auth.register({
          username: formData.username!,
          email: formData.email,
          password: formData.password!
        });
        
        if (response.success && response.data) {
          onSuccess(response.data.user);
        } else {
          setApiError(response.message);
        }
      } catch (error) {
        setApiError(t('auth.errSystem'));
      } finally {
        setIsSubmitting(false);
      }

    } else {
      if (!formData.identifier) newErrors.identifier = t('auth.errRequired');
      else if (formData.identifier.length > 255) newErrors.identifier = t('auth.errLimit');

      if (!formData.password) newErrors.password = t('auth.errRequired');
      else if (formData.password.length < 6) newErrors.password = t('auth.errMin6');
      else if (formData.password.length > 255) newErrors.password = t('auth.errMax255');

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await api.auth.login({
          identifier: formData.identifier!,
          password: formData.password!
        });
        
        if (response.success && response.data) {
          onSuccess(response.data.user);
        } else {
          setApiError(response.message);
        }
      } catch (error) {
        setApiError(t('auth.errSystem'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    mode,
    setMode,
    formData,
    errors,
    isSubmitting,
    apiError,
    handleChange,
    handleSubmit
  };
}

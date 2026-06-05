import { useNavigate } from 'react-router';

export function useSmartBack() {
  const navigate = useNavigate();

  const goBack = (fallbackUrl: string) => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackUrl, { replace: true }); 
    }
  };

  return { goBack };
}
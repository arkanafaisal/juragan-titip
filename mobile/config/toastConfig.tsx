import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'hsl(161, 64%, 39%)', backgroundColor: 'hsl(0, 0%, 100%)' }} // success, surface
      text1Style={{ fontSize: 14, fontWeight: '700', color: 'hsl(222, 47%, 11%)' }} // text-primary
      text2Style={{ fontSize: 12, color: 'hsl(215, 16%, 47%)' }} // text-secondary
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#ba1a1a', backgroundColor: '#ffdad6' }} // error, error-container
      text1Style={{ fontSize: 14, fontWeight: '700', color: '#93000a' }} // on-error-container
      text2Style={{ fontSize: 12, color: '#ba1a1a' }} // error
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'hsl(38, 92%, 50%)', backgroundColor: 'hsl(0, 0%, 100%)' }} // warning, surface
      text1Style={{ fontSize: 14, fontWeight: '700', color: '#0b1c30' }} // on-warning (or text-primary)
      text2Style={{ fontSize: 12, color: 'hsl(215, 16%, 47%)' }} // text-secondary
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'hsl(262, 83%, 66%)', backgroundColor: 'hsl(0, 0%, 100%)' }} // info, surface
      text1Style={{ fontSize: 14, fontWeight: '700', color: 'hsl(222, 47%, 11%)' }} // text-primary
      text2Style={{ fontSize: 12, color: 'hsl(215, 16%, 47%)' }} // text-secondary
    />
  )
};
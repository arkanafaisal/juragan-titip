import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export function useExitAppConfirmation() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onBackPress = () => {
      if (!router.canGoBack() && pathname === '/') {
        Alert.alert(
          'Keluar Aplikasi',
          'Apakah Anda yakin ingin keluar dari aplikasi?',
          [
            { text: 'Batal', style: 'cancel', onPress: () => {} },
            { text: 'Keluar', style: 'destructive', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [router, pathname]);
}

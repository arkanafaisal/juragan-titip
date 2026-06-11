import { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

export function useExitAppConfirmation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (!router.canGoBack() && pathname === '/') {
        setIsExitModalVisible(true);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [router, pathname]);

  const confirmExit = () => {
    setIsExitModalVisible(false);
    BackHandler.exitApp();
  };

  const cancelExit = () => {
    setIsExitModalVisible(false);
  };

  return { isExitModalVisible, confirmExit, cancelExit };
}

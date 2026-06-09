import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      {/* Mengatur judul header khusus untuk halaman ini */}
      <Stack.Screen options={{ title: 'Oops!' }} />
      
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-slate-900">
        <Text className="text-2xl font-bold text-slate-800 dark:text-white">
          Halaman tidak ditemukan.
        </Text>
        
        <Link href="/" className="mt-4 py-4">
          <Text className="text-base text-blue-600 dark:text-blue-400">
            Kembali ke layar beranda!
          </Text>
        </Link>
      </View>
    </>
  );
}
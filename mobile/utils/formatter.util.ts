export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}


export const formatDate = (isoString: string) => {
  // SQLite CURRENT_TIMESTAMP mengembalikan waktu dalam format YYYY-MM-DD HH:MM:SS (UTC).
  // Karena tidak ada 'Z' di akhirnya, JS mengira itu waktu lokal.
  // Kita ubah ke ISO 8601 (YYYY-MM-DDTHH:MM:SSZ) agar JS tahu ini UTC.
  let normalizedString = isoString;
  if (!isoString.includes('T') && !isoString.includes('Z')) {
    normalizedString = isoString.replace(' ', 'T') + 'Z';
  }
  
  const date = new Date(normalizedString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date).replace('.', ':');
};

export const formatRelativeTime = (isoString: string) => {
  let normalizedString = isoString;
  if (!isoString.includes('T') && !isoString.includes('Z')) {
    normalizedString = isoString.replace(' ', 'T') + 'Z';
  }
  
  const date = new Date(normalizedString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mnt lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} bln lalu`;
  return `${Math.floor(diffInSeconds / 31536000)} thn lalu`;
};
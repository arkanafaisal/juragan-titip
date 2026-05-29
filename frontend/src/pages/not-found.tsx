import { Link } from "react-router";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      {/* Lingkaran dengan Icon */}
      <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-12 h-12 text-text-secondary" />
      </div>
      
      {/* Teks Judul */}
      <h1 className="text-display font-bold text-text-primary mb-2">404</h1>
      <h2 className="text-h2 font-semibold text-text-primary mb-4">
        Halaman Tidak Ditemukan
      </h2>
      
      {/* Deskripsi */}
      <p className="text-body text-text-secondary max-w-[484px] mb-8">
        Maaf, rute atau halaman yang Anda cari mungkin telah dihapus, diubah namanya, atau memang belum dibuat (Masih dalam tahap *Development*).
      </p>

      {/* Tombol Aksi */}
      <Button asChild className="rounded-xl shadow-sm px-6">
        <Link to="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </div>
  );
}
// File: frontend/src/components/layout/profile-menu.tsx
import { useState, useEffect } from "react";
import { User, Building2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileMenuProps {
  variant?: "icon" | "sidebar";
  isSidebarCollapsed?: boolean;
}

export function ProfileMenu({ variant = "icon", isSidebarCollapsed = false }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // Muat data profil dari Local Storage saat komponen dimuat
  useEffect(() => {
    const savedProfile = localStorage.getItem("juragan_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Handler untuk menyimpan profil
  const handleSaveProfile = () => {
    localStorage.setItem("juragan_profile", JSON.stringify(profile));
    toast.success("Profil Usaha berhasil disimpan!");
    setIsOpen(false);
  };

  // Fungsi pembuat inisial nama
  const getInitials = (name: string) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === "sidebar" ? (
          <button 
            className={cn("mt-sm bg-surface-container-low hover:bg-surface-container rounded-lg p-2.5 flex items-center gap-sm mx-xs border border-outline-variant w-[calc(100%-1rem)] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-left", isSidebarCollapsed ? "justify-center" : "justify-start")}
          >
            <div className="w-8 h-8 rounded-md bg-surface-container-high text-text-secondary flex items-center justify-center flex-shrink-0 border border-outline-variant font-bold text-body-sm">
              {profile.name ? getInitials(profile.name) : <Building2 className="w-4 h-4" />}
            </div>
            <div className={cn("transition-opacity flex-1 min-w-0", isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>
              <div className="font-body-sm font-medium text-on-surface truncate">{profile.name || "Profil Usaha"}</div>
              <div className="font-caption text-text-muted truncate">{profile.phone || "Belum diatur"}</div>
            </div>
          </button>
        ) : (
          <button 
            className="w-9 h-9 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:bg-primary-fixed-dim border border-primary/20 cursor-pointer"
            aria-label="Profil Usaha"
          >
            {profile.name ? (
              <span className="text-body-sm font-bold tracking-wider">
                {getInitials(profile.name)}
              </span>
            ) : (
              <User className="w-4 h-4" />
            )}
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent 
        align={variant === "sidebar" ? "start" : "end"} 
        sideOffset={12} 
        collisionPadding={16}
        className="w-[calc(100vw-2rem)] sm:w-[340px] p-5 rounded-2xl bg-surface border border-border shadow-xl z-50"
      >
        <div className="flex flex-col space-y-4">
          
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-body text-text-primary truncate">
                {profile.name || "Profil Belum Diatur"}
              </span>
              <span className="text-caption text-text-muted truncate">
                Data ini digunakan untuk kop struk/faktur
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-text-secondary text-body-sm">
                Nama Usaha / Pemilik
              </Label>
              <Input 
                id="profile-name" 
                placeholder="Misal: Budi Santoso"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="bg-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone" className="text-text-secondary text-body-sm">
                No. WhatsApp
              </Label>
              <Input 
                id="profile-phone" 
                placeholder="0812-3456-7890"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="bg-surface"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email" className="text-text-secondary text-body-sm">
                Email (Opsional)
              </Label>
              <Input 
                id="profile-email" 
                placeholder="budi@juragantitip.com"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="bg-surface"
              />
            </div>
          </div>

          <div className="flex flex-row gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl shadow-none border-outline-variant text-text-primary bg-surface"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>
            <Button 
              className="flex-1 rounded-xl shadow-sm bg-primary text-on-primary hover:bg-primary/90"
              onClick={handleSaveProfile}
            >
              Simpan Profil
            </Button>
          </div>

        </div>
      </PopoverContent>
    </Popover>
  );
}
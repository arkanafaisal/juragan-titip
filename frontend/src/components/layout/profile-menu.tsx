import { useState, useEffect } from "react";
import { User, Building2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";
import { validateProfileForm } from "@/lib/validations";
import { VALIDATION_RULES } from "@/lib/validation-rules";
import { SectionCard } from "@/components/shared/section-card";

interface ProfileMenuProps {
  variant?: "icon" | "sidebar";
  isSidebarCollapsed?: boolean;
}

export function ProfileMenu({ variant = "icon", isSidebarCollapsed = false }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { profile: savedProfile, updateProfile } = useProfile();
  
  const [profile, setProfile] = useState({
    name: savedProfile?.name || "",
    phone: savedProfile?.phone || ""
  });
  const [errors, setErrors] = useState<{name?: string, phone?: string}>({});

  useEffect(() => {
    if (isOpen) {
      setProfile({
        name: savedProfile?.name || "",
        phone: savedProfile?.phone || ""
      });
      setErrors({});
    }
  }, [isOpen, savedProfile]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSaveProfile = () => {
    const newErrors = validateProfileForm(profile);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;
    
    updateProfile(profile);
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
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {variant === "sidebar" ? (
          <button 
            className={cn("mt-sm bg-surface-container-low hover:bg-surface-container rounded-lg p-2.5 flex items-center gap-sm mx-xs border border-outline-variant w-[calc(100%-1rem)] transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-left", isSidebarCollapsed ? "justify-center" : "justify-start")}
          >
            <div className="w-8 h-8 rounded-md bg-surface-container-high text-text-secondary flex items-center justify-center flex-shrink-0 border border-outline-variant font-bold text-body-sm">
              {savedProfile?.name ? getInitials(savedProfile.name) : <Building2 className="w-4 h-4" />}
            </div>
            <div className={cn("transition-opacity flex-1 min-w-0", isSidebarCollapsed ? "opacity-0 hidden" : "opacity-100 block")}>
              <div className="font-body-sm font-medium text-on-surface truncate">{savedProfile?.name || "Profil Usaha"}</div>
              <div className="font-caption text-text-muted truncate">{savedProfile?.phone || "Belum diatur"}</div>
            </div>
          </button>
        ) : (
          <button 
            className="w-9 h-9 rounded-full bg-primary-fixed text-primary-container flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:bg-primary-fixed-dim border border-primary/20 cursor-pointer"
            aria-label="Profil Usaha"
          >
            {savedProfile?.name ? (
              <span className="text-body-sm font-bold tracking-wider">
                {getInitials(savedProfile.name)}
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
        className="w-[calc(100vw-2rem)] max-w-[400px] p-0 border-none shadow-none bg-transparent z-50"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SectionCard className="flex flex-col space-y-4 shadow-xl">
          
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-text-secondary shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-body text-text-primary truncate">
                {savedProfile?.name || "Profil Belum Diatur"}
              </span>
              <span className="text-caption text-text-muted truncate">
                Data ini digunakan untuk kop struk/faktur
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className={cn("text-body-sm", errors.name ? "text-error" : "text-text-secondary")}>
                Nama Usaha / Pemilik
              </Label>
              <Input 
                id="profile-name" 
                placeholder="Misal: Budi Santoso"
                value={profile.name}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={cn("bg-surface", errors.name && "border-error focus-visible:ring-error")}
                minLength={VALIDATION_RULES.STORE.NAME_MIN}
                maxLength={VALIDATION_RULES.STORE.NAME_MAX}
              />
              {errors.name && <p className="text-caption text-error">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-phone" className={cn("text-body-sm", errors.phone ? "text-error" : "text-text-secondary")}>
                No. WhatsApp (Opsional)
              </Label>
              <Input 
                id="profile-phone" 
                placeholder="081234567890"
                type="tel"
                value={profile.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length > 0 && !val.startsWith("0")) return;
                  setProfile({ ...profile, phone: val });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={cn("bg-surface", errors.phone && "border-error focus-visible:ring-error")}
                minLength={VALIDATION_RULES.PHONE.MIN_LENGTH}
                maxLength={VALIDATION_RULES.PHONE.MAX_LENGTH}
              />
              {errors.phone && <p className="text-caption text-error">{errors.phone}</p>}
            </div>

          </div>

          <div className="flex flex-row gap-2 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl shadow-none border-outline-variant text-text-primary bg-surface"
              onClick={() => handleOpenChange(false)}
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

        </SectionCard>
      </PopoverContent>
    </Popover>
  );
}
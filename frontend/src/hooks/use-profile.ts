import { useState, useEffect, useCallback } from "react";
import { profileService, type UserProfile } from "@/services/profile";

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(profileService.getProfile());

  useEffect(() => {
    const handleUpdate = () => setProfileState(profileService.getProfile());
    window.addEventListener("profile_updated", handleUpdate);
    return () => window.removeEventListener("profile_updated", handleUpdate);
  }, []);

  const updateProfile = useCallback((newProfile: UserProfile) => {
    profileService.saveProfile(newProfile);
  }, []);

  const clearProfile = useCallback(() => {
    profileService.clearProfile();
  }, []);

  return { profile, updateProfile, clearProfile };
}

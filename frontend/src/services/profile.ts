export interface UserProfile {
  name: string;
  phone: string;
  email: string;
}

const PROFILE_KEY = "juragan_profile";

export const profileService = {
  getProfile: (): UserProfile | null => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },
  
  saveProfile: (profile: UserProfile): void => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event("profile_updated"));
  },
  
  clearProfile: (): void => {
    localStorage.removeItem(PROFILE_KEY);
    window.dispatchEvent(new Event("profile_updated"));
  }
};

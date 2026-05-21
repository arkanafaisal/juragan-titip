// src/helpers/apiMessages.ts

const handleCommonMessages = async (response: Response) => {
  const status = response.status;
  
  if (status === 0) {
    return "Connection failed. Please check your internet connection.";
  }
  if (status >= 500) {
    return "An internal server error occurred. Please try again later.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (status === 403) {
    return "Forbidden: You do not have permission to perform this action.";
  }
  if (status === 401) {
    return "Unauthorized: Please log in again.";
  }
  if (status === 400) {
    const data = await response.clone().json().catch(() => null);
    return data?.error || "Invalid data provided (Bad Request).";
  }
  
  return "";
};

type ApiMessagesType = Record<string, Record<string, (response: Response) => Promise<string>>>

const apiMessages: ApiMessagesType = {
  auth: {
    login: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Login successful.";
      if (status === 404) return "User not found.";
      if (status === 401) return "Incorrect password.";
      
      return `Login failed (Code: ${status}).`;
    },
    
    register: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 201 || status === 200) return "Registration successful.";
      if (status === 409) return "Username or Email already taken."; 
      
      return `Registration failed (Code: ${status}).`;
    },
    
    logout: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;

      if (response.status === 200) return "Logged out successfully.";
      return `Logout failed (Code: ${response.status}).`;
    }
  },
  
  users: {
    getMe: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Profile loaded.";
      if (status === 404) return "User profile not found.";
      
      return `Failed to load profile (Code: ${status}).`;
    },
  },

  products: {
    getAll: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Products loaded.";
      
      return `Failed to load products (Code: ${status}).`;
    },
  },

  titipan: {
    getAll: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 200) return "Titipan list loaded.";
      
      return `Failed to load titipan (Code: ${status}).`;
    },

    create: async (response) => {
      const common = await handleCommonMessages(response);
      if (common) return common;
      
      const status = response.status;
      if (status === 201 || status === 200) return "Titipan created successfully.";
      if (status === 400) return "Invalid titipan data.";
      
      return `Failed to create titipan (Code: ${status}).`;
    },
  }
};

export default apiMessages;

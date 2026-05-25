export const apiClient = {
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",

  async get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: this.getHeaders(),
      credentials: "include",
    })
    return response.json()
  },

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: this.getHeaders(),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  },

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: this.getHeaders(),
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  },

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      credentials: "include",
    })
    return response.json()
  },

  getHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" }
    return headers
  },
}

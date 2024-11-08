import { ComplaintPointInterface } from "@/types";

const API_URL = "https://dd26-132-251-3-55.ngrok-free.app/api";

export const complaintsApi = {
  getAll: async (): Promise<ComplaintPointInterface[]> => {
    try {
      const response = await fetch(`${API_URL}/complaints`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      console.log("response", response);
      return await response.json();
    } catch (error) {
      console.error("Error fetching complaints:", error);
      return [];
    }
  },

  create: async (formData: FormData): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error creating complaint:", error);
      throw error;
    }
  }
};
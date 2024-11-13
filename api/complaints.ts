import { ComplaintPointInterface } from "@/types";
import { API_URL } from "@/constants";

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
  },


  findOne: async (id: string): Promise<ComplaintPointInterface> => {
    try {
      const response = await fetch(`${API_URL}/complaints/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error fetching complaint');
      }

      if (!data) {
        throw new Error('Complaint not found');
      }

      return data;
    } catch (error) {
      console.error("Error fetching complaint:", error);
      throw error;
    }
  },
};
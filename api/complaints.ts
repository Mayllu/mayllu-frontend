import { ComplaintPointInterface } from "@/types";

export const fetchComplaints = async (): Promise<ComplaintPointInterface[]> => {
  try {
    const response = await fetch("http://localhost:5555/api/complaints");
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    return data as ComplaintPointInterface[];
  } catch (error) {
    console.error("Error al obtener las quejas:", error);
    return [];
  }
};

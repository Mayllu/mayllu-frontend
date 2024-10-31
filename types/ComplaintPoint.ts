export interface ComplaintPointInterface {
  id: number;
  title: string;
  description: string;
  ubication: {
    x: number;
    y: number;
  };
  created_at: string;
  updated_at: string;
  user: {
    dni: string;
    name: string;
    lastname: string;
    email: string;
    password: string;
    image_url: string;
    created_at: string;
    updated_at: string;
  };
  category: {
    id: number;
    name: string;
    icon: string;
  };
  district: {
    name: string;
  };
  complaints_image: any[]; // Puedes especificar el tipo si tienes más detalles de esta estructura
  comments: any[]; // Igualmente, ajusta si tienes el tipo específico
  complaintState: any[]; // Ajusta según el tipo específico de los estados de queja
}

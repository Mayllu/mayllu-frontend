export interface ComplaintPointInterface {
  createdAt: string;
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  ubication: {
    x: number;
    y: number;
  };
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
  complaints_image: any[];
  comments: any[];
  complaintState: any[];
}

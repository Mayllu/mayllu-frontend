import { ComplaintPointInterface } from "@/types";

const mockComplaints: ComplaintPointInterface[] = [
  {
    userId: "72671060",
    title: "Pista en mal estado - UTEC",
    image: "https://i.ibb.co/Lt3t7Gb/pic1.jpg",
    description: "Baches profundos frente a UTEC que dificultan el tránsito",
    latitude: "-12.093938",
    longitude: "-77.026048",
    categoryId: 1,
    districtId: 1
  },
  {
    userId: "72671061",
    image: "https://i.ibb.co/Lt3t7Gb/pic1.jpg",
    title: "Semáforo malogrado - Javier Prado",
    description: "Semáforo sin funcionar en cruce peligroso",
    latitude: "-12.091213",
    longitude: "-77.022510",
    categoryId: 2,
    districtId: 2
  },
  {
    userId: "72671062",
    image: "https://i.ibb.co/Lt3t7Gb/pic1.jpg",
    title: "Obras inconclusas - Miraflores",
    description: "Obra abandonada hace más de un mes, genera congestión",
    latitude: "-12.119896",
    longitude: "-77.030219",
    categoryId: 1,
    districtId: 3
  },
  {
    userId: "72671063",
    image: "https://i.ibb.co/Lt3t7Gb/pic1.jpg",
    title: "Falta señalización - San Isidro",
    description: "No hay señales de tránsito en intersección peligrosa",
    latitude: "-12.092882",
    longitude: "-77.027951",
    categoryId: 3,
    districtId: 4
  },
  {
    userId: "72671064",
    title: "Congestión vehicular - La Victoria",
    image: "https://i.ibb.co/Lt3t7Gb/pic1.jpg",
    description: "Paradero informal genera caos vehicular",
    latitude: "-12.088942",
    longitude: "-77.027453",
    categoryId: 4,
    districtId: 5
  }
];

export const fetchComplaints = async () => {
  return new Promise<ComplaintPointInterface[]>((resolve) => {
    setTimeout(() => {
      resolve(mockComplaints);
    }, 800);
  });
};

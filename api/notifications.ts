import { NotificationItemInterface } from "@/types";

// fake data, change when backend is ready !!
const mockNotifications: NotificationItemInterface[] = [
  {
    id: '1',
    title: 'Nuevo reporte cerca de ti',
    description: 'Se ha reportado un bache en Av. Arequipa',
    status: 'NEW_REPORT',
    createdAt: '2024-10-03T10:00:00Z'
  },
  {
    id: '2',
    title: 'Recolección de basura atrasada',
    description: 'No se ha recogido la basura en Bellavista desde ayer',
    status: 'WASTE_COLLECTION_DELAY',
    category: 'Limpieza y Recolección',
    createdAt: '2024-10-03T21:30:00Z'
  },
  {
    id: '3',
    title: 'Problema resuelto',
    description: 'El semáforo en Av. Javier Prado ya está reparado',
    status: 'REPORT_RESOLVED',
    createdAt: '2024-10-02T15:45:00Z'
  },
  {
    id: '4',
    title: 'Tu reporte fue aprobado',
    description: 'El reporte de alumbrado público en Av. Brasil fue aprobado',
    status: 'REPORT_APPROVED',
    createdAt: '2024-10-02T11:20:00Z'
  },
  {
    id: '5',
    title: 'Nuevo evento comunitario',
    description: 'Se ha organizado una jornada de limpieza en el Parque Kennedy',
    status: 'NEW_REPORT',
    createdAt: '2024-09-30T14:00:00Z'
  },
  {
    id: '6',
    title: 'Reporte rechazado',
    description: 'Tu reporte sobre grafitis en Miraflores ha sido rechazado',
    status: 'REPORT_REJECTED',
    createdAt: '2024-09-28T16:30:00Z'
  },
];

// fake fetch, change when backend is ready !!
export const fetchNotifications = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNotifications);
    }, 800);
  });
};

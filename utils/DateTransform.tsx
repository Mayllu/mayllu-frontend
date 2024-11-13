export const formatTimeAgo = (date: string): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) {
    return minutes <= 1 ? "hace un minuto" : `hace ${minutes} minutos`;
  } else if (hours < 24) {
    return hours === 1 ? "hace una hora" : `hace ${hours} horas`;
  } else if (days < 30) {
    return days === 1 ? "hace un día" : `hace ${days} días`;
  } else if (months < 12) {
    return months === 1 ? "hace un mes" : `hace ${months} meses`;
  } else {
    return years === 1 ? "hace un año" : `hace ${years} años`;
  }
};

export const formatDate = (date) => {
  const rawDate = new Date(date);

  if (isNaN(rawDate)) {
    return 'Invalid Date';
  }
  const hours = rawDate.getHours();
  const minutes = rawDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours < 10 ? '0' + formattedHours : formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
};


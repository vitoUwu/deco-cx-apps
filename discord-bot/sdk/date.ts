export const dateInSeconds = (date: string | Date) =>
  Math.floor(
    new Date(date).getTime() / 1000,
  );

export const isToday = (date: string | Date) => {
  const today = new Date();
  const createdAt = new Date(date);

  return createdAt.getDate() === today.getDate() &&
    today.getMonth() === createdAt.getMonth() &&
    today.getFullYear() === createdAt.getFullYear();
};

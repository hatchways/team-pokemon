// Function that converts date and time input into ISO format
export const formatDateTime = (date, time) => {
  // Create new date object using arguments
  let formattedDate = new Date(`${date}T${time}`);

  // Remove the UTC timezone offset.
  const offset = formattedDate.getTimezoneOffset() / 60;
  formattedDate.setHours(formattedDate.getHours() - offset);

  // Covert to ISO format
  const dateISO = formattedDate.toISOString();
  return dateISO;
};

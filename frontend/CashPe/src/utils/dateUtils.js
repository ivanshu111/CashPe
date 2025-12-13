const formatDate = (dateString) => {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Or "N/A", depending on preference
  }

  return date.toLocaleDateString();
};

export default formatDate;

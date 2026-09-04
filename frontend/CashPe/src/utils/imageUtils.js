const API_URL = import.meta.env.VITE_API_URL || "";

export const getImageUrl = (profilePicture) => {
  if (!profilePicture) return null;
  return `${API_URL}${profilePicture.replace("/public", "")}`;
};

export const getInitials = (name) => {
  if (!name) return "??"; // Agar name na ho toh default value

  const nameParts = name.split(' ');
  
  // Agar single name hai (e.g., "Prabhakar"), toh uska first letter lo
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  // Agar full name hai (e.g., "Prabhakar Kumar"), toh dono ka first letter lo
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};
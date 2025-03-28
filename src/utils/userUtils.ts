
/**
 * Extracts initials from a person's name
 * @param name Full name to extract initials from
 * @returns One or two character initials
 */
export const getInitials = (name: string) => {
  if (!name) return '??';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

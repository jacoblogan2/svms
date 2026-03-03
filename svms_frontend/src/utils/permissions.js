/**
 * Checks if the logged-in user has a specific permission.
 * Permissions are loaded from the user object in localStorage.
 * 
 * @param {string} permissionName - The name of the permission to check (e.g. 'view_households')
 * @returns {boolean}
 */
export const hasPermission = (permissionName) => {
  const userString = localStorage.getItem("user");
  if (!userString) return false;

  try {
    const user = JSON.parse(userString);
    // In our backend implementation, req.user.permissions is an array of permission names.
    // The frontend user object should have this array if we update the login response.
    // However, if it's missing, we fallback to a safe false.
    if (!user.permissions || !Array.isArray(user.permissions)) {
      console.warn("User permissions not found in localStorage. Ensure the login API returns permissions.");
      return false;
    }

    return user.permissions.includes(permissionName);
  } catch (error) {
    console.error("Error parsing user for permission check:", error);
    return false;
  }
};

/**
 * Checks if the user has ANY of the provided permissions.
 */
export const hasAnyPermission = (permissions) => {
  return permissions.some(p => hasPermission(p));
};

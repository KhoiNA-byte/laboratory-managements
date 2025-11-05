export interface Credentials {
  email: string;
  password: string;
}

export const mockLoginAPI = async (credentials: Credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { email, password } = credentials;

  const mockUsers = [
    {
      id: "1",
      username: "admin",
      email: "admin@lab.com",
      password: "AdminSecure2024!",
      role: "admin",
      name: "Admin User",
    },
    {
      id: "2",
      username: "manager",
      email: "manager@lab.com",
      password: "ManagerSecure2024!",
      role: "manager",
      name: "Manager Jane",
    },
    {
      id: "3",
      username: "lab_user",
      email: "lab@lab.com",
      password: "LabUserSecure2024!",
      role: "lab_user",
      name: "Lab Technician",
    },
    {
      id: "4",
      username: "service",
      email: "service@lab.com",
      password: "ServiceSecure2024!",
      role: "service",
      name: "Service Engineer",
    },
    {
      id: "5",
      username: "user",
      email: "user@lab.com",
      password: "LabSecure2024!",
      role: "user",
      name: "John Doe",
    },
  ];

  const foundUser = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) throw new Error("Invalid email and password");

  return {
    user: {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
    },
    token: `mock-jwt-token-${foundUser.role}-${Date.now()}`,
  };
};

export const mockLogoutAPI = async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

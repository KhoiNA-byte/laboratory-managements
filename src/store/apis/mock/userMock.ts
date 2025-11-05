export const mockGetUsersAPI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const today = new Date().toISOString().split("T")[0];

  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@lab.com",
      phone: "0909642416",
      gender: "Male",
      age: 30,
      address: "123 Lab St, Science City",
      password: "SecurePass123",
      role: "Administrator",
      status: "active",
      lastLogin: today,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@lab.com",
      phone: "0909123456",
      gender: "Female",
      age: 28,
      address: "456 Innovation Blvd, Techville",
      password: "SecurePass456",
      role: "Lab User",
      status: "active",
      lastLogin: today,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@lab.com",
      phone: "0909789123",
      gender: "Male",
      age: 32,
      address: "789 Discovery Ave, Science City",
      password: "SecurePass789",
      role: "Service User",
      status: "inactive",
      lastLogin: today,
    },
    {
      id: "4",
      name: "Alice Brown",
      email: "alice@lab.com",
      phone: "0909345678",
      gender: "Female",
      age: 27,
      address: "321 Research Rd, Techville",
      password: "SecurePass321",
      role: "Normal User",
      status: "active",
      lastLogin: today,
    },
  ];
};

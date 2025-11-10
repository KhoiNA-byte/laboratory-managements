import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getListTestOrder,
  TestOrderWithUser,
} from "../../services/testOrderApi";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardInfo = styled.div``;

const CardTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const CardNumber = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const CardIcon = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: #6b7280;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const TableHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const HeaderInfo = styled.div``;

const HeaderTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const NewOrderButton = styled.button`
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }

  svg {
    height: 1rem;
    width: 1rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-bottom: 2px solid
    ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.$active ? "#2563eb" : "#6b7280")};
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.$active ? "#2563eb" : "#374151")};
    border-bottom-color: ${(props) => (props.$active ? "#3b82f6" : "#d1d5db")};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 16rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  pointer-events: none;

  svg {
    height: 1rem;
    width: 1rem;
    color: #9ca3af;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeadRow = styled.tr``;

const TableHeadCell = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableBody = styled.tbody`
  background: white;
`;

const TableRow = styled.tr`
  border-top: 1px solid #e5e7eb;

  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
`;

const OrderNumber = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2563eb;
`;

const PatientName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const DoctorName = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TestType = styled.div`
  font-size: 0.875rem;
  color: #111827;
`;

const Badge = styled.span<{ $type: "priority" | "status"; $variant: string }>`
  display: inline-flex;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  ${(props) => {
    if (props.$type === "priority") {
      switch (props.$variant) {
        case "Stat":
          return "background-color: #fef2f2; color: #991b1b;";
        case "Urgent":
          return "background-color: #fefce8; color: #a16207;";
        case "Routine":
          return "background-color: #f0fdf4; color: #166534;";
        default:
          return "background-color: #f3f4f6; color: #374151;";
      }
    } else {
      switch (props.$variant) {
        case "Pending":
          return "background-color: #fefce8; color: #a16207;";
        case "In Progress":
          return "background-color: #fff7ed; color: #c2410c;";
        case "Completed":
          return "background-color: #dbeafe; color: #1e40af;";
        case "Reviewed":
          return "background-color: #f3e8ff; color: #7c3aed;";
        default:
          return "background-color: #f3f4f6; color: #374151;";
      }
    }
  }}
`;

const OrderDate = styled.div`
  font-size: 0.875rem;
  color: #111827;
`;

const ActionsContainer = styled.div`
  position: relative;
`;

const ActionsButton = styled.button`
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: #6b7280;
  }

  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 12rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 10;
  border: 1px solid #e5e7eb;
`;

const DropdownContent = styled.div`
  padding: 0.25rem 0;
`;

const DropdownItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: ${(props) => (props.$danger ? "#dc2626" : "#374151")};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }

  svg {
    height: 1rem;
    width: 1rem;
    margin-right: 0.75rem;
  }
`;
const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LoadingText = styled.div`
  color: #6b7280;
  font-style: italic;
`;

const ErrorText = styled.div`
  color: #dc2626;
`;

const EmptyText = styled.div`
  color: #6b7280;
`;

export const TestOrdersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Orders");
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(
    null
  );
  const [testOrders, setTestOrders] = useState<TestOrderWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test orders from API
  useEffect(() => {
    const fetchTestOrders = async () => {
      try {
        setLoading(true);
        const response = await getListTestOrder();

        if (response.success) {
          setTestOrders(response.data);
          setError(null);
        } else {
          setError(response.message || "Không thể tải danh sách test orders");
          setTestOrders([]);
        }
      } catch (err) {
        console.error("Error fetching test orders:", err);
        setError("Có lỗi xảy ra khi tải danh sách test orders");
        setTestOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestOrders();
  }, []);

  const handleViewDetails = (orderNumber: string) => {
    console.log("View Details clicked for:", orderNumber);
    navigate(`/admin/test-orders/${orderNumber}`);
  };

  const handleUpdateOrder = (orderNumber: string) => {
    console.log("Update order:", orderNumber);
    setShowActionsDropdown(null);
    navigate(`/admin/test-orders/${orderNumber}/edit`);
  };

  const handleDeleteOrder = (orderNumber: string) => {
    console.log("Delete order:", orderNumber);
    setShowActionsDropdown(null);
  };

  const handleNewOrder = () => {
    navigate("/admin/test-orders/new");
  };

  // Filter orders based on active tab and search term
  const filteredOrders = testOrders.filter((order) => {
    const matchesTab = activeTab === "All Orders" || order.status === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.testType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Calculate summary counts
  const summaryData = {
    pending: testOrders.filter((order) => order.status === "Pending").length,
    inProgress: testOrders.filter((order) => order.status === "In Progress")
      .length,
    completed: testOrders.filter((order) => order.status === "Completed")
      .length,
    reviewed: testOrders.filter((order) => order.status === "Reviewed").length,
  };

  return (
    <Container>
      {/* Summary Cards */}
      <CardsGrid>
        {/* Pending Card */}
        <Card>
          <CardContent>
            <CardInfo>
              <CardTitle>Pending</CardTitle>
              <CardNumber>{loading ? "..." : summaryData.pending}</CardNumber>
              <CardSubtitle>Awaiting processing</CardSubtitle>
            </CardInfo>
            <CardIcon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardIcon>
          </CardContent>
        </Card>

        {/* In Progress Card */}
        <Card>
          <CardContent>
            <CardInfo>
              <CardTitle>In Progress</CardTitle>
              <CardNumber>
                {loading ? "..." : summaryData.inProgress}
              </CardNumber>
              <CardSubtitle>Being processed</CardSubtitle>
            </CardInfo>
            <CardIcon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardIcon>
          </CardContent>
        </Card>

        {/* Completed Card */}
        <Card>
          <CardContent>
            <CardInfo>
              <CardTitle>Completed</CardTitle>
              <CardNumber>{loading ? "..." : summaryData.completed}</CardNumber>
              <CardSubtitle>Ready for review</CardSubtitle>
            </CardInfo>
            <CardIcon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardIcon>
          </CardContent>
        </Card>

        {/* Reviewed Card */}
        <Card>
          <CardContent>
            <CardInfo>
              <CardTitle>Reviewed</CardTitle>
              <CardNumber>{loading ? "..." : summaryData.reviewed}</CardNumber>
              <CardSubtitle>Finalized</CardSubtitle>
            </CardInfo>
            <CardIcon>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </CardIcon>
          </CardContent>
        </Card>
      </CardsGrid>

      {/* All Test Orders Section */}
      <TableContainer>
        <TableHeader>
          <HeaderTop>
            <HeaderInfo>
              <HeaderTitle>All Test Orders</HeaderTitle>
              <HeaderSubtitle>
                View and manage laboratory test orders.
              </HeaderSubtitle>
            </HeaderInfo>
            <NewOrderButton onClick={handleNewOrder}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Order
            </NewOrderButton>
          </HeaderTop>

          <FiltersContainer>
            {/* Tabs */}
            <TabsContainer>
              {[
                "All Orders",
                "Pending",
                "In Progress",
                "Completed",
                "Reviewed",
              ].map((tab) => (
                <Tab
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  $active={activeTab === tab}
                >
                  {tab}
                </Tab>
              ))}
            </TabsContainer>

            {/* Search Bar */}
            <SearchContainer>
              <SearchWrapper>
                <SearchInput
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </SearchIcon>
              </SearchWrapper>
            </SearchContainer>
          </FiltersContainer>
        </TableHeader>

        {/* Test Orders Table */}
        <TableWrapper>
          <Table>
            <TableHead>
              <TableHeadRow>
                <TableHeadCell style={{ textAlign: "center" }}>
                  Order Number
                </TableHeadCell>
                <TableHeadCell>Patient</TableHeadCell>
                <TableHeadCell>Test Type</TableHeadCell>
                <TableHeadCell>Priority</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Ordered</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableHeadRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    <LoadingText>Đang tải danh sách test orders...</LoadingText>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    <ErrorText>{error}</ErrorText>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    <EmptyText>
                      {searchTerm
                        ? "Không tìm thấy test order nào phù hợp với tìm kiếm."
                        : "Không có test order nào."}
                    </EmptyText>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell style={{ textAlign: "center" }}>
                      <OrderNumber>{order.orderNumber}</OrderNumber>
                    </TableCell>
                    <TableCell>
                      <PatientName>{order.patient}</PatientName>
                      <DoctorName>{order.tester}</DoctorName>
                    </TableCell>
                    <TableCell>
                      <TestType>{order.testType}</TestType>
                    </TableCell>
                    <TableCell>
                      <Badge $type="priority" $variant={order.priority}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge $type="status" $variant={order.status}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <OrderDate>{order.ordered}</OrderDate>
                    </TableCell>
                    <TableCell>
                      <ActionsContainer>
                        <ActionsButton
                          onClick={() =>
                            setShowActionsDropdown(
                              showActionsDropdown === order.orderNumber
                                ? null
                                : order.orderNumber
                            )
                          }
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </ActionsButton>

                        {showActionsDropdown === order.orderNumber && (
                          <DropdownMenu>
                            <DropdownContent>
                              <DropdownItem
                                onClick={() =>
                                  handleViewDetails(order.orderNumber)
                                }
                              >
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View Details
                              </DropdownItem>
                              <DropdownItem
                                onClick={() =>
                                  handleUpdateOrder(order.orderNumber)
                                }
                              >
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Update Test Order
                              </DropdownItem>
                              <DropdownItem
                                $danger
                                onClick={() =>
                                  handleDeleteOrder(order.orderNumber)
                                }
                              >
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete Test Order
                              </DropdownItem>
                            </DropdownContent>
                          </DropdownMenu>
                        )}
                      </ActionsContainer>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      </TableContainer>
    </Container>
  );
};

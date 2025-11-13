import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/index";
import {
  fetchReagentsRequest,
  deleteReagentRequest,
  ReagentServer,
} from "../../store/slices/reagentSlice";
import AddReagent from "./AddReagent";

const prettyDate = (iso?: string) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-GB");
  } catch {
    return iso;
  }
};

const QtyDisplay: React.FC<{ q?: number | string; unit?: string }> = ({
  q,
  unit,
}) => {
  if (q == null || q === "") return <>-</>;
  if (typeof q === "number")
    return (
      <>
        {q} {unit ?? ""}
      </>
    );
  return <>{q}</>;
};

const WarehousePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: reagents, loading } = useSelector(
    (state: RootState) => state.reagents
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Items");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null); // dropdown hiện tại

  const filterTabs = [
    "All Items",
    "In Stock",
    "Low Stock",
    "Expired",
    "Out of Stock",
  ];

  useEffect(() => {
    dispatch(fetchReagentsRequest());
  }, [dispatch]);

  const filtered = reagents.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesFilter =
      activeFilter === "All Items" ? true : (r as any).status === activeFilter;
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.lot_number.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this reagent?")) {
      dispatch(deleteReagentRequest(id));
    }
  };

  const handleView = (r: ReagentServer) => {
    alert(`View detail of ${r.name}\nLot: ${r.lot_number}\nQty: ${r.quantity}`);
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header & Stats */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Warehouse</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-3xl font-bold">{reagents.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Low stock</p>
          <p className="text-3xl font-bold">
            {reagents.filter((r) => (r as any).status === "Low Stock").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Expiring soon</p>
          <p className="text-3xl font-bold">
            {
              reagents.filter(
                (r) =>
                  r.expiry_date &&
                  (new Date(r.expiry_date).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24) >
                    0 &&
                  (new Date(r.expiry_date).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24) <=
                    30
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border">
          <p className="text-sm text-gray-500">Expired/Out</p>
          <p className="text-3xl font-bold">
            {
              reagents.filter(
                (r) =>
                  (r as any).status === "Expired" ||
                  (r as any).status === "Out of Stock"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Reagents Inventory</h3>
            <p className="text-sm text-gray-600">
              Manage laboratory reagents and supplies
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`text-sm px-3 py-2 rounded-full border ${
                    activeFilter === tab
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
            >
              + Add Reagent
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr key={String(r.id)} className="hover:bg-gray-50 relative">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {r.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs">
                        {r.lot_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {r.manufacturer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <QtyDisplay q={r.quantity} unit={r.unit} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {prettyDate(r.expiry_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {r.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="relative">
                        <button
                          className="px-2 py-1 rounded hover:bg-gray-100"
                          onClick={() => toggleDropdown(r.id!)}
                        >
                          ⋮
                        </button>
                        {openDropdownId === r.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-50">
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                              onClick={() => handleView(r)}
                            >
                              View Detail
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => handleDelete(r.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      No reagent found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddReagent isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
};

export default WarehousePage;

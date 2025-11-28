"use client";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Shield,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function ProfileInfo() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user)
    return <div className="p-6 text-center text-gray-500">No data</div>;

  const getAvatarFromName = (name: string) => name.charAt(0).toUpperCase();

  // Component con để hiển thị từng dòng thông tin (giúp code gọn hơn)
  const InfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* CỘT TRÁI: IDENTITY (Chiếm khoảng 30-40%) */}
        <div className="w-full md:w-1/3 bg-gray-50/50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100">
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
              {getAvatarFromName(user.name ?? "")}
            </div>
            <span
              className={`absolute bottom-1 right-1 px-3 py-1 rounded-full text-xs font-bold border-2 border-white ${
                user.status === "active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {user.status?.toUpperCase()}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500 mb-4">User ID: {user.id}</p>

          <div className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {user.role}
          </div>
        </div>

        {/* CỘT PHẢI: DETAILS (Dạng lưới 2 cột) */}
        <div className="w-full md:w-2/3 p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">
            General Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem
              icon={User}
              label="Age / Gender"
              value={`${user.age} / ${user.gender}`}
            />
            <InfoItem icon={Phone} label="Phone Number" value={user.phone} />
            <InfoItem icon={Mail} label="Email Address" value={user.email} />
            <InfoItem icon={MapPin} label="Address" value={user.address} />
            <InfoItem
              icon={Clock}
              label="Last Login"
              value={new Date(user.lastLogin!).toLocaleDateString()}
            />
            <InfoItem icon={Shield} label="Account Role" value={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
}

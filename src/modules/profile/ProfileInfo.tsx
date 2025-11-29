"use client";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; // Điều chỉnh đường dẫn nếu cần

export default function ProfileInfo() {
  const { t } = useTranslation("common");
  // Lấy thông tin user từ Redux store
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-border p-6 lg:col-span-1">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-4">
            ?
          </div>
          <p className="text-muted-foreground">{t("profilePage.profileInfo.noUserData")}</p>
        </div>
      </div>
    );
  }

  // Tạo avatar từ tên
  const getAvatarFromName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date nếu cần
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 lg:col-span-1">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-4">
          {getAvatarFromName(user.name ?? "")}
        </div>
        <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
        <p className="text-sm text-muted-foreground mb-6">{t("profilePage.profileInfo.userId")}: {user.id}</p>

        <div className="w-full space-y-4 text-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-muted-foreground font-medium w-24">
              {t("profilePage.profileInfo.ageGender")}
            </span>
            <span className="text-foreground">
              {user.age} {t("profilePage.profileInfo.years")} / {user.gender === "Male" ? t("usersPage.filters.male") : user.gender === "Female" ? t("usersPage.filters.female") : user.gender}
            </span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-muted-foreground font-medium w-24">
              {t("profilePage.profileInfo.lastLogin")}
            </span>
            <span className="text-foreground">
              {formatDate(user.lastLogin)}
            </span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{user.phone}</span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-foreground">{user.email}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <span className="text-foreground">{user.address}</span>
          </div>

          {/* Thêm các thông tin khác nếu cần */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-muted-foreground font-medium w-24">{t("profilePage.profileInfo.role")}</span>
            <span className="text-foreground">{user.role}</span>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-muted-foreground font-medium w-24">
              {t("profilePage.profileInfo.status")}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.status === "active" ? t("common.active") : t("common.inactive")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

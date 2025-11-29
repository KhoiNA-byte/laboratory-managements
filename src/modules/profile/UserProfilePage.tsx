import { useTranslation } from "react-i18next";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";

export default function UserProfilePage() {
  const { t } = useTranslation("common");
  
  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("profilePage.title")}
          </h1>
          <p className="text-gray-600">
            {t("profilePage.subtitle")}
          </p>
        </div>
        <ProfileHeader />
        <ProfileInfo />
      </div>
    </div>
  );
}

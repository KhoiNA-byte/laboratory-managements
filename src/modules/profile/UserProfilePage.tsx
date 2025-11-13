import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileStats from "./ProfileStat";
import RecentActivity from "./RecentActivity";

export default function UserProfilePage() {
  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <ProfileInfo />
          <RecentActivity />
        </div>
        <ProfileStats />
      </div>
    </div>
  );
}

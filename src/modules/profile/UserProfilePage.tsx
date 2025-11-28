import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";

export default function UserProfilePage() {
  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader />
        <ProfileInfo />
      </div>
    </div>
  );
}

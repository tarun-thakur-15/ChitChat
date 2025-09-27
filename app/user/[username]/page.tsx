//COMPONENTS
import UserProfile from "@/components/userProfile";
import UserProfileCards from "@/components/UserProfileCards";
import UserProfileAbout from "@/components/UserProfileAbout";

//api and schema
import { getUserProfile } from "@/app/services/serverapi";
import { UserProfile as UserProfileSchema } from "@/app/services/schema";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const profile: UserProfileSchema = (await getUserProfile(params.username))!;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Card */}
        <UserProfile
          fullName={profile?.fullName}
          username={profile?.username}
          profileImage={profile?.profileImage}
          coverImage={profile?.coverImage}
          isFriend={profile?.isFriend}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <UserProfileCards
          username={profile?.username}
            joinedOn={profile?.joinedOn}
            totalFriends={profile?.totalFriends}
          />
        </div>

        {/* Additional Info */}
        <UserProfileAbout bio={profile?.bio} />
      </div>
    </div>
  );
}

//components
import MyProfile from "@/components/MyProfileComponent";
import MyProfileCards from "@/components/MyProfileCards";
import MyProfileAbout from "@/components/MyProfileAbout";
//api
import { fetchMyProfileSSR } from "../services/serverapi";
import { MyProfileResponse } from "../services/schema"; 

export default async function ProfilePage() {
    const profile: MyProfileResponse = await fetchMyProfileSSR();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Card */}
        <MyProfile fullName={profile.fullName} username={profile.username} coverImage={profile.coverImage} profileImage={profile.profileImage} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
         <MyProfileCards joinedOn={profile.joinedOn} totalFriends={profile.totalFriends} username={profile.username} />
        </div>

        {/* About */}
        <MyProfileAbout bio={profile.bio} />
        
      </div>
    </div>
  );
}

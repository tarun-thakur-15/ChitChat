// app/dashboard/page.tsx
import SearchPageClientSide from "@/components/SearchPageCLient";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function Dashboard() {
  const user = await getCurrentUser(); // ✅ You now have the logged-in user here
  const userId = user?._id;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      <SearchPageClientSide userId={userId} />
    </div>
  );
}

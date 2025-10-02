import AuthComponent from "@/components/AuthComponent";
import { getCurrentUser } from "@/lib/getCurrentUser"; 
export default async function AuthPage() {
  const user = await getCurrentUser();
  const isLoggedInParent = !!user;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <AuthComponent user={user} isLoggedInParent={isLoggedInParent} />
    </div>
  );
}

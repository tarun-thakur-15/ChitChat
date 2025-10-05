import AuthComponent from "@/components/AuthComponent";
import { getCurrentUser } from "@/lib/getCurrentUser"; 
import FAQSection from "@/components/FAQ";
export default async function AuthPage() {
  const user = await getCurrentUser();
  const isLoggedInParent = !!user;
  return (
    <>
      <AuthComponent user={user} isLoggedInParent={isLoggedInParent} />
      <FAQSection/>
    </>

  );
}

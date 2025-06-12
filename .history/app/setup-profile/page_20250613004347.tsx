import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import StudentProfileForm from "@/components/StudentProfileForm/page";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <StudentProfileForm />
      </main>
      <Footer />
    </div>
  );
}

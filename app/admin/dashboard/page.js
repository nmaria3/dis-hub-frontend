import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotificationBell from "@/app/components/NotificationBell";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="p-10 bg-[#EFEFEF] min-h-screen">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">
        Welcome to your dashboard.
      </p>

      {/* 🔔 Floating Bell */}
      <NotificationBell />
    </div>
  );
}
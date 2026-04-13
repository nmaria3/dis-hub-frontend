import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId, getToken } = await auth();

  // 🚫 If NOT signed in → redirect
  if (!userId) {
    redirect("/");
  }

  const token = await getToken();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-heading">Dashboard</h1>
      <p className="mt-4 font-body">
        Welcome to your dashboard.
      </p>
      <p>{token}</p>
    </div>
  );
}
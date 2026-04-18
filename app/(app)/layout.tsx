import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/app-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppNav email={user.email ?? null} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:py-10 animate-page-in">
        {children}
      </main>
    </div>
  );
}

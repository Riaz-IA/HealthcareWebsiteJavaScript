import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ParentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "parent") redirect("/");

  const { data: sentRequests } = await supabase
    .from("contact_requests")
    .select("id, message, created_at, professional_id, profiles!contact_requests_professional_id_fkey(full_name)")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-sentury-cream p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-sentury-green mb-2">
          Family Dashboard
        </h1>
        <p className="text-sentury-green/70 mb-8">
          Track the contact requests you have sent to care professionals.
        </p>

        <div className="bg-sentury-offwhite p-8 rounded-lg shadow-sm border border-sentury-blue/30">
          <h2 className="text-xl font-bold text-sentury-green mb-6">Outbound Inquiries</h2>
          
          <div className="flex flex-col gap-4">
            {sentRequests && sentRequests.length > 0 ? (
              sentRequests.map((req) => (
                <div key={req.id} className="bg-white p-5 rounded-default border border-sentury-blue/40 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-sentury-green capitalize">
                        {/* @ts-ignore */}
                        Sent to: {req.profiles?.full_name || "Unknown"}
                      </span>
                      <span className="text-xs text-sentury-green/60 font-medium">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sentury-green/80 text-sm whitespace-pre-wrap">
                      "{req.message}"
                    </p>
                  </div>
                  <div className="sm:text-right flex items-center">
                    <Link 
                      href={`/directory/${req.professional_id}`}
                      className="text-sm font-bold text-sentury-peach hover:text-sentury-peach/80 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 bg-sentury-blue/10 rounded-default border border-sentury-blue/30">
                <p className="text-sentury-green/70 text-sm mb-4">You have not sent any requests yet.</p>
                <Link href="/" className="bg-sentury-green text-sentury-offwhite px-6 py-2 rounded-default font-bold hover:bg-sentury-green/90 transition-colors inline-block">
                  Browse Directory
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
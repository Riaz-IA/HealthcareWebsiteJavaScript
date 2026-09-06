import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { toggleApproval } from "./actions";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: currentUser } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentUser?.role !== "admin") redirect("/");

  const { data: professionals } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "professional")
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-sentury-cream p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-sentury-green mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sentury-green/70 mb-8">
          Review and manage professional directory listings.
        </p>

        <div className="bg-sentury-offwhite rounded-lg shadow-sm border border-sentury-blue/30 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sentury-blue/20 border-b border-sentury-blue/30 text-sentury-green">
                <th className="p-4 font-semibold">Professional Name</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {professionals?.map((pro) => (
                <tr key={pro.id} className="border-b border-sentury-blue/10 last:border-0 hover:bg-sentury-blue/5">
                  <td className="p-4 font-medium text-sentury-green capitalize">
                    {pro.full_name || "Unnamed"}
                  </td>
                  <td className="p-4 text-sentury-green/80">
                    {pro.location || "-"}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      pro.is_approved 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {pro.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    <form action={toggleApproval.bind(null, pro.id, pro.is_approved)}>
                      <button 
                        type="submit"
                        className={`text-sm font-bold px-4 py-2 rounded-default transition-colors ${
                          pro.is_approved
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-sentury-green text-sentury-offwhite hover:bg-sentury-green/90"
                        }`}
                      >
                        {pro.is_approved ? "Revoke" : "Approve"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!professionals || professionals.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sentury-green/70">
                    No professionals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
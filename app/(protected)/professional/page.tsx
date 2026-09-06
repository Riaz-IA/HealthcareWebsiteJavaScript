import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";
import SubmitButton from "@/components/SubmitButton";

export default async function ProfessionalDashboard({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "professional") redirect("/");

  const { data: requests } = await supabase
    .from("contact_requests")
    .select("id, message, created_at, profiles!contact_requests_parent_id_fkey(full_name)")
    .eq("professional_id", user.id)
    .order("created_at", { ascending: false });

  const { data: allServices } = await supabase
    .from("services")
    .select("*")
    .order("name");

  const { data: userServices } = await supabase
    .from("profile_services")
    .select("service_id")
    .eq("profile_id", user.id);
    
  const selectedServiceIds = userServices?.map((s) => s.service_id) || [];

  return (
    <main className="min-h-screen bg-sentury-cream p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-sentury-green mb-8">
          My Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Profile Settings */}
          <div className="bg-sentury-offwhite p-8 rounded-lg shadow-sm border border-sentury-blue/30 h-fit">
            <h2 className="text-xl font-bold text-sentury-green mb-2">
              Profile Settings
            </h2>
            <p className="text-sm text-sentury-green/70 mb-6">
              Update how you appear in the directory.
            </p>

            {saved && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 border border-green-200 rounded-default font-medium text-sm">
                ✅ Profile successfully updated!
              </div>
            )}

            <form action={updateProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-sentury-green mb-1">Full Name</label>
                <input
                  name="full_name"
                  type="text"
                  defaultValue={profile.full_name || ""}
                  required
                  className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-sentury-green mb-1">Location</label>
                  <input
                    name="location"
                    type="text"
                    defaultValue={profile.location || ""}
                    className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-sentury-green mb-1">Years of Experience</label>
                  <input
                    name="experience_years"
                    type="number"
                    min="0"
                    defaultValue={profile.experience_years || 0}
                    className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-sentury-green mb-1">Professional Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  defaultValue={profile.bio || ""}
                  className="w-full p-3 rounded-default border border-sentury-blue/50 bg-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-sentury-green mb-2">Care Services Offered</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border border-sentury-blue/50 rounded-default bg-white">
                  {allServices?.map((service) => (
                    <label key={service.id} className="flex items-center gap-3 text-sm text-sentury-green cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="services" 
                        value={service.id} 
                        defaultChecked={selectedServiceIds.includes(service.id)}
                        className="w-4 h-4 accent-sentury-green cursor-pointer"
                      />
                      {service.name}
                    </label>
                  ))}
                </div>
              </div>

              <SubmitButton defaultText="Save Profile Changes" loadingText="Saving..." />
            </form>
          </div>

          {/* RIGHT COLUMN: Inbox */}
          <div className="bg-sentury-offwhite p-8 rounded-lg shadow-sm border border-sentury-blue/30 h-fit">
            <h2 className="text-xl font-bold text-sentury-green mb-2">
              Recent Requests
            </h2>
            <p className="text-sm text-sentury-green/70 mb-6">
              Messages from parents seeking support.
            </p>

            <div className="flex flex-col gap-4">
              {requests && requests.length > 0 ? (
                requests.map((req) => (
                  <div key={req.id} className="bg-white p-5 rounded-default border border-sentury-blue/40 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-sentury-green">
                        {/* @ts-ignore */}
                        {req.profiles?.full_name || "Unknown Parent"}
                      </span>
                      <span className="text-xs text-sentury-green/60 font-medium">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sentury-green/80 text-sm whitespace-pre-wrap">
                      {req.message}
                    </p>
                    <button className="mt-4 text-sm font-bold text-sentury-peach hover:text-sentury-peach/80 transition-colors">
                      Reply via Email &rarr;
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-sentury-blue/10 rounded-default border border-sentury-blue/30 text-sentury-green/70 text-sm">
                  Your inbox is currently empty.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
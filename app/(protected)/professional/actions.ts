"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const fullName = formData.get("full_name") as string;
  const location = formData.get("location") as string;
  const bio = formData.get("bio") as string;
  const experienceYears = parseInt(formData.get("experience_years") as string) || 0;
  
  const selectedServices = formData.getAll("services");

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      location: location,
      bio: bio,
      experience_years: experienceYears,
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Update failed:", profileError);
    throw new Error("Failed to update profile");
  }

  const { error: deleteError } = await supabase
    .from("profile_services")
    .delete()
    .eq("profile_id", user.id);

  if (deleteError) {
    console.error("Failed to delete old services:", deleteError);
    throw new Error("Could not update service tags");
  }
  
  if (selectedServices.length > 0) {
    const serviceInserts = selectedServices.map((serviceId) => ({
      profile_id: user.id,
      service_id: parseInt(serviceId as string),
    }));
    
    const { error: insertError } = await supabase
      .from("profile_services")
      .insert(serviceInserts);
      
    if (insertError) {
      console.error("Failed to insert new services:", insertError);
      throw new Error("Could not save new service tags");
    }
  }

  revalidatePath("/(protected)/professional", "page");
  revalidatePath(`/directory/${user.id}`, "page");
  redirect("/professional?saved=true");
}
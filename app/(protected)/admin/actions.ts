"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleApproval(profileId: string, currentStatus: boolean) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
    
  if (adminProfile?.role !== "admin") throw new Error("Unauthorized");

  const { error } = await supabase
    .from("profiles")
    .update({ is_approved: !currentStatus })
    .eq("id", profileId);

  if (error) {
    console.error("Approval toggle failed:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/(protected)/admin", "page");
  revalidatePath("/", "page");
}
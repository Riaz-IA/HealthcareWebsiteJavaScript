"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendContactRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const professionalId = formData.get("professional_id") as string;
  const message = formData.get("message") as string;

  const { error } = await supabase
    .from("contact_requests")
    .insert({
      parent_id: user.id,
      professional_id: professionalId,
      message: message,
    });

  if (error) {
    console.error("Failed to send request:", error);
    throw new Error("Could not send message.");
  }

  redirect(`/directory/${professionalId}?sent=true`);
}
"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  defaultText = "Save Profile Changes",
  loadingText = "Saving Changes..."
}: {
  defaultText?: string;
  loadingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-sentury-green text-sentury-offwhite py-3 rounded-default font-bold hover:bg-sentury-green/90 transition-colors mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
    >
      {pending ? loadingText : defaultText}
    </button>
  );
}
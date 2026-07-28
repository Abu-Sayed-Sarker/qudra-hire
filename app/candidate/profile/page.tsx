import { redirect } from "next/navigation";

export default function CandidateProfileRedirect() {
  // Redirect to a default designation profile
    redirect("/candidate");
}

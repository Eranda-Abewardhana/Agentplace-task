import { AssistantConsultant } from "@/components/assistant-consultant";

export const metadata = {
  title: "SHWASH Detailing Consultant",
  description: "Get a guided service recommendation and a transparent mobile detailing estimate using SHWASH's published pricing.",
};

export default function AssistantPage() {
  return (
    <main className="assistant-page">
      <div className="container assistant-page__container">
        <div className="assistant-page__intro"><p className="eyebrow">A little help choosing</p><h1>Find the detail that fits.</h1><p>Answer a few quick questions. We’ll match your needs to SHWASH’s service menu and published prices.</p></div>
        <AssistantConsultant />
        <p className="assistant-disclaimer">Recommendations use a structured guide and SHWASH’s published service data. They are estimates; SHWASH confirms scope, availability, and your reservation through its official booking flow.</p>
      </div>
    </main>
  );
}

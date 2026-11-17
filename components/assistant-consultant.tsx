"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, CircleHelp, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import type { RecommendationInput } from "@/lib/recommendation";
import { cadences, packageDetails, vehicles, type AddOnId } from "@/lib/business-data";
import { formatUsd } from "@/lib/estimator";

type Recommendation = {
  location: string;
  vehicle: { id: string; label: string };
  package: "full" | "interior" | "exterior";
  packageLabel: string;
  cadence: RecommendationInput["cadence"];
  reason: string;
  estimate: { basePrice: number | null; addOnsTotal: number; total: number | null; selectedAddOns: { id: AddOnId; label: string; price: number }[]; quoteRequired: boolean } | null;
  suggestedAddOns: { id: AddOnId; label: string; price: number; description: string }[];
  alternative: { package: "full" | "interior"; label: string; price: number | null } | null;
  budgetNote: string | null;
  conditionNote: string;
  areaNote: string | null;
  limitations: string[];
};

type ChatMessage = { id: number; role: "assistant" | "user"; text: string };
type Step = 0 | 1 | 2 | 3 | 4 | 5;

const concernOptions: { id: RecommendationInput["concerns"][number]; label: string }[] = [
  { id: "carpet-stains", label: "Carpet or floor stains" },
  { id: "seat-stains", label: "Seat stains" },
  { id: "pet-hair", label: "Pet hair" },
  { id: "odor", label: "Lingering odor" },
  { id: "child-seat", label: "Child car seat" },
  { id: "bio-mess", label: "Vomit / urine cleanup" },
];

const starterOptions = [
  { label: "Find the right detailing service", value: "service" },
  { label: "Estimate my detailing cost", value: "estimate" },
  { label: "I have pet hair or interior stains", value: "condition" },
];

const assistantPrompts = [
  "What city or ZIP code should SHWASH come to?",
  "What kind of vehicle are we detailing?",
  "What would you most like to improve?",
  "How would you describe the vehicle's condition? Anything specific to address?",
  "How often would you like to have the vehicle detailed?",
  "Do you have a budget range in mind? This is optional.",
];

function bookingHrefFor(recommendation: Recommendation) {
  const params = new URLSearchParams({
    vehicle: recommendation.vehicle.id,
    package: recommendation.package,
    cadence: recommendation.cadence,
  });
  if (recommendation.suggestedAddOns.length) {
    params.set("addons", recommendation.suggestedAddOns.map((item) => item.id).join(","));
  }
  return `/booking?${params.toString()}`;
}

export function AssistantConsultant() {
  const [step, setStep] = useState<Step | null>(null);
  const [assessment, setAssessment] = useState<Partial<RecommendationInput>>({ concerns: [], condition: "typical" });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: "assistant", text: "Welcome to SHWASH. Let's find the right detailing service for your vehicle. Tell me a little about your car and what you'd like to improve." },
  ]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState<RecommendationInput["condition"]>("typical");
  const [concerns, setConcerns] = useState<RecommendationInput["concerns"]>([]);
  const feedEndRef = useRef<HTMLDivElement>(null);
  const progress = useMemo(() => step === null ? 0 : step + 1, [step]);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  function addMessage(role: ChatMessage["role"], text: string) {
    setMessages((current) => [...current, { id: Date.now() + Math.random(), role, text }]);
  }

  function beginAssessment(mode: "service" | "estimate" | "condition") {
    const starterText = mode === "condition" ? "I have pet hair or interior stains" : mode === "estimate" ? "Estimate my detailing cost" : "Find the right detailing service";
    setRecommendation(null);
    setError(null);
    setAssessment({ concerns: mode === "condition" ? ["pet-hair"] : [], condition: "typical" });
    setLocation("");
    setConcerns(mode === "condition" ? ["pet-hair"] : []);
    setCondition("typical");
    setStep(0);
    addMessage("user", starterText);
    addMessage("assistant", assistantPrompts[0]);
  }

  function chooseSingle(field: "vehicle" | "goal" | "cadence", value: string, label: string, nextStep: Step | null) {
    setAssessment((current) => ({ ...current, [field]: value }));
    addMessage("user", label);
    if (nextStep === null) {
      setStep(5);
      addMessage("assistant", assistantPrompts[5]);
    } else {
      setStep(nextStep);
      addMessage("assistant", assistantPrompts[nextStep]);
    }
  }

  function submitLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = location.trim();
    if (clean.length < 2) {
      setError("Add a city or ZIP code so SHWASH can confirm service coverage.");
      return;
    }
    setError(null);
    setAssessment((current) => ({ ...current, location: clean }));
    addMessage("user", clean);
    setStep(1);
    addMessage("assistant", assistantPrompts[1]);
  }

  function submitCondition(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAssessment((current) => ({ ...current, condition, concerns }));
    const conditionLabel = condition === "light" ? "Light everyday use" : condition === "heavy" ? "Heavier-than-usual buildup" : "Typical use";
    const names = concerns.map((id) => concernOptions.find((option) => option.id === id)?.label).filter(Boolean);
    addMessage("user", `${conditionLabel}${names.length ? ` · ${names.join(", ")}` : " · Nothing specific"}`);
    setStep(4);
    addMessage("assistant", assistantPrompts[4]);
  }

  async function submitBudget(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assessment.location || !assessment.vehicle || !assessment.goal || !assessment.cadence) {
      setError("Please restart the assessment and answer the required selections.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const budget = String(form.get("budget") ?? "flexible") as NonNullable<RecommendationInput["budget"]>;
    const payload: RecommendationInput = {
      location: assessment.location,
      vehicle: assessment.vehicle,
      goal: assessment.goal,
      condition: assessment.condition ?? "typical",
      concerns: assessment.concerns ?? [],
      cadence: assessment.cadence,
      budget,
    };
    setError(null);
    addMessage("user", budget === "flexible" ? "I'm flexible on budget" : ({ "under-200": "Under $200", "200-300": "$200–$300", "over-300": "Over $300" } as const)[budget]);
    setLoading(true);
    setStep(5);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { recommendation?: Recommendation; error?: string } = await response.json();
      if (!response.ok || !data.recommendation) throw new Error(data.error ?? "The recommendation could not be calculated.");
      setRecommendation(data.recommendation);
      setStep(null);
      addMessage("assistant", "I’ve matched your answers to SHWASH’s published services and pricing. Here’s a clear starting point.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not finish the estimate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleConcern(id: RecommendationInput["concerns"][number]) {
    setConcerns((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  function restart() {
    setStep(null);
    setRecommendation(null);
    setAssessment({ concerns: [], condition: "typical" });
    setMessages([{ id: Date.now(), role: "assistant", text: "No problem. Tell me what you'd like help with and we'll start fresh." }]);
    setError(null);
    setLoading(false);
  }

  const progressPercent = step === null ? (recommendation ? 100 : 0) : Math.round(((step + 1) / 6) * 100);

  return (
    <div className="assistant-layout">
      <aside className="assistant-aside">
        <div className="assistant-aside__top"><span className="assistant-avatar"><Sparkles size={18} /></span><div><strong>SHWASH consultant</strong><small>Service guide · Austin, TX</small></div><span className="online-dot" aria-label="Available" /></div>
        <div className="assistant-aside__body">
          <p className="eyebrow">A clearer way to choose</p>
          <h2>Tell us what your car needs.</h2>
          <p>Get a recommendation based on SHWASH&apos;s published packages and rates. Your estimate stays transparent, including add-ons and plan conditions.</p>
          <div className="assistant-aside__benefits">
            <span><Check size={16} /> Prices from SHWASH&apos;s published menu</span>
            <span><Check size={16} /> No payment details collected</span>
            <span><Check size={16} /> You confirm the booking with SHWASH</span>
          </div>
        </div>
        <div className="assistant-aside__foot"><CircleHelp size={17} /><span>Questions about a special vehicle or heavy buildup? <a href="tel:+15127596337">Call SHWASH</a> for confirmation.</span></div>
      </aside>

      <section className={`assistant-panel ${recommendation ? "assistant-panel--result" : ""}`} aria-label="SHWASH detailing consultant">
        <div className="assistant-panel__header">
          <div><span className="assistant-panel__mobile-mark"><Sparkles size={16} /></span><div><strong>Detailing consultant</strong><small>Guided service recommendations</small></div></div>
          <button type="button" className="icon-button" onClick={restart} aria-label="Restart conversation"><RotateCcw size={17} /></button>
        </div>
        <div className="assistant-progress" aria-label={step === null ? "Assessment status" : `Assessment step ${progress} of 6`}>
          <span style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="assistant-feed" aria-live="polite" aria-relevant="additions text">
          {messages.map((message) => (
            <div key={message.id} className={`chat-row chat-row--${message.role}`}>
              {message.role === "assistant" && <span className="chat-avatar"><Sparkles size={13} /></span>}
              <p className="chat-bubble">{message.text}</p>
            </div>
          ))}
          {step === null && !recommendation && !loading && messages.length === 1 && (
            <div className="starter-list">
              {starterOptions.map((item) => <button key={item.value} type="button" onClick={() => beginAssessment(item.value as "service" | "estimate" | "condition")}>{item.label}<ArrowRight size={15} /></button>)}
              <Link href="/pricing">Compare detailing plans <ArrowUpRight size={15} /></Link>
              <Link href="/booking">Help me prepare a booking <ArrowUpRight size={15} /></Link>
            </div>
          )}
          {loading && <div className="chat-row chat-row--assistant"><span className="chat-avatar"><Sparkles size={13} /></span><p className="chat-bubble loading-bubble"><LoaderCircle className="spin" size={17} /> Checking SHWASH&apos;s service menu and calculating your estimate…</p></div>}
          {recommendation && <RecommendationCard recommendation={recommendation} />}
          <div ref={feedEndRef} />
        </div>

        {step !== null && !loading && (
          <div className="assistant-question" key={step}>
            <div className="assistant-question__top"><span>STEP {step + 1} OF 6</span>{step > 0 && <button type="button" onClick={() => { setStep((step - 1) as Step); setError(null); }}><ChevronLeft size={14} /> Back</button>}</div>
            {step === 0 && <form onSubmit={submitLocation} className="question-form"><label htmlFor="service-location">City or ZIP code</label><div className="inline-entry"><input id="service-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Austin, TX" autoComplete="postal-code" /><button className="button button--primary button--small" type="submit">Continue <ArrowRight size={16} /></button></div><small>We&apos;ll flag it if coverage needs confirmation.</small></form>}
            {step === 1 && <div className="assistant-choice-grid assistant-choice-grid--vehicle">{vehicles.map((item) => <button type="button" key={item.id} className={`assistant-choice ${assessment.vehicle === item.id ? "is-selected" : ""}`} onClick={() => chooseSingle("vehicle", item.id, item.label, 2)}><Image src={item.image} alt="" width={86} height={46} /><strong>{item.label}</strong><small>{item.seats}</small></button>)}</div>}
            {step === 2 && <div className="assistant-choice-grid">{[{id:"interior",label:"Interior",text:"Focus on the cabin"},{id:"exterior",label:"Exterior",text:"Focus on the paint and finish"},{id:"both",label:"Inside + out",text:"A complete detail"}].map((item) => <button type="button" key={item.id} className="assistant-choice assistant-choice--text" onClick={() => chooseSingle("goal", item.id, item.label, 3)}><strong>{item.label}</strong><small>{item.text}</small></button>)}</div>}
            {step === 3 && <form className="question-form" onSubmit={submitCondition}><fieldset className="condition-fieldset"><legend>Vehicle condition</legend><div className="condition-options">{([{id:"light",label:"Light"},{id:"typical",label:"Typical"},{id:"heavy",label:"Heavier buildup"}] as const).map((item) => <button key={item.id} type="button" aria-pressed={condition === item.id} className={`condition-option ${condition === item.id ? "is-selected" : ""}`} onClick={() => setCondition(item.id)}>{item.label}</button>)}</div></fieldset><fieldset className="condition-fieldset"><legend>Anything specific? <span>Choose any that apply</span></legend><div className="concern-options">{concernOptions.map((item) => <button type="button" key={item.id} aria-pressed={concerns.includes(item.id)} className={`concern-option ${concerns.includes(item.id) ? "is-selected" : ""}`} onClick={() => toggleConcern(item.id)}>{concerns.includes(item.id) && <Check size={13} />}{item.label}</button>)}</div></fieldset><button className="button button--primary button--small" type="submit">Continue <ArrowRight size={16} /></button></form>}
            {step === 4 && <div className="assistant-choice-grid assistant-choice-grid--cadence">{cadences.map((item) => <button type="button" key={item.id} className="assistant-choice assistant-choice--text" onClick={() => chooseSingle("cadence", item.id, item.label, null)}><strong>{item.label}</strong><small>{item.description}</small></button>)}</div>}
            {step === 5 && <form className="question-form" onSubmit={submitBudget}><label htmlFor="budget-range">Budget range</label><select id="budget-range" name="budget" defaultValue="flexible"><option value="under-200">Under $200</option><option value="200-300">$200–$300</option><option value="over-300">Over $300</option><option value="flexible">I&apos;m flexible</option></select><small>This only helps us make the estimate easier to assess. We won&apos;t change your service recommendation to fit the budget.</small><button className="button button--primary button--small" type="submit">See my recommendation <ArrowRight size={16} /></button></form>}
            {error && <p className="field-error" role="alert">{error}</p>}
          </div>
        )}
        {step === null && !loading && recommendation && <div className="assistant-restart"><button type="button" onClick={restart}><RotateCcw size={15} /> Start again</button></div>}
      </section>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const isQuote = recommendation.estimate?.quoteRequired || recommendation.estimate === null;
  const vehicleName = recommendation.vehicle.label;
  const bookingHref = bookingHrefFor(recommendation);
  const serviceItems = recommendation.package === "exterior"
    ? ["Professional hand wash", "Decontamination pre-soak", "Wheel and tire cleaning", "High-gloss spray wax"]
    : recommendation.package === "interior"
      ? packageDetails.interior.interior
      : [...packageDetails.full.interior.slice(0, 4), ...packageDetails.full.exterior.slice(0, 3)];

  return (
    <div className="recommendation-card">
      <div className="recommendation-card__head"><span className="recommendation-card__badge"><Sparkles size={13} /> MATCHED TO YOUR NEEDS</span><h3>{recommendation.packageLabel}</h3><p>{vehicleName} · {cadences.find((item) => item.id === recommendation.cadence)?.label}</p></div>
      <p className="recommendation-card__reason">{recommendation.reason}</p>
      {!isQuote && recommendation.estimate && <div className="recommendation-price"><span>Estimated total{recommendation.cadence !== "one-time" ? " per visit" : ""}</span><strong>{formatUsd(recommendation.estimate.total)}</strong><small>Base {formatUsd(recommendation.estimate.basePrice)}{recommendation.estimate.addOnsTotal ? ` + ${formatUsd(recommendation.estimate.addOnsTotal)} selected add-ons` : " · no add-ons selected"}</small></div>}
      {isQuote && <div className="recommendation-price recommendation-price--quote"><span>{recommendation.package === "exterior" ? "Official price" : "Vehicle price"}</span><strong>{recommendation.package === "exterior" ? "See official booking" : "Call for quote"}</strong><small>{recommendation.package === "exterior" ? "SHWASH does not publish an exterior-only price here." : "Sprinter and oversized vehicles need custom pricing."}</small></div>}
      {recommendation.suggestedAddOns.length > 0 && <div className="recommendation-addons"><strong>Related to what you mentioned</strong>{recommendation.suggestedAddOns.map((item) => <div key={item.id}><span>{item.label}</span><strong>+{formatUsd(item.price)}</strong></div>)}</div>}
      <details className="recommendation-includes"><summary>What this service includes</summary><ul>{serviceItems.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul></details>
      {recommendation.alternative && <div className="recommendation-alternative"><span>Another option, if it fits your needs</span><strong>{recommendation.alternative.label}{recommendation.alternative.price !== null ? ` · ${formatUsd(recommendation.alternative.price)}` : " · Call for quote"}</strong></div>}
      {recommendation.budgetNote && <p className="recommendation-note recommendation-note--budget">{recommendation.budgetNote}</p>}
      {recommendation.conditionNote && <p className="recommendation-note"><CircleHelp size={15} />{recommendation.conditionNote}</p>}
      {recommendation.areaNote && <p className="recommendation-note"><CircleHelp size={15} />{recommendation.areaNote}</p>}
      <div className="recommendation-card__actions"><Link className="button button--primary button--full" href={bookingHref}>Prepare a booking <ArrowRight size={16} /></Link><p>Next: confirm your vehicle, date, and details with SHWASH.</p></div>
      <p className="recommendation-payment"><strong>Payment comes later.</strong> SHWASH says payment is processed after your service is complete to your satisfaction. This estimate isn&apos;t a confirmed reservation or charge.</p>
    </div>
  );
}

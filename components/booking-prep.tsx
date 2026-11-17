"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Clipboard, ExternalLink, LockKeyhole, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { addOns, cadences, isAddOnAvailableForService, OFFICIAL, packageDetails, planConditions, vehicles, type AddOnId, type DetailPackage, type PlanCadence, type ServiceSelection, type VehicleId } from "@/lib/business-data";
import { estimateDetail, formatUsd } from "@/lib/estimator";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  phone: z.string().trim().min(7, "Enter a phone number SHWASH can reach.").max(30),
  address: z.string().trim().min(5, "Add the service address or location.").max(240),
  vehicleDetails: z.string().trim().min(2, "Add the year, make, and model.").max(120),
  preferredDate: z.string().min(1, "Choose a preferred date."),
  preferredTime: z.string().min(1, "Choose a preferred time window."),
  notes: z.string().max(500, "Keep additional notes under 500 characters.").optional().default(""),
});

type BookingFormData = z.output<typeof bookingSchema>;
type BookingFormInput = z.input<typeof bookingSchema>;
export function BookingPrep({
  initialVehicle,
  initialPackage,
  initialCadence,
  initialAddOns,
}: {
  initialVehicle: VehicleId;
  initialPackage: ServiceSelection;
  initialCadence: PlanCadence;
  initialAddOns: AddOnId[];
}) {
  const [vehicle, setVehicle] = useState<VehicleId>(initialVehicle);
  const [servicePackage, setServicePackage] = useState<ServiceSelection>(initialPackage);
  const [cadence, setCadence] = useState<PlanCadence>(initialCadence);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>(initialAddOns);
  const [details, setDetails] = useState<BookingFormData | null>(null);
  const [handoffOpened, setHandoffOpened] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [handoffError, setHandoffError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormInput, unknown, BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { notes: "" },
  });

  const estimatorPackage: DetailPackage = servicePackage === "exterior" ? "full" : servicePackage;
  const estimate = useMemo(() => servicePackage === "exterior" ? null : estimateDetail({
    vehicle,
    detailPackage: estimatorPackage,
    cadence,
    selectedAddOnIds: selectedAddOns,
  }), [vehicle, servicePackage, estimatorPackage, cadence, selectedAddOns]);
  const vehicleLabel = vehicles.find((item) => item.id === vehicle)?.label ?? "Vehicle";
  const packageLabel = servicePackage === "exterior" ? "Exterior-only detail" : packageDetails[servicePackage].name;
  const cadenceLabel = cadences.find((item) => item.id === cadence)?.label ?? "One-time";
  const total = estimate?.total ?? null;
  const lines = details ? [
    `Customer: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    `Service location: ${details.address}`,
    `Vehicle: ${vehicleLabel} · ${details.vehicleDetails}`,
    `Service: ${packageLabel} · ${cadenceLabel}`,
    `Add-ons: ${selectedAddOns.map((id) => addOns.find((item) => item.id === id)?.label).filter(Boolean).join(", ") || "None"}`,
    `Estimated price: ${total === null ? "Confirm with SHWASH" : formatUsd(total) + (cadence === "one-time" ? "" : " per visit")}`,
    `Preferred appointment: ${details.preferredDate} · ${details.preferredTime}`,
    `Additional requirements: ${details.notes || "None"}`,
    "Status: Booking details prepared in this browser only; not submitted or confirmed.",
  ].join("\n") : "";

  function onSubmit(formData: BookingFormData) {
    setDetails(formData);
    setHandoffOpened(false);
    setHandoffError(null);
    setCopyState("idle");
  }

  async function copySummary() {
    if (!lines) return;
    try {
      await navigator.clipboard.writeText(lines);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function openOfficialBooking() {
    setHandoffOpened(true);
    setHandoffError(null);
  }

  function toggleAddOn(id: AddOnId) {
    setSelectedAddOns((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function choosePackage(value: ServiceSelection) {
    setServicePackage(value);
    setSelectedAddOns((current) => current.filter((selected) => isAddOnAvailableForService(selected, value)));
  }

  return (
    <div className="booking-grid">
      <section className="booking-form-panel">
        <div className="booking-form-panel__intro">
          <span className="step-label"><span>01</span> Your selection</span>
          <h2>Build your booking summary</h2>
          <p>We’ll organize the details for you. Nothing is submitted to SHWASH from this form.</p>
        </div>
        <form className="booking-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-section">
            <h3>Service and vehicle</h3>
            <div className="form-two-col">
              <label className="field"><span>Vehicle category</span><select value={vehicle} onChange={(event) => setVehicle(event.target.value as VehicleId)}>{vehicles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label className="field"><span>Service</span><select value={servicePackage} onChange={(event) => choosePackage(event.target.value as ServiceSelection)}><option value="full">Interior + exterior</option><option value="interior">Interior only</option><option value="exterior">Exterior only · official booking</option></select></label>
              <label className="field"><span>Visit frequency</span><select value={cadence} onChange={(event) => setCadence(event.target.value as PlanCadence)}>{cadences.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label className="field"><span>Year, make, and model</span><input {...register("vehicleDetails")} placeholder="e.g. 2022 Toyota Highlander" autoComplete="off" aria-invalid={Boolean(errors.vehicleDetails)} />{errors.vehicleDetails && <small className="field-error">{errors.vehicleDetails.message}</small>}</label>
            </div>
          </div>

          <div className="form-section">
            <h3>Add-ons <span>Optional</span></h3>
            <div className="booking-addon-list">
              {addOns.map((item) => {
                const disabled = !isAddOnAvailableForService(item.id, servicePackage);
                const checked = selectedAddOns.includes(item.id) && !disabled;
                return <label key={item.id} className={`booking-addon ${checked ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}><input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleAddOn(item.id)} /><span className="addon-option__check"><Check size={12} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span><b>+${item.price}</b></label>;
              })}
            </div>
            {selectedAddOns.some((id) => id === "bio-clean") && <p className="inline-note"><CircleHelp size={15} /> Bio cleaning is specialized. Confirm the job is within scope with SHWASH before booking.</p>}
          </div>

          <div className="form-section">
            <h3>How can SHWASH reach you?</h3>
            <div className="form-two-col">
              <label className="field"><span>Full name</span><input {...register("name")} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small className="field-error">{errors.name.message}</small>}</label>
              <label className="field"><span>Email</span><input type="email" {...register("email")} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
              <label className="field"><span>Phone</span><input type="tel" {...register("phone")} autoComplete="tel" aria-invalid={Boolean(errors.phone)} />{errors.phone && <small className="field-error">{errors.phone.message}</small>}</label>
              <label className="field"><span>Service address or location</span><input {...register("address")} autoComplete="street-address" placeholder="Street, city, ZIP" aria-invalid={Boolean(errors.address)} />{errors.address && <small className="field-error">{errors.address.message}</small>}</label>
            </div>
          </div>

          <div className="form-section">
            <h3>Preferred appointment</h3>
            <div className="form-two-col">
              <label className="field"><span>Preferred date</span><input type="date" {...register("preferredDate")} aria-invalid={Boolean(errors.preferredDate)} />{errors.preferredDate && <small className="field-error">{errors.preferredDate.message}</small>}</label>
              <label className="field"><span>Time window</span><select {...register("preferredTime")} defaultValue="" aria-invalid={Boolean(errors.preferredTime)}><option value="" disabled>Select a time window</option><option>Morning</option><option>Midday</option><option>Afternoon</option><option>Flexible</option></select>{errors.preferredTime && <small className="field-error">{errors.preferredTime.message}</small>}</label>
            </div>
            <label className="field field--full"><span>Anything else SHWASH should know? <small>Optional</small></span><textarea {...register("notes")} rows={3} placeholder="Stains, pet hair, parking access, or other requirements" aria-invalid={Boolean(errors.notes)} />{errors.notes && <small className="field-error">{errors.notes.message}</small>}</label>
          </div>
          <Button type="submit">Review booking summary <ArrowRight size={16} /></Button>
          <p className="form-privacy"><LockKeyhole size={14} /> Kept in this browser tab only. Enter these details again on SHWASH’s official site to request the appointment.</p>
        </form>
      </section>

      <aside className="booking-summary-column">
        <Card className="booking-summary-card">
          <CardHeader className="booking-summary-card__head"><span className="eyebrow">Your summary</span><h2>{packageLabel}</h2><p>{vehicleLabel} · {cadenceLabel}</p></CardHeader>
          <CardContent className="booking-summary-card__lines">
            {estimate ? <>
              <div><span>Base service{cadence !== "one-time" ? " / visit" : ""}</span><strong>{formatUsd(estimate.basePrice)}</strong></div>
              {estimate.selectedAddOns.map((item) => <div key={item.id}><span>{item.label}</span><strong>+{formatUsd(item.price)}</strong></div>)}
              <div className="booking-summary-total"><span>Estimate{cadence !== "one-time" ? " / visit" : ""}</span><strong>{formatUsd(estimate.total)}</strong></div>
            </> : <div className="booking-summary-quote"><span>Exterior-only price</span><strong>Confirm in official booking</strong></div>}
            {cadence !== "one-time" && <p className="estimate-card__plan">Service plan rates are per visit. {planConditions}</p>}
          </CardContent>
          {selectedAddOns.some((id) => id === "pet-hair") && <p className="inline-note"><CircleHelp size={15} /> Standard pet hair may be included. SHWASH lists a $50 all-surface removal add-on; heavy buildup may need an upfront adjustment.</p>}
          <div className="booking-status-list" aria-label="Booking and payment status">
            <div className="booking-status booking-status--done"><span>1</span><div><strong>Service selected</strong><small>Estimate uses published menu prices</small></div><Check size={15} /></div>
            <div className={`booking-status ${details ? "booking-status--done" : "booking-status--current"}`}><span>2</span><div><strong>Details collected</strong><small>{details ? "Prepared in this tab; not sent" : "Complete the form to prepare"}</small></div>{details ? <Check size={15} /> : null}</div>
            <div className={`booking-status ${handoffOpened ? "booking-status--current" : ""}`}><span>3</span><div><strong>Official booking</strong><small>{handoffOpened ? "Opened · confirmation still pending" : "Confirmation comes from SHWASH"}</small></div></div>
            <div className="booking-status"><span>4</span><div><strong>Payment after service</strong><small>Processed by SHWASH when your service is complete</small></div></div>
          </div>
          {!details ? <div className="booking-next"><p>Review your details to get the official booking link and copyable summary.</p></div> : <div className="official-handoff">
            <div className="official-handoff__intro"><ShieldCheck size={18} /><div><strong>Continue with SHWASH</strong><p>Next, re-enter your details on the official site. This app cannot send them through automatically.</p></div></div>
            <a className="button button--primary button--full" href={OFFICIAL.booking} target="_blank" rel="noreferrer" onClick={openOfficialBooking}>Continue to Official Booking <ExternalLink size={16} /></a>
            <p className="handoff-caption">The SHWASH booking page opens in a new tab. Your appointment is not confirmed until SHWASH confirms it.</p>
            {handoffOpened && <p className="handoff-pending" role="status">Official booking opened. Confirmation is pending from SHWASH.</p>}
            {handoffError && <p className="field-error" role="alert">{handoffError}</p>}
            <button className="copy-summary" type="button" onClick={copySummary}><Clipboard size={15} /> {copyState === "copied" ? "Summary copied" : "Copy booking summary"}</button>
            {copyState === "error" && <div className="summary-copy-fallback"><p>Copy was unavailable. Select and copy the summary below:</p><textarea readOnly rows={8} value={lines} aria-label="Booking summary to copy" /></div>}
          </div>}
        </Card>

        <div className="payment-after-card"><span className="payment-after-card__icon"><LockKeyhole size={17} /></span><div><strong>Payment follows your service.</strong><p>SHWASH says payment is collected after your detail, once the work is complete to your satisfaction. It accepts major credit/debit cards, Apple Pay, and Google Pay. No payment is due here.</p><a href={OFFICIAL.call}><Phone size={14} /> Ask SHWASH about payment</a></div></div>
        <Link className="back-link" href="/assistant"><ArrowLeft size={15} /> Back to the consultant</Link>
        <p className="booking-location-note"><MapPin size={14} /> Service availability and final pricing are confirmed in SHWASH’s official booking flow.</p>
      </aside>
    </div>
  );
}

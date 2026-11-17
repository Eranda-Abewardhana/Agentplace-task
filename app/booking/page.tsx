import { Suspense } from "react";
import { BookingPrep } from "@/components/booking-prep";
import { addOns, cadences, isAddOnAvailableForService, vehicles, type AddOnId, type PlanCadence, type ServiceSelection, type VehicleId } from "@/lib/business-data";

export const metadata = {
  title: "Prepare Your SHWASH Booking",
  description: "Organize your SHWASH service and appointment details, then continue through the official booking flow.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function BookingPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="booking-page">
      <section className="simple-page-hero simple-page-hero--booking"><div className="container simple-page-hero__inner"><p className="eyebrow">A clear next step</p><h1>Prepare the details. Book with SHWASH.</h1><p>Your information stays in this browser while you review it. The actual reservation is completed and confirmed by SHWASH through its official booking site.</p></div></section>
      <section className="section section--light booking-main"><div className="container"><Suspense fallback={<p className="booking-form-skeleton" role="status">Loading your booking summary…</p>}><BookingOptions searchParams={searchParams} /></Suspense></div></section>
    </main>
  );
}

async function BookingOptions({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const vehicleValue = first(params.vehicle);
  const packageValue = first(params.package);
  const cadenceValue = first(params.cadence);
  const addOnValues = (first(params.addons) ?? "").split(",");
  const initialVehicle: VehicleId = vehicles.some((item) => item.id === vehicleValue) ? vehicleValue as VehicleId : "sedan";
  const initialPackage: ServiceSelection = packageValue === "interior" || packageValue === "exterior" ? packageValue : "full";
  const initialCadence: PlanCadence = cadences.some((item) => item.id === cadenceValue) ? cadenceValue as PlanCadence : "one-time";
  const initialAddOns = addOns.filter((item) => addOnValues.includes(item.id) && isAddOnAvailableForService(item.id, initialPackage)).map((item) => item.id) as AddOnId[];

  return <BookingPrep initialVehicle={initialVehicle} initialPackage={initialPackage} initialCadence={initialCadence} initialAddOns={initialAddOns} />;
}

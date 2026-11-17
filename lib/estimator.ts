import {
  addOns,
  publishedPricing,
  type AddOnId,
  type DetailPackage,
  type PlanCadence,
  type VehicleId,
} from "@/lib/business-data";

export type Estimate = {
  basePrice: number | null;
  addOnsTotal: number;
  total: number | null;
  selectedAddOns: { id: AddOnId; label: string; price: number }[];
  quoteRequired: boolean;
};

export function estimateDetail({
  vehicle,
  detailPackage,
  cadence,
  selectedAddOnIds = [],
}: {
  vehicle: VehicleId;
  detailPackage: DetailPackage;
  cadence: PlanCadence;
  selectedAddOnIds?: AddOnId[];
}): Estimate {
  const selectedAddOns = addOns.filter(
    (addOn) =>
      selectedAddOnIds.includes(addOn.id) &&
      (!addOn.fullDetailOnly || detailPackage === "full"),
  );
  const addOnsTotal = selectedAddOns.reduce((total, addOn) => total + addOn.price, 0);
  const basePrice =
    vehicle === "oversized" ? null : publishedPricing[vehicle][detailPackage][cadence];

  return {
    basePrice,
    addOnsTotal,
    total: basePrice === null ? null : basePrice + addOnsTotal,
    selectedAddOns: selectedAddOns.map(({ id, label, price }) => ({ id, label, price })),
    quoteRequired: basePrice === null,
  };
}

export function formatUsd(amount: number | null): string {
  if (amount === null) return "Call for quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

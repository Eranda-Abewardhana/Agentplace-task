import { z } from "zod";
import {
  addOns,
  packageDetails,
  vehicles,
  type AddOnId,
  type DetailPackage,
  type PlanCadence,
  type VehicleId,
} from "@/lib/business-data";
import { estimateDetail } from "@/lib/estimator";

export const recommendationInputSchema = z.object({
  location: z.string().trim().min(2).max(100),
  vehicle: z.enum(["sedan", "suv5", "suv7", "oversized"]),
  goal: z.enum(["interior", "exterior", "both"]),
  condition: z.enum(["light", "typical", "heavy"]),
  concerns: z.array(z.enum(["carpet-stains", "seat-stains", "pet-hair", "odor", "child-seat", "bio-mess"])).max(6),
  cadence: z.enum(["one-time", "monthly", "bi-monthly", "quarterly"]),
  budget: z.enum(["under-200", "200-300", "over-300", "flexible"]).optional(),
});

export type RecommendationInput = z.infer<typeof recommendationInputSchema>;

const concernAddOns: Partial<Record<RecommendationInput["concerns"][number], AddOnId>> = {
  "carpet-stains": "carpet-shampoo",
  "seat-stains": "seat-shampoo",
  "pet-hair": "pet-hair",
  odor: "ozone",
  "child-seat": "child-seat",
  "bio-mess": "bio-clean",
};

const areaIsListed = /austin|round rock|cedar park|pflugerville|georgetown|buda|manor|hutto|leander|lakeway|bee cave|dallas|houston/i;

export function buildRecommendation(input: RecommendationInput) {
  const detailPackage: DetailPackage = input.goal === "interior" ? "interior" : "full";
  const vehicle = vehicles.find((item) => item.id === input.vehicle)!;
  const suggestedAddOnIds = [...new Set(input.concerns
    .filter((concern) => concern !== "pet-hair" || input.condition === "heavy")
    .map((concern) => concernAddOns[concern])
    .filter((value): value is AddOnId => Boolean(value)))];
  const availableAddOnIds = suggestedAddOnIds.filter((id) => {
    const item = addOns.find((addOn) => addOn.id === id);
    if (!item) return false;
    if (input.goal === "exterior") return false;
    return !item.fullDetailOnly || detailPackage === "full";
  });

  const exteriorOnly = input.goal === "exterior";
  const estimate = exteriorOnly
    ? null
    : estimateDetail({
        vehicle: input.vehicle,
        detailPackage,
        cadence: input.cadence,
        selectedAddOnIds: availableAddOnIds,
      });

  const reasons = {
    interior: "You said the cabin is the priority, so interior-only keeps the service focused and is $50 less than the combined one-time detail for standard vehicle sizes.",
    exterior: "You asked to focus on the exterior. SHWASH offers exterior-only service in its official booking flow, but it does not publish that price on its pricing page.",
    both: "You want care inside and out, so the combined detail is the closest match to that goal.",
  };

  const interiorConcerns = input.concerns.some((concern) =>
    ["carpet-stains", "seat-stains", "pet-hair", "odor", "child-seat", "bio-mess"].includes(concern),
  );
  const concernsNote = input.goal === "exterior"
    ? interiorConcerns
      ? "You selected an exterior-only detail and also mentioned an interior need. Interior cleaning is not included in this option; ask SHWASH whether an interior or combined detail is a better fit."
      : "SHWASH does not publish an exterior-only price here. Confirm the service scope and price in its official booking flow."
    : input.concerns.includes("bio-mess")
      ? "Bio cleaning is a specialized add-on. Contact SHWASH to confirm the job is within scope before booking."
      : input.condition === "heavy" && input.concerns.includes("pet-hair")
        ? "You noted heavier buildup and selected pet hair, so the published $50 all-surface removal add-on is included. SHWASH says standard pet hair may be included; confirm extensive buildup, service scope, and any adjustment before booking."
        : input.condition === "heavy"
          ? "You noted heavier-than-usual condition. Mention that in the official booking flow so SHWASH can confirm scope and any condition-based charge before starting."
          : input.concerns.includes("pet-hair")
            ? "SHWASH says standard pet hair may be included. This estimate leaves out the optional $50 all-surface removal; mention it during booking if buildup is extensive so SHWASH can confirm scope."
            : input.concerns.includes("carpet-stains") || input.concerns.includes("seat-stains")
              ? "Stain treatment is priced as the relevant carpet or seat shampoo add-on. Other condition-based charges require SHWASH confirmation."
              : input.concerns.includes("odor")
                ? "The $50 ozone odor treatment you selected is included in this estimate. Mention the odor source during booking so SHWASH can confirm the right treatment."
                : input.concerns.includes("child-seat")
                  ? "The $50 child car-seat cleaning add-on you selected is included in this estimate. Confirm the number and type of seats with SHWASH."
                  : "This estimate includes only options tied to needs you selected. Ask SHWASH to confirm any special work or condition-based charge.";

  const alternative: { package: DetailPackage; label: string; price: number | null } | null = exteriorOnly
    ? { package: "full", label: "Interior + exterior", price: input.vehicle === "oversized" ? null : estimateDetail({ vehicle: input.vehicle, detailPackage: "full", cadence: input.cadence }).total }
    : {
        package: detailPackage === "full" ? "interior" : "full",
        label: packageDetails[detailPackage === "full" ? "interior" : "full"].name,
        price: input.vehicle === "oversized" ? null : estimateDetail({ vehicle: input.vehicle, detailPackage: detailPackage === "full" ? "interior" : "full", cadence: input.cadence }).total,
      };
  const budgetCeiling = input.budget === "under-200" ? 200 : input.budget === "200-300" ? 300 : null;
  const budgetNote = budgetCeiling !== null && estimate?.total !== null && estimate?.total !== undefined && estimate.total > budgetCeiling
    ? `This estimate is above the budget range you selected. The ${alternative?.label.toLowerCase() ?? "other service option"} is ${alternative?.price === null || alternative?.price === undefined ? "custom quote" : `$${alternative.price} before optional add-ons`} at this cadence, if it fits your needs.`
    : null;

  return {
    location: input.location,
    vehicle: { id: input.vehicle as VehicleId, label: vehicle.label },
    package: exteriorOnly ? "exterior" as const : detailPackage,
    packageLabel: exteriorOnly ? "Exterior-only detail" : packageDetails[detailPackage].name,
    cadence: input.cadence as PlanCadence,
    reason: reasons[input.goal],
    estimate,
    suggestedAddOns: availableAddOnIds.map((id) => addOns.find((addOn) => addOn.id === id)!).map(({ id, label, price, description }) => ({ id, label, price, description })),
    alternative,
    budgetNote,
    conditionNote: concernsNote,
    areaNote: areaIsListed.test(input.location) ? null : "SHWASH lists Austin, Dallas, and Houston metro service. Confirm your exact address and availability in the official booking flow.",
    limitations: [
      "Estimate uses SHWASH's published prices and excludes taxes or any adjustment SHWASH confirms for unusual vehicle condition.",
      "Oversized vehicles require a custom quote.",
      "Service-plan discounts require a minimum of 3 completed visits.",
    ],
  };
}

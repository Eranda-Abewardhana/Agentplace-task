import { vehicleAssets } from "@/lib/assets";

export const OFFICIAL = {
  home: "https://www.shwash.co/",
  pricing: "https://www.shwash.co/pricing",
  austin: "https://www.shwash.co/locations/austin-tx",
  booking: "https://book.shwash.co/",
  call: "tel:+15127596337",
  text: "sms:+15127643015",
} as const;

export const vehicles = [
  {
    id: "sedan",
    label: "Coupe / Sedan",
    seats: "2–5 seats",
    examples: "BMW 3 Series · Audi A4 · Mercedes C-Class",
    image: vehicleAssets.sedan,
  },
  {
    id: "suv5",
    label: "5-Seat SUV / Truck",
    seats: "Up to 5 seats",
    examples: "BMW X3 · Range Rover · Ford F-150",
    image: vehicleAssets.suv5,
  },
  {
    id: "suv7",
    label: "7-Seat SUV / Van",
    seats: "6–7 seats",
    examples: "BMW X7 · Cadillac Escalade · Mercedes GLS",
    image: vehicleAssets.suv7,
  },
  {
    id: "oversized",
    label: "Sprinter / Oversized",
    seats: "Oversized vehicles",
    examples: "Mercedes Sprinter · Ford Transit",
    image: vehicleAssets.oversized,
  },
] as const;

export type VehicleId = (typeof vehicles)[number]["id"];
export type DetailPackage = "full" | "interior";
export type ServiceSelection = DetailPackage | "exterior";
export type PlanCadence = "one-time" | "monthly" | "bi-monthly" | "quarterly";

type PublishedRate = {
  "one-time": number;
  monthly: number;
  "bi-monthly": number;
  quarterly: number;
};

export const publishedPricing: Record<
  Exclude<VehicleId, "oversized">,
  Record<DetailPackage, PublishedRate>
> = {
  sedan: {
    full: { "one-time": 249, monthly: 149, "bi-monthly": 179, quarterly: 199 },
    interior: { "one-time": 199, monthly: 99, "bi-monthly": 129, quarterly: 149 },
  },
  suv5: {
    full: { "one-time": 299, monthly: 199, "bi-monthly": 229, quarterly: 249 },
    interior: { "one-time": 249, monthly: 149, "bi-monthly": 179, quarterly: 199 },
  },
  suv7: {
    full: { "one-time": 349, monthly: 249, "bi-monthly": 279, quarterly: 299 },
    interior: { "one-time": 299, monthly: 199, "bi-monthly": 229, quarterly: 249 },
  },
};

export const cadences: { id: PlanCadence; label: string; description: string }[] = [
  { id: "one-time", label: "One-time", description: "A single visit" },
  { id: "monthly", label: "Monthly", description: "One detail each month" },
  { id: "bi-monthly", label: "Every 2 months", description: "One detail every 2 months" },
  { id: "quarterly", label: "Every 3 months", description: "One detail every 3 months" },
];

export type AddOnId =
  | "carpet-shampoo"
  | "pet-hair"
  | "seat-shampoo"
  | "child-seat"
  | "ozone"
  | "bio-clean"
  | "clay-bar"
  | "engine-bay"
  | "headlight"
  | "ceramic-sealant";

export const addOns: {
  id: AddOnId;
  label: string;
  price: number;
  description: string;
  group: "interior" | "exterior";
  fullDetailOnly?: boolean;
}[] = [
  { id: "carpet-shampoo", label: "Carpet shampoo", price: 50, description: "Hot-water extraction for floors and mats", group: "interior" },
  { id: "pet-hair", label: "Pet-hair removal", price: 50, description: "Removal from interior surfaces", group: "interior" },
  { id: "seat-shampoo", label: "Seat shampoo", price: 50, description: "Hot-water extraction for fabric seats", group: "interior" },
  { id: "child-seat", label: "Child car-seat cleaning", price: 50, description: "Clean and sanitize child seats", group: "interior" },
  { id: "ozone", label: "Ozone odor removal", price: 50, description: "Odor treatment at the source", group: "interior" },
  { id: "bio-clean", label: "Bio cleaning", price: 150, description: "Specialized extraction and ozone treatment", group: "interior" },
  { id: "clay-bar", label: "Clay-bar treatment", price: 50, description: "Remove embedded paint contaminants", group: "exterior", fullDetailOnly: true },
  { id: "engine-bay", label: "Engine-bay detail", price: 50, description: "Clean and degrease the engine compartment", group: "exterior", fullDetailOnly: true },
  { id: "headlight", label: "Headlight restoration", price: 100, description: "Restore clarity to both headlights", group: "exterior", fullDetailOnly: true },
  { id: "ceramic-sealant", label: "Ceramic sealant upgrade", price: 100, description: "Paint protection described by SHWASH as up to 6 months", group: "exterior", fullDetailOnly: true },
];

export function isAddOnAvailableForService(id: AddOnId, service: ServiceSelection): boolean {
  const item = addOns.find((addOn) => addOn.id === id);
  if (!item || service === "exterior") return false;
  return service === "full" || item.group === "interior";
}

export const packageDetails = {
  full: {
    name: "Interior + Exterior Detail",
    shortName: "Interior + exterior",
    description: "A complete detail with a steam-cleaned cabin and a hand-washed, decontaminated, waxed exterior.",
    interior: [
      "Two-step deep vacuum",
      "Full steam cleaning",
      "Leather clean and conditioning",
      "Windows, mirrors and visor",
      "Matte-finish interior plastics",
      "Trunk, floor mats and carpets",
      "Air blowout for vents and crevices",
    ],
    exterior: [
      "Professional hand wash and decontamination pre-soak",
      "Wheel wells, rims and tires",
      "High-gloss spray wax",
      "Door jambs and trim",
      "Exterior trim and tire dressing",
    ],
  },
  interior: {
    name: "Interior Detail",
    shortName: "Interior only",
    description: "A full interior detail. Exterior cleaning is not included.",
    interior: [
      "Two-step deep vacuum",
      "Full steam cleaning",
      "Leather clean and conditioning",
      "Windows, mirrors and visor",
      "Matte-finish interior plastics",
      "Trunk, floor mats and carpets",
      "Air blowout for vents and crevices",
    ],
    exterior: [],
  },
} as const;

export const planConditions =
  "Service plans require a minimum of 3 completed services to retain discounted pricing. If you cancel before 3 visits, SHWASH may charge back the difference from the one-time rate for services already received.";

export const serviceAreaNote =
  "SHWASH lists service across the Austin, Dallas, and Houston metro areas. Confirm your exact address and availability in the official booking flow.";

export const paymentNote =
  "SHWASH's FAQ says payment is processed after the service is completed to your satisfaction. It lists major credit and debit cards, Apple Pay, and Google Pay. This app does not take payment.";

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, CircleHelp, Clock3 } from "lucide-react";
import { addOns, cadences, packageDetails, vehicles, type AddOnId, type DetailPackage, type PlanCadence, type VehicleId } from "@/lib/business-data";
import { estimateDetail, formatUsd } from "@/lib/estimator";

export function PricingEstimator() {
  const [vehicle, setVehicle] = useState<VehicleId>("sedan");
  const [detailPackage, setDetailPackage] = useState<DetailPackage>("full");
  const [cadence, setCadence] = useState<PlanCadence>("one-time");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const estimate = useMemo(
    () => estimateDetail({ vehicle, detailPackage, cadence, selectedAddOnIds: selectedAddOns }),
    [vehicle, detailPackage, cadence, selectedAddOns],
  );
  const selectedVehicle = vehicles.find((item) => item.id === vehicle)!;
  const bookingParams = new URLSearchParams({ vehicle, package: detailPackage, cadence });
  if (estimate.selectedAddOns.length) bookingParams.set("addons", estimate.selectedAddOns.map((item) => item.id).join(","));
  const bookingHref = `/booking?${bookingParams.toString()}`;

  function toggleAddOn(id: AddOnId) {
    setSelectedAddOns((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function choosePackage(id: DetailPackage) {
    setDetailPackage(id);
    if (id === "interior") {
      setSelectedAddOns((current) => current.filter((selected) => !addOns.find((item) => item.id === selected)?.fullDetailOnly));
    }
  }

  return (
    <div className="estimator" aria-label="Interactive SHWASH price estimator">
      <div className="estimator__controls">
        <div className="estimator__step">
          <div className="estimator__step-title"><span>01</span><div><h3>Choose your vehicle</h3><p>Rates are based on vehicle size.</p></div></div>
          <div className="vehicle-grid" role="group" aria-label="Vehicle category">
            {vehicles.map((item) => (
              <button
                className={`vehicle-option ${vehicle === item.id ? "is-selected" : ""}`}
                key={item.id}
                type="button"
                aria-pressed={vehicle === item.id}
                onClick={() => setVehicle(item.id)}
              >
                <Image src={item.image} alt="" width={148} height={76} />
                <strong>{item.label}</strong>
                <span>{item.examples.split(" · ")[0]}</span>
                {vehicle === item.id && <span className="vehicle-option__check"><Check size={14} /></span>}
              </button>
            ))}
          </div>
        </div>

        <div className="estimator__step">
          <div className="estimator__step-title"><span>02</span><div><h3>Pick a service</h3><p>One clear package for each service type.</p></div></div>
          <div className="package-select" role="group" aria-label="Service package">
            {(["full", "interior"] as const).map((id) => (
              <button type="button" key={id} className={`package-option ${detailPackage === id ? "is-selected" : ""}`} aria-pressed={detailPackage === id} onClick={() => choosePackage(id)}>
                <span className="package-option__radio" aria-hidden="true">{detailPackage === id && <span />}</span>
                <span><strong>{packageDetails[id].shortName}</strong><small>{id === "full" ? "Interior + exterior" : "Exterior not included"}</small></span>
                <span className="package-option__delta">{id === "interior" ? "$50 less" : "Complete"}</span>
              </button>
            ))}
          </div>
          <p className="inline-note"><CircleHelp size={15} /> Exterior-only service is available in the official booking flow; SHWASH does not publish its price here.</p>
        </div>

        <div className="estimator__step">
          <div className="estimator__step-title"><span>03</span><div><h3>How often?</h3><p>Service plan rates are shown per visit.</p></div></div>
          <div className="cadence-select" role="group" aria-label="Visit frequency">
            {cadences.map((item) => (
              <button key={item.id} type="button" className={`cadence-option ${cadence === item.id ? "is-selected" : ""}`} aria-pressed={cadence === item.id} onClick={() => setCadence(item.id)}>
                <span>{item.label}</span>
                {item.id === "monthly" && <small>Save up to $100</small>}
              </button>
            ))}
          </div>
        </div>

        <div className="estimator__step">
          <div className="estimator__step-title"><span>04</span><div><h3>Add a little extra, if you need it</h3><p>Only select work you want done.</p></div></div>
          <div className="addons-grid">
            {addOns.map((item) => {
              const unavailable = item.fullDetailOnly && detailPackage !== "full";
              const checked = selectedAddOns.includes(item.id) && !unavailable;
              return (
                <label key={item.id} className={`addon-option ${checked ? "is-selected" : ""} ${unavailable ? "is-disabled" : ""}`}>
                  <input type="checkbox" checked={checked} disabled={unavailable} onChange={() => toggleAddOn(item.id)} />
                  <span className="addon-option__check"><Check size={13} /></span>
                  <span className="addon-option__copy"><strong>{item.label}</strong><small>{item.description}</small></span>
                  <span className="addon-option__price">+${item.price}</span>
                </label>
              );
            })}
          </div>
          <p className="inline-note"><CircleHelp size={15} /> Exterior add-ons are available with the interior + exterior package. Heavy buildup or specialized work may need SHWASH to confirm scope.</p>
        </div>
      </div>

      <aside className="estimate-card" aria-live="polite">
        <div className="estimate-card__top">
          <p className="eyebrow">Your estimate</p>
          <h3>{selectedVehicle.label}</h3>
          <p>{packageDetails[detailPackage].name}</p>
          <div className="estimate-card__time"><Clock3 size={15} /> {cadence === "one-time" ? "One-time visit" : `${cadences.find((item) => item.id === cadence)?.label} plan · per visit`}</div>
        </div>
        <div className="estimate-card__lines">
          {estimate.basePrice === null ? (
            <>
              <div className="estimate-line"><span>Custom vehicle pricing</span><strong>Call for quote</strong></div>
              {estimate.selectedAddOns.map((item) => <div className="estimate-line" key={item.id}><span>{item.label}</span><strong>{formatUsd(item.price)}</strong></div>)}
              {estimate.selectedAddOns.length > 0 && <p className="estimate-card__plan">Optional add-ons are shown at their published prices; the oversized vehicle total needs SHWASH confirmation.</p>}
            </>
          ) : (
            <>
              <div className="estimate-line"><span>Service price</span><strong>{formatUsd(estimate.basePrice)}</strong></div>
              {estimate.selectedAddOns.map((item) => <div className="estimate-line" key={item.id}><span>{item.label}</span><strong>{formatUsd(item.price)}</strong></div>)}
              {cadence !== "one-time" && <p className="estimate-card__plan">Billed per visit. Three completed services are required to keep plan pricing.</p>}
            </>
          )}
          {estimate.basePrice !== null && <div className="estimate-line estimate-line--total"><span>Estimated total{cadence !== "one-time" ? " / visit" : ""}</span><strong>{formatUsd(estimate.total)}</strong></div>}
        </div>
        <div className="estimate-card__bottom">
          <Link className="button button--primary button--full" href={bookingHref}>Prepare my booking <ArrowRight size={17} /></Link>
          <p>Final scope and appointment are confirmed in SHWASH’s official booking flow. No payment is taken here.</p>
        </div>
      </aside>
    </div>
  );
}

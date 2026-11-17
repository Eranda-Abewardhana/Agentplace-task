import { ArrowRight, Sparkles } from "lucide-react";

export function IllustrativeBeforeAfter() {
  return (
    <div className="illustrative-showcase" aria-label="Illustrative before and after example of a cabin cleaning">
      <div className="illustrative-showcase__panels">
        <div className="illustrative-panel illustrative-panel--before">
          <span className="illustrative-panel__label">Before</span>
          <div className="seat-illustration seat-illustration--before" aria-hidden="true"><span className="seat-illustration__back" /><span className="seat-illustration__base" /><i /><i /><i /><i /></div>
          <p>Illustrative everyday buildup</p>
        </div>
        <div className="illustrative-showcase__arrow"><ArrowRight size={18} /></div>
        <div className="illustrative-panel illustrative-panel--after">
          <span className="illustrative-panel__label"><Sparkles size={13} /> After</span>
          <div className="seat-illustration seat-illustration--after" aria-hidden="true"><span className="seat-illustration__back" /><span className="seat-illustration__base" /><b /></div>
          <p>Illustrative refreshed cabin</p>
        </div>
      </div>
      <p className="illustrative-showcase__disclaimer">Concept illustration, not a SHWASH customer vehicle. Actual results vary with material and condition.</p>
    </div>
  );
}

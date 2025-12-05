import { useEffect, useRef } from "react";

const ScoreRing = ({ clb, id }: { clb: number; id: string }) => {
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pct = Math.min(100, Math.round((clb / 9) * 100));
    let cur = 0;

    // Animation loop
    const step = () => {
      cur = Math.min(pct, cur + 2);
      const deg = Math.round((360 * cur) / 100);

      if (ringRef.current) {
        // Note: utilizing css variables defined in your global css
        ringRef.current.style.background = `conic-gradient(var(--vt-g1) 0deg, var(--vt-g2) ${deg}deg, #e5e7eb ${deg}deg)`;
      }
      if (labelRef.current) {
        labelRef.current.textContent = cur + "%";
      }

      if (cur < pct) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [clb]);

  return (
    <div className="score-ring" ref={ringRef} id={id}>
      <span ref={labelRef}>0%</span>
    </div>
  );
};

export default ScoreRing;

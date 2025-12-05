import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { PromptRandQuestion } from "@/types/AssessmentTypes.type";

export function PromptsAccordion({ type }: { type: string }) {
  const [prompts, setPrompts] = useState<PromptRandQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchPrompts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get<PromptRandQuestion[]>(
          `/celpip/prompts-questions?testTypeSlug=${encodeURIComponent(type)}`
        );
        if (!cancelled) setPrompts(res.data || []);
      } catch {
        if (!cancelled) setError("Failed to load prompts");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPrompts();
    return () => {
      cancelled = true;
    };
  }, [type]);

  if (isLoading)
    return <div className="small text-secondary">Loading prompts...</div>;
  if (error) return <div className="text-danger small">{error}</div>;
  if (!prompts || prompts.length === 0)
    return <div className="small text-secondary">No prompts available.</div>;

  return (
    <div className="accordion" id={`spkAcc-${type}`}>
      {prompts.map((p, idx) => {
        const itemId = `spk-${type}-${p.id}`;
        return (
          <>
            <div className="accordion-item" key={p.id}></div>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${idx !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${itemId}`}
                aria-expanded={idx === 0 ? "true" : "false"}
                aria-controls={itemId}
              >
                {p.namePrefix} {p.name}
                <span className="badge text-bg-warning-subtle ms-2">Focus</span>
              </button>
            </h2>

            <div
              id={itemId}
              className={`accordion-collapse collapse !visible ${
                idx === 0 ? "show" : ""
              }`}
              data-bs-parent={`#spkAcc-${type}`}
            >
              <div className="accordion-body">
                <div>{p.shortDescription}</div>
                <div className="mt-2 small text-secondary">
                  <strong>Preparation:</strong> {p.preparationTime}s ·{" "}
                  <strong>Response:</strong> {p.responseTime}s
                </div>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
}

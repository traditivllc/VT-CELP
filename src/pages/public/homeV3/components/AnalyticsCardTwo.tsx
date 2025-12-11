import ScoreRing from "./ScoreRing";

export function AnalyticsCardTwo({
  title,
  avgSpeakingScore,
}: {
  title: string;
  avgSpeakingScore: number;
}) {
  return (
    <div className="card h-100 speak-card">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <div className="small text-secondary">{title}</div>
          <div className="h4 mb-1">CLB {avgSpeakingScore}</div>
          <div className="d-flex flex-wrap gap-2 mt-2">
            <span className="chip">
              <i className="bi bi-speedometer2"></i> Fluency ↑
            </span>
            <span className="chip">
              <i className="bi bi-journal-check"></i> Task Fit
            </span>
          </div>
        </div>
        <ScoreRing clb={avgSpeakingScore} id="sRing" />
      </div>
    </div>
  );
}

import ScoreRing from "./ScoreRing";

export function AnalyticsCardOnce({
  overallAvgScore: clb = 0,
  overallAvgScore,
}: {
  overallAvgScore?: number;
  scoreChangePercentage?: number;
}) {
  const pct = Math.min(100, Math.round((clb / 9) * 100));
  return (
    <div className="card h-100">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <div className="small text-secondary">Overall (latest)</div>
          <div className="h4 fw-bold mb-1">CLB {clb}</div>
          <div className="text-success small">
            <i className="bi bi-arrow-up-right"></i> +{overallAvgScore} vs prev
          </div>
        </div>
        <ScoreRing clb={clb} id="overallRing" />
      </div>
      <div className="card-footer bg-white">
        <div className="d-flex justify-content-between small">
          <span>Progress to CLB 9</span>
          <span>{pct}%</span>
        </div>
        <div className="progress mt-2">
          <div className="progress-bar" style={{ width: { pct } + "%" }}></div>
        </div>
      </div>
    </div>
  );
}

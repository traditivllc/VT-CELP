import { useAuth } from "@/comman/contexts/AuthContext";
import { getEvaluationTimeline } from "@/services/celpip-services";
import { type CustomerScoreTimeLine } from "@/types/AssessmentTypes.type";
import { useEffect, useState } from "react";

export default function Timeline() {
  const [evaluationTimeline, setEvaluationTimeline] = useState<
    CustomerScoreTimeLine[]
  >([]);
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      getEvaluationTimeline().then((res) => {
        setEvaluationTimeline(res.reverse());
      });
    }
  }, [isAuthenticated]);

  if (evaluationTimeline.length === 0) {
    evaluationTimeline.push({
      totalScore: "0",
      month: "1",
    });
  }

  return (
    <section className="mb-4 mt-4 relative">
      {isAuthenticated === false && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xs flex items-center justify-center z-10 font-bold">
          Please Login to see your timeline
        </div>
      )}
      <div className="card  pb-6">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div className="section-title">
                Your Growth (last Last 6 months)
              </div>
              <div className="soft-label">
                From CLB {evaluationTimeline[0].totalScore} →{" "}
                {evaluationTimeline[evaluationTimeline.length - 1].totalScore}
              </div>
            </div>
          </div>
          <div className="timeline mt-3">
            <div className="line">
              <div className="fill" style={{ width: "100%" }}></div>
            </div>
            <div className="dots">
              {evaluationTimeline.map((item, index) => (
                <div
                  className="dot"
                  key={index}
                  data-label={`M-${index + 1} :  ${item.totalScore}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

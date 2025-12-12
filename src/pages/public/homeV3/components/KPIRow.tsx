import { getAnalytics } from "@/services/celpip-services";
import type { CustomerAnalytics } from "@/types/AssessmentTypes.type";
import { useEffect, useState } from "react";
import { AnalyticsCardOnce } from "./AnalyticsCardOnce";
import { AnalyticsCardTwo } from "./AnalyticsCardTwo";
import { useAuth } from "@/comman/contexts/AuthContext";

export function KPIRow() {
  const { isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState<CustomerAnalytics>();
  useEffect(() => {
    if (isAuthenticated)
      getAnalytics().then((res) => {
        setAnalytics(res);
      });
  }, [isAuthenticated]);

  return (
    <div className="row g-3">
      <div className="col-12 col-lg-3">
        <AnalyticsCardOnce
          overallAvgScore={analytics?.overallAvgScore || 0}
          scoreChangePercentage={analytics?.scoreChangePercentage || 0}
        />
      </div>

      <div className="col-12 col-lg-3">
        <AnalyticsCardTwo
          title="Speaking"
          avgSpeakingScore={analytics?.avgSpeakingScore || 0}
        />
      </div>

      <div className="col-12 col-lg-3">
        <AnalyticsCardTwo
          title="Writing"
          avgSpeakingScore={analytics?.avgWritingScore || 0}
        />
      </div>

      <div className="col-12 col-lg-3">
        <div className="card h-100 position-relative overflow-visible">
          <img
            src="images/nurse.webp"
            alt="coach"
            className="nurse-float-card"
            loading="lazy"
          />
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="small text-secondary">Study streak</div>
              <span className="badge text-bg-success-subtle">Active</span>
            </div>
            <div className="display-6 fw-bold my-1">6 days</div>
            <div className="small text-secondary">
              Avg {(analytics?.avgSecondsLast6Days || 0) / 60}/day last week
            </div>
            <div className="progress mt-3">
              <div className="progress-bar" style={{ width: "60%" }}></div>
            </div>
          </div>
          <div className="card-footer bg-white d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm w-100">
              <i className="bi bi-clock-history"></i> Schedule
            </button>
            <button className="btn btn-outline-success btn-sm w-100">
              <i className="bi bi-bell"></i> Remind
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

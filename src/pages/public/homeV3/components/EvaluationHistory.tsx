import api from "@/lib/axios";
import type {
  TAssessmentType,
  EvaluationResult,
} from "@/types/AssessmentTypes.type";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type Props = {
  type?: TAssessmentType;
};

export function EvaluationHistory(props: Props) {
  const [list, setList] = useState<EvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<EvaluationResult[]>("/evaluation/history", {
          params: {
            promptTypeSlug: props.type,
          },
        });
        setList(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load evaluation history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [props.type]);

  if (isLoading) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <h6 className="mb-3">
            Attempt History —{" "}
            {props.type === "speaking" ? "Speaking" : "Writing"}
          </h6>
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-100">
        <div className="card-body">
          <h6 className="mb-3">Attempt History</h6>
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-body">
        <h6 className="mb-3">
          Attempt History — {props.type === "speaking" ? "Speaking" : "Writing"}
        </h6>
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Prompt</th>
                <th>CLB Score</th>
                <th>Time</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!list || list.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No evaluation history yet
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((item) => (
                  <tr key={item.evaluationUuid}>
                    <td className="text-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div style={{ maxWidth: "300px" }}>
                        <div className="fw-medium text-truncate">
                          {item.promptQuestion.celpTestPrompt.namePrefix}
                        </div>
                        <small className="text-muted text-truncate d-block">
                          {item.promptQuestion.celpTestPrompt.name}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          parseFloat(item.score) >= 8
                            ? "text-bg-success"
                            : parseFloat(item.score) >= 6
                            ? "text-bg-warning"
                            : "text-bg-secondary"
                        }`}
                      >
                        {item.score}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      {Math.round(parseFloat(item.responseTime))}s
                    </td>
                    <td>
                      <span
                        className={`badge text-white ${
                          item.status === "COMPLETED"
                            ? "bg-success"
                            : item.status === "IN_PROGRESS"
                            ? "text-bg-warning-subtle"
                            : "bg-secondary"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/test/speaking/${item.promptQuestion.celpTestPrompt.promptUuid}/result?evaluationUUID=${item.evaluationUuid}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

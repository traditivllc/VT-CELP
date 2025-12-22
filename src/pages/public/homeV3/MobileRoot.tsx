import { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { EvaluationHistory } from "./components/EvaluationHistory";
import { useAuth } from "@/comman/contexts/AuthContext";

const MobileRoot = () => {
  const [activeScreen, setActiveScreen] = useState("home");
  const { currentCustomer, isAuthenticated, logout } = useAuth();
  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return (
          <>
            <div className="mobile-card mobile-card-gradient">
              <div className="mobile-kpi">
                <div>
                  <div className="small">Overall (latest)</div>
                  <div className="h4 mb-0">CLB 8</div>
                  <div className="small text-dark">+0.5 vs previous</div>
                </div>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#fff3fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  89%
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Progress to CLB 9</span>
                  <span>89%</span>
                </div>
                <div className="progress" style={{ height: "0.45rem" }}>
                  <div className="progress-bar" style={{ width: "89%" }}></div>
                </div>
              </div>
            </div>

            <div className="mobile-card">
              <div className="d-grid gap-2 mt-2">
                <Link to="/test/speaking" className="mobile-cta-primary">
                  <i className="bi bi-mic"></i> Start Speaking Practice
                </Link>
                <Link
                  to="/test/writing"
                  className="mobile-cta-outline btn btn-outline-secondary"
                >
                  <i className="bi bi-pencil-square"></i> Start Writing Practice
                </Link>
              </div>
            </div>
          </>
        );
      case "speaking":
        return (
          <>
            <div className="mobile-card mobile-card-gradient">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <div className="small">Speaking Practice</div>
                  <div className="h5 mb-0">CLB 8 (target 9)</div>
                </div>
                <span className="badge bg-light text-dark border">
                  Fluency focus
                </span>
              </div>
              <div className="progress" style={{ height: "0.45rem" }}>
                <div className="progress-bar" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="mobile-card">
              <Link
                to="/test/speaking"
                className="btn brand-btn w-100 mb-2 text-white"
              >
                <i className="bi bi-mic"></i> Start Speaking Practice
              </Link>
            </div>
          </>
        );
      case "writing":
        return (
          <>
            <div className="mobile-card mobile-card-gradient">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <div className="small">Writing Practice</div>
                  <div className="h5 mb-0">CLB 7 (target 9)</div>
                </div>
                <span className="badge bg-light text-dark border">
                  Grammar focus
                </span>
              </div>
              <div className="progress" style={{ height: "0.45rem" }}>
                <div className="progress-bar" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="mobile-card">
              <Link
                to="/test/writing"
                className="btn brand-btn w-100 mb-2 text-white"
              >
                <i className="bi bi-pencil-square"></i> Start New Writing Task
              </Link>
            </div>
          </>
        );
      case "history":
        return (
          <Suspense fallback={<p>Loading...</p>}>
            <EvaluationHistory />
          </Suspense>
        );
      case "profile": {
        const initials = (() => {
          const name = `${currentCustomer?.firstName || ""} ${
            currentCustomer?.lastName || ""
          }`.trim();
          if (name)
            return name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("");
          if (currentCustomer?.email)
            return currentCustomer.email.charAt(0).toUpperCase();
          return "U";
        })();

        return (
          <div className="mobile-card">
            <div className="fw-semibold small mb-2">Profile</div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "56px",
                  height: "56px",
                  background: "#fee2f8",
                  fontWeight: 700,
                }}
              >
                {initials}
              </div>
              <div>
                <div className="fw-semibold">
                  {isAuthenticated && currentCustomer
                    ? `${currentCustomer.firstName || ""} ${
                        currentCustomer.lastName || ""
                      }`.trim()
                    : "Guest User"}
                </div>
                <div className="small text-secondary">
                  {isAuthenticated && currentCustomer?.email
                    ? currentCustomer.email
                    : "Not signed in"}
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <div className="d-grid gap-2 mb-2">
                  <button
                    className="btn btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#planModal"
                  >
                    <i className="bi bi-list-task"></i> View Plan
                  </button>
                  <button
                    className="btn cta-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#boostModal"
                  >
                    <i className="bi bi-rocket-takeoff"></i> Boost Plan
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      logout();
                      setActiveScreen("home");
                    }}
                  >
                    <i className="bi bi-box-arrow-right"></i> Sign out
                  </button>
                </div>
                {/* <div className="small text-secondary mt-2">
                  Member since:{" "}
                  {currentCustomer?.createdAt
                    ? new Date(currentCustomer.createdAt).toLocaleDateString()
                    : "—"}
                </div> */}
              </>
            ) : (
              <button
                className="mobile-cta-primary"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                <i className="bi bi-envelope"></i> Sign in with email
              </button>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div id="mobile-root">
      <div className="mobile-app">
        <header className="mobile-header">
          <div>
            <div className="mobile-header-title">
              <img
                style={{ width: "110px" }}
                src="images/logo.png"
                loading="lazy"
                alt="logo"
              />
            </div>
            <div className="mobile-header-sub">
              CLB 8 · Target CLB 9 in 30 days
            </div>
          </div>
        </header>

        <main className="mobile-main">{renderScreen()}</main>

        <nav className="mobile-bottom-nav">
          {["home", "speaking", "writing", "history", "profile"].map((tab) => (
            <button
              key={tab}
              className={`mobile-nav-btn ${
                activeScreen === tab ? "active" : ""
              }`}
              onClick={() => setActiveScreen(tab)}
            >
              <i
                className={`bi bi-${
                  tab === "home"
                    ? "house-door"
                    : tab === "speaking"
                    ? "mic"
                    : tab === "writing"
                    ? "pencil-square"
                    : tab === "history"
                    ? "clock-history"
                    : "person"
                }`}
              ></i>
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileRoot;

import { useAuth } from "@/comman/contexts/AuthContext";
import { Suspense, useState } from "react";
import { Link } from "react-router-dom";
import AudioRecorder from "./components/AudioRecorder";
import { EvaluationHistory } from "./components/EvaluationHistory";
import { KPIRow } from "./components/KPIRow";
import { PlanModal } from "./components/Modals";
import WritingEditor from "./components/WritingEditor";

// --- DESKTOP COMPONENT ---
const DesktopRoot = () => {
  const { currentCustomer } = useAuth();

  return (
    <div id="desktop-root">
      <header className="app-header">
        <div className="container py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div>
              <div className="text-secondary small" id="welcomeText">
                {currentCustomer ? (
                  <>
                    <span className="text-success fw-semibold">
                      Welcome, {currentCustomer.firstName}!
                    </span>{" "}
                    Your CELPIP AI account is ready.
                  </>
                ) : (
                  <img
                    style={{ width: "140px" }}
                    src="images/logo.png"
                    loading="lazy"
                    alt="Logo"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn speak-btn btn-sm">
              <i className="bi bi-mic"></i> Speaking Practice
            </button>
            <button className="btn write-btn btn-sm">
              <i className="bi bi-pencil-square"></i> Writing Practice
            </button>
            <button
              className="btn cta-btn btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              <i className="bi bi-rocket-takeoff"></i> Boost Plan
            </button>
            <button
              className="btn brand-btn btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#planModal"
            >
              <i className="bi bi-list-task"></i> View Plan
            </button>
          </div>
        </div>
      </header>

      <main className="container my-4 position-relative">
        {/* KPI Row */}
        <KPIRow />

        {/* Tabs */}
        <div className="card mt-4">
          <div className="card-header bg-white">
            <ul className="nav nav-tabs card-header-tabs" role="tablist">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#speaking"
                  type="button"
                >
                  <i className="bi bi-mic"></i> Speaking
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#writing"
                  type="button"
                >
                  <i className="bi bi-pencil-square"></i> Writing
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body tab-content">
            {/* SPEAKING TAB */}
            <div className="tab-pane fade show active speak-tint" id="speaking">
              <div className="row g-4">
                <div className="col-12 col-xl-5">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6>Compiled Feedback — Speaking</h6>
                      <div className="accordion" id="spkAcc">
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              data-bs-toggle="collapse"
                              data-bs-target="#spk1"
                            >
                              Fluency & Coherence{" "}
                              <span className="badge text-bg-warning-subtle ms-2">
                                Focus
                              </span>
                            </button>
                          </h2>
                          <div
                            id="spk1"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#spkAcc"
                          >
                            <div className="accordion-body">
                              <ul className="mb-1">
                                <li>
                                  Cap pauses at 2–3s; keep flow between ideas.
                                </li>
                                <li>
                                  Link ideas (however, moreover, as a result).
                                </li>
                                <li>
                                  Use <b>PREP</b>: Point → Reason → Example →
                                  Point.
                                </li>
                              </ul>
                              <div className="small text-secondary">
                                Drill: 2-min impromptu x4 daily.
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* More Accordion Items omitted for brevity but follow same structure */}
                      </div>
                      <hr />
                      <Link
                        to="/test/speaking"
                        className="btn brand-btn w-100 mb-2 text-white"
                      >
                        <i className="bi bi-mic-fill"></i> Start New Speaking
                        Task
                      </Link>
                      {/* <AudioRecorder
                        id="deskRecorderPanel"
                        prompt="Describe a difficult decision you had to make."
                      /> */}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-xl-7">
                  <Suspense fallback={<p>Loading...</p>}>
                    <EvaluationHistory />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* WRITING TAB */}
            <div className="tab-pane fade write-tint" id="writing">
              <div className="row g-4">
                <div className="col-12 col-xl-5">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6>Compiled Feedback — Writing</h6>
                      <div className="accordion" id="wAcc">
                        {/* Accordion Items */}
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              data-bs-toggle="collapse"
                              data-bs-target="#w1"
                            >
                              Grammar & Accuracy{" "}
                              <span className="badge text-bg-warning-subtle ms-2">
                                Focus
                              </span>
                            </button>
                          </h2>
                          <div
                            id="w1"
                            className="accordion-collapse collapse show"
                            data-bs-parent="#wAcc"
                          >
                            <div className="accordion-body">
                              <ul className="mb-1">
                                <li>Fix article usage (a/an/the) & plurals.</li>
                                <li>Break long chains → concise sentences.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <WritingEditor
                        id="deskWritingPanel"
                        prompt="Write an email to your landlord explaining a problem in your apartment."
                        storageKey="celpipDeskWritingDraft"
                      />
                    </div>
                  </div>
                </div>

                {/* History Table Writing */}
                <div className="col-12 col-xl-7">
                  <EvaluationHistory type="writing" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <section className="mb-4 mt-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="section-title">
                    Your Growth (last 8 attempts)
                  </div>
                  <div className="soft-label">From CLB 7 → 8</div>
                </div>
              </div>
              <div className="timeline mt-3">
                <div className="line">
                  <div className="fill" style={{ width: "100%" }}></div>
                </div>
                <div className="dots">
                  <div className="dot" data-label="M-7"></div>
                  <div className="dot" data-label="M-6"></div>
                  <div className="dot" data-label="M-5"></div>
                  <div className="dot" data-label="M-4"></div>
                  <div className="dot" data-label="Now-3"></div>
                  <div className="dot" data-label="Now-2"></div>
                  <div className="dot" data-label="Now-1"></div>
                  <div className="dot" data-label="Now"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky CTA */}
        <div className="sticky-cta mt-4">
          <div className="card brand-outline">
            <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <i
                  className="bi bi-lightning-charge-fill fs-3"
                  style={{ color: "#ff4db8" }}
                ></i>
                <div>
                  <div className="fw-semibold">Boost to CLB 9+ in 30 Days</div>
                  <div className="small text-secondary">
                    Daily drills + instant feedback + targeted grammar fixes
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
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
                  <i className="bi bi-rocket-takeoff"></i> Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- MOBILE COMPONENT ---
const MobileRoot = () => {
  const [activeScreen, setActiveScreen] = useState("home");

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
                <button
                  className="mobile-cta-primary"
                  onClick={() => setActiveScreen("speaking")}
                >
                  <i className="bi bi-mic"></i> Start Speaking Practice
                </button>
                <button
                  className="mobile-cta-outline btn btn-outline-secondary"
                  onClick={() => setActiveScreen("writing")}
                >
                  <i className="bi bi-pencil-square"></i> Start Writing Practice
                </button>
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
              <AudioRecorder
                id="mRecorderPanel"
                prompt="Describe a time when you helped someone."
              />
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
              <WritingEditor
                id="mWritingPanel"
                prompt="Write an email to your manager requesting time off."
                storageKey="celpipMobileWritingDraft"
              />
            </div>
          </>
        );
      case "history":
        return (
          <div className="mobile-card">
            <div className="fw-semibold small mb-2">History</div>
            <ul className="list-group list-group-flush small">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <div>Speaking · Difficult choice</div>
                  <div className="text-secondary">Nov 10, 2025</div>
                </div>
                <span className="badge text-bg-success-subtle">CLB 8</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <div>Writing · Complaint to landlord</div>
                  <div className="text-secondary">Nov 09, 2025</div>
                </div>
                <span className="badge text-bg-warning-subtle">CLB 7</span>
              </li>
            </ul>
          </div>
        );
      case "profile":
        return (
          <div className="mobile-card">
            <div className="fw-semibold small mb-2">Profile</div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "42px", height: "42px", background: "#fee2f8" }}
              >
                <i className="bi bi-person-fill"></i>
              </div>
              <div>
                <div className="fw-semibold">Guest User</div>
              </div>
            </div>
            <button
              className="mobile-cta-primary"
              data-bs-toggle="modal"
              data-bs-target="#boostModal"
            >
              <i className="bi bi-envelope"></i> Sign in with email
            </button>
          </div>
        );
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

// --- APP ROOT ---
const App = () => {
  return (
    <>
      {/* Shared Backgrounds */}
      <img
        src="images/bg-circles.png"
        alt=""
        className="bg-circle"
        loading="lazy"
      />
      <img
        src="images/nurse.png"
        alt="Encouraged Nurse"
        className="nurse-float"
        loading="lazy"
      />

      <DesktopRoot />
      <MobileRoot />

      <PlanModal />
    </>
  );
};

export default App;

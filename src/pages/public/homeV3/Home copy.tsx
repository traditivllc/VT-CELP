import { useAuth } from "@/comman/contexts/AuthContext";
import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileRoot from "./MobileRoot";
import { EvaluationHistory } from "./components/EvaluationHistory";
import { KPIRow } from "./components/KPIRow";
import { PlanModal } from "./components/Modals";
import Timeline from "./components/Timeline";

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
            <Link
              to="/test/speaking"
              className="btn speak-btn text-white btn-sm"
            >
              <i className="bi bi-pencil-square"></i> Speaking Practice
            </Link>
            <Link
              to="/test/writing"
              className="btn write-btn btn-sm text-white"
            >
              <i className="bi bi-pencil-square"></i> Writing Practice
            </Link>
            <button
              className="btn cta-btn btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              <i className="bi bi-rocket-takeoff"></i> Boost Plan
            </button>
            <button
              className="btn brand-btn btn-sm text-white"
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
              <li className="nav-item">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#listening"
                  type="button"
                >
                  <i className="bi bi-ear"></i> Listening
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
                    <EvaluationHistory type="speaking" />
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
                      <Link
                        to="/test/writing"
                        className="btn brand-btn w-100 mb-2 text-white"
                      >
                        <i className="bi bi-pencil-square"></i> Start New
                        Writing Task
                      </Link>
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
        <Timeline />

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
      {/* MobileRoot only render on small screens */}
      <ConditionalMobile />

      <PlanModal />
    </>
  );
};

export default App;

function ConditionalMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  return isMobile ? <MobileRoot /> : null;
}

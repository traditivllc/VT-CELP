import React, { useState } from "react";

export const PlanModal = () => (
  <div className="modal fade" id="planModal" tabIndex={-1} aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-3 border-0 rounded-4">
        <div className="modal-header border-0">
          <h5 className="modal-title">
            <i className="bi bi-lightning-fill text-warning"></i> Choose Your
            Plan
          </h5>
          <button
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="border rounded-4 p-3 h-100 text-center shadow-sm">
                <h6 className="fw-bold">Basic</h6>
                <div className="display-6 fw-bold text-primary">50 Tests</div>
                <p className="small text-secondary mb-2">
                  Perfect for quick practice.
                </p>
                <div className="h5">
                  $9.99 CAD{" "}
                  <small className="text-success">Limited Offer</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="border rounded-4 p-3 h-100 text-center shadow-sm">
                <h6 className="fw-bold">Pro</h6>
                <div className="display-6 fw-bold" style={{ color: "#8c00ff" }}>
                  Unlimited
                </div>
                <p className="small text-secondary mb-2">
                  Full access to all tests.
                </p>
                <div className="h5">$19.99 CAD / mo</div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer border-0 justify-content-center">
          <button
            className="btn cta-btn"
            data-bs-dismiss="modal"
            data-bs-toggle="modal"
            data-bs-target="#boostModal"
          >
            <i className="bi bi-rocket-takeoff"></i> Boost Plan
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const BoostModal = ({
  onLogin,
}: {
  onLogin: (name: string) => void;
}) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.includes("@")) {
      setStep(2);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp === "1234") {
      // Programmatically close modal using DOM API since we are using bootstrap JS
      const modalEl = document.getElementById("boostModal");
      if (!modalEl) return;
      const modal = window.bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();

      onLogin(email.split("@")[0]);
      // Reset for next time
      setTimeout(() => {
        setStep(1);
        setEmail("");
        setOtp("");
      }, 500);
    } else {
      setError(true);
      setOtp("");
    }
  };

  return (
    <div
      className="modal fade"
      id="boostModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 p-3">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              <i className="bi bi-envelope-paper text-primary"></i> Boost Plan
              Sign-In
            </h5>
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="btn brand-btn w-100" type="submit">
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Enter OTP sent to your email
                  </label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      className={`form-control text-center fs-4 ${
                        error ? "is-invalid" : ""
                      }`}
                      placeholder={error ? "Try 1234" : "----"}
                      value={otp}
                      onChange={(e) => {
                        setError(false);
                        setOtp(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-text">
                    Use demo OTP: <b>1234</b>
                  </div>
                </div>
                <button className="btn cta-btn w-100" type="submit">
                  Verify &amp; Sign-In
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

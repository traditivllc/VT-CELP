import { useEffect } from "react";
export default function Modal({
  id = "boostModal",
  onClose,
  title,
  children,
}: {
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  id?: string;
}) {
  useEffect(() => {
    return () => {
      onClose?.();
    };
  }, [id, onClose]);

  return (
    <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 p-3">
          <div className="modal-header border-0">
            {title && (
              <h5 className="modal-title">
                <i className="bi bi-envelope-paper text-primary"></i> {title}
              </h5>
            )}
            <button
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

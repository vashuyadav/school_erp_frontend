import { useEffect, useRef } from "react";

const Notification = ({ message, type = "success", onClose }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (toastRef.current) {
      const toast = new window.bootstrap.Toast(toastRef.current);
      toast.show();
      toastRef.current.addEventListener("hidden.bs.toast", () => {
        onClose && onClose();
      });
    }
  }, [message]);

  return (
    <div
      ref={toastRef}
      className={`toast align-items-center text-bg-${type} border-0 position-fixed top-0 end-0 m-3`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 1055 }}
    >
      <div className="d-flex">
        <div className="toast-body">{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Notification;

import { useEffect, useState } from "react";

const Notification = ({ message, type = "success", onClose }) => {
    const [show, setShow] = useState(false);
    const [animation, setAnimation] = useState("animate__fadeInDown");

    useEffect(() => {
        if (message) {
            setShow(true);
            //   setAnimation("animate__fadeInDown");
            setAnimation("animate__fadeInRight");

            const timer = setTimeout(() => {
                // setAnimation("animate__fadeOutUp");
                setAnimation("animate__fadeOutRight");
                setTimeout(() => {
                    setShow(false);
                    onClose && onClose();
                }, 600);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!show || !message) return null;

    return (
        <div className={`position-fixed top-0 end-0 p-3 animate__animated ${animation}`} style={{ zIndex: 2000 }} >
            <div
                className={`toast show text-bg-${type} border-0 shadow-lg`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                style={{
                    minWidth: "300px",
                    borderRadius: "10px",
                }}
            >
                <div className="d-flex">
                    <div className="toast-body fw-semibold">{message}</div>
                    <button
                        type="button"
                        className="btn-close btn-close-white me-2 m-auto"
                        aria-label="Close"
                        onClick={() => {
                            setAnimation("animate__fadeOutUp");
                            setTimeout(() => {
                                setShow(false);
                                onClose && onClose();
                            }, 600);
                        }}
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Notification;

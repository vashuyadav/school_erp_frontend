import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import api from "../../../src/components/api/api";

const AddSession = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // const [sessionName, setSessionName] = useState("");
    // const [startDate, setStartDate] = useState("");
    // const [endDate, setEndDate] = useState("");
    const [formData, setFormData] = useState({
        session_name: "",
        start_date: "",
        end_date: "",
    });

    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // if use only add mode then use this code
    // useEffect(() => {
    //     flatpickr(".datepicker", {
    //         dateFormat: "Y-m-d",
    //         allowInput: false,
    //     });
    // }, []);

    // if use add and edit mode then use this code
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);
    useEffect(() => {
        if (startInputRef.current) {
            flatpickr(startInputRef.current, {
                dateFormat: "Y-m-d",
                allowInput: true,
                onChange: (selectedDates, dateStr) => {
                    setFormData((prev) => ({ ...prev, start_date: dateStr }));
                },
            });
        }

        if (endInputRef.current) {
            flatpickr(endInputRef.current, {
                dateFormat: "Y-m-d",
                allowInput: true,
                onChange: (selectedDates, dateStr) => {
                    setFormData((prev) => ({ ...prev, end_date: dateStr }));
                },
            });
        }
    }, []);
    // end date picker code

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchSessionData(id);
        } else {
            // reset on add mode
            setFormData({ session_name: "", start_date: "", end_date: "" });
            setIsEditMode(false);
        }
    }, [id]);

    const fetchSessionData = async (sessionId) => {
        try {
            setLoading(true);
            const res = await api.get(`/class-sessions/${sessionId}`);
            const editData = res.data;
            setFormData({
                session_name: editData.session_name || "",
                start_date: editData.start_date || "",
                end_date: editData.end_date || "",
            });
        } catch (error) {
            console.error("Failed to fetch session:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData);
        console.log(e.target.name);
        console.log(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditMode) {
                // EDIT
                await api.put(`/class-sessions/${id}`, formData);
                alert("Session updated successfully!");
            } else {
                // ADD
                await api.post("/class-sessions", formData);
                alert("Session added successfully!");
            }
            navigate("/session");
        } catch (error) {
            console.error("Error saving session:", error);
        } finally {
            setLoading(false);
        }

        // const response = await api.post('/class-sessions', {
        //     session_name: session_name,
        //     start_date: start_date,
        //     end_date: end_date
        // }).then(res => {
        //     console.log(res);
        // });
    };

    return (
        <>
            <main className="app-main">
                <div className="app-content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6">
                                <h4 className="mb-0">{props.header}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="app-content">
                    {/* begin::Container */}
                    <div className="container-fluid">
                        <div className="row g-4">
                            <div className="col-md-12">
                                <div className="card card-primary card-outline mb-4">
                                    <div className="card-header">
                                        <div className="card-title">Add Session</div>
                                    </div>

                                    <form onSubmit={handleSubmit} method="post">
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label htmlFor="session_name" className="form-label">Session Name</label>
                                                <input type="text" name="session_name" id="session_name" value={formData.session_name} onChange={handleChange} className="form-control" />
                                                {/* @error('name')
                                                <p style="color: red;">{{ $message }}</p>
                                                @enderror */}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="start_date" className="form-label">Start Date</label>
                                                <div className="input-group">
                                                    <input type="text" name="start_date" id="start_date" ref={startInputRef} value={formData.start_date} onChange={handleChange} className="form-control datepicker" />
                                                    <span className="input-group-text"><i className="bi bi-calendar-date-fill"></i></span>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="end_date" className="form-label">End Date</label>
                                                <div className="input-group">
                                                    <input type="text" name="end_date" id="end_date" ref={endInputRef} value={formData.end_date} onChange={handleChange} className="form-control datepicker" />
                                                    <span className="input-group-text"><i className="bi bi-calendar-date"></i></span>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="card-footer">
                                            <Link to="/session" className="btn btn-danger"><i className="bi bi-arrow-return-right"></i> Return</Link>&nbsp;
                                            {/* <button type="submit" className="btn btn-primary">Submit</button> */}
                                            {/* <button type="button" onClick={handleSubmit} className="btn btn-primary">Submit</button> */}
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? "Saving..." : isEditMode ? "Update Session" : "Add Session"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end::Container */}
                </div>

            </main>
        </>
    )
}

export default AddSession

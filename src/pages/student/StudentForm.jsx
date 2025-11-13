import { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../components/api/api";
import Notification from "../../components/common/Notification";
import { LoadingBarContext } from "../../App"; // for top loader

const AddClassMappings = (props) => {
    const { startLoading, updateLoading, completeLoading } = useContext(LoadingBarContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        session_id: "",
        class_id: "",
        section_id: "",
        status: true,
    });

    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [notify, setNotify] = useState({ message: "", type: "success" });

    // useRef me stable references store karo
    const loadingRef = useRef({ startLoading, updateLoading, completeLoading });
    useEffect(() => {
        loadingRef.current = { startLoading, updateLoading, completeLoading };
    }, [startLoading, updateLoading, completeLoading]);

    // Fetch all dropdown data when page loads
    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        const { startLoading, updateLoading, completeLoading } = loadingRef.current;
        try {
            startLoading(); // start top loading bar
            const [sessionRes, classRes, sectionRes] = await Promise.all([
                api.get("/class-sessions"),
                api.get("/class", { params: { status: 1 } }),
                api.get("/section"),
            ]);
            updateLoading(70); // mid-progress
            setSessions(sessionRes.data.data || sessionRes.data);
            setClasses(classRes.data.data || classRes.data);
            setSections(sectionRes.data.data || sectionRes.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            setNotify({ message: "Failed to load dropdown data", type: "error" });
        } finally {
            setTimeout(() => {
                completeLoading(); // ensures 100% completion
            }, 300);
        }
    };

    // Load data if editing existing record
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchSectionData(id);
        }
    }, [id]);

    // Fetch existing class data
    const fetchSectionData = async (rowId) => {
        try {
            setLoading(true);
            const res = await api.get(`/class-mapping/${rowId}`);
            const editData = res.data;

            setFormData({
                session_id: editData.session_id || "",
                class_id: editData.class_id || "",
                section_id: editData.section_id || "",
                status: editData.status ?? true,
            });
        } catch (error) {
            console.error("Failed to fetch section:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value, });
    };

    // Submit form (add or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (isEditMode) {
                res = await api.put(`/class-mapping/${id}`, formData);
            } else {
                res = await api.post("/class-mapping", formData);
            }
            // send message with navigate
            navigate("/class-mapping", {
                state: {
                    notify: { message: res.data.message || "Operation successful!", type: "success" }
                },
            });
        } catch (error) {
            console.error("Error saving class mapping:", error);
            setNotify({
                message: error.response?.data?.message || "Something went wrong!",
                type: "danger"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="app-main">
            <div className="app-content mt-3">
                <div className="container-fluid">
                    <div className="row g-4">
                        <div className="col-md-12">
                            <div className="card card-primary card-outline mb-4">
                                <div className="card-header">
                                    <div className="card-title">
                                        {isEditMode ? "Edit Class Mapping" : "Add Class Mapping"}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label htmlFor="session_id" className="form-label">Session Name</label>
                                            <select className="form-select" id="session_id" name="session_id" value={formData.session_id} onChange={handleChange} required>
                                                <option value="">Choose...</option>
                                                {sessions.map((session) => (
                                                    <option key={session.id} value={session.id}>
                                                        {session.session_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="class_id" className="form-label">Class Name</label>
                                            <select className="form-select" id="class_id" name="class_id" value={formData.class_id} onChange={handleChange} required>
                                                <option value="">Choose...</option>
                                                {classes.map((cls) => (
                                                    <option key={cls.id} value={cls.id}>
                                                        {cls.class_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="section_id" className="form-label">Section Name</label>
                                            <select className="form-select" id="section_id" name="section_id" value={formData.section_id} onChange={handleChange} required>
                                                <option value="">Choose...</option>
                                                {sections.map((section) => (
                                                    <option key={section.id} value={section.id}>
                                                        {section.section_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" id="status" name="status" checked={formData.status} onChange={handleChange} />
                                            <label className="form-check-label" htmlFor="status"> Active </label>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link to="/class-mapping" className="btn btn-danger"> <i className="bi bi-arrow-return-right"></i> Return </Link>
                                        &nbsp;
                                        <button type="submit" className="btn btn-primary" disabled={loading} >
                                            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {notify.message && (
                <Notification
                    message={notify.message}
                    type={notify.type}
                    onClose={() => setNotify({ message: "", type: "success" })}
                />
            )}
        </main>
    );
};

export default AddClassMappings

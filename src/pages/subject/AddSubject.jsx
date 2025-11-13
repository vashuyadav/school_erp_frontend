import { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../components/api/api";
import Notification from "../../components/common/Notification";
import { LoadingBarContext } from "../../App"; // for top loader

const AddSubject = (props) => {
    const { startLoading, updateLoading, completeLoading } = useContext(LoadingBarContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject_type_id: "",
        short_name: "",
        subject_name: "",
        status: true,
    });

    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [subjectType, setSubjectType] = useState([]);
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
            const [subjectTypeRes,] = await Promise.all([
                api.get("/subject-type"),
            ]);
            updateLoading(70); // mid-progress
            setSubjectType(subjectTypeRes.data.data || subjectTypeRes.data);
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
            fetchSubjectData(id);
        }
    }, [id]);

    // Fetch existing class data
    const fetchSubjectData = async (rowId) => {
        try {
            setLoading(true);
            const res = await api.get(`/subject/${rowId}`);
            const editData = res.data;

            setFormData({
                subject_type_id: editData.subject_type_id || "",
                short_name: editData.short_name || "",
                subject_name: editData.subject_name || "",
                status: editData.status ?? true,
            });
        } catch (error) {
            console.error("Failed to fetch record:", error);
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
                res = await api.put(`/subject/${id}`, formData);
            } else {
                res = await api.post("/subject", formData);
            }
            // send message with navigate
            navigate("/subject", {
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
                                        {isEditMode ? "Edit Subject Type" : "Add Subject Type"}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label htmlFor="subject_type_id" className="form-label">Subject Type</label>
                                            <select className="form-select" id="subject_type_id" name="subject_type_id" value={formData.subject_type_id} onChange={handleChange} required>
                                                <option value="">Choose...</option>
                                                {subjectType.map((subType) => (
                                                    <option key={subType.id} value={subType.id}>
                                                        {subType.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="short_name" className="form-label">Subject Short Name</label>
                                            <input type="text" className="form-control" id="short_name" name="short_name" value={formData.short_name} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="subject_name" className="form-label">Subject Name</label>
                                            <input type="text" className="form-control" id="subject_name" name="subject_name" value={formData.subject_name} onChange={handleChange} />
                                        </div>
                                        
                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" id="status" name="status" checked={formData.status} onChange={handleChange} />
                                            <label className="form-check-label" htmlFor="status"> Active </label>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link to="/subject-type" className="btn btn-danger"> <i className="bi bi-arrow-return-right"></i> Return </Link>
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

export default AddSubject

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
        name: "",
        status: true,
    });

    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [notify, setNotify] = useState({ message: "", type: "success" });

    // useRef me stable references store karo
    const loadingRef = useRef({ startLoading, updateLoading, completeLoading });
    useEffect(() => {
        loadingRef.current = { startLoading, updateLoading, completeLoading };
    }, [startLoading, updateLoading, completeLoading]);

    // Load data if editing existing record
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchSubjectTypeData(id);
        }
    }, [id]);

    // Fetch existing class data
    const fetchSubjectTypeData = async (rowId) => {
        try {
            setLoading(true);
            const res = await api.get(`/subject-type/${rowId}`);
            const editData = res.data;

            setFormData({
                name: editData.name || "",
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
                res = await api.put(`/subject-type/${id}`, formData);
            } else {
                res = await api.post("/subject-type", formData);
            }
            // send message with navigate
            navigate("/subject-type", {
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
                                            <label htmlFor="name" className="form-label">Subject Type Name</label>
                                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
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

export default AddClassMappings

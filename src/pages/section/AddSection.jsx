import { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../components/api/api";
import Notification from "../../components/common/Notification";

const AddSection = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        section_name: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [notify, setNotify] = useState({ message: "", type: "success" });

    // Load data if editing existing record
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            fetchSectionData(id);
        }
    }, [id]);

    // Fetch existing class data
    const fetchSectionData = async (sectionId) => {
        try {
            setLoading(true);
            const res = await api.get(`/section/${sectionId}`);
            const editData = res.data;

            setFormData({
                section_name: editData.section_name || "",
                is_active: editData.is_active ?? true,
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
                res = await api.put(`/section/${id}`, formData);
            } else {
                res = await api.post("/section", formData);
            }
            // send message with navigate
            navigate("/section", {
                state: {
                    notify: { message: res.data.message || "Operation successful!",type: "success" }
                },
            });
        } catch (error) {
            console.error("Error saving section:", error);
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
            <div className="app-content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h4 className="mb-0">{isEditMode ? "Edit Section" : "Add Section"}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="app-content">
                <div className="container-fluid">
                    <div className="row g-4">
                        <div className="col-md-12">
                            <div className="card card-primary card-outline mb-4">
                                <div className="card-header">
                                    <div className="card-title">
                                        {isEditMode ? "Edit Section" : "Add Section"}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label htmlFor="section_name" className="form-label">Section Name</label>
                                            <input type="text" name="section_name" id="section_name" value={formData.section_name} onChange={handleChange} className="form-control" />
                                        </div>

                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" id="is_active" name="is_active" checked={formData.is_active} onChange={handleChange} />
                                            <label className="form-check-label" htmlFor="is_active"> Active </label>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Link to="/section" className="btn btn-danger"> <i className="bi bi-arrow-return-right"></i> Return </Link>
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

export default AddSection

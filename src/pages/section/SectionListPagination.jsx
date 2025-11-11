import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import api from "../../components/api/api";
import Notification from "../../components/common/Notification";
import { getStatusLabel } from "../../utils/helpers";


const SectionListPagination = (props) => {

    const [sections, setSections] = useState([]);
    const location = useLocation();
    const [notify, setNotify] = useState({ message: "", type: "success" });

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        if (location.state?.notify) {
            setNotify(location.state.notify);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const fetchRecords = async (page = 1) => {
        try {
            const response = await api.get(`/section?page=${page}`);
            setSections(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Error fetching sections:", error);
        }
    };
    useEffect(() => {
        fetchRecords();
    }, []);


    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this record ?")) {
            api.delete(`/section/${id}`)
                .then((res) => {
                    setNotify({
                        message: res?.data?.message || "Something went wrong!",
                        type: "success"
                    });
                    setSections(prev => prev.filter(c => c.id !== id));
                })
                .catch((err) => {
                    console.error("Error deleting class:", err);
                    setNotify({
                        message: err.response?.data?.message || "Something went wrong!",
                        type: "danger"
                    });
                });
        }
    }

    return (
        <>
            <main className="app-main">
                <div className="app-content mt-3">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="card col-md-12 mb-4">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h3 className="card-title">Section List</h3>
                                        </div>
                                        <div className="col-md-6" style={{ textAlign: "right" }}>

                                            <Link to="/section/create" className="btn btn-primary btn-header">
                                                <i className="icon bi bi-plus-circle"></i> Add
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <table className="table table-striped mb-2">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "5%" }}>#</th>
                                                <th>Section Name</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sections.map((section, index) => (
                                                <tr className="align-middle" key={section.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{section.section_name}</td>
                                                    <td>{getStatusLabel(section.is_active)}</td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: "6px" }}>
                                                            <Link to={`/section/edit/${section.id}`} className="btn btn-primary btn-sm"><i className="icon bi bi-pencil-square"></i></Link>
                                                            <Link to="#" className="btn btn-danger btn-sm" onClick={() => { handleDelete(section.id) }}><i className="bi bi-trash"></i></Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* pagination style 1 */}
                                    <nav>
                                        <ul className="pagination justify-content-center mt-3">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => fetchRecords(currentPage - 1)} >
                                                    Previous
                                                </button>
                                            </li>
                                            <li className="page-item">
                                                <span className="page-link">
                                                    Page {currentPage} of {lastPage}
                                                </span>
                                            </li>
                                            <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => fetchRecords(currentPage + 1)} >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                    {/* pagination style 2 */}
                                    <nav>
                                        <ul className="pagination justify-content-center mt-3">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => fetchRecords(currentPage - 1)} >
                                                    Previous
                                                </button>
                                            </li>

                                            {[...Array(lastPage)].map((_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                    <button className="page-link" onClick={() => fetchRecords(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => fetchRecords(currentPage + 1)} >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>

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
        </>
    )
}

export default SectionListPagination

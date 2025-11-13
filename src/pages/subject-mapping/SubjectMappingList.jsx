import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import api from "../../components/api/api";
import Notification from "../../components/common/Notification";
import { getStatusLabel } from "../../utils/helpers";
import { LoadingBarContext } from "../../App"; // for top loader

const SubjectMappingList = (props) => {
    const { startLoading, updateLoading, completeLoading } = useContext(LoadingBarContext); // use loading context
    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [notify, setNotify] = useState({ message: "", type: "success" });

    const location = useLocation();

    useEffect(() => {
        if (location.state?.notify) {
            setNotify(location.state.notify);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // useRef me stable references store karo
    const loadingRef = useRef({ startLoading, updateLoading, completeLoading });
    useEffect(() => {
        loadingRef.current = { startLoading, updateLoading, completeLoading };
    }, [startLoading, updateLoading, completeLoading]);

    const fetchRecords = useCallback(async (page = 1, perPage = 5) => {
        const { startLoading, updateLoading, completeLoading } = loadingRef.current;
        try {
            startLoading(); // start top loading bar
            const response = await api.get(`/subject-mapping?page=${page}&per_page=${perPage}`);
            updateLoading(70); // mid-progress
            setRows(response.data.data);
            setCurrentPage(response.data.current_page);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.error("Error fetching sections:", error);
        } finally {
            setTimeout(() => {
                completeLoading(); // ensures 100% completion
            }, 300);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this record?")) {
            const { startLoading, updateLoading, completeLoading } = loadingRef.current;
            try {
                startLoading();
                const res = await api.delete(`/subject-mapping/${id}`);
                setNotify({
                    message: res?.data?.message || "Record deleted successfully!",
                    type: "success",
                });
                updateLoading(70); // mid-progress
                setRows((prev) => prev.filter((c) => c.id !== id));
            } catch (err) {
                console.error("Error deleting class mapping:", err);
                setNotify({
                    message: err.response?.data?.message || "Something went wrong!",
                    type: "danger",
                });
            } finally {
                setTimeout(() => {
                    completeLoading(); // ensures 100% completion
                }, 300);
            }
        }
    };

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
                                            <h3 className="card-title">Subject Mapping List</h3>
                                        </div>
                                        <div className="col-md-6" style={{ textAlign: "right" }}>

                                            <Link to="/subject-mapping/create" className="btn btn-primary btn-header">
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
                                                <th>Class Name</th>
                                                <th>Section Name</th>
                                                <th>Subject Name</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="text-center text-muted py-3"> No records found </td>
                                                </tr>
                                            ) : (
                                                rows.map((row, index) => (
                                                    <tr className="align-middle" key={row.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{row.class?.class_name}</td>
                                                        <td>{row.section?.section_name}</td>
                                                        <td>{row.subject?.subject_name}</td>
                                                        <td>{getStatusLabel(row.status)}</td>
                                                        <td>
                                                            <div style={{ display: "flex", gap: "6px" }}>
                                                                <Link to={`/subject-mapping/edit/${row.id}`} className="btn btn-primary btn-sm"><i className="icon bi bi-pencil-square"></i></Link>
                                                                <Link to="#" className="btn btn-danger btn-sm" onClick={() => { handleDelete(row.id) }}><i className="bi bi-trash"></i></Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                    {/* pagination start */}
                                    {rows.length !== 0 && (
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
                                    )}
                                    {/* pagination end */}
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

export default SubjectMappingList

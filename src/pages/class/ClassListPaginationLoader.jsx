import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import api from "../../../src/components/api/api";
import Notification from "../../../src/components/common/Notification";
import { getStatusLabel } from "../../utils/helpers";
import useFetchWithLoader from "../../hooks/useFetchWithLoader";

const ClassListPaginationLoader = (props) => {

    const location = useLocation();
    const [notify, setNotify] = useState({ message: "", type: "success" });

    useEffect(() => {
        if (location.state?.notify) {
            setNotify(location.state.notify);
            // optional: history clean karne ke liye
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const { data, error } = useFetchWithLoader("/class");
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        if (data) {
            setClasses(data);
        }
    }, [data]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this class?")) {
            try {
                const res = await api.delete(`/class/${id}`);
                alert(res?.data?.message || "Deleted successfully!");
                setClasses((prev) => prev.filter((c) => c.id !== id)); // local update
            } catch (err) {
                console.error("Error deleting class:", err);
                alert("Something went wrong!");
            }
        }
    };
    if(error){
        
    }

    // Pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // ek page par kitne record dikhane hain
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClasses = classes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(classes.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // End Pagination logic

    return (
        <>
            <main className="app-main">
                {/* <div className="app-content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6">
                                <h4 className="mb-0">{props.header}</h4>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="app-content mt-3">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="card col-md-12 mb-4">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h3 className="card-title">{props.header}</h3>
                                        </div>
                                        <div className="col-md-6" style={{ textAlign: "right" }}>

                                            <Link to="/class/create" className="btn btn-primary btn-header">
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
                                                <th>ClassName</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentClasses.length > 0 ? (
                                                currentClasses.map((cls, index) => (
                                                    <tr key={cls.id}>
                                                        <td>{indexOfFirstItem + index + 1}</td>
                                                        <td>{cls.class_name}</td>
                                                        <td>{getStatusLabel(cls.is_active)}</td>
                                                        <td>
                                                            <div style={{ display: "flex", gap: "6px" }}>
                                                                <Link
                                                                    to={`/class/edit/${cls.id}`}
                                                                    className="btn btn-primary btn-sm"
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(cls.id)}
                                                                    className="btn btn-danger btn-sm"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        No records found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination Controls */}
                                    {classes.length > itemsPerPage && (
                                        <nav>
                                            <ul className="pagination justify-content-center mt-3">
                                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} >
                                                        Previous
                                                    </button>
                                                </li>

                                                {[...Array(totalPages)].map((_, i) => (
                                                    <li
                                                        key={i}
                                                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                                                    >
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(i + 1)}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} >
                                                        Next
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}
                                    {/* End Pagination Controls */}
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

export default ClassListPaginationLoader

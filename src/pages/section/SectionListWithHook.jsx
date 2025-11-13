import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
import api from "../../components/api/api";
import Notification from "../../components/common/Notification";
import { getStatusLabel } from "../../utils/helpers";
// import { LoadingBarContext } from "../../App"; // for top loader
import usePaginatedFetchWithLoader from "../../hooks/usePaginatedFetchWithLoader";

const SectionList = (props) => {
    // const { startLoading, updateLoading, completeLoading } = useContext(LoadingBarContext); // use loading context
    // const [sections, setSections] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [lastPage, setLastPage] = useState(1);
    const [notify, setNotify] = useState({ message: "", type: "success" });

    const location = useLocation();

    const {
        data: sections,
        currentPage,
        lastPage,
        fetchData,
        setData: setSections,
    } = usePaginatedFetchWithLoader("/section", 3);

    useEffect(() => {
        if (location.state?.notify) {
            setNotify(location.state.notify);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // ✅ Delete section
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this record?")) {
            try {
                const res = await api.delete(`/section/${id}`);
                setSections((prev) => prev.filter((s) => s.id !== id));
                setNotify({
                    message: res?.data?.message || "Record deleted successfully!",
                    type: "success",
                });
            } catch (err) {
                console.error("Error deleting section:", err);
                setNotify({
                    message: err.response?.data?.message || "Something went wrong!",
                    type: "danger",
                });
            }
        }
    };

    // const fetchRecords = async (page = 1, perPage = 3) => {
    //     try {
    //         startLoading(); // start top loading bar
    //         const response = await api.get(`/section?page=${page}&per_page=${perPage}`);
    //         updateLoading(70); // mid-progress
    //         setSections(response.data.data);
    //         setCurrentPage(response.data.current_page);
    //         setLastPage(response.data.last_page);
    //     } catch (error) {
    //         console.error("Error fetching sections:", error);
    //     } finally {
    //         setTimeout(() => {
    //             completeLoading(); // ensures 100% completion
    //         }, 300);
    //     }
    // };
    // useEffect(() => {
    //     fetchRecords();
    // }, []);

    // const handleDelete = async (id) => {
    //     if (window.confirm("Are you sure to delete this record?")) {
    //         try {
    //             startLoading();
    //             const res = await api.delete(`/section/${id}`);
    //             setNotify({
    //                 message: res?.data?.message || "Record deleted successfully!",
    //                 type: "success",
    //             });
    //             updateLoading(70); // mid-progress
    //             setSections((prev) => prev.filter((c) => c.id !== id));
    //         } catch (err) {
    //             console.error("Error deleting section:", err);
    //             setNotify({
    //                 message: err.response?.data?.message || "Something went wrong!",
    //                 type: "danger",
    //             });
    //         } finally {
    //             setTimeout(() => {
    //                 completeLoading(); // ensures 100% completion
    //             }, 300);
    //         }
    //     }
    // };


    // const handleDelete = (id) => {
    //     if (window.confirm("Are you sure to delete this record ?")) {
    //         api.delete(`/section/${id}`)
    //             .then((res) => {
    //                 setNotify({
    //                     message: res?.data?.message || "Something went wrong!",
    //                     type: "success"
    //                 });
    //                 setSections(prev => prev.filter(c => c.id !== id));
    //             })
    //             .catch((err) => {
    //                 console.error("Error deleting class:", err);
    //                 setNotify({
    //                     message: err.response?.data?.message || "Something went wrong!",
    //                     type: "danger"
    //                 });
    //             });
    //     }
    // }

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
                                    {/* pagination start */}
                                    <nav>
                                        <ul className="pagination justify-content-center mt-3">
                                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => fetchData(currentPage - 1)} >
                                                    Previous
                                                </button>
                                            </li>

                                            {[...Array(lastPage)].map((_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                                    <button className="page-link" onClick={() => fetchData(i + 1)}>
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`page-item ${currentPage === lastPage ? "disabled" : ""}`}>
                                                <button className="page-link" onClick={() => fetchData(currentPage + 1)} >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
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

export default SectionList

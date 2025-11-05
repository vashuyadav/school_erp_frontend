import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import api from "../../../src/components/api/api";
import Notification from "../../../src/components/common/Notification";
import { getStatusLabel } from "../../utils/helpers";

const ClassList = (props) => {

    const [classes, setClasses] = useState([]);
    const location = useLocation();
    const [notify, setNotify] = useState({ message: "", type: "success" });

    useEffect(() => {
        if (location.state?.notify) {
            setNotify(location.state.notify);
            // optional: history clean karne ke liye
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        api.get("/class")
            .then(res => {
                setClasses(res.data);
            })
            .catch(err => {
                console.error("Error fetching class:", err);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this class?")) {
            api.delete(`/class/${id}`)
                .then((res) => {
                    // alert(res.data.message || "Operation successful!");
                    setNotify({
                        message: res?.data?.message || "Something went wrong!",
                        type: "success"
                    });
                    setClasses(prev => prev.filter(c => c.id !== id));
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
                                            {classes.map((cls, index) => (
                                                <tr className="align-middle" key={cls.id}>
                                                    <td>{index+1}</td>
                                                    <td>{cls.class_name}</td>
                                                    <td>{getStatusLabel(cls.is_active)}</td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: "6px" }}>
                                                            <Link to={`/class/edit/${cls.id}`} className="btn btn-primary btn-sm"><i className="icon bi bi-pencil-square"></i></Link>
                                                            <Link to="#" className="btn btn-danger btn-sm" onClick={() => { handleDelete(cls.id) }}><i className="bi bi-trash"></i></Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {/*  paggination */}
                                    {/* {{ $results->links('pagination::bootstrap-5') }} */}
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

export default ClassList

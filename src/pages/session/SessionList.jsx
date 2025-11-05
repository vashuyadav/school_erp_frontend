import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import moment from "moment";
import api from "../../../src/components/api/api";

const SessionList = (props) => {

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        api.get("/class-sessions")
            .then(res => {
                setSessions(res.data);
            })
            .catch(err => {
                console.error("Error fetching sessions:", err);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this session?")) {
            api.delete(`/class-sessions/${id}`)
                .then((res) => {
                    console.log("Deleted:", res.data);
                    setSessions(prev => prev.filter(s => s.id !== id));
                })
                .catch((err) => {
                    console.error("Error deleting session:", err);
                });
        }
    }

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
                    <div className="container-fluid">
                        <div className="row">
                            <div className="card col-md-12 mb-4">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h3 className="card-title">Session List</h3>
                                        </div>
                                        <div className="col-md-6" style={{ textAlign: "right" }}>

                                            <Link to="/session/create" className="btn btn-primary btn-header">
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
                                                <th>Name</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sessions.map((session) => (
                                                <tr className="align-middle" key={session.id}>
                                                    <td>{session.id}</td>
                                                    <td>{session.session_name}</td>
                                                    <td>{moment(session.start_date).format("DD-MM-YYYY")}</td>
                                                    <td>{moment(session.end_date).format("DD-MM-YYYY")}</td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: "6px" }}>
                                                            {/* <Link to="/session/edit/${session.id}" className="btn btn-primary btn-sm"><i className="icon bi bi-pencil-square"></i></Link> */}
                                                            <Link to={`/session/edit/${session.id}`} className="btn btn-primary btn-sm"><i className="icon bi bi-pencil-square"></i></Link>
                                                            <Link to="#" className="btn btn-danger btn-sm" onClick={() => { handleDelete(session.id) }}><i className="bi bi-trash"></i></Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* <tr className="align-middle">
                                                <td>1</td>
                                                <td>2024-25</td>
                                                <td>01-07-2024</td>
                                                <td>30-06-2025</td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <Link to="/session/create" className="btn btn-primary btn-sm"><i className="icon bi bi-pencil-square"></i></Link>
                                                        <Link to="#" className="btn btn-danger btn-sm" onClick={() => { onDelete() }}><i className="bi bi-trash"></i></Link>

                                                        <form action="/session" method="POST" style={{ display: "inline" }}>
                                                        <button type="submit" className="btn btn-danger btn-sm" onClick={()=>{onDelete()}}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </form>
                                                    </div>
                                                </td>
                                            </tr> */}
                                        </tbody>
                                    </table>
                                    {/*  paggination */}
                                    {/* {{ $results->links('pagination::bootstrap-5') }} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default SessionList

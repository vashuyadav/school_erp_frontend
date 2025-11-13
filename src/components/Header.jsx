import React, { useEffect } from 'react'
import api from "../components/api/api";

const Header = () => {
    const body = document.body;
    useEffect(() => {
        body.classList.add("layout-fixed", "sidebar-expand-lg", "bg-body-tertiary");
        body.classList.remove("login-page", "bg-body-secondary");
    }, []);

    const handleLogout = async () => {
        try {
            // Get token from localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }
            // Attach token in Authorization header
            await api.post("/api/logout", {}, {
                headers: { Authorization: `Bearer ${token}`, },
            });
            // Clear token from localStorage
            localStorage.removeItem("token");
            // Redirect to login
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    };

    return (
        <>
            <nav className="app-header navbar navbar-expand bg-body">
                {/* begin::Container */}
                <div className="container-fluid">
                    {/* begin::Start Navbar Links */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                                <i className="bi bi-list"></i>
                            </a>
                        </li>
                        <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Home</a></li>
                        <li className="nav-item d-none d-md-block"><a href="#" className="nav-link">Contact</a></li>
                    </ul>
                    {/* end::Start Navbar Links */}
                    {/* begin::End Navbar Links */}
                    <ul className="navbar-nav ms-auto">
                        {/* begin::Navbar Search */}
                        <li className="nav-item">
                            <a className="nav-link" data-widget="navbar-search" href="#" role="button">
                                <i className="bi bi-search"></i>
                            </a>
                        </li>
                        {/* end::Navbar Search */}
                        {/* begin::Messages Dropdown Menu */}
                        <li className="nav-item dropdown">
                            <a className="nav-link" data-bs-toggle="dropdown" href="#">
                                <i className="bi bi-chat-text"></i>
                                <span className="navbar-badge badge text-bg-danger">3</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                <a href="#" className="dropdown-item">
                                    {/* begin::Message */}
                                    <div className="d-flex">
                                        <div className="flex-shrink-0">
                                            <img
                                                src="assets/img/user1-128x128.jpg"
                                                alt="User Avatar"
                                                className="img-size-50 rounded-circle me-3"
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h3 className="dropdown-item-title">
                                                Brad Diesel
                                                <span className="float-end fs-7 text-danger"
                                                ><i className="bi bi-star-fill"></i
                                                ></span>
                                            </h3>
                                            <p className="fs-7">Call me whenever you can...</p>
                                            <p className="fs-7 text-secondary">
                                                <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                                            </p>
                                        </div>
                                    </div>
                                    {/* end::Message */}
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item">
                                    {/* begin::Message */}
                                    <div className="d-flex">
                                        <div className="flex-shrink-0">
                                            <img
                                                src="assets/img/user3-128x128.jpg"
                                                alt="User Avatar"
                                                className="img-size-50 rounded-circle me-3"
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h3 className="dropdown-item-title">
                                                Nora Silvester
                                                <span className="float-end fs-7 text-warning">
                                                    <i className="bi bi-star-fill"></i>
                                                </span>
                                            </h3>
                                            <p className="fs-7">The subject goes here</p>
                                            <p className="fs-7 text-secondary">
                                                <i className="bi bi-clock-fill me-1"></i> 4 Hours Ago
                                            </p>
                                        </div>
                                    </div>
                                    {/* end::Message */}
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item dropdown-footer">See All Messages</a>
                            </div>
                        </li>
                        {/* end::Messages Dropdown Menu */}
                        {/* begin::Notifications Dropdown Menu */}
                        <li className="nav-item dropdown">
                            <a className="nav-link" data-bs-toggle="dropdown" href="#">
                                <i className="bi bi-bell-fill"></i>
                                <span className="navbar-badge badge text-bg-warning">15</span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                <span className="dropdown-item dropdown-header">15 Notifications</span>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item">
                                    <i className="bi bi-envelope me-2"></i> 4 new messages
                                    <span className="float-end text-secondary fs-7">3 mins</span>
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item">
                                    <i className="bi bi-people-fill me-2"></i> 8 friend requests
                                    <span className="float-end text-secondary fs-7">12 hours</span>
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item">
                                    <i className="bi bi-file-earmark-fill me-2"></i> 3 new reports
                                    <span className="float-end text-secondary fs-7">2 days</span>
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item dropdown-footer"> See All Notifications </a>
                            </div>
                        </li>
                        {/* end::Notifications Dropdown Menu */}

                        {/* begin::User Menu Dropdown */}
                        <li className="nav-item dropdown user-menu">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                <img src="assets/img/avatar5.png" className="user-image rounded-circle shadow" alt="User Image" />
                                <span className="d-none d-md-inline">Admin</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-lg dropdown-menu-end">
                                {/* begin::User Image */}
                                <li className="user-header text-bg-primary">
                                    <img src="assets/img/avatar5.png" className="rounded-circle shadow" alt="User Image" />
                                    <p>
                                        Admin - Web Developer
                                        <small>Member since Nov. 2023</small>
                                    </p>
                                </li>
                                {/* end::User Image */}
                                {/* begin::Menu Body */}
                                <li className="user-body">
                                    <div className="row">
                                        <div className="col-4 text-center"><a href="#">Followers</a></div>
                                        <div className="col-4 text-center"><a href="#">Sales</a></div>
                                        <div className="col-4 text-center"><a href="#">Friends</a></div>
                                    </div>
                                </li>
                                {/* end::Menu Body */}
                                {/* begin::Menu Footer */}
                                <li className="user-footer">
                                    <a href="#" className="btn btn-default btn-flat">Profile</a>
                                    <a href="#" className="btn btn-default btn-flat float-end" onClick={handleLogout}>Sign out</a>
                                </li>
                                {/* end::Menu Footer */}
                            </ul>
                        </li>
                        {/* end::User Menu Dropdown */}
                    </ul>
                    {/* end::End Navbar Links */}
                </div>
                {/* end::Container */}
            </nav>
        </>
    )
}

export default Header

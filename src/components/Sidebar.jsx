import React, { useEffect } from "react";
import { Link } from 'react-router-dom';

const Sidebar = () => {
    useEffect(() => {
        const SELECTOR_SIDEBAR_WRAPPER = ".sidebar-wrapper";
        const Default = {
            scrollbarTheme: "os-theme-light",
            scrollbarAutoHide: "leave",
            scrollbarClickScroll: true,
        };

        const sidebarWrapper = document.querySelector(SELECTOR_SIDEBAR_WRAPPER);
        if (
            sidebarWrapper &&
            typeof window.OverlayScrollbarsGlobal?.OverlayScrollbars !== "undefined"
        ) {
            window.OverlayScrollbarsGlobal.OverlayScrollbars(sidebarWrapper, {
                scrollbars: {
                    theme: Default.scrollbarTheme,
                    autoHide: Default.scrollbarAutoHide,
                    clickScroll: Default.scrollbarClickScroll,
                },
            });
        }
        // find all nav-links that can open submenu
        const navLinks = document.querySelectorAll(".nav-item > .nav-link");

        const handleClick = (e) => {
            const parent = e.currentTarget.closest(".nav-item");
            const subMenu = parent.querySelector(".nav-treeview");

            if (subMenu) {
                e.preventDefault();

                const isOpen = parent.classList.contains("menu-open");

                // close all other open menus
                document.querySelectorAll(".nav-item.menu-open").forEach((item) => {
                    if (item !== parent) {
                        item.classList.remove("menu-open");
                        const openSub = item.querySelector(".nav-treeview");
                        if (openSub) openSub.style.display = "none";
                    }
                });

                // toggle current one
                if (!isOpen) {
                    parent.classList.add("menu-open");
                    subMenu.style.display = "block";
                } else {
                    parent.classList.remove("menu-open");
                    subMenu.style.display = "none";
                }
            }
        };

        navLinks.forEach((link) => {
            link.addEventListener("click", handleClick);
        });

        return () => {
            navLinks.forEach((link) => {
                link.removeEventListener("click", handleClick);
            });
        };
    }, []);

    return (
        <>
            <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
                <div className="sidebar-brand">
                    <Link to="./index.html" className="brand-link">
                        <img src="assets/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image opacity-75 shadow" />
                        <span className="brand-text fw-light">SchoolERP</span>
                    </Link>
                </div>
                <div className="sidebar-wrapper">
                    <nav className="mt-2">
                        {/* begin::Sidebar Menu */}
                        <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="false">

                            <li className="nav-item">
                                <Link to="/" className="nav-link active">
                                    <i className="nav-icon bi bi-speedometer"></i><p>Dashboard</p>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to="#" className="nav-link">
                                    <i className="nav-icon bi bi-gear-wide-connected"></i>
                                    <p>Configuration<i className="nav-arrow bi bi-chevron-right"></i></p>
                                </Link>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link to="/session" className="nav-link">
                                            <i className="nav-icon bi bi-calendar-date"></i><p>Session</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/class" className="nav-link">
                                            <i className="nav-icon bi bi-mortarboard"></i><p>Class</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/section" className="nav-link">
                                            <i className="nav-icon bi bi-layers"></i><p>Section</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/class-mapping" className="nav-link">
                                            <i className="nav-icon bi bi-link-45deg"></i><p>Class Mapping</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/subject-type" className="nav-link">
                                            <i className="nav-icon bi bi-circle"></i><p>Subject Type</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/subject" className="nav-link">
                                            <i className="nav-icon bi bi-circle"></i><p>Subject</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/subject-mapping" className="nav-link">
                                            <i className="nav-icon bi bi-link-45deg"></i><p>Subject Mapping</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/state" className="nav-link">
                                            <i className="nav-icon bi bi-circle"></i><p>State</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/city" className="nav-link ">
                                            <i className="nav-icon bi bi-circle"></i><p>City</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/religion" className="nav-link ">
                                            <i className="nav-icon bi bi-circle"></i><p>Religion</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/category" className="nav-link ">
                                            <i className="nav-icon bi bi-circle"></i><p>Category</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <Link to="#" className="nav-link ">
                                    <i className="nav-icon bi bi-people"></i>
                                    <p>Student<i className="nav-arrow bi bi-chevron-right"></i></p>
                                </Link>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link to="/student" className="nav-link">
                                            <i className="nav-icon bi bi-person-vcard"></i><p>Student Detail</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/student/create" className="nav-link">
                                            <i className="nav-icon bi bi-person-add"></i><p>Student Registration</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/student/id-card" className="nav-link ">
                                            <i className="nav-icon bi bi-person-bounding-box"></i><p>Identity Card</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="nav-item ">
                                <Link to="#" className="nav-link">
                                    <i className="nav-icon bi bi-book-half"></i>
                                    <p>Attendance<i className="nav-arrow bi bi-chevron-right"></i></p>
                                </Link>
                                <ul className="nav nav-treeview">
                                    <li className="nav-item">
                                        <Link to="/class-session" className="nav-link">
                                            <i className="nav-icon bi bi-person-vcard"></i><p>Student Attendace</p>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/class-session" className="nav-link">
                                            <i className="nav-icon bi bi-person-add"></i><p>Attendace Report</p>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                        </ul>
                        {/* end::Sidebar Menu */}
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Sidebar

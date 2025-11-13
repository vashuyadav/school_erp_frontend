import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Already logged in user ko dashboard pe redirect karo
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/"); // Dashboard route
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.get("/sanctum/csrf-cookie");

            const res = await axios.post("/api/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);

            navigate("/"); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            setError("Invalid email or password");
        } finally {
            setLoading(false); // 🔚 Stop loader
        }
    };

    return (

        <div className="my-4">
            <div className="login-box">
                <div className="login-logo">
                    <a href="/login"><b>School</b>ERP</a>
                </div>

                <div className="card">
                    <div className="card-body login-card-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                        {error && <p className="login-box-msg" style={{ color: 'red' }}>{error}</p>}
                        <form onSubmit={handleLogin}>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <div className="input-group-text"><span className="bi bi-envelope"></span></div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <div className="input-group-text"><span className="bi bi-lock-fill"></span></div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                        <label className="form-check-label" htmlFor="flexCheckDefault"> Remember Me </label>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Signing in...
                                                </>
                                            ) : (
                                                "Sign In"
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </form>
                        <div className="social-auth-links text-center mb-3 d-grid gap-2">
                            <p>- OR -</p>
                            <a href="/login" className="btn btn-primary">
                                <i className="bi bi-facebook me-2"></i> Sign in using Facebook
                            </a>
                            <a href="/login" className="btn btn-danger">
                                <i className="bi bi-google me-2"></i> Sign in using Google+
                            </a>
                        </div>

                        <p className="mb-1"><a href="/login">I forgot my password</a></p>
                        <p className="mb-0">
                            <a href="/login" className="text-center"> Register a new membership </a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

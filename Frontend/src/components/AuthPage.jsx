import React, { useState, useEffect } from "react";
import "../styles/AuthAndProfile.css";
import { apiService } from "../services/api";
import {
    User,
    Mail,
    Lock,
    Phone,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Loader2
} from "lucide-react";

export default function AuthPage({ onLoginSuccess, onBackToStore }) {
    const [authMode, setAuthMode] = useState("signin");
    const [signUpStep, setSignUpStep] = useState(1);

    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");

    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");

    // Lockout & Loading States
    const [lockoutTimer, setLockoutTimer] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");

    useEffect(() => {
        let interval = null;
        if (lockoutTimer > 0) {
            interval = setInterval(() => {
                setLockoutTimer((prev) => prev - 1);
            }, 1000);
        } else if (lockoutTimer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [lockoutTimer]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // ==========================================
    // DIRECT LOGIN HANDLER
    // ==========================================
    const handleSignIn = async (e) => {
        e.preventDefault();
        if (lockoutTimer > 0 || isSubmitting) return;

        if (!signInEmail || !signInPassword) {
            alert("Please provide both email and password.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiService.login(signInEmail, signInPassword);

            if (response.ok) {
                onLoginSuccess(response.data.user, response.data.token);
            } else {
                if (response.status === 429 || response.status === 403) {
                    setLockoutTimer(900); // 15 mins
                }
                alert(response.data.message || "Login failed");
            }
        } catch (error) {
            alert("An error occurred during login. Please check server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==========================================
    // REGISTRATION HANDLERS (With OTP)
    // ==========================================
    const handleSignUpInitiate = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!regName || !regEmail || !regPhone || !regPassword) {
            alert("Please fill in all registration fields.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiService.sendRegisterOtp(regEmail);
            if (response.ok) {
                setGeneratedOtp(response.data.otp);
                setSignUpStep(2);
            } else {
                alert(response.data.message || "Failed to send OTP");
            }
        } catch (error) {
            alert("An error occurred. Please check server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyRegisterOtpAndCreate = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (otp !== generatedOtp.toString()) {
            alert("Invalid OTP Code. Please check your email.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiService.register({
                name: regName,
                email: regEmail,
                phone: regPhone,
                password: regPassword
            });
            if (response.ok) {
                alert("Account created successfully! Please log in.");
                setOtp("");
                setAuthMode("signin");
                setSignUpStep(1);
            } else {
                alert(response.data.message || "Registration failed");
            }
        } catch (error) {
            alert("An error occurred during registration.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const showTabs = authMode === "signin" || (authMode === "signup" && signUpStep === 1);

    return (
        <div className="auth-page-canvas">
            <div className="auth-card-container">
                <button
                    type="button"
                    className="btn-back-catalog"
                    onClick={onBackToStore}
                    disabled={isSubmitting}
                    style={{ marginBottom: 18 }}
                >
                    <ArrowLeft size={15} /> Back to Store
                </button>

                <div className="auth-header-block">
                    <h2>Kisan & Parivaar SuperMall</h2>
                    <p>
                        {authMode === "signin"
                            ? "Sign in to access your saved addresses & orders"
                            : signUpStep === 1
                            ? "Create an account for quick checkout & order tracking"
                            : "Verify Email Address"}
                    </p>
                </div>

                {showTabs && (
                    <div className="auth-tabs-nav">
                        <button
                            type="button"
                            className={`auth-tab-btn ${authMode === "signin" ? "active" : ""}`}
                            disabled={isSubmitting}
                            onClick={() => {
                                setAuthMode("signin");
                                setOtp("");
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`auth-tab-btn ${authMode === "signup" ? "active" : ""}`}
                            disabled={isSubmitting}
                            onClick={() => {
                                setAuthMode("signup");
                                setSignUpStep(1);
                                setOtp("");
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {/* ========================================== */}
                {/* DIRECT SIGN IN FLOW */}
                {/* ========================================== */}
                {authMode === "signin" ? (
                    <form onSubmit={handleSignIn} className="auth-form-cluster">
                        <div className="input-field-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={16} className="field-icon" />
                                <input
                                    type="email"
                                    placeholder="name@gmail.com"
                                    value={signInEmail}
                                    onChange={(e) => setSignInEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-field-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={16} className="field-icon" />
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={signInPassword}
                                    onChange={(e) => setSignInPassword(e.target.value)}
                                    autoComplete="current-password"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-auth-submit"
                            disabled={lockoutTimer > 0 || isSubmitting}
                        >
                            {lockoutTimer > 0 ? (
                                <>
                                    <Clock size={16} /> Try again in {formatTime(lockoutTimer)}
                                </>
                            ) : isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="spin-icon" /> Logging in...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        <div className="auth-toggle-note">
                            Don't have an account yet?{" "}
                            <span onClick={() => !isSubmitting && setAuthMode("signup")}>
                                Register here
                            </span>
                        </div>
                    </form>
                ) : signUpStep === 1 ? (
                    /* ========================================== */
                    /* SIGN UP STEP 1: SEND OTP */
                    /* ========================================== */
                    <form onSubmit={handleSignUpInitiate} className="auth-form-cluster">
                        <div className="input-field-group">
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <User size={16} className="field-icon" />
                                <input
                                    type="text"
                                    placeholder="e.g. Golu Kumar"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    autoComplete="name"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-field-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={16} className="field-icon" />
                                <input
                                    type="email"
                                    placeholder="golu@gmail.com"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-field-group">
                            <label>Mobile Number</label>
                            <div className="input-wrapper">
                                <Phone size={16} className="field-icon" />
                                <input
                                    type="tel"
                                    placeholder="10-digit number"
                                    value={regPhone}
                                    onChange={(e) => setRegPhone(e.target.value)}
                                    autoComplete="tel"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>
                        <div className="input-field-group">
                            <label>Create Password</label>
                            <div className="input-wrapper">
                                <Lock size={16} className="field-icon" />
                                <input
                                    type="password"
                                    placeholder="At least 6 characters"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="spin-icon" /> Sending OTP...
                                </>
                            ) : (
                                <>
                                    Send OTP <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        <div className="auth-toggle-note">
                            Already have an account?{" "}
                            <span onClick={() => !isSubmitting && setAuthMode("signin")}>
                                Sign in here
                            </span>
                        </div>
                    </form>
                ) : (
                    /* ========================================== */
                    /* SIGN UP STEP 2: VERIFY OTP */
                    /* ========================================== */
                    <form onSubmit={handleVerifyRegisterOtpAndCreate} className="auth-form-cluster">
                        <div
                            className="otp-verification-box"
                            style={{
                                background: "#f8fafc",
                                padding: 20,
                                borderRadius: 12,
                                border: "1px solid #e2e8f0",
                                textAlign: "center",
                                marginBottom: 10
                            }}
                        >
                            <Mail size={32} color="#0f172a" style={{ margin: "0 auto 10px" }} />
                            <h4 style={{ margin: "0 0 6px", color: "#0f172a", fontSize: 16 }}>
                                Verify Your Email
                            </h4>
                            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                                We sent a 6-digit registration code to <strong>{regEmail}</strong>
                            </p>
                        </div>

                        <div className="input-field-group">
                            <div className="input-wrapper">
                                <ShieldCheck size={16} className="field-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter 6-Digit Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    autoComplete="one-time-code"
                                    disabled={isSubmitting}
                                    style={{
                                        letterSpacing: "4px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        paddingLeft: 14
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-auth-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="spin-icon" /> Creating Account...
                                </>
                            ) : (
                                <>
                                    Verify & Create Account <CheckCircle2 size={16} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
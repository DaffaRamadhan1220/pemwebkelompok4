import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem(
          "gudangku_admin",
          JSON.stringify({
            username: "admin",
            nama: "Admin Gudang",
            role: "Administrator",
            loginAt: new Date().toISOString(),
          })
        );

        navigate("/");
      } else {
        setError("Username atau password salah.");
      }

      setLoading(false);
    }, 700);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-decoration decoration-one"></div>
        <div className="login-decoration decoration-two"></div>
      </div>

      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
            <div className="login-card">

              {/* Logo */}
              <div className="text-center mb-4">
                <div className="login-logo">
                  <i className="bi bi-box-seam-fill"></i>
                </div>

                <h2 className="login-title">
                  Gudang<span>Ku</span>
                </h2>

                <p className="login-subtitle">
                  Inventory Management System
                </p>
              </div>

              {/* Welcome */}
              <div className="mb-4">
                <h4 className="fw-bold mb-1">
                  Selamat Datang 👋
                </h4>

                <p className="text-muted mb-0">
                  Silakan masuk sebagai Administrator
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="alert alert-danger login-alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin}>

                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Username
                  </label>

                  <div className="input-group login-input">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Password
                  </label>

                  <div className="input-group login-input">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="btn password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={
                          showPassword
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                    />

                    <label
                      className="form-check-label small text-muted"
                      htmlFor="remember"
                    >
                      Ingat saya
                    </label>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-login w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk ke Dashboard
                      <i className="bi bi-arrow-right ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Account */}
              <div className="demo-account mt-4">
                <div className="small fw-semibold mb-1">
                  <i className="bi bi-info-circle me-1"></i>
                  Akun Demo Admin
                </div>

                <div className="small text-muted">
                  Username: <strong>admin</strong>
                  <br />
                  Password: <strong>admin123</strong>
                </div>
              </div>

              <div className="text-center mt-4">
                <small className="text-muted">
                  © 2026 GudangKu • Inventory System
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
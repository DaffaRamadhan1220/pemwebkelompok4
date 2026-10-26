import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  NavLink,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

/* =========================================================
   CONSTANT
========================================================= */

const ITEMS_KEY = "gudangku_items";
const TRANSACTIONS_KEY = "gudangku_transactions";
const SUPPLIERS_KEY = "gudangku_suppliers";
const CATEGORIES_KEY = "gudangku_categories";
const ADMIN_KEY = "gudangku_admin";

/* =========================================================
   INITIAL DATA
========================================================= */

const initialItems = [
  {
    id: "BRG-001",
    kode: "BRG-001",
    nama: "Laptop ASUS Vivobook",
    kategori: "Elektronik",
    stok: 25,
    minStok: 10,
    satuan: "Unit",
    lokasi: "Rak A-01",
    supplier: "PT ASUS Indonesia",
  },
  {
    id: "BRG-002",
    kode: "BRG-002",
    nama: "Keyboard Mechanical",
    kategori: "Elektronik",
    stok: 8,
    minStok: 10,
    satuan: "Unit",
    lokasi: "Rak A-02",
    supplier: "PT Sumber Komputer",
  },
  {
    id: "BRG-003",
    kode: "BRG-003",
    nama: "Mouse Wireless",
    kategori: "Elektronik",
    stok: 42,
    minStok: 15,
    satuan: "Unit",
    lokasi: "Rak A-03",
    supplier: "PT Sumber Komputer",
  },
  {
    id: "BRG-004",
    kode: "BRG-004",
    nama: "Kertas A4",
    kategori: "ATK",
    stok: 5,
    minStok: 10,
    satuan: "Rim",
    lokasi: "Rak B-01",
    supplier: "CV ATK Jaya",
  },
  {
    id: "BRG-005",
    kode: "BRG-005",
    nama: "Tinta Printer",
    kategori: "ATK",
    stok: 0,
    minStok: 5,
    satuan: "Botol",
    lokasi: "Rak B-02",
    supplier: "CV ATK Jaya",
  },
];

const initialSuppliers = [
  {
    id: "SUP-001",
    nama: "PT ASUS Indonesia",
    kontak: "021-555-1234",
    email: "sales@asus.co.id",
    alamat: "Jakarta",
  },
  {
    id: "SUP-002",
    nama: "PT Sumber Komputer",
    kontak: "021-555-2233",
    email: "info@sumberkomputer.com",
    alamat: "Surabaya",
  },
  {
    id: "SUP-003",
    nama: "CV ATK Jaya",
    kontak: "031-777-8899",
    email: "atkjaya@gmail.com",
    alamat: "Sidoarjo",
  },
];

const initialCategories = [
  "Elektronik",
  "ATK",
  "Peralatan Gudang",
  "Furniture",
];

/* =========================================================
   HELPER
========================================================= */

function getData(key, fallback) {
  const saved = localStorage.getItem(key);

  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getStatus(stok, minStok) {
  if (stok <= 0) {
    return {
      text: "Habis",
      className: "status-habis",
    };
  }

  if (stok <= minStok) {
    return {
      text: "Menipis",
      className: "status-menipis",
    };
  }

  return {
    text: "Aman",
    className: "status-aman",
  };
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function generateId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children }) {
  const admin = localStorage.getItem(ADMIN_KEY);

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(ADMIN_KEY)) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        const admin = {
          username: "admin",
          nama: "Admin Gudang",
          role: "Administrator",
          loginAt: new Date().toISOString(),
        };

        localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));

        navigate("/", { replace: true });
      } else {
        setError("Username atau password salah.");
      }

      setLoading(false);
    }, 600);
  };

  return (
    <div className="login-page">
      <div className="login-decoration decoration-one"></div>
      <div className="login-decoration decoration-two"></div>

      <div className="container">
        <div className="row min-vh-100 justify-content-center align-items-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
            <div className="login-card">
              <div className="text-center mb-4">
                <div className="login-logo">
                  <i className="bi bi-box-seam-fill"></i>
                </div>

                <h1 className="login-title">
                  Gudang<span>Ku</span>
                </h1>

                <p className="login-subtitle">
                  Inventory Management System
                </p>
              </div>

              <div className="mb-4">
                <h4 className="fw-bold mb-1">Selamat Datang 👋</h4>
                <p className="text-muted mb-0">
                  Masuk sebagai Administrator Gudang
                </p>
              </div>

              {error && (
                <div className="alert alert-danger rounded-3 small">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
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
                    />
                  </div>
                </div>

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

                <div className="d-flex justify-content-between mb-4">
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

                <button
                  className="btn btn-login w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
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

              <div className="demo-account mt-4">
                <div className="fw-semibold small">
                  <i className="bi bi-info-circle me-1"></i>
                  Akun Demo
                </div>

                <small className="text-muted">
                  Username: <strong>admin</strong>
                  <br />
                  Password: <strong>admin123</strong>
                </small>
              </div>

              <div className="text-center mt-4">
                <small className="text-muted">
                  © 2026 GudangKu
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN LAYOUT
========================================================= */

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState(() =>
    getData(ITEMS_KEY, initialItems)
  );

  const [transactions, setTransactions] = useState(() =>
    getData(TRANSACTIONS_KEY, [])
  );

  const [suppliers, setSuppliers] = useState(() =>
    getData(SUPPLIERS_KEY, initialSuppliers)
  );

  const [categories, setCategories] = useState(() =>
    getData(CATEGORIES_KEY, initialCategories)
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const admin = JSON.parse(
    localStorage.getItem(ADMIN_KEY) || "{}"
  );

  useEffect(() => {
    saveData(ITEMS_KEY, items);
  }, [items]);

  useEffect(() => {
    saveData(TRANSACTIONS_KEY, transactions);
  }, [transactions]);

  useEffect(() => {
    saveData(SUPPLIERS_KEY, suppliers);
  }, [suppliers]);

  useEffect(() => {
    saveData(CATEGORIES_KEY, categories);
  }, [categories]);

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate("/login");
  };

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const updateItem = (updated) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updated.id ? updated : item
      )
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const updateStock = (itemId, amount) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        return {
          ...item,
          stok: Math.max(0, item.stok + amount),
        };
      })
    );
  };

  const addSupplier = (supplier) => {
    setSuppliers((prev) => [...prev, supplier]);
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  const deleteCategory = (category) => {
    setCategories((prev) =>
      prev.filter((item) => item !== category)
    );
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="app-shell">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
        logout={logout}
      />

      {/* Main */}
      <div className="main-content">

        <Topbar
          title={pageTitle}
          admin={admin}
          onMenu={() => setSidebarOpen(true)}
          logout={logout}
          items={items}
        />

        <main className="content-area">
          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  items={items}
                  transactions={transactions}
                />
              }
            />

            <Route
              path="/barang"
              element={
                <Barang
                  items={items}
                  categories={categories}
                  onDelete={deleteItem}
                />
              }
            />

            <Route
              path="/barang/tambah"
              element={
                <FormBarang
                  items={items}
                  categories={categories}
                  suppliers={suppliers}
                  onSave={addItem}
                  onUpdate={updateItem}
                />
              }
            />

            <Route
              path="/barang/edit/:id"
              element={
                <FormBarang
                  items={items}
                  categories={categories}
                  suppliers={suppliers}
                  onSave={addItem}
                  onUpdate={updateItem}
                />
              }
            />

            <Route
              path="/barang-masuk"
              element={
                <BarangMasuk
                  items={items}
                  onTransaction={addTransaction}
                  onUpdateStock={updateStock}
                />
              }
            />

            <Route
              path="/barang-keluar"
              element={
                <BarangKeluar
                  items={items}
                  onTransaction={addTransaction}
                  onUpdateStock={updateStock}
                />
              }
            />

            <Route
              path="/riwayat"
              element={
                <Riwayat
                  transactions={transactions}
                  items={items}
                />
              }
            />

            <Route
              path="/supplier"
              element={
                <Supplier
                  suppliers={suppliers}
                  onAdd={addSupplier}
                  onDelete={deleteSupplier}
                />
              }
            />

            <Route
              path="/kategori"
              element={
                <Kategori
                  categories={categories}
                  onAdd={addCategory}
                  onDelete={deleteCategory}
                />
              }
            />

            <Route
              path="/laporan"
              element={
                <Laporan
                  items={items}
                  transactions={transactions}
                />
              }
            />

            <Route
              path="/pengaturan"
              element={<Pengaturan logout={logout} />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({ open, close, logout }) {
  return (
    <>
      {open && (
        <div
          className="sidebar-overlay"
          onClick={close}
        ></div>
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>

        <div className="brand-area">
          <div className="brand-icon">
            <i className="bi bi-box-seam-fill"></i>
          </div>

          <div>
            <div className="brand-name">
              Gudang<span>Ku</span>
            </div>

            <small>Inventory System</small>
          </div>
        </div>

        <div className="menu-label">
          MENU UTAMA
        </div>

        <nav className="sidebar-nav">

          <SidebarLink
            to="/"
            icon="bi-grid-1x2-fill"
            text="Dashboard"
            close={close}
          />

          <div className="menu-label mt-3">
            INVENTORY
          </div>

          <SidebarLink
            to="/barang"
            icon="bi-box-seam"
            text="Data Barang"
            close={close}
          />

          <SidebarLink
            to="/kategori"
            icon="bi-tags"
            text="Kategori"
            close={close}
          />

          <div className="menu-label mt-3">
            TRANSAKSI
          </div>

          <SidebarLink
            to="/barang-masuk"
            icon="bi-box-arrow-in-down"
            text="Barang Masuk"
            close={close}
          />

          <SidebarLink
            to="/barang-keluar"
            icon="bi-box-arrow-up"
            text="Barang Keluar"
            close={close}
          />

          <SidebarLink
            to="/riwayat"
            icon="bi-clock-history"
            text="Riwayat Transaksi"
            close={close}
          />

          <div className="menu-label mt-3">
            MASTER DATA
          </div>

          <SidebarLink
            to="/supplier"
            icon="bi-building"
            text="Supplier"
            close={close}
          />

          <div className="menu-label mt-3">
            LAPORAN & SISTEM
          </div>

          <SidebarLink
            to="/laporan"
            icon="bi-bar-chart"
            text="Laporan"
            close={close}
          />

          <SidebarLink
            to="/pengaturan"
            icon="bi-gear"
            text="Pengaturan"
            close={close}
          />

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-mini">
            <div className="admin-avatar">
              DR
            </div>

            <div>
              <strong>Admin Gudang</strong>
              <small>Administrator</small>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
          >
            <i className="bi bi-box-arrow-left"></i>
            Logout
          </button>

        </div>

      </aside>
    </>
  );
}

function SidebarLink({ to, icon, text, close }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={close}
      className={({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`
      }
    >
      <i className={`bi ${icon}`}></i>
      <span>{text}</span>
    </NavLink>
  );
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({
  title,
  admin,
  onMenu,
  logout,
  items,
}) {
  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const lowStock = items.filter(
    (item) => item.stok <= item.minStok
  );

  return (
    <header className="topbar">

      <div className="d-flex align-items-center gap-3">
        <button
          className="mobile-menu-btn"
          onClick={onMenu}
        >
          <i className="bi bi-list"></i>
        </button>

        <div>
          <h5 className="topbar-title">
            {title}
          </h5>

          <small className="text-muted">
            Selamat datang kembali, {admin?.nama || "Admin"} 👋
          </small>
        </div>
      </div>

      <div className="topbar-actions">

        {/* Notification */}
        <div className="notification-wrapper">

          <button
            className="topbar-icon-btn"
            onClick={() =>
              setNotificationOpen(!notificationOpen)
            }
          >
            <i className="bi bi-bell"></i>

            {lowStock.length > 0 && (
              <span className="notification-badge">
                {lowStock.length}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <strong>Notifikasi</strong>

                <span>
                  {lowStock.length} perhatian
                </span>
              </div>

              {lowStock.length === 0 ? (
                <div className="notification-empty">
                  <i className="bi bi-check-circle text-success"></i>
                  Semua stok aman
                </div>
              ) : (
                lowStock.slice(0, 5).map((item) => (
                  <div
                    className="notification-item"
                    key={item.id}
                  >
                    <div className="notification-icon">
                      <i className="bi bi-exclamation-triangle"></i>
                    </div>

                    <div>
                      <strong>{item.nama}</strong>

                      <small>
                        Stok tersisa {item.stok} {item.satuan}
                      </small>
                    </div>
                  </div>
                ))
              )}

              <Link
                to="/barang"
                className="notification-footer"
                onClick={() => setNotificationOpen(false)}
              >
                Lihat semua barang
              </Link>

            </div>
          )}

        </div>

        <div className="date-display">
          <i className="bi bi-calendar3 me-2"></i>
          {formatDate()}
        </div>

        <button
          className="btn btn-sm btn-outline-danger d-none d-md-block"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </header>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ items, transactions }) {
  const totalStock = items.reduce(
    (sum, item) => sum + Number(item.stok),
    0
  );

  const lowStock = items.filter(
    (item) =>
      item.stok > 0 &&
      item.stok <= item.minStok
  );

  const emptyStock = items.filter(
    (item) => item.stok <= 0
  );

  const categories = [
    ...new Set(items.map((item) => item.kategori)),
  ];

  const recentItems = [...items].slice(-5).reverse();

  const stockSafe = items.filter(
    (item) => item.stok > item.minStok
  ).length;

  const safePercent = items.length
    ? Math.round((stockSafe / items.length) * 100)
    : 0;

  const lowPercent = items.length
    ? Math.round((lowStock.length / items.length) * 100)
    : 0;

  const emptyPercent = items.length
    ? Math.round((emptyStock.length / items.length) * 100)
    : 0;

  return (
    <>

      <PageHeader
        title="Dashboard Inventory"
        subtitle="Ringkasan kondisi stok gudang saat ini."
      >
        <Link
          to="/barang/tambah"
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Tambah Barang
        </Link>
      </PageHeader>

      {/* Statistics */}
      <div className="row g-4 mb-4">

        <StatCard
          title="Total Barang"
          value={items.length}
          icon="bi-box-seam"
          color="blue"
          note="Jenis barang"
        />

        <StatCard
          title="Total Stok"
          value={totalStock.toLocaleString("id-ID")}
          icon="bi-boxes"
          color="green"
          note="Semua unit"
        />

        <StatCard
          title="Stok Menipis"
          value={lowStock.length}
          icon="bi-exclamation-triangle"
          color="orange"
          note="Perlu diperhatikan"
        />

        <StatCard
          title="Stok Habis"
          value={emptyStock.length}
          icon="bi-x-circle"
          color="red"
          note="Segera restock"
        />

      </div>

      <div className="row g-4">

        {/* Recent Items */}
        <div className="col-lg-8">

          <div className="content-card">

            <div className="card-header-custom">
              <div>
                <h5>Barang Terbaru</h5>
                <small>
                  Daftar barang dalam inventory
                </small>
              </div>

              <Link
                to="/barang"
                className="btn btn-sm btn-outline-primary"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table custom-table mb-0">

                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama Barang</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentItems.map((item) => {
                    const status = getStatus(
                      item.stok,
                      item.minStok
                    );

                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.kode}</strong>
                        </td>

                        <td>
                          <div className="item-name">
                            <div className="item-icon">
                              <i className="bi bi-box"></i>
                            </div>

                            {item.nama}
                          </div>
                        </td>

                        <td>{item.kategori}</td>

                        <td>
                          <strong>{item.stok}</strong>{" "}
                          {item.satuan}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${status.className}`}
                          >
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

          </div>
        </div>

        {/* Stock Summary */}
        <div className="col-lg-4">

          <div className="content-card h-100">

            <div className="card-header-custom">
              <div>
                <h5>Ringkasan Stok</h5>
                <small>Kondisi inventory</small>
              </div>
            </div>

            <div className="stock-summary">

              <StockProgress
                label="Stok Aman"
                percent={safePercent}
                type="safe"
              />

              <StockProgress
                label="Stok Menipis"
                percent={lowPercent}
                type="warning"
              />

              <StockProgress
                label="Stok Habis"
                percent={emptyPercent}
                type="danger"
              />

            </div>

            <div className="dashboard-category">
              <div className="small text-muted">
                Kategori Aktif
              </div>

              <div className="category-count">
                {categories.length}
              </div>
            </div>

          </div>

        </div>

        {/* Transaction summary */}
        <div className="col-lg-6">

          <div className="content-card">

            <div className="card-header-custom">
              <div>
                <h5>Aktivitas Transaksi</h5>
                <small>
                  Ringkasan transaksi inventory
                </small>
              </div>
            </div>

            <div className="transaction-summary">

              <div className="transaction-box masuk">
                <i className="bi bi-arrow-down-circle"></i>

                <div>
                  <span>Barang Masuk</span>

                  <strong>
                    {
                      transactions.filter(
                        (t) => t.jenis === "Masuk"
                      ).length
                    }
                  </strong>
                </div>
              </div>

              <div className="transaction-box keluar">
                <i className="bi bi-arrow-up-circle"></i>

                <div>
                  <span>Barang Keluar</span>

                  <strong>
                    {
                      transactions.filter(
                        (t) => t.jenis === "Keluar"
                      ).length
                    }
                  </strong>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Quick actions */}
        <div className="col-lg-6">

          <div className="content-card">

            <div className="card-header-custom">
              <div>
                <h5>Aksi Cepat</h5>
                <small>
                  Kelola inventory dengan cepat
                </small>
              </div>
            </div>

            <div className="quick-actions">

              <Link
                to="/barang/tambah"
                className="quick-action"
              >
                <i className="bi bi-plus-circle"></i>
                <span>Tambah Barang</span>
              </Link>

              <Link
                to="/barang-masuk"
                className="quick-action"
              >
                <i className="bi bi-box-arrow-in-down"></i>
                <span>Barang Masuk</span>
              </Link>

              <Link
                to="/barang-keluar"
                className="quick-action"
              >
                <i className="bi bi-box-arrow-up"></i>
                <span>Barang Keluar</span>
              </Link>

              <Link
                to="/laporan"
                className="quick-action"
              >
                <i className="bi bi-file-earmark-bar-graph"></i>
                <span>Laporan</span>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  note,
}) {
  return (
    <div className="col-sm-6 col-xl-3">

      <div className="stat-card">

        <div className={`stat-icon ${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>

        <div className="stat-info">
          <span>{title}</span>

          <strong>{value}</strong>

          <small>{note}</small>
        </div>

      </div>

    </div>
  );
}

function StockProgress({
  label,
  percent,
  type,
}) {
  return (
    <div className="stock-progress">

      <div className="d-flex justify-content-between mb-2">
        <span>
          <span className={`stock-dot ${type}`}></span>
          {label}
        </span>

        <strong>{percent}%</strong>
      </div>

      <div className="progress">
        <div
          className={`progress-bar ${type}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

    </div>
  );
}

/* =========================================================
   BARANG
========================================================= */

function Barang({
  items,
  categories,
  onDelete,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("Default");

  const [selectedItem, setSelectedItem] =
    useState(null);

  const filteredItems = useMemo(() => {
  const filtered = items.filter((item) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      item.kode.toLowerCase().includes(keyword) ||
      item.nama.toLowerCase().includes(keyword) ||
      item.kategori.toLowerCase().includes(keyword) ||
      item.lokasi.toLowerCase().includes(keyword);

    const status = getStatus(
      item.stok,
      item.minStok
    ).text;

    const matchesStatus =
      filterStatus === "Semua" ||
      status === filterStatus;

    const matchesCategory =
      filterCategory === "Semua" ||
      item.kategori === filterCategory;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    );
  });

  const sorted = [...filtered];

  if (sortBy === "name-asc") {
    sorted.sort((a, b) =>
      a.nama.localeCompare(b.nama)
    );
  }

  if (sortBy === "stock-desc") {
    sorted.sort((a, b) => b.stok - a.stok);
  }

  if (sortBy === "stock-asc") {
    sorted.sort((a, b) => a.stok - b.stok);
  }

  return sorted;
}, [
  items,
  search,
  filterStatus,
  filterCategory,
  sortBy,
]);

  const handleDelete = (item) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus ${item.nama}?`
    );

    if (confirmed) {
      onDelete(item.id);
    }
  };

  return (
    <>

      <PageHeader
        title="Data Barang"
        subtitle="Kelola seluruh data inventory gudang."
      >
        <Link
          to="/barang/tambah"
          className="btn btn-primary"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Tambah Barang
        </Link>
      </PageHeader>

      <div className="content-card">

        {/* Filter */}
        <div className="filter-area">

  <div className="search-box">
    <i className="bi bi-search"></i>

    <input
      type="text"
      placeholder="Cari kode, nama, kategori, lokasi..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />
  </div>

  <select
    className="form-select filter-select"
    value={filterCategory}
    onChange={(e) =>
      setFilterCategory(e.target.value)
    }
  >
    <option value="Semua">
      Semua Kategori
    </option>

    {categories.map((category) => (
      <option key={category}>
        {category}
      </option>
    ))}
  </select>

  {/* INI TAMBAHAN EDWARD */}
  <select
    className="form-select filter-select"
    value={sortBy}
    onChange={(e) =>
      setSortBy(e.target.value)
    }
  >
    <option value="default">Urutkan Default</option>
    <option value="name-asc">Nama (A-Z)</option>
    <option value="stock-desc">Stok (Terbanyak)</option>
    <option value="stock-asc">Stok (Terkecil)</option>
  </select>

  {/* Tombol Reset */}
<button
  type="button"
  className="btn btn-outline-secondary"
  onClick={() => {
    setSearch("");
    setFilterCategory("Semua");
    setFilterStatus("Semua");
    setSortBy("default");
  }}
>
  <i className="bi bi-arrow-counterclockwise me-2"></i>
  Reset Filter
</button>

</div>

        {/* Table */}
        <select
  className="form-select filter-select"
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
>
  <option value="Semua">Semua Status</option>
  <option value="Aman">Aman</option>
  <option value="Menipis">Menipis</option>
  <option value="Habis">Habis</option>
</select>

        {/* Table */}
        <div className="table-responsive">
          <table className="table custom-table mb-0">

            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th className="text-end">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5"
                  >
                    <i className="bi bi-inbox fs-1 text-muted"></i>

                    <div className="mt-2 text-muted">
                      Data barang tidak ditemukan.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const status = getStatus(
                    item.stok,
                    item.minStok
                  );

                  return (
                    <tr key={item.id}>

                      <td>
                        <strong>{item.kode}</strong>
                      </td>

                      <td>
                        <div className="item-name">
                          <div className="item-icon">
                            <i className="bi bi-box"></i>
                          </div>

                          {item.nama}
                        </div>
                      </td>

                      <td>
                        <span className="category-badge">
                          {item.kategori}
                        </span>
                      </td>

                      <td>
                        <strong>{item.stok}</strong>{" "}
                        {item.satuan}
                      </td>

                      <td>
                        <i className="bi bi-geo-alt me-1 text-primary"></i>
                        {item.lokasi}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions justify-content-end">

                          <button
                            className="action-btn view"
                            title="Detail"
                            onClick={() =>
                              setSelectedItem(item)
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          <button
                            className="action-btn edit"
                            title="Edit"
                            onClick={() =>
                              navigate(
                                `/barang/edit/${item.id}`
                              )
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="action-btn delete"
                            title="Hapus"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>

          </table>
        </div>

        <div className="table-footer">
          Menampilkan{" "}
          <strong>{filteredItems.length}</strong>{" "}
          dari <strong>{items.length}</strong> barang
        </div>

      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          close={() => setSelectedItem(null)}
        />
      )}

    </>
  );
}

/* =========================================================
   DETAIL MODAL
========================================================= */

function DetailModal({ item, close }) {
  const status = getStatus(
    item.stok,
    item.minStok
  );

  return (
    <div className="modal-backdrop-custom">

      <div className="detail-modal">

        <div className="modal-header-custom">

          <div>
            <h5>Detail Barang</h5>
            <small>{item.kode}</small>
          </div>

          <button
            className="btn-close"
            onClick={close}
          ></button>

        </div>

        <div className="detail-product">

          <div className="detail-product-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div>
            <h4>{item.nama}</h4>

            <span
              className={`status-badge ${status.className}`}
            >
              {status.text}
            </span>
          </div>

        </div>

        <div className="detail-grid">

          <DetailField
            label="Kode Barang"
            value={item.kode}
          />

          <DetailField
            label="Kategori"
            value={item.kategori}
          />

          <DetailField
            label="Stok"
            value={`${item.stok} ${item.satuan}`}
          />

          <DetailField
            label="Minimum Stok"
            value={`${item.minStok} ${item.satuan}`}
          />

          <DetailField
            label="Lokasi"
            value={item.lokasi}
          />

          <DetailField
            label="Supplier"
            value={item.supplier || "-"}
          />

        </div>

        <div className="text-end mt-4">

          <button
            className="btn btn-secondary"
            onClick={close}
          >
            Tutup
          </button>

        </div>

      </div>

    </div>
  );
}

function DetailField({ label, value }) {
  return (
    <div className="detail-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   FORM BARANG
========================================================= */

function FormBarang({
  items,
  categories,
  suppliers,
  onSave,
  onUpdate,
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const editingItem = id
    ? items.find((item) => item.id === id)
    : null;

  const [form, setForm] = useState({
    kode: "",
    nama: "",
    kategori: categories[0] || "",
    stok: "",
    minStok: "",
    satuan: "Unit",
    lokasi: "",
    supplier: suppliers[0]?.nama || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingItem) {
      setForm({
        kode: editingItem.kode,
        nama: editingItem.nama,
        kategori: editingItem.kategori,
        stok: editingItem.stok,
        minStok: editingItem.minStok,
        satuan: editingItem.satuan,
        lokasi: editingItem.lokasi,
        supplier: editingItem.supplier || "",
      });
    }
  }, [editingItem]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.kode ||
      !form.nama ||
      !form.kategori ||
      form.stok === "" ||
      form.minStok === "" ||
      !form.lokasi
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    const data = {
      id: editingItem
        ? editingItem.id
        : form.kode,
      kode: form.kode,
      nama: form.nama,
      kategori: form.kategori,
      stok: Number(form.stok),
      minStok: Number(form.minStok),
      satuan: form.satuan,
      lokasi: form.lokasi,
      supplier: form.supplier,
    };

    if (editingItem) {
      onUpdate(data);
    } else {
      onSave(data);
    }

    navigate("/barang");
  };

  return (
    <>

      <PageHeader
        title={
          editingItem
            ? "Edit Barang"
            : "Tambah Barang"
        }
        subtitle={
          editingItem
            ? "Perbarui informasi barang."
            : "Tambahkan barang baru ke inventory."
        }
      />

      <div className="row justify-content-center">

        <div className="col-xl-9">

          <div className="content-card">

            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-section-title">
                <i className="bi bi-box-seam"></i>
                Informasi Barang
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    Kode Barang *
                  </label>

                  <input
                    type="text"
                    name="kode"
                    className="form-control"
                    placeholder="Contoh: BRG-006"
                    value={form.kode}
                    onChange={handleChange}
                    disabled={!!editingItem}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Nama Barang *
                  </label>

                  <input
                    type="text"
                    name="nama"
                    className="form-control"
                    placeholder="Nama barang"
                    value={form.nama}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Kategori *
                  </label>

                  <select
                    name="kategori"
                    className="form-select"
                    value={form.kategori}
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <option key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Satuan *
                  </label>

                  <select
                    name="satuan"
                    className="form-select"
                    value={form.satuan}
                    onChange={handleChange}
                  >
                    <option>Unit</option>
                    <option>Rim</option>
                    <option>Botol</option>
                    <option>Karton</option>
                    <option>Box</option>
                    <option>Buah</option>
                    <option>Set</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Stok *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stok"
                    className="form-control"
                    value={form.stok}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Minimum Stok *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="minStok"
                    className="form-control"
                    value={form.minStok}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Lokasi / Rak *
                  </label>

                  <input
                    type="text"
                    name="lokasi"
                    className="form-control"
                    placeholder="Contoh: Rak A-01"
                    value={form.lokasi}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Supplier
                  </label>

                  <select
                    name="supplier"
                    className="form-select"
                    value={form.supplier}
                    onChange={handleChange}
                  >
                    <option value="">
                      Pilih supplier
                    </option>

                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.nama}
                      >
                        {supplier.nama}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="form-actions mt-4">

                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => navigate("/barang")}
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <i className="bi bi-check-lg me-2"></i>

                  {editingItem
                    ? "Simpan Perubahan"
                    : "Simpan Barang"}
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </>
  );
}

/* =========================================================
   BARANG MASUK
========================================================= */

function BarangMasuk({
  items,
  onTransaction,
  onUpdateStock,
}) {
  const navigate = useNavigate();

  const [itemId, setItemId] = useState(
    items[0]?.id || ""
  );

  const [jumlah, setJumlah] = useState("");
  const [supplier, setSupplier] = useState("");
  const [catatan, setCatatan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const item = items.find(
      (item) => item.id === itemId
    );

    if (!item || Number(jumlah) <= 0) {
      alert("Pilih barang dan jumlah yang valid.");
      return;
    }

    const transaction = {
      id: generateId("IN"),
      jenis: "Masuk",
      itemId: item.id,
      kode: item.kode,
      nama: item.nama,
      jumlah: Number(jumlah),
      satuan: item.satuan,
      supplier: supplier || item.supplier || "-",
      catatan,
      tanggal: new Date().toISOString(),
      petugas: "Admin Gudang",
    };

    onUpdateStock(item.id, Number(jumlah));
    onTransaction(transaction);

    alert("Barang masuk berhasil dicatat.");

    setJumlah("");
    setSupplier("");
    setCatatan("");

    navigate("/riwayat");
  };

  return (
    <>

      <PageHeader
        title="Barang Masuk"
        subtitle="Catat barang yang masuk ke gudang."
      />

      <div className="row justify-content-center">

        <div className="col-xl-8">

          <div className="content-card">

            <div className="transaction-form-icon masuk">
              <i className="bi bi-box-arrow-in-down"></i>
            </div>

            <div className="text-center mb-4">
              <h4 className="fw-bold">
                Form Barang Masuk
              </h4>

              <p className="text-muted">
                Stok barang akan otomatis bertambah.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">
                  Pilih Barang *
                </label>

                <select
                  className="form-select"
                  value={itemId}
                  onChange={(e) =>
                    setItemId(e.target.value)
                  }
                >
                  {items.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.kode} - {item.nama}{" "}
                      (Stok: {item.stok})
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    Jumlah Masuk *
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Contoh: 20"
                    value={jumlah}
                    onChange={(e) =>
                      setJumlah(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Supplier
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama supplier"
                    value={supplier}
                    onChange={(e) =>
                      setSupplier(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="mt-3">
                <label className="form-label">
                  Catatan
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Catatan transaksi..."
                  value={catatan}
                  onChange={(e) =>
                    setCatatan(e.target.value)
                  }
                ></textarea>
              </div>

              <div className="form-actions mt-4">

                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() =>
                    navigate("/riwayat")
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Simpan Barang Masuk
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </>
  );
}

/* =========================================================
   BARANG KELUAR
========================================================= */

function BarangKeluar({
  items,
  onTransaction,
  onUpdateStock,
}) {
  const navigate = useNavigate();

  const [itemId, setItemId] = useState(
    items[0]?.id || ""
  );

  const [jumlah, setJumlah] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [catatan, setCatatan] = useState("");

  const selectedItem = items.find(
    (item) => item.id === itemId
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const jumlahNumber = Number(jumlah);

    if (!selectedItem || jumlahNumber <= 0) {
      alert("Pilih barang dan jumlah yang valid.");
      return;
    }

    if (jumlahNumber > selectedItem.stok) {
      alert(
        `Stok tidak mencukupi. Stok tersedia: ${selectedItem.stok} ${selectedItem.satuan}`
      );
      return;
    }

    const transaction = {
      id: generateId("OUT"),
      jenis: "Keluar",
      itemId: selectedItem.id,
      kode: selectedItem.kode,
      nama: selectedItem.nama,
      jumlah: jumlahNumber,
      satuan: selectedItem.satuan,
      tujuan: tujuan || "-",
      catatan,
      tanggal: new Date().toISOString(),
      petugas: "Admin Gudang",
    };

    onUpdateStock(
      selectedItem.id,
      -jumlahNumber
    );

    onTransaction(transaction);

    alert("Barang keluar berhasil dicatat.");

    setJumlah("");
    setTujuan("");
    setCatatan("");

    navigate("/riwayat");
  };

  return (
    <>

      <PageHeader
        title="Barang Keluar"
        subtitle="Catat barang yang keluar dari gudang."
      />

      <div className="row justify-content-center">

        <div className="col-xl-8">

          <div className="content-card">

            <div className="transaction-form-icon keluar">
              <i className="bi bi-box-arrow-up"></i>
            </div>

            <div className="text-center mb-4">
              <h4 className="fw-bold">
                Form Barang Keluar
              </h4>

              <p className="text-muted">
                Stok barang akan otomatis berkurang.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">
                  Pilih Barang *
                </label>

                <select
                  className="form-select"
                  value={itemId}
                  onChange={(e) =>
                    setItemId(e.target.value)
                  }
                >
                  {items.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.kode} - {item.nama}{" "}
                      (Stok: {item.stok})
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    Jumlah Keluar *
                  </label>

                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Contoh: 5"
                    value={jumlah}
                    onChange={(e) =>
                      setJumlah(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Tujuan
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Divisi IT"
                    value={tujuan}
                    onChange={(e) =>
                      setTujuan(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="mt-3">
                <label className="form-label">
                  Catatan
                </label>

                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Catatan transaksi..."
                  value={catatan}
                  onChange={(e) =>
                    setCatatan(e.target.value)
                  }
                ></textarea>
              </div>

              <div className="form-actions mt-4">

                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() =>
                    navigate("/riwayat")
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  <i className="bi bi-check-lg me-2"></i>
                  Simpan Barang Keluar
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </>
  );
}

/* =========================================================
   RIWAYAT
========================================================= */

function Riwayat({
  transactions,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Semua");

  const filtered = transactions.filter(
    (transaction) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        transaction.id
          .toLowerCase()
          .includes(keyword) ||
        transaction.nama
          .toLowerCase()
          .includes(keyword) ||
        transaction.kode
          .toLowerCase()
          .includes(keyword);

      const matchFilter =
        filter === "Semua" ||
        transaction.jenis === filter;

      return matchSearch && matchFilter;
    }
  );

  return (
    <>

      <PageHeader
        title="Riwayat Transaksi"
        subtitle="Semua aktivitas barang masuk dan keluar."
      />

      <div className="content-card">

        <div className="filter-area">

          <div className="search-box">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="form-select filter-select"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option>Semua</option>
            <option>Masuk</option>
            <option>Keluar</option>
          </select>

        </div>

        <div className="table-responsive">
          <table className="table custom-table mb-0">

            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Barang</th>
                <th>Jenis</th>
                <th>Jumlah</th>
                <th>Detail</th>
              </tr>
            </thead>

            <tbody>

              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-5 text-muted"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>
              ) : (
                filtered.map((transaction) => (
                  <tr key={transaction.id}>

                    <td>
                      <strong>
                        {transaction.id}
                      </strong>
                    </td>

                    <td>
                      {formatDateTime(
                        transaction.tanggal
                      )}
                    </td>

                    <td>
                      <strong>
                        {transaction.nama}
                      </strong>

                      <small className="d-block text-muted">
                        {transaction.kode}
                      </small>
                    </td>

                    <td>
                      <span
                        className={
                          transaction.jenis === "Masuk"
                            ? "transaction-badge masuk"
                            : "transaction-badge keluar"
                        }
                      >
                        <i
                          className={
                            transaction.jenis === "Masuk"
                              ? "bi bi-arrow-down"
                              : "bi bi-arrow-up"
                          }
                        ></i>

                        {transaction.jenis}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {transaction.jenis === "Masuk"
                          ? "+"
                          : "-"}
                        {transaction.jumlah}{" "}
                        {transaction.satuan}
                      </strong>
                    </td>

                    <td>
                      <small className="text-muted">
                        {transaction.supplier ||
                          transaction.tujuan ||
                          "-"}
                      </small>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
        </div>

      </div>

    </>
  );
}

/* =========================================================
   SUPPLIER
========================================================= */

function Supplier({
  suppliers,
  onAdd,
  onDelete,
}) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    nama: "",
    kontak: "",
    email: "",
    alamat: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nama) {
      alert("Nama supplier wajib diisi.");
      return;
    }

    onAdd({
      id: generateId("SUP"),
      ...form,
    });

    setForm({
      nama: "",
      kontak: "",
      email: "",
      alamat: "",
    });

    setShowForm(false);
  };

  return (
    <>

      <PageHeader
        title="Supplier"
        subtitle="Kelola data pemasok barang."
      >
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Tambah Supplier
        </button>
      </PageHeader>

      {showForm && (
        <div className="content-card mb-4">

          <h5 className="fw-bold mb-4">
            Tambah Supplier
          </h5>

          <form onSubmit={handleSubmit}>

            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">
                  Nama Supplier
                </label>

                <input
                  className="form-control"
                  value={form.nama}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nama: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Nomor Kontak
                </label>

                <input
                  className="form-control"
                  value={form.kontak}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      kontak: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  Alamat
                </label>

                <input
                  className="form-control"
                  value={form.alamat}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alamat: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <div className="mt-4">

              <button className="btn btn-primary">
                Simpan Supplier
              </button>

              <button
                type="button"
                className="btn btn-light border ms-2"
                onClick={() => setShowForm(false)}
              >
                Batal
              </button>

            </div>

          </form>

        </div>
      )}

      <div className="row g-4">

        {suppliers.map((supplier) => (
          <div
            className="col-md-6 col-xl-4"
            key={supplier.id}
          >

            <div className="supplier-card">

              <div className="supplier-icon">
                <i className="bi bi-building"></i>
              </div>

              <div className="flex-grow-1">

                <h5>{supplier.nama}</h5>

                <p>
                  <i className="bi bi-telephone me-2"></i>
                  {supplier.kontak || "-"}
                </p>

                <p>
                  <i className="bi bi-envelope me-2"></i>
                  {supplier.email || "-"}
                </p>

                <p>
                  <i className="bi bi-geo-alt me-2"></i>
                  {supplier.alamat || "-"}
                </p>

              </div>

              <button
                className="action-btn delete"
                onClick={() =>
                  onDelete(supplier.id)
                }
              >
                <i className="bi bi-trash"></i>
              </button>

            </div>

          </div>
        ))}

      </div>

    </>
  );
}

/* =========================================================
   KATEGORI
========================================================= */

function Kategori({
  categories,
  onAdd,
  onDelete,
}) {
  const [newCategory, setNewCategory] =
    useState("");

  const handleAdd = (e) => {
    e.preventDefault();

    const value = newCategory.trim();

    if (!value) return;

    if (categories.includes(value)) {
      alert("Kategori sudah ada.");
      return;
    }

    onAdd(value);
    setNewCategory("");
  };

  return (
    <>

      <PageHeader
        title="Kategori Barang"
        subtitle="Kelola kategori inventory."
      />

      <div className="row g-4">

        <div className="col-lg-5">

          <div className="content-card">

            <h5 className="fw-bold mb-3">
              Tambah Kategori
            </h5>

            <form onSubmit={handleAdd}>

              <label className="form-label">
                Nama Kategori
              </label>

              <input
                className="form-control mb-3"
                placeholder="Contoh: Elektronik"
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value)
                }
              />

              <button className="btn btn-primary">
                <i className="bi bi-plus-lg me-2"></i>
                Tambah Kategori
              </button>

            </form>

          </div>

        </div>

        <div className="col-lg-7">

          <div className="content-card">

            <div className="card-header-custom">
              <div>
                <h5>Daftar Kategori</h5>
                <small>
                  {categories.length} kategori aktif
                </small>
              </div>
            </div>

            <div className="category-list">

              {categories.map((category, index) => (
                <div
                  className="category-list-item"
                  key={category}
                >

                  <div className="d-flex align-items-center gap-3">

                    <div className="category-number">
                      {index + 1}
                    </div>

                    <strong>{category}</strong>

                  </div>

                  <button
                    className="action-btn delete"
                    onClick={() =>
                      onDelete(category)
                    }
                  >
                    <i className="bi bi-trash"></i>
                  </button>

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

/* =========================================================
   LAPORAN
========================================================= */

function Laporan({
  items,
  transactions,
}) {
  const totalStock = items.reduce(
    (sum, item) => sum + item.stok,
    0
  );

  const totalMasuk = transactions
    .filter((t) => t.jenis === "Masuk")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalKeluar = transactions
    .filter((t) => t.jenis === "Keluar")
    .reduce((sum, t) => sum + t.jumlah, 0);

  const exportCSV = () => {
    const headers = [
      "Kode",
      "Nama Barang",
      "Kategori",
      "Stok",
      "Satuan",
      "Minimum Stok",
      "Lokasi",
      "Supplier",
      "Status",
    ];

    const rows = items.map((item) => {
      const status = getStatus(
        item.stok,
        item.minStok
      ).text;

      return [
        item.kode,
        item.nama,
        item.kategori,
        item.stok,
        item.satuan,
        item.minStok,
        item.lokasi,
        item.supplier,
        status,
      ];
    });

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\ufeff" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `laporan-inventory-${Date.now()}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>

      <PageHeader
        title="Laporan Inventory"
        subtitle="Ringkasan dan export data inventory."
      >
        <button
          className="btn btn-success"
          onClick={exportCSV}
        >
          <i className="bi bi-download me-2"></i>
          Export CSV
        </button>
      </PageHeader>

      <div className="row g-4 mb-4">

        <StatCard
          title="Total Jenis Barang"
          value={items.length}
          icon="bi-box-seam"
          color="blue"
          note="Jenis barang"
        />

        <StatCard
          title="Total Stok"
          value={totalStock.toLocaleString("id-ID")}
          icon="bi-boxes"
          color="green"
          note="Stok saat ini"
        />

        <StatCard
          title="Total Barang Masuk"
          value={totalMasuk}
          icon="bi-arrow-down-circle"
          color="blue"
          note="Dari semua transaksi"
        />

        <StatCard
          title="Total Barang Keluar"
          value={totalKeluar}
          icon="bi-arrow-up-circle"
          color="orange"
          note="Dari semua transaksi"
        />

      </div>

      <div className="content-card">

        <div className="card-header-custom">
          <div>
            <h5>Laporan Stok Barang</h5>
            <small>
              Data terbaru inventory
            </small>
          </div>
        </div>

        <div className="table-responsive">

          <table className="table custom-table">

            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Min. Stok</th>
                <th>Lokasi</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const status = getStatus(
                  item.stok,
                  item.minStok
                );

                return (
                  <tr key={item.id}>

                    <td>
                      <strong>{item.kode}</strong>
                    </td>

                    <td>{item.nama}</td>

                    <td>{item.kategori}</td>

                    <td>
                      {item.stok} {item.satuan}
                    </td>

                    <td>
                      {item.minStok} {item.satuan}
                    </td>

                    <td>{item.lokasi}</td>

                    <td>
                      <span
                        className={`status-badge ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}

/* =========================================================
   PENGATURAN
========================================================= */

function Pengaturan({ logout }) {
  const resetData = () => {
    const confirmed = window.confirm(
      "Reset semua data inventory ke data awal?"
    );

    if (!confirmed) return;

    localStorage.setItem(
      ITEMS_KEY,
      JSON.stringify(initialItems)
    );

    localStorage.setItem(
      TRANSACTIONS_KEY,
      JSON.stringify([])
    );

    localStorage.setItem(
      SUPPLIERS_KEY,
      JSON.stringify(initialSuppliers)
    );

    localStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(initialCategories)
    );

    window.location.reload();
  };

  return (
    <>

      <PageHeader
        title="Pengaturan"
        subtitle="Pengaturan akun dan aplikasi."
      />

      <div className="row g-4">

        <div className="col-lg-7">

          <div className="content-card">

            <div className="form-section-title">
              <i className="bi bi-person-circle"></i>
              Profil Administrator
            </div>

            <div className="profile-box">

              <div className="profile-avatar">
                DR
              </div>

              <div>
                <h5>Admin Gudang</h5>
                <p className="text-muted mb-0">
                  Administrator
                </p>
              </div>

            </div>

            <hr />

            <div className="setting-row">
              <div>
                <strong>Username</strong>
                <small>admin</small>
              </div>

              <span className="badge bg-light text-dark">
                Administrator
              </span>
            </div>

            <div className="setting-row">
              <div>
                <strong>Status</strong>
                <small>Akun sedang aktif</small>
              </div>

              <span className="status-badge status-aman">
                Aktif
              </span>
            </div>

          </div>

        </div>

        <div className="col-lg-5">

          <div className="content-card">

            <div className="form-section-title">
              <i className="bi bi-shield-check"></i>
              Sistem
            </div>

            <p className="text-muted small">
              Data aplikasi saat ini disimpan di
              browser menggunakan localStorage.
            </p>

            <button
              className="btn btn-outline-warning w-100 mb-3"
              onClick={resetData}
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Reset Data Demo
            </button>

            <button
              className="btn btn-outline-danger w-100"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout Administrator
            </button>

          </div>

        </div>

      </div>

    </>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="page-header">

      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {children && (
        <div className="page-header-actions">
          {children}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   PAGE TITLE
========================================================= */

function getPageTitle(pathname) {
  if (pathname === "/") return "Dashboard";

  if (pathname.startsWith("/barang/edit"))
    return "Edit Barang";

  if (pathname === "/barang/tambah")
    return "Tambah Barang";

  if (pathname === "/barang")
    return "Data Barang";

  if (pathname === "/barang-masuk")
    return "Barang Masuk";

  if (pathname === "/barang-keluar")
    return "Barang Keluar";

  if (pathname === "/riwayat")
    return "Riwayat Transaksi";

  if (pathname === "/supplier")
    return "Supplier";

  if (pathname === "/kategori")
    return "Kategori";

  if (pathname === "/laporan")
    return "Laporan";

  if (pathname === "/pengaturan")
    return "Pengaturan";

  return "GudangKu";
}
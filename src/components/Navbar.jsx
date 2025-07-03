import { useState, useContext, useRef, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "../contexts/SearchContext";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { searchTag, setSearchTag } = useContext(SearchContext);

  const inputRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearchClick = () => {
    setSearchVisible(true);
  };

  const handleBlur = () => {
    setSearchVisible(false);
    setSearchInput("");
  };

  const handleChange = (e) => {
    setSearchTag(e.target.value.trim().toLowerCase());
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (searchVisible) {
      inputRef.current?.focus();
    }
  }, [searchVisible]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo izquierda */}
        <Link className="navbar-brand fw-bold" to="/">
          UnaHur <span className="text-muted">Anti-Social Net</span>
        </Link>

        {/* Buscador centrado */}
        <div className="d-flex justify-content-center align-items-center" style={{ flex: 1 }}>
          {searchVisible && (
            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                ref={inputRef}
                className="form-control"
                placeholder="Buscar por tag..."
                value={searchInput}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: "250px" }}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchVisible(false)}
                aria-label="Ocultar buscador"
              >
                <i className="bi bi-search" />
              </button>
            </div>
          )}

          {!searchVisible && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchVisible(true)}
              aria-label="Mostrar buscador"
            >
              <i className="bi bi-search" />
            </button>
          )}
        </div>




        {/* Menú derecha */}
        <div>
          <ul className="navbar-nav d-flex flex-row gap-3 mb-0">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/feed">
                    Inicio
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Perfil
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger ms-2">
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

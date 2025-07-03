import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Register = () => {
  const [nickName, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nicknameError, setNicknameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const navigate = useNavigate();
  const { checkNicknameExists } = useContext(UserContext);

  // ✅ Validación de email
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const getEmailError = (email) => {
    if (!email.trim()) return "El email es obligatorio";
    if (!isValidEmail(email)) return "El formato del email no es válido";
    return null;
  };

  const validateNickname = async () => {
    if (!nickName.trim()) return;

    const exists = await checkNicknameExists(nickName);
    setNicknameError(exists ? "Este nickname ya está en uso" : null);
  };

  const validateEmail = () => {
    const error = getEmailError(email);
    setEmailError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailValidation = getEmailError(email);
    if (nicknameError || emailValidation) {
      setEmailError(emailValidation);
      alert("Por favor corregí los errores antes de continuar.");
      return;
    }

    const newUser = {
      nickName,
      email,
      password,
    };

    try {
      const res = await fetch("http://localhost:3003/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("Usuario registrado con éxito");
        navigate("/login");
      } else {
        alert("Hubo un error al registrar el usuario");
      }
    } catch (err) {
      console.error(err);
      alert("Error en el servidor");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        {/* Nickname */}
        <div className="mb-3">
          <label className="form-label">Nickname</label>
          <input
            type="text"
            className={`form-control ${nicknameError ? "is-invalid" : ""}`}
            value={nickName}
            onChange={(e) => {
              setNickname(e.target.value);
              setNicknameError(null);
            }}
            onBlur={validateNickname}
            required
          />
          {nicknameError && (
            <div className="invalid-feedback">{nicknameError}</div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            onBlur={validateEmail}
            required
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;

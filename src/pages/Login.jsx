
import { useState, useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../contexts/UserContext'
import logo from "../assets/UNAHUR AntiSocial Net.png"
import '../styles/Login.css'

function Login() {
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const [nickName, setNickName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()


    try {
      const res = await fetch('http://localhost:3003/user') // Ruta según API local
      const users = await res.json()

      const foundUser = users.find((u) => u.nickName === nickName.trim())

      if (!foundUser) {
        setError('Usuario no encontrado.')
        return
      }
      if (password !== foundUser.password) {
        setError('Contraseña incorrecta.')
        return
      }

      setUser(foundUser) // Guarda en el contexto
      navigate(`/profile`) // Redirige al Home

    } catch (err) {
      console.error(err)
      setError('Hubo un error al intentar iniciar sesión.')
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card p-4 shadow login-unahur" >
        <img src={logo} alt="Logo de red antisocial UNAHUR" />
        <h2 className="mb-4 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control custom-input"
              value={nickName}
              onChange={(e) => setNickName(e.target.value.trimStart())}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control custom-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn btn-primary w-100 btn-ingresar" >
            Ingresar
          </button>

          <Link to='/register'>¿No sos usuario? Registrate</Link> <br></br>
          <Link to='/'>Volver al inicio</Link>
        </form>
      </div>
    </div>
  )
}

export default Login

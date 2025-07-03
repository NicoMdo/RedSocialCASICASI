import { createContext, useState, useEffect } from 'react'

const UserContext = createContext()

function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user]);

  const checkNicknameExists = async (nickname) => {
    try {
      const res = await fetch("http://localhost:3003/user"); // trae todos los usuarios
      const data = await res.json(); // asumimos que es un array

      const nicknames = data.map(u => u.nickName?.toLowerCase()); // ajustar campo si es diferente
      return nicknames.includes(nickname.toLowerCase());
    } catch (error) {
      console.error("Error al verificar nickname:", error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, checkNicknameExists }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider };
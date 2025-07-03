import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostDetail from './pages/PostDetail'
import NewPost from './pages/NewPost'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { SearchProvider } from "./contexts/SearchContext";


function App() {

  return (
    <>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<><Navbar /> <Home /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <><Navbar /> <PostDetail /> </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <><Navbar /> <Profile /> </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-post"
            element={
              <ProtectedRoute>
                <NewPost />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SearchProvider>
    </>

  )

}

export default App
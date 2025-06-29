import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/Usuarios'
import Eventos from './pages/Eventos'
import Categorias from './pages/Categorias'
import Inscripciones from './pages/Inscripciones'
import Layout from './components/Layout'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="inscripciones" element={<Inscripciones />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App 
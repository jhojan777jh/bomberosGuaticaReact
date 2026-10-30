import { useState } from 'react'
import { Nav, Button } from 'react-bootstrap'
import { Speedometer2, ListTask, Mortarboard, Heart, People, BoxArrowRight, ShieldShaded } from 'react-bootstrap-icons'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Layout = ({ children }) => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="d-flex">
      <div style={{ minHeight: '100vh', width: '250px', background: 'linear-gradient(180deg, #b30000 0%, #800000 100%)' }}>
        <div className="p-4 text-center text-white">
          <ShieldShaded size={50} />
          <h5 className="mt-2 mb-0">BOMBEROS</h5>
          <small>Guática</small>
        </div>
        <Nav className="flex-column px-2">
          <Nav.Link as={Link} to="/dashboard" className="text-white my-1" style={{ borderRadius: '10px' }}>
            <Speedometer2 /> Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/tasks" className="text-white my-1" style={{ borderRadius: '10px' }}>
            <ListTask /> Tareas
          </Nav.Link>
          <Nav.Link as={Link} to="/training" className="text-white my-1" style={{ borderRadius: '10px' }}>
            <Mortarboard /> Capacitaciones
          </Nav.Link>
          <Nav.Link as={Link} to="/donations" className="text-white my-1" style={{ borderRadius: '10px' }}>
            <Heart /> Donaciones
          </Nav.Link>
          <Nav.Link as={Link} to="/users" className="text-white my-1" style={{ borderRadius: '10px' }}>
            <People /> Usuarios
          </Nav.Link>
        </Nav>
        <div className="mt-auto p-3" style={{ position: 'absolute', bottom: 0, width: '250px' }}>
          <Button variant="danger" className="w-100" onClick={handleLogout}>
            <BoxArrowRight /> Cerrar Sesión
          </Button>
          <div className="text-white-50 small text-center mt-2">
            <em>[BACKEND PENDIENTE]</em>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, background: '#f5f6fa', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}

export default Layout

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { ShieldShaded } from 'react-bootstrap-icons'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(credentials)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container>
        <Card style={{ maxWidth: '450px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden' }}>
          <Card.Header style={{ background: '#b30000', color: 'white', textAlign: 'center', padding: '30px' }}>
            <ShieldShaded size={60} />
            <h2 className="mt-2 mb-0">PANEL ADMINISTRATIVO</h2>
            <p className="mb-0">Cuerpo de Bomberos - Guática</p>
          </Card.Header>
          <Card.Body style={{ padding: '40px' }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <Button type="submit" disabled={loading} style={{ background: '#b30000', border: 'none', width: '100%', padding: '12px' }}>
                {loading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </Form>
            <div className="text-center text-muted small mt-3">
              <em>Modo Visual - Demo: admin / admin</em><br />
              <em>Backend pendiente de implementar</em>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Login

import { Container, Button, Badge } from 'react-bootstrap'
import { People, PersonPlus } from 'react-bootstrap-icons'

const Users = () => {
  return (
    <Container fluid className="p-4">
      <h2 className="mb-4"><People /> Usuarios <Badge bg="warning" text="dark">VISUAL</Badge></h2>
      <p className="text-muted">Gestión de usuarios - Pendiente de implementar con backend</p>
      <Button style={{ background: '#b30000', border: 'none' }} onClick={() => alert('[TODO] Implementar CRUD de usuarios en backend')}>
        <PersonPlus /> Agregar Usuario
      </Button>
    </Container>
  )
}

export default Users

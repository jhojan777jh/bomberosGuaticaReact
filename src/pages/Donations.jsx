import { Container, Table, Badge, Button } from 'react-bootstrap'
import { Heart } from 'react-bootstrap-icons'

const Donations = () => {
  const donations = [
    { id: 1, donor: 'Empresa XYZ', amount: 500000, status: 'approved', date: '2026-10-28' },
    { id: 2, donor: 'Anónimo', amount: 200000, status: 'pending', date: '2026-10-29' }
  ]

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4"><Heart /> Donaciones <Badge bg="warning" text="dark">VISUAL</Badge></h2>
      <Table striped bordered hover className="shadow-sm bg-white">
        <thead style={{ background: '#b30000', color: 'white' }}>
          <tr>
            <th>Donante</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(d => (
            <tr key={d.id}>
              <td>{d.donor}</td>
              <td></td>
              <td><Badge bg={d.status === 'approved' ? 'success' : 'warning'}>{d.status}</Badge></td>
              <td>{d.date}</td>
              <td><Button size="sm" variant="outline-primary" onClick={() => alert('[TODO] Aprobar/Rechazar donación')}>Gestionar</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Donations

import { Container, Table, Badge, Button } from 'react-bootstrap'
import { Mortarboard } from 'react-bootstrap-icons'
import { useState, useEffect } from 'react'
import API from '../services/api'

const Training = () => {
  const [trainings, setTrainings] = useState([])

  useEffect(() => {
    loadTrainings()
  }, [])

  const loadTrainings = async () => {
    const res = await API.training.get()
    if (res.success) setTrainings(res.trainings)
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4"><Mortarboard /> Capacitaciones <Badge bg="warning" text="dark">VISUAL</Badge></h2>
      <Table striped bordered hover className="shadow-sm bg-white">
        <thead style={{ background: '#b30000', color: 'white' }}>
          <tr>
            <th>Curso</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Capacidad</th>
            <th>Inscritos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trainings.map(tr => (
            <tr key={tr.id}>
              <td>{tr.name}</td>
              <td>{tr.date}</td>
              <td>{tr.time}</td>
              <td>{tr.capacity}</td>
              <td>{tr.enrolled}</td>
              <td><Button size="sm" variant="outline-primary" onClick={() => alert('[TODO] Gestionar inscripción')}>Ver</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default Training

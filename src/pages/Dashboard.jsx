import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap'
import { Speedometer2, ListTask, Mortarboard, Heart, People, PlusCircle } from 'react-bootstrap-icons'
import API from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({ usuarios: 0, capacitaciones: 0, donaciones: 0, tareas: 0 })
  const [tasks, setTasks] = useState([])
  const [trainings, setTrainings] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const statsRes = await API.content.stats()
    if (statsRes.success) setStats(statsRes.stats)
    
    const tasksRes = await API.tasks.get()
    if (tasksRes.success) setTasks(tasksRes.tasks)
    
    const trainingsRes = await API.training.get()
    if (trainingsRes.success) setTrainings(trainingsRes.trainings)
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4"><Speedometer2 /> Dashboard <Badge bg="warning" text="dark">VISUAL</Badge></h2>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <People size={40} color="#b30000" />
              <h3 className="mt-2">{stats.usuarios}</h3>
              <p className="text-muted mb-0">Usuarios</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Mortarboard size={40} color="#b30000" />
              <h3 className="mt-2">{stats.capacitaciones}</h3>
              <p className="text-muted mb-0">Capacitaciones</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Heart size={40} color="#b30000" />
              <h3 className="mt-2">{stats.donaciones}</h3>
              <p className="text-muted mb-0">Donaciones</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <ListTask size={40} color="#b30000" />
              <h3 className="mt-2">{stats.tareas}</h3>
              <p className="text-muted mb-0">Tareas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header style={{ background: '#b30000', color: 'white' }}>
              <ListTask /> Tareas Recientes
            </Card.Header>
            <Card.Body>
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} className="border-bottom py-2">
                  <strong>{task.title}</strong> <Badge bg={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'secondary'}>{task.status}</Badge>
                  <br />
                  <small className="text-muted">{task.description}</small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header style={{ background: '#b30000', color: 'white' }}>
              <Mortarboard /> Próximas Capacitaciones
            </Card.Header>
            <Card.Body>
              {trainings.map(tr => (
                <div key={tr.id} className="border-bottom py-2">
                  <strong>{tr.name}</strong><br />
                  <small className="text-muted">{tr.date} - {tr.time} | Cupos: {tr.enrolled}/{tr.capacity}</small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard

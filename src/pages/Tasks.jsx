import { Container, Card, Table, Badge, Button } from 'react-bootstrap'
import { ListTask, PlusCircle } from 'react-bootstrap-icons'
import { useState, useEffect } from 'react'
import API from '../services/api'

const Tasks = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    const res = await API.tasks.get()
    if (res.success) setTasks(res.tasks)
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4"><ListTask /> Gestión de Tareas <Badge bg="warning" text="dark">VISUAL</Badge></h2>
      <Button style={{ background: '#b30000', border: 'none' }} className="mb-3" onClick={() => alert('[TODO] Implementar creación de tareas en backend')}>
        <PlusCircle /> Nueva Tarea
      </Button>
      {tasks.map(task => (
        <Card key={task.id} className="mb-3 shadow-sm" style={{ borderLeft: '4px solid #b30000' }}>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <h5>{task.title}</h5>
              <Badge bg={task.priority === 'high' ? 'danger' : 'warning'}>{task.priority}</Badge>
            </div>
            <p className="text-muted mb-2">{task.description}</p>
            <Badge bg={task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'info' : 'secondary'}>{task.status}</Badge>
          </Card.Body>
        </Card>
      ))}
    </Container>
  )
}

export default Tasks

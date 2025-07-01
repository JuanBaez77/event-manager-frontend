import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Grid, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material'
import { Event as EventIcon, People as PeopleIcon, TrendingUp as TrendingUpIcon, Star as StarIcon } from '@mui/icons-material'
import { statsService, eventService, inscripcionService } from '../services/api'
import { Event, Inscripcion } from '../types'

interface DashboardStats {
  total_eventos: number
  inscripciones_activas: number
  promedio_inscripciones_por_evento: number
  evento_mas_inscripciones: {
    nombre: string
    inscripciones: number
  }
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Nuevos estados para funcionalidades
  const [eventosDisponibles, setEventosDisponibles] = useState<Event[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Event[]>([])
  const [categoria, setCategoria] = useState('')
  const [eventosCategoria, setEventosCategoria] = useState<Event[]>([])
  const [inscripcionesActivas, setInscripcionesActivas] = useState<Inscripcion[]>([])
  const [historialInscripciones, setHistorialInscripciones] = useState<Inscripcion[]>([])

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await statsService.getDashboardStats()
      setStats(data)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const fetchEventosDisponibles = async () => {
    const data = await eventService.getDisponibles()
    setEventosDisponibles(data)
  }

  const fetchInscripcionesActivas = async () => {
    if (user?.id) {
      const data = await inscripcionService.getActivasByUser(user.id)
      setInscripcionesActivas(data)
    }
  }

  const fetchHistorialInscripciones = async () => {
    if (user?.id) {
      const data = await inscripcionService.getHistorialByUser(user.id)
      setHistorialInscripciones(data)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchEventosDisponibles()
    fetchInscripcionesActivas()
    fetchHistorialInscripciones()
  }, [])

  // IDs de eventos en los que el usuario está inscripto
  const eventosInscriptoIds = new Set(inscripcionesActivas.map(i => i.evento_id))

  // Crear un mapa de evento_id a nombre para lookup rápido
  const eventoNombreMap = Object.fromEntries(eventosDisponibles.map(e => [e.id, e.nombre]))

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {/* Indicadores de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Total Eventos
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {stats?.total_eventos || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Inscripciones Activas
            </Typography>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {stats?.inscripciones_activas || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <TrendingUpIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Promedio por Evento
            </Typography>
            <Typography variant="h4" color="secondary.main" fontWeight="bold">
              {stats?.promedio_inscripciones_por_evento || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              Evento Más Popular
            </Typography>
            <Typography variant="h6" color="warning.main" fontWeight="bold" sx={{ mb: 1 }}>
              {stats?.evento_mas_inscripciones?.nombre || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats?.evento_mas_inscripciones?.inscripciones || 0} inscripciones
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      {/* Layout de dos columnas */}
      <Grid container spacing={3}>
        {/* Columna izquierda: Cards de eventos disponibles */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {eventosDisponibles.map((evento) => (
              <Paper
                key={evento.id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 3,
                  background: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#fff',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {evento.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {evento.descripcion}
                  </Typography>
                  {evento.categoria?.nombre && (
                    <Box sx={{ display: 'inline-block', mb: 1 }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          bgcolor: 'primary.light',
                          color: 'primary.dark',
                          borderRadius: 2,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {evento.categoria.nombre}
                      </Box>
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span role="img" aria-label="inscritos">👥</span>
                      <Typography variant="body2">{evento.cupos} cupos</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span role="img" aria-label="fecha">📅</span>
                      <Typography variant="body2">{evento.fecha_inicio}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 16 }}>
                      {evento.nombre ? evento.nombre[0] : 'E'}
                    </Avatar>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }} color={eventosInscriptoIds.has(evento.id) ? 'success.main' : 'error.main'} fontWeight="bold">
                  {eventosInscriptoIds.has(evento.id) ? 'Inscripto' : 'No inscripto'}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
        {/* Columna derecha: Tablas */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Inscripciones activas del usuario */}
            <Box>
              <Typography variant="h6" gutterBottom>Mis Inscripciones Activas</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Evento ID</TableCell>
                      <TableCell>Nombre del Evento</TableCell>
                      <TableCell>Fecha Inscripción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inscripcionesActivas.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>{i.evento_id}</TableCell>
                        <TableCell>{eventoNombreMap[i.evento_id] || '-'}</TableCell>
                        <TableCell>{i.fecha_inscripcion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {/* Historial de inscripciones del usuario */}
            <Box>
              <Typography variant="h6" gutterBottom>Mi Historial de Inscripciones</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Evento ID</TableCell>
                      <TableCell>Nombre del Evento</TableCell>
                      <TableCell>Fecha Inscripción</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historialInscripciones.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell>{i.evento_id}</TableCell>
                        <TableCell>{eventoNombreMap[i.evento_id] || '-'}</TableCell>
                        <TableCell>{i.fecha_inscripcion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard 
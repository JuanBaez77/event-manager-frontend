import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Alert,
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { inscripcionService, userService, eventService } from '../services/api'
import { Inscripcion, User, Event } from '../types'
import { useAuth } from '../hooks/useAuth'

const initialForm: Partial<Inscripcion> = { usuario_id: undefined, evento_id: undefined, fecha_inscripcion: '' }

const Inscripciones: React.FC = () => {
  const { user } = useAuth()
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [eventos, setEventos] = useState<Event[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Inscripcion>>(initialForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [usuarioFiltro, setUsuarioFiltro] = useState('')
  const [errorCupo, setErrorCupo] = useState('')

  const fetchInscripciones = async () => {
    let data = await inscripcionService.getAll()
    if (usuarioFiltro) {
      data = data.filter((i: Inscripcion) => i.usuario_id === Number(usuarioFiltro))
    }
    if (search) {
      data = data.filter((i: Inscripcion) => {
        const usuario = usuarios.find(u => u.id === i.usuario_id)
        const evento = eventos.find(e => e.id === i.evento_id)
        return (
          usuario?.nombre.toLowerCase().includes(search.toLowerCase()) ||
          evento?.nombre.toLowerCase().includes(search.toLowerCase())
        )
      })
    }
    setInscripciones(data)
  }

  const fetchUsuarios = async () => {
    const data = await userService.getAll()
    setUsuarios(data)
  }

  const fetchEventos = async () => {
    const data = await eventService.getDisponibles()
    setEventos(data)
  }

  useEffect(() => {
    fetchUsuarios()
    fetchEventos()
  }, [])

  useEffect(() => {
    fetchInscripciones()
    // eslint-disable-next-line
  }, [search, usuarios, eventos, usuarioFiltro])

  const handleOpen = (inscripcion?: Inscripcion) => {
    if (inscripcion) {
      setForm(inscripcion)
      setEditId(inscripcion.id)
    } else {
      setForm(user?.rol === 'Cliente' ? { ...initialForm, usuario_id: user.id } : initialForm)
      setEditId(null)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setForm(initialForm)
    setEditId(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name as string]: value }))
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name as string]: name === 'usuario_id' || name === 'evento_id' ? Number(value) : value }))
  }

  const handleSave = async () => {
    setErrorCupo('')
    if (!editId) {
      const evento = eventos.find(e => e.id === form.evento_id)
      if (evento) {
        const inscriptos = inscripciones.filter(i => i.evento_id === evento.id).length
        if (inscriptos >= evento.cupos) {
          setErrorCupo('No hay cupos disponibles para este evento.')
          return
        }
      }
    }
    try {
      if (editId) {
        await inscripcionService.update(editId, form)
      } else {
        await inscripcionService.create(form)
      }
      fetchInscripciones()
      handleClose()
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorCupo(error.response.data.detail)
      } else {
        setErrorCupo('Error al guardar la inscripción.')
      }
    }
  }

  const handleDelete = async (id: number) => {
    await inscripcionService.delete(id)
    fetchInscripciones()
  }

  return (
    <Box sx={{ pl: 2, pr: 2, pt: 2, pb: 0 }}>
      <Typography variant="h4" gutterBottom>Inscripciones</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Buscar por usuario o evento"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filtrar por usuario</InputLabel>
          <Select
            value={usuarioFiltro}
            label="Filtrar por usuario"
            onChange={e => setUsuarioFiltro(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {usuarios.map((u) => (
              <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Agregar</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Evento</TableCell>
              <TableCell>Fecha de inscripción</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inscripciones.map((i) => {
              const usuario = usuarios.find(u => u.id === i.usuario_id)
              const evento = eventos.find(e => e.id === i.evento_id)
              return (
                <TableRow key={i.id}>
                  <TableCell>{usuario?.nombre || ''}</TableCell>
                  <TableCell>{evento?.nombre || ''}</TableCell>
                  <TableCell>{i.fecha_inscripcion}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(i)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(i.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Inscripción' : 'Agregar Inscripción'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {errorCupo && <Alert severity="error">{errorCupo}</Alert>}
          {user?.rol === 'Administrador' ? (
            <FormControl fullWidth>
              <InputLabel>Usuario</InputLabel>
              <Select
                name="usuario_id"
                value={form.usuario_id?.toString() ?? ''}
                label="Usuario"
                onChange={handleSelectChange}
              >
                {usuarios.map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.nombre}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Usuario"
              value={user?.nombre}
              disabled
              fullWidth
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Evento</InputLabel>
            <Select
              name="evento_id"
              value={form.evento_id?.toString() ?? ''}
              label="Evento"
              onChange={handleSelectChange}
            >
              {eventos.map((e) => (
                <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Fecha de inscripción"
            name="fecha_inscripcion"
            type="date"
            value={form.fecha_inscripcion}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Inscripciones 
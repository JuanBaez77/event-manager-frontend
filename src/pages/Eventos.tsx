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
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { eventService, categoriaService } from '../services/api'
import { Event, Categoria } from '../types'

const initialForm: Partial<Event> = {
  nombre: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  lugar: '',
  cupos: 0,
  categoria_id: undefined,
}

const Eventos: React.FC = () => {
  const [eventos, setEventos] = useState<Event[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Event>>(initialForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const fetchEventos = async () => {
    let data = [];
    data = await eventService.getTodos();
    if (categoriaFiltro !== '') {
      data = data.filter((e: Event) => String(e.categoria_id) === categoriaFiltro);
    }
    if (search) {
      data = data.filter((e: Event) =>
        e.nombre.toLowerCase().includes(search.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(search.toLowerCase())
      );
    }
    setEventos(data);
  }

  const fetchCategorias = async () => {
    const data = await categoriaService.getAll()
    setCategorias(data)
  }

  useEffect(() => {
    fetchEventos()
    fetchCategorias()
    // eslint-disable-next-line
  }, [search, estado, categoriaFiltro])

  const handleOpen = (evento?: Event) => {
    if (evento) {
      setForm(evento)
      setEditId(evento.id)
    } else {
      setForm(initialForm)
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
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: name === 'categoria_id' ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    const dataToSend = { ...form };
    if (!dataToSend.categoria_id) {
      delete dataToSend.categoria_id;
    }
    delete dataToSend.categoria;
    if (editId) {
      await eventService.update(editId, dataToSend);
    } else {
      await eventService.create(dataToSend);
    }
    fetchEventos();
    handleClose();
  };

  const handleDelete = async (id: number) => {
    await eventService.delete(id)
    fetchEventos()
  }

  return (
    <Box sx={{ pl: 2, pr: 2, pt: 2, pb: 0 }}>
      <Typography variant="h4" gutterBottom>Eventos</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Buscar por nombre o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select value={estado} label="Estado" onChange={(e) => setEstado(e.target.value as string)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="inactivo">Inactivo</MenuItem>
            <MenuItem value="cancelado">Cancelado</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoriaFiltro}
            label="Categoría"
            onChange={e => setCategoriaFiltro(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={String(cat.id)}>{cat.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Agregar</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Lugar</TableCell>
              <TableCell>Cupos</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventos.map((e) => (
              <TableRow key={e.id}>
                <TableCell>{e.nombre}</TableCell>
                <TableCell>{e.descripcion}</TableCell>
                <TableCell>{e.fecha_inicio}</TableCell>
                <TableCell>{e.fecha_fin}</TableCell>
                <TableCell>{e.lugar}</TableCell>
                <TableCell>{e.cupos}</TableCell>
                <TableCell>{e.categoria?.nombre || ''}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(e)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(e.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Evento' : 'Agregar Evento'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Fecha Inicio"
            name="fecha_inicio"
            type="date"
            value={form.fecha_inicio}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Fecha Fin"
            name="fecha_fin"
            type="date"
            value={form.fecha_fin}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Lugar"
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Cupos"
            name="cupos"
            type="number"
            value={form.cupos}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="categoria_id"
              value={form.categoria_id !== undefined ? String(form.categoria_id) : ''}
              label="Categoría"
              onChange={handleSelectChange}
            >
              <MenuItem value="">Sin categoría</MenuItem>
              {categorias.map((cat) => (
                <MenuItem key={cat.id} value={String(cat.id)}>{cat.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Eventos 
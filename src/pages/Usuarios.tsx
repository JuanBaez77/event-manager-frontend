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
import { userService } from '../services/api'
import { User } from '../types'

const initialForm: Partial<User> = { nombre: '', email: '', rol: 'Cliente' }

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [rol, setRol] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<User>>(initialForm)
  const [password, setPassword] = useState('')
  const [editId, setEditId] = useState<number | null>(null)

  const fetchUsuarios = async () => {
    let data = []
    if (search) {
      data = await userService.search(search)
    } else if (rol) {
      data = await userService.getByRole(rol)
    } else {
      data = await userService.getAll()
    }
    setUsuarios(data)
  }

  useEffect(() => {
    fetchUsuarios()
    // eslint-disable-next-line
  }, [search, rol])

  const handleOpen = (user?: User) => {
    if (user) {
      setForm(user)
      setEditId(user.id)
      setPassword('')
    } else {
      setForm(initialForm)
      setEditId(null)
      setPassword('')
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setForm(initialForm)
    setEditId(null)
    setPassword('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name as string]: value }))
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name as string]: value }))
  }

  const handleSave = async () => {
    if (!editId && !password) {
      alert('La contraseña es obligatoria para crear un usuario.')
      return
    }
    if (editId) {
      await userService.update(editId, form)
    } else {
      await userService.create({ ...form, password })
    }
    fetchUsuarios()
    handleClose()
  }

  const handleDelete = async (id: number) => {
    await userService.delete(id)
    fetchUsuarios()
  }

  return (
    <Box sx={{ pl: 2, pr: 2, pt: 2, pb: 0 }}>
      <Typography variant="h4" gutterBottom>Usuarios</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Buscar por email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rol</InputLabel>
          <Select value={rol} label="Rol" onChange={handleSelectChange} name="rol">
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Administrador">Administrador</MenuItem>
            <MenuItem value="Cliente">Cliente</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Agregar</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(u)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(u.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Usuario' : 'Agregar Usuario'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          {!editId && (
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
            />
          )}
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              name="rol"
              value={form.rol}
              label="Rol"
              onChange={handleSelectChange}
            >
              <MenuItem value="Administrador">Administrador</MenuItem>
              <MenuItem value="Cliente">Cliente</MenuItem>
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

export default Usuarios 
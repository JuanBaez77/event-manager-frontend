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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { Edit, Delete, Add } from '@mui/icons-material'
import { categoriaService } from '../services/api'
import { Categoria } from '../types'
import { useAuth } from '../hooks/useAuth'

const initialForm: Partial<Categoria> = { nombre: '', descripcion: '' }

const Categorias: React.FC = () => {
  const { user } = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Categoria>>(initialForm)
  const [editId, setEditId] = useState<number | null>(null)

  const fetchCategorias = async () => {
    let data = await categoriaService.getAll()
    if (search) {
      data = data.filter((c: Categoria) => c.nombre.toLowerCase().includes(search.toLowerCase()))
    }
    setCategorias(data)
  }

  useEffect(() => {
    fetchCategorias()
    // eslint-disable-next-line
  }, [search])

  const handleOpen = (categoria?: Categoria) => {
    if (categoria) {
      setForm(categoria)
      setEditId(categoria.id)
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

  const handleSave = async () => {
    if (editId) {
      await categoriaService.update(editId, form)
    } else {
      await categoriaService.create(form)
    }
    fetchCategorias()
    handleClose()
  }

  const handleDelete = async (id: number) => {
    await categoriaService.delete(id)
    fetchCategorias()
  }

  return (
    <Box sx={{ pl: 2, pr: 2, pt: 2, pb: 0 }}>
      <Typography variant="h4" gutterBottom>Categorías</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        {user?.rol === 'Administrador' && (
          <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Agregar</Button>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.nombre}</TableCell>
                <TableCell>{c.descripcion}</TableCell>
                <TableCell align="right">
                  {user?.rol === 'Administrador' && (
                    <>
                      <IconButton color="primary" onClick={() => handleOpen(c)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(c.id)}><Delete /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {user?.rol === 'Administrador' && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? 'Editar Categoría' : 'Agregar Categoría'}</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}

export default Categorias 
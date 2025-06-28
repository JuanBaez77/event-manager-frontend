import React, { useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Category as CategoryIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  MailOutline,
  NotificationsNone,
  Logout,
  AccountCircle,
} from '@mui/icons-material'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const drawerWidth = 240

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon color="primary" />,
    path: '/',
  },
  {
    text: 'Usuarios',
    icon: <PeopleIcon color="primary" />,
    path: '/usuarios',
  },
  {
    text: 'Eventos',
    icon: <EventIcon color="primary" />,
    path: '/eventos',
  },
  {
    text: 'Categorías',
    icon: <CategoryIcon color="primary" />,
    path: '/categorias',
  },
  {
    text: 'Inscripciones',
    icon: <AssignmentTurnedInIcon color="primary" />,
    path: '/inscripciones',
  },
]

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const Layout: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== '/login') {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: '#fff',
            borderRight: '1px solid #e3e3e3',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          <Avatar src="/logo2.png" sx={{ width: 56, height: 56, mb: 1, bgcolor: 'primary.main' }} />
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Event Manager
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e3e3e3' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
              {/* Puedes mostrar el nombre de la sección aquí si lo deseas */}
            </Typography>
            {isAuthenticated && user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f7fafd', borderRadius: 5, px: 2, py: 0.5 }}>
                <IconButton color="primary">
                  <MailOutline />
                </IconButton>
                <IconButton color="primary">
                  <NotificationsNone />
                </IconButton>
                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                  {getInitials(user.nombre)}
                </Avatar>
                <Box sx={{ ml: 1, textAlign: 'left' }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{user.nombre}</Typography>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{user.email}</Typography>
                </Box>
                <IconButton onClick={handleMenu} color="primary">
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Perfil</MenuItem>
                  <MenuItem onClick={handleClose}>Configuración</MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} /> Cerrar Sesión
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flexGrow: 1, pl: 2, pr: 2, pt: 2, background: '#f6fbff', minHeight: '100vh' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout 
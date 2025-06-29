import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme,
} from '@mui/material'
import { Visibility, VisibilityOff, Google } from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface LoginForm {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const theme = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data)
      toast.success('Inicio de sesión exitoso')
      navigate('/')
    } catch (error: any) {
      const msg = error?.response?.data?.detail || 'Error al iniciar sesión'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: theme.palette.background.default,
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
          maxWidth: 1000,
          width: '100%',
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Imagen a la izquierda */}
        <Box
          sx={{
            width: '60%',
            display: { xs: 'none', md: 'block' },
            backgroundImage: 'url(/public/placeholder.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Formulario */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 3, md: 6 },
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Logo y bienvenida */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              Event Manager
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={600} gutterBottom>
            Nice to see you again!
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email or phone number"
              margin="normal"
              {...register('email', { required: 'This field is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password', { required: 'This field is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Button size="small">Forgot password?</Button>
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold', fontSize: 16 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <Divider sx={{ my: 3 }}>Or sign in with</Divider>

            <Button
              fullWidth
              variant="contained"
              startIcon={<Google />}
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#111' },
              }}
            >
              Sign in with Google
            </Button>
          </form>

          <Typography variant="body2" align="center" mt={4}>
            Don't have an account?{' '}
            <Button size="small">Sign up now</Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Login

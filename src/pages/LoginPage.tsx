import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Button, TextField, Container, Typography, Box,
  createTheme, ThemeProvider, CssBaseline
} from '@mui/material';
import { AuthRequest } from '../types.ts';

// 1. Esquema de validação (igual ao backend)
const loginSchema = z.object({
  username: z.string().min(3, 'Utilizador deve ter no mínimo 3 caracteres').max(50),
  password: z.string().min(1, 'Senha é obrigatória').max(255),
});

// 2. Tema escuro simples
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: AuthRequest) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Aqui você pode definir um erro de formulário para mostrar ao utilizador
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Utilizador"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
              {isSubmitting ? 'A entrar...' : 'Entrar'}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
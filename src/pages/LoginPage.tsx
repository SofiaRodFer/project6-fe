import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';
import type { AuthRequest } from '../types.ts';

const loginSchema = z.object({
  username: z.string().min(3, 'O utilizador deve ter no mínimo 3 caracteres.').max(50),
  password: z.string().min(1, 'A senha é obrigatória.').max(255),
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AuthRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: AuthRequest) => {
    try {
      setLoginError(null);
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login falhou:', error);
      setLoginError('Utilizador ou senha inválidos. Por favor, tente novamente.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, width: '100%' }}>
            {loginError && <Alert severity="error" sx={{ mb: 2 }}>{loginError}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              label="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="senha"
              type="password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
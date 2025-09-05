import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLES } from '../config';
import { DefaultUserPage } from '../pages/DefaultUserPage';
import { LandingPage } from '../pages/LandingPage';

export const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Lógica de roles
  if (user?.roles.includes(ROLES.ADMIN) || user?.roles.includes(ROLES.LUCAS)) {
    return <LandingPage />; // Mostra a landing page para ADMIN e LUCAS
  }

  if (user?.roles.includes(ROLES.DEFAULT)) {
    return <DefaultUserPage />; // Mostra a página "Nada para ver aqui" para DEFAULT
  }

  // Fallback para o caso de o utilizador não ter nenhuma role conhecida (ou para o dashboard de admin)
  // No futuro, aqui pode ir um dashboard de admin completo
  if (user?.roles.includes(ROLES.ADMIN)) {
    return <LandingPage />; // Por agora, admin vê a mesma landing page
  }

  // Se o utilizador está logado mas não tem uma role válida, pode-se fazer logout ou mostrar erro
  return <DefaultUserPage />;
};
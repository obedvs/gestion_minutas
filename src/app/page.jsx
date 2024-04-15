"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function App() {

  const router = useRouter();

  useEffect(() => {
    const idFromSession = sessionStorage.getItem('idUser');
    if (idFromSession) {
      router.replace('/dash/inicio');
    } else {
      router.replace('/login');
    }
  }, []);

  return null; // No renderizamos nada en este componente ya que la redirección se maneja en useEffect
}
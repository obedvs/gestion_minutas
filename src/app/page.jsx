"use client"

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function App() {

  const router = useRouter();

  useEffect(() => {
    const idFromCookie = Cookies.get('idUser');
    if (idFromCookie !== undefined) {
      if (idFromCookie) {
        router.replace('/dash/inicio');
      } else {
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null; // No renderizamos nada en este componente ya que la redirección se maneja en useEffect
}
"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Metric, Text, Icon } from "@tremor/react";
import { HomeIcon, DocumentIcon, UserIcon, Bars3Icon, XCircleIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'

const ROUTES = [
  { label: 'Inicio', path: '/dash/inicio', icon: HomeIcon },
  { label: 'Minutas', path: '/dash/minutas', icon: DocumentIcon },
  { label: 'Perfil', path: '/dash/perfil', icon: UserIcon },
]

function LatBar({ children }) {

  const router = useRouter();

  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  const onLogout = () => {
    sessionStorage.clear();
    
    // Redirigir a la página de inicio
    router.replace('/');
    
  }

  return (
    <>
      <main className='relative w-full h-screen'>
        <nav className='h-14 bg-main flex items-center justify-center w-full'>

          <div className='md:flex items-center justify-center hidden w-40'>
            <img className="w-32" src="/assets/img/logoujedblanco.png" alt='logo Ujed'/>
          </div>

          <div className="md:px-0 md:justify-center flex items-center justify-between w-full px-3">
            <Metric className="text-white">Gestión de Minutas</Metric>
            <Icon size='lg' icon={ Bars3Icon } className='md:hidden text-white' onClick={ () => setIsMenuOpen(!isMenuOpen) }/>
          </div>
        </nav>

        {/* mobile menu */}
        <div className={`${ isMenuOpen ? 'flex flex-col' : 'hidden' } w-full h-screen absolute top-0 left-0 bg-main z-10`}>
          <Icon size='lg' icon={ XCircleIcon } className='top-3 right-3 absolute text-white' onClick={ () => setIsMenuOpen(!isMenuOpen) }/>
          <ul className='flex flex-col items-center justify-center w-full h-full gap-2 -mt-5'>
            { ROUTES.map(({ label, path, icon }) => (
              <li key={ path } className='p-1 rounded-md'>
                <Link href={ path } onClick={ () => setIsMenuOpen(false) } className="flex items-center justify-start">
                  <Icon size='sm' icon={ icon } className='text-white'/>
                  <Text className='text-white'>{label}</Text>
                </Link>
              </li>
            )) }
            <li className='p-1 mt-12 rounded-md'>
              <button className='flex items-center justify-start w-full'onClick={ onLogout }>
                <Icon size='sm' icon={ ArrowLeftStartOnRectangleIcon } className='text-white'/>
                <Text className='text-white'>Cerrar Sesion</Text>
              </button>
            </li>
          </ul>
        </div>

        <section className="h-[calc(100vh-56px)] flex bg-main">

          <aside className='md:flex flex-col justify-between hidden w-40 p-2'>

            <ul className='flex flex-col items-center justify-center gap-2 mt-10'>
              { ROUTES.map(({ label, path, icon }) => (
                <li key={ path } className='hover:bg-red-600 w-full p-1 rounded-md'>
                  <Link href={ path } className="flex items-center justify-start">
                    <Icon size='sm' icon={ icon } className='text-white'/>
                    <Text className='text-white'>{label}</Text>
                  </Link>
                </li>
              )) }
            </ul>
              
            <button className='hover:bg-red-600 flex items-center justify-start w-full p-1 rounded-md'
              onClick={ onLogout }
            >
              <Icon size='sm' icon={ ArrowLeftStartOnRectangleIcon } className='text-white'/>
              <Text className='text-white'>Cerrar Sesión</Text>
            </button>

          </aside>
          
          <aside className='rounded-t-xl md:rounded-tl-xl w-full h-full p-4 overflow-y-auto bg-white'>
            { children }
          </aside>

        </section>
      </main>
    </>
  );
}

export default LatBar;

"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import Link from "next/link";
import { Metric, Text, Icon } from "@tremor/react";
import { HomeIcon, DocumentIcon, UserIcon, UserGroupIcon, Bars3Icon, XCircleIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline'

const ROUTES = [
  { label: 'Inicio', path: '/dash/inicio', icon: HomeIcon },
  { label: 'Minutas', path: '/dash/minutas', icon: DocumentIcon },
  { label: 'Perfil', path: '/dash/perfil', icon: UserIcon },
  // { label: 'Usuarios', path: '/dash/usuarios', icon: UserGroupIcon },
]

function LatBar({ children }) {

  const router = useRouter();

  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  const onLogout = () => {
    const cookies = Cookies.get();
    // Iterar sobre todas las cookies y eliminarlas una por una
    Object.keys(cookies).forEach(cookie => {
      Cookies.remove(cookie);
    });
    
    // Redirigir a la página de inicio
    router.replace('/');
    
  }

  return (
    <>
      <main className='w-full h-screen relative'>
        <nav className='w-full h-14 bg-main flex justify-center items-center'>

          <div className='hidden md:flex w-40 justify-center items-center'>
            <img className="w-32" src="/assets/img/logoujedblanco.png" alt='logo Ujed'/>
          </div>

          <div className="w-full flex justify-between px-3 md:px-0 md:justify-center items-center">
            <Metric className="text-white">Gestión de Minutas</Metric>
            <Icon size='lg' icon={ Bars3Icon } className='text-white md:hidden' onClick={ () => setIsMenuOpen(!isMenuOpen) }/>
          </div>
        </nav>

        {/* mobile menu */}
        <div className={`${ isMenuOpen ? 'flex flex-col' : 'hidden' } w-full h-screen absolute top-0 left-0 bg-main z-10`}>
          <Icon size='lg' icon={ XCircleIcon } className='text-white absolute top-3 right-3' onClick={ () => setIsMenuOpen(!isMenuOpen) }/>
          <ul className='w-full h-full flex flex-col justify-center items-center -mt-5 gap-2'>
            { ROUTES.map(({ label, path, icon }) => (
              <li key={ path } className='rounded-md p-1'>
                <Link href={ path } onClick={ () => setIsMenuOpen(false) } className="flex justify-start items-center">
                  <Icon size='sm' icon={ icon } className='text-white'/>
                  <Text className='text-white'>{label}</Text>
                </Link>
              </li>
            )) }
            <li className='rounded-md p-1 mt-12'>
              <button className='flex justify-start items-center w-full'onClick={ onLogout }>
                <Icon size='sm' icon={ ArrowLeftStartOnRectangleIcon } className='text-white'/>
                <Text className='text-white'>Cerrar Sesion</Text>
              </button>
            </li>
          </ul>
        </div>

        <section className="h-[calc(100vh-56px)] flex bg-main">

          <aside className='hidden md:flex w-40 p-2 flex-col justify-between'>

            <ul className='flex flex-col justify-center items-center gap-2 mt-10'>
              { ROUTES.map(({ label, path, icon }) => (
                <li key={ path } className='w-full hover:bg-red-600 rounded-md p-1'>
                  <Link href={ path } className="flex justify-start items-center">
                    <Icon size='sm' icon={ icon } className='text-white'/>
                    <Text className='text-white'>{label}</Text>
                  </Link>
                </li>
              )) }
            </ul>
              
            <button className='flex justify-start items-center w-full hover:bg-red-600 rounded-md p-1'
              onClick={ onLogout }
            >
              <Icon size='sm' icon={ ArrowLeftStartOnRectangleIcon } className='text-white'/>
              <Text className='text-white'>Cerrar Sesion</Text>
            </button>

          </aside>
          
          <aside className='w-full h-full overflow-y-auto p-4 rounded-t-xl md:rounded-tl-xl bg-white'>
            { children }
          </aside>

        </section>
      </main>
    </>
  );
}

export default LatBar;

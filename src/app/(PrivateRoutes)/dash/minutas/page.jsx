"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activa } from "@/components/Minutas";
import { Finalizada } from "@/components/Minutas";
import Cookies from 'js-cookie';
import { Metric, Divider, TextInput, Button } from "@tremor/react";
import { MagnifyingGlassCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
// import User from '@components/Usuarios';
import { useRouter } from 'next/navigation';

const Minutas = () => {

  const router = useRouter();

  const idUserCoockie = Cookies.get('idUser');
  // const UserNameCoockie = Cookies.get('UserName');
  const [minutaData, setMinutaData] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://62.72.1.33:3001/minutes/`);
      const reversedMinutaData = response.data.reverse();
      setMinutaData(reversedMinutaData); 
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMinutaA = minutaData ? minutaData.filter(u => u.tema && u.tema.toLowerCase().includes(searchText.toLowerCase())) : [];
  const filteredMinutaF = minutaData ? minutaData.filter(u => u.tema && u.tema.toLowerCase().includes(searchText.toLowerCase())) : [];

  return (
    <>
      <Metric>Minutas</Metric>
      <Divider />

      <div className='w-full flex flex-col-reverse md:flex-row gap-5'>
        <form className='w-full flex gap-2'>
          <TextInput 
            placeholder="Buscar"
            icon={MagnifyingGlassCircleIcon}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

        </form>

        <Button
          icon={ PlusCircleIcon }
          iconPosition="right"
          onClick={() => router.push('/dash/minuta/generar')}
          tooltip="Crear minuta"
          variant='secondary'
          color='red'
        >
          Crear minuta
        </Button>
      </div>

      <Metric className='mt-4 mb-2'>Activas</Metric>
      {filteredMinutaA.length > 0 ? (
        <div className='md:grid grid-cols-2 lg:grid-cols-3 gap-2'>
          {React.Children.toArray(filteredMinutaA.map(u => u.tema && <Activa {...u} updateData={fetchData} User = {idUserCoockie } />))}
        </div>
      ) : (
        <p>No se encontraron minutas activas.</p>
      )}

      <Metric className='mt-4 mb-2'>Finalizadas</Metric>
      {filteredMinutaF.length > 0 ? (
        <div className='md:grid grid-cols-2 lg:grid-cols-3 gap-2'>
          {React.Children.toArray(filteredMinutaF.map(u => u.tema && <Finalizada {...u} />))}
        </div>
      ) : (
        <p>No se encontraron minutas finalizadas.</p>
      )}
    </>
  );
};

export default Minutas;
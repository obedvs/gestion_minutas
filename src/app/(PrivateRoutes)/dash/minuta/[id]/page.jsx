"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// import Cookies from 'js-cookie';
import axios from 'axios';
import { Text, Title, Icon, Divider, Button } from "@tremor/react";
import { PlusCircleIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import "@/styles/inicio.css";
import "@/styles/acuerdos.css";
import { Acuerdos } from "@/components/Acuerdo";
import { apiUrl } from '@/config/config';

const MinutaSeleccionada = ({ params }) => {
  const { id } = params;
  const router = useRouter();

  const idFromSession = sessionStorage.getItem('idUser');
  // const idFromSession = Cookies.get('idUser');

  const [ acuerdoData, setAcuerdoData ] = useState([]);
  const [ minutaData, setMinutaData ] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/agreement/`);
        setAcuerdoData(response.data.filter((u) => u.minuta_id === id));

        const responseMinute = await axios.get(`${ apiUrl }/minutes/${id}`);
        setMinutaData(responseMinute.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='w-full flex flex-col md:flex-row justify-between'>
        <Icon className='w-10 h-10 cursor-pointer'
          icon={ArrowUturnLeftIcon}
          onClick={() => router.back()}
          variant='solid'
          color='red'
          tooltip='Regresar'
        />

        <div className='w-full justify-center md:justify-end flex gap-1 md:gap-4 mt-4 md:mt-0'>
          <Button
            variant='secondary'
            color='red'
            onClick={() => router.push(`/dash/minutas/${id}/conclusion`)}
          >
            Conclusión de la reunión
          </Button>

          <Button
            icon={PlusCircleIcon}
            iconPosition='right'
            color='red'
            onClick={() => router.push(`/dash/minutas/${id}/generaracuerdo`)}
            disabled={minutaData.responsable === idFromSession ? false : true}
          >
            Añadir acuerdo
          </Button>
        </div>

      </div>

      <Title className='mt-4 md:mt-7'>
        {minutaData.tema}
      </Title>
      <Divider className='mt-2' />
      <div className='md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2'>
      {
        acuerdoData.length > 0
        ? acuerdoData.reverse().map((u, index) => (
          <Acuerdos key={index} minuta={minutaData} {...u} />
          ))
        : <Text className='mt-4'>
          No hay acuerdos registrados
          </Text>
      }
      </div>
    </>
  );
};

export default MinutaSeleccionada;
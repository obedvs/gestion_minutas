"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import "@/styles/inicio.css";
import "@/styles/acuerdos.css";
import { Acuerdos } from "@/components/Acuerdo";
import { Text, Title, Icon, Divider, Button } from "@tremor/react";
import { PlusCircleIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

const MinutaSeleccionada = ({ params }) => {
  const { id } = params;
  const router = useRouter();

  const [acuerdoData, setAcuerdoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/agreement/`);
        setAcuerdoData(response.data.filter((u) => u.minuta_id === id));
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
          >
            Añadir acuerdo
          </Button>
        </div>

      </div>

      <Title className='mt-4 md:mt-7'>
        {id}
      </Title>
      <Divider className='mt-2' />
      <div className='md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2'>
      {
        acuerdoData.length > 0
        ? acuerdoData.reverse().map((u, index) => (
          <Acuerdos key={index} {...u} />
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
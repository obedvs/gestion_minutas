"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import EliminarAcuerdo from "./actions/eliminarAcuerdo";
import { Button, Card, Text, Title } from "@tremor/react";
import { ChevronDoubleRightIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";


export const Acuerdos = (acuerdo) => {

  const router = useRouter();

  const [userRCData, setUserRCData] = useState(null);
  const [userRRData, setUserRRData] = useState(null);
  const [eliminarAcuerdoVisible, setEliminarAcuerdoVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRC = await axios.get(
          `http://62.72.1.33:3001/users/${acuerdo.responsablec_id}`
        );
        setUserRCData(responseRC.data);
        const responseRR = await axios.get(
          `http://62.72.1.33:3001/users/${acuerdo.responsabler_id}`
        );
        setUserRRData(responseRR.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [acuerdo.responsablec_id, acuerdo.responsabler_id]);

  const handleEliminarClick = () => {
    setEliminarAcuerdoVisible(true);
  };

  return (
    <Card className='w-full mb-1'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-col w-full md:w-2/3 justify-center gap-1'>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Titulo:</Title>
            <Text>{acuerdo.acuerdo}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Responsable de revisar:</Title>
            <Text>{userRRData?.nombre}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Responsable de cumplir:</Title>
            <Text>{userRCData?.nombre}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Fecha de compromiso:</Title>
            <Text>{acuerdo.fecha}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Estatus:</Title>
            <Text>{acuerdo.estatus}</Text>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col justify-center gap-2">
          <Button
            className='w-full'
            icon={ PencilIcon }
            iconPosition='left'
            color='blue'
            size='xs'
            variant='secondary'
            onClick={() => router.push(`/dash/acuerdo/editar/${acuerdo._id}`)}
          >
            Editar
          </Button>
          <Button
            className='w-full'
            icon={ ChevronDoubleRightIcon }
            iconPosition='right'
            color='blue'
            size='xs'
            variant='secondary'
            onClick={() => router.push(`/dash/minutas/${acuerdo._id}/seguimiento`)}
          >
            Seguimiento
          </Button>
          <Button
            className='w-full'
            icon={ TrashIcon }
            iconPosition='left'
            color='red'
            variant='secondary'
            size='xs'
            onClick={handleEliminarClick}
          >
            Eliminar
          </Button>
          {eliminarAcuerdoVisible && <EliminarAcuerdo id={acuerdo._id} />}
        </div>
      </div>
  </Card>
  );
};

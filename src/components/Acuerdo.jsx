"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button, Card, Text, Title } from "@tremor/react";
import { ChevronDoubleRightIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { apiUrl } from "@/config/config";
import Cookies from "js-cookie";


export const Acuerdos = ( acuerdo ) => {

  const router = useRouter();

  const [userRCData, setUserRCData] = useState(null);
  const [userRRData, setUserRRData] = useState(null);

  const idUserCoockie = Cookies.get('idUser');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRC = await axios.get(`${ apiUrl }/users/${acuerdo.responsablec_id}`);
        setUserRCData(responseRC.data);

        const responseRR = await axios.get(`${ apiUrl }/users/${acuerdo.responsabler_id}`);
        setUserRRData(responseRR.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [acuerdo.responsablec_id, acuerdo.responsabler_id]);

  const handleEliminarClick = ( id ) => {
    Swal.fire({
      title: 'Eliminar Acuerdo',
      text: '¿Deseas Eliminar el Acuerdo?',
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${ apiUrl }/agreement/${id}`)
          .then(response => {
            console.log('Eliminación exitosa');
            Swal.fire({
              title: 'Acuerdo Eliminado',
              text: 'Se eliminó correctamente el Acuerdo',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(
              ()=> window.location.reload()
            )
          })
          .catch(error => {
            console.error('Error al eliminar:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Error al eliminar el Acuerdo',
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          });
      } else {
        Swal.fire({
          title: 'Acuerdo No Eliminado',
          text: 'No se ha Eliminado el Acuerdo',
          icon: 'info',
        });
      }
    });
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
            <Title className='!text-sm'>Revisión:</Title>
            <Text>{userRRData?.nombre}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Cumplimiento:</Title>
            <Text>{userRCData?.nombre}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Fecha compromiso:</Title>
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
            disabled={acuerdo.minuta.responsable === idUserCoockie ? false : true}
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
            onClick={() => handleEliminarClick(acuerdo._id)}
            disabled={acuerdo.minuta.responsable === idUserCoockie ? false : true}
          >
            Eliminar
          </Button>
        </div>
      </div>
  </Card>
  );
};

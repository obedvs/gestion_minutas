"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AiFillCheckCircle,
  AiFillFilePdf,
} from 'react-icons/ai';
import { Title, Text, Card, Button } from '@tremor/react';
import { PencilIcon, TrashIcon, ChevronDoubleRightIcon, EyeIcon  } from '@heroicons/react/24/outline'
import Swal from 'sweetalert2';
import axios from 'axios';
import { apiUrl } from '@/config/config';


export const Activa = (minuta) => {

  const router = useRouter();
  
  // Eliminar Minuta
  const handleEliminarClick = (id) => {
    if(id) {
      Swal.fire({
        title: '¿Deseas Eliminar la Minuta?',
        text: 'Esta acción no podrá ser revertida.',
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: 'Sí, eliminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${ apiUrl }/minutes/${id}`)
            .then(response => {
              Swal.fire({
                title: 'Minuta Eliminada',
                text: 'Se eliminó correctamente la Minuta',
                icon: 'success',
                confirmButtonColor: '#22C55E',
                confirmButtonText: 'Continuar',
              }).then(() => window.location.reload());
            })
            .catch(error => {
              console.error('Error al eliminar:', error);
              Swal.fire({
                title: '¡Error!',
                text: 'Error al Eliminar la minuta.',
                icon: 'error',
                confirmButtonColor: "#d33",
                confirmButtonText: 'Cerrar',
              });
            });
        } else {
          Swal.fire({
            title: '¡Minuta No Eliminada!',
            text: 'No se ha Eliminado la Minuta.',
            icon: 'info',
          });
        }
      });
    } else {
      console.log('Error')
    }

  };

  // Terminar Minuta
  const handleTerminarClick = (id) => {
    // Get data
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/minutes/${id}`);
        console.log(response.data.conclusion)
        if (response.data) {
          if (response.data.conclusion !== undefined) {
            const datosMinuta = {
              ...response.data,
              estatus: "Inactivo"
            };
            Swal.fire({
              title: '¿Desea Terminar la Minuta?',
              text: 'La minuta se dará por Terminada y la información no podrá ser modificada, se recomienda hacer una revisión y verificar que todo está en orden.',
              icon: 'question',
              confirmButtonColor: '#22C55E',
              confirmButtonText: 'Sí, terminar',
              showCancelButton: true,
              cancelButtonText: 'No, cancelar',
            }).then((result) => {
              if (result.isConfirmed) {
                axios.put(`${ apiUrl }/minutes/${id}`, datosMinuta)
                  .then(response => {
                    Swal.fire({
                      title: 'Minuta Terminada',
                      text: 'La minuta se dio por Terminada correctamente.',
                      icon: 'success',
                      confirmButtonColor: '#22C55E',
                      confirmButtonText: 'Continuar',
                    }).then(() => window.location.reload());
                  })
                  .catch(error => {
                    console.error('Error al guardar los datos:', error);
                    Swal.fire({
                      title: '¡Error!',
                      text: 'Error al terminar Minuta.',
                      icon: 'error',
                      confirmButtonColor: "#d33",
                      confirmButtonText: 'Cerrar'
                    });
                  });
              }
            });
          } else {
            Swal.fire({
              title: 'Minuta Sin Conclusión',
              text: 'La minuta no cuenta con conclusión, se debe añadir una para poder ser dada por Terminada.',
              icon: 'error',
              confirmButtonColor: '#22C55E',
              confirmButtonText: 'Continuar',
            })
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchData();

  };

  return (
    <Card className='flex flex-col justify-between w-full mb-4'>
      <div className='flex h-full'>
        <div className={minuta.usuario_id.find(user => user === minuta.User) || minuta.responsable === minuta.User ? `flex flex-col w-2/3 justify-center gap-1` : `flex flex-col w-full justify-center gap-1`}>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Tema:</Title>
            <Text>{minuta.tema}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Area:</Title>
            <Text>{minuta.area}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Fecha:</Title>
            <Text>{minuta.fecha}</Text>
          </div>
          <div className='flex items-center gap-1'>
            <Title className='!text-sm'>Hora:</Title>
            <Text>{minuta.hora}</Text>
          </div>
        </div>
        <div className={minuta.usuario_id.find(user => user === minuta.User) || minuta.responsable === minuta.User ? `w-1/3 flex flex-col gap-2` : `hidden`}>
          <Button
            className={minuta.responsable === minuta.User ? `w-full` : `hidden`}
            icon={ PencilIcon }
            iconPosition='left'
            color='blue'
            size='xs'
            variant='secondary'
            onClick={() => router.push(`/dash/minuta/editar/${minuta._id}`)}
          >
            Editar
          </Button>
          <Button
            className={minuta.usuario_id.find(user => user === minuta.User) && minuta.responsable !== minuta.User ? `w-full` : `hidden`}
            icon={ EyeIcon }
            iconPosition='left'
            color='blue'
            size='xs'
            variant='secondary'
            onClick={() => router.push(`/dash/minuta/ver/${minuta._id}`)}
          >
            Ver
          </Button>
          <Button
            className={minuta.usuario_id.find(user => user === minuta.User) || minuta.responsable === minuta.User ? `w-full` : `hidden`}
            icon={ ChevronDoubleRightIcon }
            iconPosition='right'
            color='blue'
            size='xs'
            variant='secondary'
            onClick={() => router.push(`/dash/minuta/${minuta._id}`)}
          >
            Detalles
          </Button>
          <Button
            className='w-full'
            icon={ TrashIcon }
            iconPosition='left'
            color='red'
            size='xs'
            onClick={() => handleEliminarClick(minuta._id)}
            disabled={minuta.responsable === minuta.User ? false : true}
          >
            Eliminar
          </Button>
        </div>
      </div>
      <div className={minuta.usuario_id.find(user => user === minuta.User) || minuta.responsable === minuta.User ? `w-full mt-2` : `hidden`}>
        <Button
          className='w-full'
          icon={ AiFillCheckCircle }
          iconPosition='left'
          color='green'
          size='xs'
          onClick={() => handleTerminarClick(minuta._id)}
          disabled={minuta.responsable === minuta.User ? false : true}
        >
          Terminar
        </Button>
      </div>
    </Card>
  );
};

export const Finalizada = (minuta) => {

  const router = useRouter();

  return (
    <Card className='flex flex-col justify-between w-full mb-4'>
      <div className='flex'>
        <div className='flex flex-col justify-center w-full gap-1'>
          <div className='flex items-center gap-2'>
            <Title className='!text-sm'>Tema:</Title>
            <Text>{minuta.tema}</Text>
          </div>
          <div className='flex items-center gap-2'>
            <Title className='!text-sm'>Area:</Title>
            <Text>{minuta.area}</Text>
          </div>
          <div className='flex items-center gap-2'>
            <Title className='!text-sm'>Fecha:</Title>
            <Text>{minuta.fecha}</Text>
          </div>
          <div className='flex items-center gap-2'>
            <Title className='!text-sm'>Hora:</Title>
            <Text>{minuta.hora}</Text>
          </div>
        </div>
      </div>
      <div className='w-full mt-2'>
        <Button
          className='w-full'
          icon={ AiFillFilePdf }
          iconPosition='left'
          color='blue'
          size='xs'
          onClick={() => router.push(`/dash/pdf/${minuta._id}`)}
        >
          PDF
        </Button>
      </div>
    </Card>
  );
};



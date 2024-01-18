"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AiFillCheckCircle,
  AiFillFilePdf,
} from 'react-icons/ai';
import EliminarMinuta from './actions/eliminarMinuta';
import TerminarMinuta from './actions/terminarMinuta';
import { Title, Text, Card, Button } from '@tremor/react';
import { PencilIcon, TrashIcon, ChevronDoubleRightIcon  } from '@heroicons/react/24/outline'
import Swal from 'sweetalert2';
import axios from 'axios';


export const Activa = (minuta) => {

  const router = useRouter();

  // const [eliminarMinutaVisible, setEliminarMinutaVisible] = useState(false);
  // const [terminarMinutaVisible, setTerminarMinutaVisible] = useState(false);

  // Eliminar Minuta
  const handleEliminarClick = (id) => {
    // e.preventDefault();
    // setEliminarMinutaVisible(true);
    if(id) {
      Swal.fire({
        title: 'Eliminar Minuta',
        text: '¿Deseas Eliminar la Minuta? Esta acción no podrá ser revertida.',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://localhost:3001/minutes/${id}`)
            .then(response => {
              console.log('Eliminación exitosa');
              Swal.fire({
                title: 'Minuta Eliminada',
                text: 'Se eliminó correctamente la Minuta',
                icon: 'success',
                confirmButtonColor: "#d33",
                confirmButtonText: 'Cerrar',
              }).then(() => {
                router.push('/dash/minutas');
              })
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
  const [minutaData, setMinutaData] = useState(null);
  const handleTerminarClick = (id) => {
    // Get data
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/minutes/${id}`);
        setMinutaData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    if (minutaData) {
      const datosMinuta = {
        ...minutaData,
        estatus: "Inactivo"
      };
      Swal.fire({
        title: 'Terminar Minuta',
        text: '¿Desea Terminar la Minuta?',
        icon: 'question',
        confirmButtonText: 'Sí, terminar',
        showCancelButton: true,
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.put(`http://localhost:3001/minutes/${id}`, datosMinuta)
            .then(response => {
              Swal.fire({
                title: 'Minuta Terminada',
                text: 'La Minuta se dio por Terminada Correctamente.',
                icon: 'success',
                confirmButtonColor: "#d33",
                confirmButtonText: 'Cerrar',
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
        } else {
          Swal.fire({
            title: 'Minuta No Terminada',
            text: 'No se ha dado por Terminada la Minuta.',
            icon: 'info',
          });
        }
      });
    }
  };
  if (minuta.estatus === "Activo") {
    return (
      <Card className='w-full mb-4 flex flex-col justify-between'>
        <div className='flex'>
          <div className='flex flex-col w-2/3 justify-center gap-1'>
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

          <div className="w-1/3 flex flex-col gap-2">
            <Button
              className='w-full'
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
              className='w-full'
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
            >
              Eliminar
            </Button>
            {/* {eliminarMinutaVisible && <EliminarMinuta id={minuta._id} />} */}
          </div>
        </div>
        <div className='w-full mt-2'>
          <Button
            className='w-full'
            icon={ AiFillCheckCircle }
            iconPosition='left'
            color='green'
            size='xs'
            onClick={() => handleTerminarClick(minuta._id)}
          >
            Terminar
          </Button>
          {/* {terminarMinutaVisible && <TerminarMinuta id={minuta._id} />} */}
        </div>
      </Card>
    );
  }
};

export const Finalizada = (minuta) => {

  const router = useRouter();

  if (minuta.estatus === "Inactivo") {
    return (
      <Card className='w-full mb-4 flex flex-col justify-between'>
        <div className='flex'>
          <div className='flex flex-col w-full justify-center gap-1'>
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
  }
};



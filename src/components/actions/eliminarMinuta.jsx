"use client"

import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function EliminarMinuta( props ) {
  const { id } = props;
  console.log(id);

  if(id) {
    Swal.fire({
      title: 'Eliminar Minuta',
      text: 'Deseas Eliminar la Minuta',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/minutes/${id}`)
          .then(response => {
            console.log('Eliminación exitosa');
            Swal.fire({
              title: 'Minuta Eliminado',
              text: 'Se eliminó correctamente la Minuta',
              icon: 'success',
              confirmButtonText: 'OK',
            })
          })
          .catch(error => {
            console.error('Error al eliminar:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Error al eliminar la Minuta',
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Minuta No Eliminada Denied',
          text: 'No se ha Eliminado la Minuta',
          icon: 'info',
        });
      } else if (result.isDismissed) {
        Swal.fire({
          title: 'Minuta No Eliminada Dismissed',
          text: 'No se ha Eliminado la Minuta',
          icon: 'info',
        });
      }
    });
  } else {
    console.log('Error')
  }

  return null;
}

export default EliminarMinuta;

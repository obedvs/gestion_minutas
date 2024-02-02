import { apiUrl } from '@/config/config';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ResponsableMinuta(props) {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [cargo, setCargo] = useState('');

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/users/${props.data.responsable}`);
        setNombreUsuario(response.data?.nombre + ' ' + response.data?.apellido_paterno + ' ' + response.data?.apellido_materno);
        setCargo(response.data?.cargo);

      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuario();
  },[props.data.responsable])

  return (
    <div className='contenedor'>
      <div className="cont1">
        <h3>RESPONSABLE ELABORACIÓN DE MINUTA</h3>
      </div>
      <table className='tResponsable'>
        <tbody>
          <tr>
            <td><b>Nombre</b>: {nombreUsuario}</td>
            <td><b>Fecha Próxima Reunión</b>: {props.data?.fechaProximaReunion}</td>
          </tr>
          <tr>
            <td><b>Cargo</b>: {cargo}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResponsableMinuta;

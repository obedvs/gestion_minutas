"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '@/config/config';

function PersonalInvitado(props) {
  const tamInvitados = props.data.usuario_id.length;
  const tamAcuerdos = props.dataAcu;
  const [usuarioData, setUsuariosData] = useState([]);
  const [signsData, setSignsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mapear los usuarios de manera asíncrona
        const promiseUsuarios = props.data.usuario_id.map(async (usuario) => {
          const responseUsuario = await axios.get(`${ apiUrl }/users/${usuario}`);
          return responseUsuario.data;
        });

        // Obtener datos de firmas
        const responseSigns = await axios.get(`${ apiUrl }/signs/${props.data._id}`);
        const signData = responseSigns.data;

        // Esperar a que se completen todas las solicitudes de usuarios
        const usuariosData = await Promise.all(promiseUsuarios);

        // Actualizar los estados
        setUsuariosData(usuariosData);
        setSignsData(signData);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [props.data.usuario_id, props.data._id]);

  const wordsCount = props.data.descripcion.trim().split(/\s+/).length;
  const invitados = usuarioData.map((item, index) => {
    let className = "cuart2-bod";
    if (wordsCount <= 149) {}
    if (wordsCount >= 150 && wordsCount < 180) {
      if (index === 14 || index === 30) {
        className += " pepe1";
      } else if (index === 15 || index === 32) {
        className += " pepe";
      }
    } else if (wordsCount >= 180 && wordsCount < 200) {
      if (index === 0) {
        className += " pepe1";
      } else if (index === 1) {
        className += " pepe";
      }
    }

    // Obtener la cadena del array signsData
    const token = signsData.find(minute => minute.user_id === item._id)?.sign || "";

    // Obtener la longitud de la cadena
    const tokenLength = token.length;

    // Dividir la cadena a la mitad y agregar un espacio
    const tokenFormatted = tokenLength !== 0 ? token.slice(0, tokenLength / 2) + " " + token.slice(tokenLength / 2) : "";

    return (
      <div className={className} id={index === 14 || index === 31 ? "elementoSiguiente2" : ""} key={index}>
        <div className="centercontent">{index === 14 ? "a---" : index === 15 ? "b---" : ""}{item.nombre} {item.apellido_paterno} {item.apellido_materno}</div>
        <div className="centercontent">{item.cargo}</div>
        <div className="centercontent noborder">
          <p>{tokenFormatted}</p>
        </div>
      </div>
    );
  });

  const containerClassName =
    (tamInvitados >= 9 && tamInvitados <= 15) ||
    (tamInvitados >= 18 && tamAcuerdos >= 10) ||
    tamInvitados >= 25
      ? "contenedor pepe1"
      : "contenedor pepe";

  return (
    <div className={containerClassName} id={(tamInvitados >= 9 && tamInvitados <= 15) || (tamInvitados >= 18 && tamAcuerdos >= 10) || tamInvitados >= 25 ? "elementoSiguiente2" : ""}>
      <div className="cont1">
        <h3>ASISTENTES</h3>
      </div>

      <div className="cuart-cont2">
        <div className="cuart1-cab">
          <div className="center">
            <h5>NOMBRE</h5>
          </div>
          <div className="center">
            <h5>CARGO</h5>
          </div>
          <div className="center noborder">
            <h5>FIRMA O MOTIVO DE INASISTENCIA</h5>
          </div>
        </div>
        {invitados}
      </div>
    </div>
  );
}

export default PersonalInvitado;

"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PersonalInvitado(props) {
  const tamañoInvitados = props.data.usuario_id.length;
  console.log(tamañoInvitados);
  const tamAcuerdos = props.dataAcu;
  const [usuarioData, setUsuariosData] = useState([]);
  const [signsData, setSignsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mapear los usuarios de manera asíncrona
        const promiseUsuarios = props.data.usuario_id.map(async (usuario) => {
          const responseUsuario = await axios.get(`/api/users/${usuario}`);
          return responseUsuario.data;
        });

        // Obtener datos de firmas
        const responseSigns = await axios.get(`/api/signs/${props.data._id}`);
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
  console.log('usuarioData', usuarioData);
  console.log('signsData', signsData);
  const invitados = usuarioData.map((item, index) => {
    let className = "cuart2-bod";
    if (wordsCount <= 149) {}
    if (wordsCount >= 150 && wordsCount < 180) {
      if (index === 14 || index === 30) {
        className += " pepe1 p-2";
      } else if (index === 15 || index === 32) {
        className += " pepe p-2";
      }
    } else if (wordsCount >= 180 && wordsCount < 200) {
      if (index === 0) {
        className += " pepe1 p-2";
      } else if (index === 1) {
        className += " pepe p-2";
      }
    }

    return (
      <div className={className} id={index === 14 || index === 31 ? "elementoSiguiente2" : ""} key={index}>
        <div className="center p-2">{index === 14 ? "a---" : index === 15 ? "b---" : ""}{item.nombre} {item.apellido_paterno} {item.apellido_materno}</div>
        <div className="center p-2">{item.cargo}</div>
        <div className="center p-2">
          <p>{signsData.find(minute => minute.user_id === item._id)?.sign || ""}</p>
        </div>
      </div>
    );
  });

  const containerClassName =
    (tamañoInvitados >= 9 && tamañoInvitados <= 15) ||
    (tamañoInvitados >= 18 && tamAcuerdos >= 10) ||
    tamañoInvitados >= 25
      ? "contenedor personalInvitado pepe1"
      : "contenedor personalInvitado pepe";

  return (
    <div className={containerClassName} id={(tamañoInvitados >= 9 && tamañoInvitados <= 15) || (tamañoInvitados >= 18 && tamAcuerdos >= 10) || tamañoInvitados >= 25 ? "elementoSiguiente2" : ""}>
      <div className="cont1 p-2 bg-red-600 text-white h-16 flex justify-center items-center">
        <h3>Personal Invitado a la Reunión</h3>
      </div>

      <div className="cuart-cont2">
        <div className="cuart1-cab flex justify-between">
          <div className="center p-2 w-1/3">
            <h5 className="font-bold ">Nombre</h5>
          </div>
          <div className="center w-1/3 p-2">
            <h5 className="font-bold">Cargo</h5>
          </div>
          <div className="center w-1/3 p-2">
            <h5 className="font-bold">Firma</h5>
          </div>
        </div>
        {invitados}
      </div>
    </div>
  );
}

export default PersonalInvitado;

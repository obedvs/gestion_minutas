import React from 'react';

function AcuerdosGenerados(props) {
  const tamaño = props.data.usuario_id.length;
  const tamAcuerdos = props.dataAcu;

  const containerClass = (tamAcuerdos >= 15) || (tamaño >= 17 && tamAcuerdos >= 20) || tamaño >= 30
    ? "contenedor bu pepe"
    : "contenedor bu";

  return (
    <div className={containerClass}>
      <div className="cont1 bg-red-600 text-white h-16 flex justify-center items-center">
        <h3>Acuerdos generados en la última reunión</h3>
      </div>
      <div className="cuart-cont2">
        <div className="cuart1-cab flex justify-between">
          <div className="center w-1/3 p-2">
            <h5 className="font-bold">Acuerdo</h5>
          </div>
          <div className="center w-1/3 p-2">
            <h5 className="font-bold">Responsable</h5>
          </div>
          <div className="center w-1/3 p-2">
            <h5 className="font-bold">Fecha de Compromiso</h5>
          </div>
        </div>
        <div className="cuart2-bod">
          <div className="center p-2">Mejorar la Dinámica que tiene el sitio</div>
          <div className="center p-2">Oscar Alfredo Diaz</div>
          <div className="center p-2">
            <p>2023-05-05</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcuerdosGenerados;

import React from 'react';

function InformacionGeneral(props) {
  console.log(props.data.tema);
  return (
    <div className="contenedor">
      <div className="cont1 bg-red-600 text-white h-16 flex justify-center items-center p-2">
        <h3>Información General</h3>
      </div>
      <div className="seg-cont2 flex">
        <div className="border border-black w-full p-2">
          <p><b>Tema</b>: {props.data.tema}</p>
        </div>
        <div className="border border-black w-full p-2">
          <p><b>Area</b>: {props.data.area}</p>
        </div>
        <div className="seg-cont2-izq w-1/2 flex flex-col">
          <div className="border border-black w-full p-2">
            <p><b>Hora</b>: {props.data.hora}</p>
          </div>
          <div className="lugar border-t border-black w-full p-2">
            <p><b>Lugar</b>: {props.data.lugar}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformacionGeneral;

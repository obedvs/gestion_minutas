import React from 'react';

function InformacionGeneral(props) {
  console.log(props.data.tema);
  return (
    <div className="contenedor">
      <div className="cont1">
        <h3>Información General</h3>
      </div>
      <div className="seg-cont2">
        <div>
          <p><b>Tema</b>: {props.data.tema}</p>
        </div>
        <div>
          <p><b>Area</b>: {props.data.area}</p>
        </div>
        <div className="seg-cont2-izq">
          <div>
            <p><b>Hora</b>: {props.data.hora}</p>
          </div>
          <div className="lugar">
            <p><b>Lugar</b>: {props.data.lugar}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformacionGeneral;

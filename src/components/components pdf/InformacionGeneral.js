import React from 'react';

function InformacionGeneral(props) {
  console.log(props.data.tema);
  return (
    <div className="contenedor">
      <table className='tGeneral'>
        <tbody>
          <tr>
            <td><b>Lugar:</b>: {props.data.lugar}</td>
            <td><b>Hora Inicial</b>: {props.data.hora}</td>
          </tr>
          <tr>
            <td><b>Fecha</b>: {props.data.fecha}</td>
            <td><b>Hora Final</b>: </td>
          </tr>
          <tr>
            <td><b>Objetivo</b>: {props.data.tema}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InformacionGeneral;

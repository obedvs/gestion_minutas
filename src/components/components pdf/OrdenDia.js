import React from 'react';

function ResponsableMinuta(props) {

  return (
    <div className='contenedor'>
      <div className="cont1">
        <h3>RESPONSABLE ELABORACIÓN DE MINUTA</h3>
      </div>
      <table className='tResponsable'>
        <tbody>
          <tr>
            <td><b>Nombre</b>:</td>
            <td><b>Fecha próxima reunión</b>:</td>
          </tr>
          <tr>
            <td><b>Cargo</b>:</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResponsableMinuta;

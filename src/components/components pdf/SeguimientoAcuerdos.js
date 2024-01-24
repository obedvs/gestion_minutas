import React from 'react';
import parser from 'html-react-parser';

function SeguimientoAcuerdos(props) {
  const tamaño = props.data && props.data.usuario_id ? props.data.usuario_id.length : 0;
  const tamAcuerdos = props.dataAcu;

  const estatusAcuerdos = tamAcuerdos.map((acuerdo) => {
    return acuerdo;
  });

  const acuerdos = estatusAcuerdos.map((item, index) => {
    const className =
      index === 18
        ? 'cuart2-bod pepe1'
        : index === 19
        ? 'cuart2-bod pepe'
        : 'cuart2-bod';

    return (
      <div className={className} id={index === 18 ? 'elementoSiguiente2' : null} key={index}>
        <div className='center'>{item.acuerdo}</div>
        <div className='center'>{item.estatus}</div>
        <div className='center noborder'>
          {parser(item.descripcion || "<p>No existe el reporte de estado</p>")}
        </div>
      </div>
    );
  });

  const renderizadoCondicionado =
    tamAcuerdos >= 15 ||
    (tamaño >= 17 && tamAcuerdos >= 20) ||
    (tamaño >= 27 && tamaño < 30)
      ? 'pepe1'
      : (tamaño >= 12 && tamaño < 15) || (tamaño >= 18 && tamAcuerdos >= 10) || tamaño >= 30
      ? 'pepe'
      : '';

  return (
    <div className={`contenedor ${renderizadoCondicionado}`} id={tamAcuerdos >= 15 ? 'elementoSiguiente2' : null}>
      <div className='cont1'>
        <h3>Seguimiento de Acuerdos Anteriores</h3>
      </div>
      <div className='cuart-cont2'>
        <div className='cuart1-cab'>
          <div className='center'>
            <h5>Acuerdo</h5>
          </div>
          <div className='center'>
            <h5>Estado</h5>
          </div>
          <div className='center noborder'>
            <h5>Reporte de Estado</h5>
          </div>
        </div>
        {acuerdos}
      </div>
    </div>
  );
}

export default SeguimientoAcuerdos;

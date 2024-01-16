import React from 'react';
import parser from 'html-react-parser';

function OrdenDia(props) {
  if (props.data.descripcion) {
    var ordenBD = props.data.descripcion;
  } else {
    var ordenBD = "";
  }
  const wordsCount = ordenBD.trim().split(/\s+/).length;

  const hasReached100Words = wordsCount >= 150;
  const pepeClass = hasReached100Words ? "pepe" : "";
  const pepeId = hasReached100Words ? "elementoSiguiente2" : "";

  return (
    <div className={`contenedor ordenDia ${pepeClass}`} id={pepeId}>
      <div className="cont1 bg-red-600 text-white h-16 flex justify-center items-center p-1">
        <h3>Órden del Día</h3>
      </div>
      <div className="ter-cont2 p-1">
        {parser(props.data.descripcion || "<p>No existe orden del dia</p>")}
      </div>
    </div>
  );
}

export default OrdenDia;

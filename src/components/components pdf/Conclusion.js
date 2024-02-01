import React from 'react';
import parser from 'html-react-parser';

function Conclusion(props) {
  const tamaño = props.data.usuario_id.length;
  const tamAcuerdos = props.dataAcu.length;
  // const lengCon = props.data.conclusion.length;
  const containerClass = (tamAcuerdos>=5 && tamaño>=3) || (tamAcuerdos >= 15) || (tamaño >= 17 && tamAcuerdos >= 20) || tamaño >= 30
    ? "contenedor bu pepe"
    : "contenedor bu";

  if (props.data.conclusion) {
    var conclusionBD = props.data.conclusion;
    
  } else {
    var conclusionBD = "No existen asuntos tratados";
  }
  return (
    <div className={`contenedor ordenDia ${containerClass}`} >
      <div className="cont1">
        <h3>ASUNTOS TRATADOS</h3>
      </div>
      <div className="ter-cont2">
        {parser(conclusionBD || "<p>No existen asuntos tratados</p>")}
      </div>
    </div>
  );
  
}

export default Conclusion;

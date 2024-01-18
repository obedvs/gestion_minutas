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
    var conclusionBD = "No existe conclusión";
  }
  return (
    <div className={`contenedor ordenDia ${containerClass}`} >
      <div className="cont1 bg-red-600 text-white h-16 flex justify-center items-center">
        <h3>Conclusión</h3>
      </div>
      <div className="ter-cont2 p-2">
        {parser(conclusionBD || "<p>No existe conclusion</p>")}
      </div>
    </div>
  );
  
}

export default Conclusion;

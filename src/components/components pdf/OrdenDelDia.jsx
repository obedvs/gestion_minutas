import parser from 'html-react-parser';

function OrdenDelDia(props) {

  let descripcionBD = '';

  if (props.data.descripcion) {
    descripcionBD = props.data.descripcion;
    
  } else {
    descripcionBD = "No existe una Orden del Día.";
  }
  return (
    <div className={`contenedor ordenDia`} >
      <div className="cont1">
        <h3>ORDEN DEL DÍA</h3>
      </div>
      <div className="ter-cont2">
        {parser(descripcionBD || "<p>No existe una Orden del Día.</p>")}
      </div>
    </div>
  );
  
}

export default OrdenDelDia;

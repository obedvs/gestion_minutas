import React from 'react';
// import logo from '/assets/img/logoujed.png';

function Uni(props) {
  return (
    <div className="contenedor">
      <div className="cont1">
        <h3>Universidad Juárez del Estado de Durango</h3>
      </div>
      <div className="cont2">
        <div className="cont-der">
          <img src="/assets/img/logoujed.png" alt="Logo UJED"/>
        </div>
        <div className="cont-medio">
          <div className="c1">
            <h3>Órden del Día</h3>
          </div>
          <div className="c2">
            <h3>{props.data.asunto}</h3>
          </div>
        </div>
        <div className="cont-izq">
          <div className="izq1">
            <p><b>Código</b>: R9.3, B</p>
          </div>
          <div className="izq2">
            <p><b>Edición</b>: 1</p>
          </div>
          <div className="izq3">
            <p><b>Fecha</b>: 2023-05-04</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uni;

import React from 'react';
// import logo from '/assets/img/logoujed.png';

function Uni(props) {
  return (
    <div className="contenedor">
      <div className="cont1 bg-red-600 text-white h-16 flex justify-center items-center">
        <h3>Universidad Juárez del Estado de Durango</h3>
      </div>
      <div className="cont2 flex">
        <div className="cont-der w-1/4 flex justify-center items-center">
          <img src="/assets/img/logoujed.png" alt="Logo UJED" width="100" height="100" />
        </div>
        <div className="cont-medio w-4/5 ">
          <div className="c1 center p-2 border border-black border-b-0 border-t-0">
            <h3>Órden del Día</h3>
          </div>
          <div className="c2 p-2 center border border-black h-16 border-b-0">
            <h3>{props.data.asunto}</h3>
          </div>
        </div>
        <div className="cont-izq w-1/3 flex flex-col">
          <div className="izq1 p-2 h-16 flex items-center pl-5">
            <p><b>Código</b>: R9.3, B</p>
          </div>
          <div className="izq2 p-2 border border-black h-full flex items-center pl-5 border-b-0 border-l-0 border-r-0">
            <p><b>Edición</b>: 1</p>
          </div>
          <div className="izq3 p-2 border border-black h-full flex items-center pl-5 border-b-0 border-l-0 border-r-0">
            <b>Fecha</b>: 2023-05-04
          </div>
        </div>
      </div>
    </div>
  );
}

export default Uni;

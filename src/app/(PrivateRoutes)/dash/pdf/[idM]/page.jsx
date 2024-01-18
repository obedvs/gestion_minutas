"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "@/styles/pdf.css";
import InformacionGeneral from '@/components/components pdf/InformacionGeneral';
import Uni from "@/components/components pdf/Uni";
import OrdenDia from "@/components/components pdf/OrdenDia";
import PersonalInvitado from "@/components/components pdf/PersonalInvitado";
import SeguimientoAcuerdos from "@/components/components pdf/SeguimientoAcuerdos";
import Conclusion from "@/components/components pdf/Conclusion";
import html2pdf from 'html2pdf.js';

const generatePDF = async (idM) => {
  const element = document.getElementById('divToPrint');

  try {
    const pdfBlob = await html2pdf().from(element).set({
      margin: 5,
      filename: `archivo-${idM}.pdf`,
      jsPDF: {
        format: 'letter',
        orientation: 'portrait',
      },
      html2canvas: {},
      pagebreak: {
        before: '#elementoSiguiente',
        after: '#elementoSiguiente2',
      },
      pageMargins: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
      onBeforeSave: function () {
        var style = document.createElement('style');
        style.innerHTML = `
          .pagina {
            padding: 20px;
          }
          .elementoSiguiente-pagebreak {
            page-break-after: avoid;
          }
        `;
        document.head.appendChild(style);
      },
    })
    .toPdf()
    .output('blob')
    .then(async (pdfBlob) => {
      const formData = new FormData();
      formData.append('pdf', new Blob([pdfBlob], { type: 'application/pdf' }), `archivo-${idM}.pdf`);

      await axios.post(`http://62.72.1.33:3001/save-pdf/${idM}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    })
  } catch (error) {
    console.error(error);
  }
};

const PDFViewer = ({ params }) => {
  const { idM } = params;
  const [minutaData, setMinutaData] = useState(null);
  const [acuerdoData, setAcuerdoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMinuta = await axios.get(`http://62.72.1.33:3001/minutes/${idM}`);
        setMinutaData(responseMinuta.data);
        const responseAcuerdos = await axios.get(`http://62.72.1.33:3001/agreement`);
        const acuerdosFiltrados = responseAcuerdos.data.filter(
          (element) => element.minuta_id === responseMinuta.data._id
        );
        setAcuerdoData(acuerdosFiltrados);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [idM]);

  if (minutaData) {
    return (
      <div >
        <div className="cont-general" id="divToPrint">
          <section className="part1">
            {minutaData && acuerdoData ? (
              <>
                <Uni data={minutaData} />
                <InformacionGeneral data={minutaData} dataAcu={acuerdoData} />
                <OrdenDia data={minutaData} dataAcu={acuerdoData} />
                <PersonalInvitado data={minutaData} dataAcu={acuerdoData} />
              </>
            ) : (
              <p>Cargando datos...</p>
            )}
          </section>
          <section className="part2">
            {minutaData &&acuerdoData ? (
              <>
                <SeguimientoAcuerdos data={minutaData} dataAcu={acuerdoData} />
                <Conclusion data={minutaData} dataAcu={acuerdoData} />
              </>
            ) : (
              <p>Cargando datos...</p>
            )}
          </section>
        </div>
        <button
          onClick={() => generatePDF(idM)}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Generar PDF
        </button>
      </div>
    );
  } else {
    return <p>Error</p>;
  }
};

export default PDFViewer;
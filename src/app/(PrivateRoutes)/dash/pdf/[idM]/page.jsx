"use client"

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import "@/styles/pdf.css";
import InformacionGeneral from '@/components/components pdf/InformacionGeneral';
import Uni from "@/components/components pdf/Uni";
import OrdenDia from "@/components/components pdf/OrdenDia";
import PersonalInvitado from "@/components/components pdf/PersonalInvitado";
import SeguimientoAcuerdos from "@/components/components pdf/SeguimientoAcuerdos";
import Conclusion from "@/components/components pdf/Conclusion";
import html2pdf from 'html2pdf.js';
import { apiUrl } from '@/config/config';


const PDFViewer = ({ params }) => {
  const { idM } = params;
  const [minutaData, setMinutaData] = useState(null);
  const [acuerdoData, setAcuerdoData] = useState([]);

  const divToPrint = useRef(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseMinuta = await axios.get(`${ apiUrl }/minutes/${idM}`);
        setMinutaData(responseMinuta.data);
        const responseAcuerdos = await axios.get(`${ apiUrl }/agreement`);
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
  
  const generatePDF = async (idM) => {
    const element = divToPrint.current;

    if (element) {
      const pdfOptions = {
        margin: 5,
          filename: `archivo-${idM}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 3,
            letterRendering: true,
          },
          jsPDF: {
            unit: 'mm',
            format: 'letter',
            orientation: 'portrait',
          },
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
      }
      try {
        const pdfBlob = await html2pdf().from(element).set(pdfOptions)
        .toPdf()
        .output('blob')
        .then(async (pdfBlob) => {
          const formData = new FormData();
          formData.append('pdf', new Blob([pdfBlob], { type: 'application/pdf' }), `archivo-${idM}.pdf`);
    
          await axios.post(`${ apiUrl }/save-pdf/${idM}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        })
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (minutaData) {
    return (
      <div >
        <div className="cont-general" ref={divToPrint}>
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
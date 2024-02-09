"use client"

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Button, Icon, Metric } from '@tremor/react';
import { ArrowUturnLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { apiUrl } from '@/config/config';
import "@/styles/pdf.css";
import Uni from "@/components/components pdf/Uni";
import InformacionGeneral from '@/components/components pdf/InformacionGeneral';
import OrdenDelDia from '@/components/components pdf/OrdenDelDia';
import PersonalInvitado from "@/components/components pdf/PersonalInvitado";
import Conclusion from "@/components/components pdf/Conclusion";
import SeguimientoAcuerdos from "@/components/components pdf/SeguimientoAcuerdos";
import ResponsableMinuta from "@/components/components pdf/ResponsableMinuta";
import Loading from './loading';

const PDFViewer = ({ params }) => {

  const router = useRouter();

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
          // onBeforeSave: function () {
          //   var style = document.createElement('style');
          //   style.innerHTML = `
          //     .pagina {
          //       padding: 20px;
          //     }
          //     .elementoSiguiente-pagebreak {
          //       page-break-after: avoid;
          //     }
          //   `;
          //   document.head.appendChild(style);
          // },
      }
      try {
        const pdfBlob = await html2pdf().from(element).set(pdfOptions)
        .toPdf()
        .output('blob');

        const formData = new FormData();
        formData.append('pdf', new Blob([pdfBlob], { type: 'application/pdf' }), `archivo-${idM}.pdf`);
    
        const response = await axios.post(`${ apiUrl }/save-pdf/${idM}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });

        // Maneja la respuesta del servidor
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        downloadLink.href = url;
        downloadLink.setAttribute('download', `archivo-${idM}.pdf`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        Swal.fire({
          title: '¡PDF Generado!',
          text: 'El PDF se ha generado, guardado y descargado exitosamente.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#22C55E",
          confirmButtonText: 'Continuar',
        })
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: '¡Error al generar PDF!',
          text: 'Se ha producido un error al intentar generar o guardar el PDF.',
          icon: 'error',
          showConfirmButton: false,
          cancelButtonText: 'Cerrar',
        });
      }
    }
  };

  if (minutaData) {
    return (
      <div className='flex flex-col justify-center items-center' >
        <div className='md:flex w-full max-w-[8.5in] justify-around'>
          <div className='w-full md:w-1/6'>
            <Icon className='w-10 h-10 cursor-pointer' 
              icon={ ArrowUturnLeftIcon } 
              onClick={ () => router.back() } 
              variant='solid' 
              color='red'
              tooltip='Regresar'
            />
          </div>
          <Metric className='w-full md:w-4/6 text-center mb-3 md:mb-0'>Previsualización de la Minuta</Metric>
          <Button onClick={() => generatePDF(idM)}
            className="w-full md:w-1/6 focus:outline-none focus:shadow-outline"
            // className="w-full md:w-1/4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            icon={DocumentArrowDownIcon}
            iconPosition="right"
            variant='primary'
            color='green'
            tooltip="Generar, guardar y descargar PDF."
          >PDF</Button>
        </div>
        <Suspense fallback={<Loading/>}>
          <div className="cont-general" ref={divToPrint}>
            <section className="part1">
              {minutaData && acuerdoData ? (
                <>
                  <Uni />
                  <InformacionGeneral data={minutaData} dataAcu={acuerdoData} />
                  <OrdenDelDia data={minutaData} dataAcu={acuerdoData} />
                  <PersonalInvitado data={minutaData} dataAcu={acuerdoData} />
                </>
              ) : (
                <Loading/>
                )}
            </section>
            <section className="part2">
              {minutaData && acuerdoData ? (
                <>
                  <Conclusion data={minutaData} dataAcu={acuerdoData} />
                  <SeguimientoAcuerdos data={minutaData} dataAcu={acuerdoData} />
                  <ResponsableMinuta data={minutaData} dataAcu={acuerdoData} />
                </>
              ) : (
                <Loading/>
              )}
            </section>
          </div>
        </Suspense>
      </div>
    );
  } else {
    return <Loading/>;
  }
};

export default PDFViewer;
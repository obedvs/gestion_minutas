"use client"

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
// import html2pdf from 'html2pdf.js';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Button, Icon, Metric } from '@tremor/react';
import { ArrowUturnLeftIcon, DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
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
      }
      try {
        // Condicionar la importación para prevenir error
        if (typeof window !== 'undefined') {
          const html2pdf = require('html2pdf.js');
          
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
          // downloadLink.click();
          document.body.removeChild(downloadLink);
  
          Swal.fire({
            title: '¡PDF Generado!',
            text: 'El PDF se ha generado y guardado exitosamente.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#22C55E",
            confirmButtonText: 'Continuar',
          })
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: '¡Error al generar PDF!',
          text: 'Se ha producido un error al intentar generar o guardar el PDF.',
          icon: 'error',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Cerrar',
        });
      }
    }
  };

  const downloadPDF = async (idM) => {
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
      }
      try {
        // Condicionar la importación para prevenir error
        if (typeof window !== 'undefined') {
          const html2pdf = require('html2pdf.js');
          await html2pdf().from(element).set(pdfOptions).save();
  
          Swal.fire({
            title: '¡Descargando PDF!',
            text: 'La descarga del PDF ha comenzado.',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: "#22C55E",
            confirmButtonText: 'Continuar',
          })
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: '¡Error al generar PDF!',
          text: 'Se ha producido un error al intentar generar o guardar el PDF.',
          icon: 'error',
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: 'Cerrar',
        });
      }
    }
  };

  if (minutaData) {
    return (
      <div className='flex flex-col justify-center items-center' >
        <div className='md:flex w-full max-w-[8.5in] justify-around items-center'>
          <div className='w-full md:w-1/12'>
            <Icon className='w-10 h-10 cursor-pointer' 
              icon={ ArrowUturnLeftIcon } 
              onClick={ () => router.back() } 
              variant='solid' 
              color='red'
              tooltip='Regresar'
            />
          </div>
          <Metric className='w-full md:w-8/12 text-center mb-3 md:mb-0'>Previsualización de la Minuta</Metric>
          <div className='w-full md:w-3/12'>
            <Button onClick={() => generatePDF(idM)}
              className="w-full focus:outline-none mb-2"
              icon={DocumentArrowUpIcon}
              iconPosition="right"
              variant='primary'
              color='blue'
              tooltip="Generar PDF."
            ><span className=''>Generar </span>PDF</Button>
            <Button onClick={() => downloadPDF(idM)}
              className="w-full focus:outline-none"
              icon={DocumentArrowDownIcon}
              iconPosition="right"
              variant='primary'
              color='emerald'
              tooltip="Descargar PDF."
            ><span className=''>Descargar </span>PDF</Button>
          </div>
        </div>
        <div className="cont-general" ref={divToPrint}>
          <Suspense fallback={<Loading/>}>
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
          </Suspense>
          <Suspense fallback={<Loading/>}>
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
          </Suspense>
        </div>
      </div>
    );
  } else {
    return <Loading/>;
  }
};

export default PDFViewer;
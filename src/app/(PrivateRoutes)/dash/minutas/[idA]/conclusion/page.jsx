"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import html2pdf from 'html2pdf.js';
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Divider, Icon, Title, Subtitle, MultiSelect, MultiSelectItem, TextInput, Metric } from "@tremor/react";
import { ArrowUturnLeftIcon, DocumentArrowDownIcon, DocumentIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { apiUrl } from "@/config/config";
import "@/styles/pdf.css";
import EditText from "@/components/rich_text";
import Loading from "@/components/Loading";
import Uni from "@/components/components pdf/Uni";
import InformacionGeneral from "@/components/components pdf/InformacionGeneral";
import PersonalInvitado from "@/components/components pdf/PersonalInvitado";
import Conclusion from "@/components/components pdf/Conclusion";
import SeguimientoAcuerdos from "@/components/components pdf/SeguimientoAcuerdos";
import ResponsableMinuta from "@/components/components pdf/OrdenDia";

const ConclusionMinuta = ({ params }) => {

  const router = useRouter();

  const idUserCoockie = Cookies.get('idUser');

  const [conclusion, setConclusion] = useState('');
  const [fechaProximaReunion, setFechaProximaReunion] = useState("");
  const [usersData, setUserData] = useState([]);
  const [minutaData, setMinutaData] = useState(null);
  const [acuerdoData, setAcuerdoData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setFechaProximaReunion(e.target.value);
  };

  const divToPrint = useRef(null);

  const { idA } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/minutes/${idA}`);
        setConclusion(response?.data?.conclusion);
        setFechaProximaReunion(response?.data?.fechaProximaReunion);
        setMinutaData(response?.data);
        const responseAcuerdos = await axios.get(`${ apiUrl }/agreement`);
        const acuerdosFiltrados = responseAcuerdos.data.filter(
          (element) => element.minuta_id === response.data._id
        );
        setAcuerdoData(await Promise.all(acuerdosFiltrados));
        const promiseUsuarios = response.data.usuario_id.map(async (usuario) => {
          const responseUsuario = await axios.get(`${ apiUrl }/users/${usuario}`);
          return responseUsuario.data;
        });
        const usuariosData = await Promise.all(promiseUsuarios);
        setUserData(usuariosData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const idM = idA;

  const generatePDF = async (idM) => {
    const element = divToPrint.current;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/minutes/${idM}`);
        setMinutaData(response?.data);
        const responseAcuerdos = await axios.get(`${ apiUrl }/agreement`);
        const acuerdosFiltrados = responseAcuerdos.data.filter(
          (element) => element.minuta_id === response.data._id
        );
        setAcuerdoData(await Promise.all(acuerdosFiltrados));
      } catch (error) {
        console.error(error);
      }
    };
    await fetchData();

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

      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEmails = (ids = []) => {
    if (ids.length === 0) return;
    const emails = ids.map((id) => usersData.find(user => user._id === id ).email);
    // TODO: CHANGE THIS TO THE REAL URL
    axios.post(`${ apiUrl }/send_email_2/${idM}`, {
      subject: "Firma de Minuta",
      guests: emails,
    })
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          title: 'Correos enviados',
          icon: 'success',
          confirmButtonText: 'Cool'
        }).then(() => {
          router.back();
        })
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Error al enviar los correos',
          icon: 'error',
          confirmButtonText: 'Cool'
        });
      }
    })
    .catch((error) => { console.error(error); });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (conclusion === '') return;
    try {
      const response = await axios.put(`${ apiUrl }/minutes/${idM}`, {
        conclusion, fechaProximaReunion
      });

      if (response.status !== 200) {
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Cool'
        });
        return;
      }

      Swal.fire({
        title: 'Información Guardada',
        text: 'Los datos se han guardado con exito.',
        icon: 'success',
        confirmButtonText: 'Continuar'
      }).then(() => {
        generatePDF(idM);
        handleEmails(selectedUsers);
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al guardar los datos',
        icon: 'error',
        confirmButtonText: 'Cool'
      });
    }
  };

  if (minutaData){
    return (
      <>
        <div className="flex justify-between">
          <Icon
            className="w-10 h-10 cursor-pointer"
            icon={ArrowUturnLeftIcon}
            onClick={() => router.back()}
            variant="solid"
            color="red"
            tooltip="Regresar"
          />
        </div>
  
        <Metric className="md:-mt-6 w-full text-center">Conclusiones de la reunion</Metric>
              <Divider className="mt-2"/>
        <EditText value={conclusion} setValue={setConclusion} read={minutaData.responsable === idUserCoockie ? false : true} />
  
        <Subtitle className="mt-2">Fecha Proxima Reunión</Subtitle>
        <TextInput
          className='w-full mt-1'
          label='Fecha'
          name='fechaProximaReunion'
          type='date'
          placeholder='Fecha'
          value={fechaProximaReunion}
          onChange={handleInputChange}
          // onChange={handleInputChange}
          disabled={minutaData.responsable === idUserCoockie ? false : true}
        />
  
        <Subtitle className="mt-2">Solicitar Firma:</Subtitle>
        <MultiSelect
          className="w-full mt-1"
          name="usuario_id"
          value={selectedUsers}
          onChange={setSelectedUsers}
          disabled={minutaData.responsable === idUserCoockie ? false : true}
        >
          {usersData.map((user) => (
            <MultiSelectItem key={user._id} value={user._id}>
              {user.nombre} {user.apellido_paterno} {user.apellido_materno} ({user.email})
            </MultiSelectItem>
          ))}
        </MultiSelect>
  
        <Button
          className="w-full mt-4"
          type="submit"
          color="green"
          icon={PaperAirplaneIcon}
          iconPosition="right"
          onClick={handleSubmit}
          disabled={minutaData.responsable === idUserCoockie ? false : true}
        >
          Guardar
        </Button>
        
        <div className='fixed flex flex-col justify-center items-center opacity-0' >
          <div className="cont-general" ref={divToPrint}>
            <section className="part1">
              {minutaData && acuerdoData ? (
                <>
                  <Uni />
                  <InformacionGeneral data={minutaData} dataAcu={acuerdoData} />
                  <PersonalInvitado data={minutaData} dataAcu={acuerdoData} />
                  <Conclusion data={minutaData} dataAcu={acuerdoData} />
                </>
              ) : (
                <p>Cargando datos...</p>
                )}
            </section>
            <section className="part2">
              {minutaData && acuerdoData ? (
                <>
                  <SeguimientoAcuerdos data={minutaData} dataAcu={acuerdoData} />
                  <ResponsableMinuta data={minutaData} dataAcu={acuerdoData} />
                </>
              ) : (
                <p>Cargando datos...</p>
              )}
            </section>
          </div>
        </div>
      </>
    );
  } else {
    return <Loading/>
  }
};

export default ConclusionMinuta;

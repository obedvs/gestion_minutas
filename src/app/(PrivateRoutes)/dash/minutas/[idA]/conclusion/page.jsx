"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Divider, Icon, Subtitle, MultiSelect, MultiSelectItem, TextInput, Metric } from "@tremor/react";
import { ArrowUturnLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { apiUrl } from "@/config/config";
import EditText from "@/components/rich_text";
import Loading from "@/components/Loading";

const ConclusionMinuta = ({ params }) => {

  const router = useRouter();
  const idFromSession = sessionStorage.getItem('idUser');

  const { idA } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/minutes/${idA}`);
        setConclusion(response?.data?.conclusion);
        setFechaProximaReunion(response?.data?.fechaProximaReunion);
        setMinutaData(response?.data);
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
  
  const [ conclusion, setConclusion ] = useState('');
  const [ fechaProximaReunion, setFechaProximaReunion ] = useState("");
  const [ usersData, setUserData ] = useState([]);
  const [ minutaData, setMinutaData ] = useState(null);
  const [ selectedUsers, setSelectedUsers ] = useState([]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setFechaProximaReunion(e.target.value);
  };


  const idM = idA;

  const handleEmails = (ids = []) => {
    if (ids.length === 0) {
      Swal.fire({
        title: 'No Se Seleccionaron Destinatarios',
        text: 'Debe seleccionar destinatario/s para continuar.',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: "Seleccionar Destinatario/s",
        showConfirmButton: false
      });
      return
    } else {
      const emails = ids.map((id) => usersData.find(user => user._id === id ).email);
      axios.post(`${ apiUrl }/send_email_2/${idM}`, {
        subject: "Firma de Minuta",
        guests: emails,
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: 'Información Guardada y Correos Enviados',
            text: 'Se ha guardado la información y se han enviado correctamente los correos electrónicos a los destinatarios seleccionados.',
            icon: 'success',
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#22C55E'
          }).then(() => {
            router.back();
          })
        } else {
          Swal.fire({
            title: '¡Error!',
            text: 'Error al guardar la información o enviar los correos electrónicos.',
            icon: 'error',
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            showConfirmButton: false
          });
        }
      })
      .catch((error) => { console.error(error); });
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (conclusion === '') return;
    Swal.fire({
      title: "¿Desea Continuar?",
      text: "La conlcusión de la minuta será guardada con la información introducida (puede ser modificada más adelante), y se enviará un correo electrónico para solicitar la firma de los destinatarios seleccionados.",
      icon: "question",
      confirmButtonColor: "#22C55E",
      confirmButtonText: "Sí, Continuar",
      showCancelButton: true,
      cancelButtonText: 'No, Cancelar',
    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${ apiUrl }/minutes/${idM}`, {
            conclusion, fechaProximaReunion
          });
  
          if (response.status === 200) {
            handleEmails(selectedUsers);
          }
  
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: '¡Error!',
            text: 'Error al guardar los datos.',
            icon: 'error',
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            showConfirmButton: false
          });
        }
      }
    });
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
        <EditText value={conclusion} setValue={setConclusion} read={minutaData.responsable === idFromSession ? false : true} />
  
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
          disabled={minutaData.responsable === idFromSession ? false : true}
        />
  
        <Subtitle className="mt-2">Solicitar Firma:</Subtitle>
        <MultiSelect
          className="w-full mt-1"
          name="usuario_id"
          value={selectedUsers}
          onValueChange={(value) => setSelectedUsers(value)}
          disabled={minutaData.responsable === idFromSession ? false : true}
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
          disabled={minutaData.responsable === idFromSession ? false : true}
        >
          Guardar
        </Button>
      </>
    );
  } else {
    return <Loading/>
  }
};

export default ConclusionMinuta;

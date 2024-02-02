"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Divider, Icon, Title, Subtitle, MultiSelect, MultiSelectItem, TextInput, Metric } from "@tremor/react";
import { ArrowUturnLeftIcon, DocumentIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import EditText from "@/components/rich_text";
import { apiUrl } from "@/config/config";
import Loading from "@/components/Loading";
import Cookies from "js-cookie";

const ConclusionMinuta = ({ params }) => {

  const router = useRouter();

  const idUserCoockie = Cookies.get('idUser');

  const [conclusion, setConclusion] = useState('');
  const [fechaProximaReunion, setFechaProximaReunion] = useState("");
  const [usersData, setUserData] = useState([]);
  const [minutaData, setMinutaData] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
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
  }, [idA]);

  const handleInputChange = (e) => {
    setFechaProximaReunion(e.target.value);
  };

  console.log(minutaData)

  const idM = idA;

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

  const handleSubmit = async() => {
    if (conclusion === '') return;
    try {
      const response = await axios.put(`${ apiUrl }/minutes/${idA}`, {
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
        title: 'Minuta Guardada',
        text: 'Los datos se han guardado',
        icon: 'success',
        confirmButtonText: 'Cool'
      }).then(() => {
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
  
          {/* <Button
            variant="primary"
            color="red"
            icon={DocumentIcon}
            iconPosition="right"
            className="w-40"
            tooltip="Subir PDF"
          >
            PDF
          </Button> */}
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
          disabled={minutaData.responsable === idUserCoockie ? false : true}
        />
  
        <Subtitle className="mt-2">Solicitar Firma:</Subtitle>
        <MultiSelect
          className="w-full mt-1"
          name="usuario_id"
          value={selectedUsers}
          onValueChange={(value) => setSelectedUsers(value)}
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
      </>
    );
  } else {
    return <Loading/>
  }
};

export default ConclusionMinuta;

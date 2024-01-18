"use client"

import { ArrowUturnLeftIcon, DocumentIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Divider, Icon, Title, Subtitle, MultiSelect, MultiSelectItem } from "@tremor/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditText from "@/components/rich_text";
import Swal from "sweetalert2";
import axios from "axios";

const ConclusionMinuta = ({ params }) => {

  const router = useRouter();

  const [conclusion, setConclusion] = useState('');
  const [usersData, setUserData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { idA } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response, userDataResponse] = await Promise.all([
          axios.get(`/api/minutes/${idA}`),
          axios.get("/api/users/"),
        ]);
        setConclusion(response?.data?.conclusion);
        setUserData(userDataResponse.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [idA]);

  const idM = idA;

  const handleEmails = (ids = []) => {
    if (ids.length === 0) return;
    const emails = ids.map((id) => usersData.find(user => user._id === id ).email);
    // TODO: CHANGE THIS TO THE REAL URL
    axios.post(`/api/send_email_2/${idM}`, {
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
          router.push('/dash/minutas');
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
      const response = await axios.put(`/api/minutes/${idA}`, {
        conclusion
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
        router.back();
      });

      handleEmails(selectedUsers);
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

        <Button
          variant="primary"
          color="red"
          icon={DocumentIcon}
          iconPosition="right"
          className="w-40"
          tooltip="Subir PDF"
        >
          PDF
        </Button>
      </div>

      <Title className="mt-4">Conclusiones de la reunion</Title>
            <Divider className="mt-2"/>
      <EditText value={conclusion} setValue={setConclusion} />

      <Subtitle className="mt-2">Invitados</Subtitle>
      <MultiSelect
        className="w-full mt-1"
        name="usuario_id"
        value={selectedUsers}
        onValueChange={(value) => setSelectedUsers(value)}
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
      >
        Guardar
      </Button>
    </>
  );
};

export default ConclusionMinuta;

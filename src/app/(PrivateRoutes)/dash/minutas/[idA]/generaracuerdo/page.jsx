"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import EditText from "@/components/rich_text";
import "@/styles/generarAcuerdo.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Title, Icon, Button, SearchSelect, SearchSelectItem, TextInput, Subtitle } from "@tremor/react";
import { ArrowUturnLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { apiUrl } from "@/config/config";

const NuevoAcuerdo = ({ params }) => {
  const { idA } = params;
  const [responsables, setResponsables] = useState([]);
  const [formData, setFormData] = useState({
    minuta_id: idA,
    responsablec_id: "",
    responsabler_id: "",
    acuerdo: "",
    fecha: "",
    descripcion: "",
    estatus: "Pendiente",
    reporte_estado: "En revisión"
  });
  const [editableDescription, setEditableDescription] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/users/`);
        setResponsables(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResponsables();
  }, []);

  const handleEmails = async () => {
    // if (id.length === 0) return;
    const emailc = responsables.find(user => user._id === formData.responsablec_id ).email;
    const emailr = responsables.find(user => user._id === formData.responsabler_id ).email;
    // TODO: CHANGE THIS TO THE REAL URL
    axios.post(`${ apiUrl }/send_email_3`, {
      subject: `Responsable de Acuerdo - ${formData.acuerdo}`,
      acuerdo: formData.acuerdo,
      date: formData.fecha,
      responsablec: emailc,
      responsabler: emailr,
    })
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          title: 'Correos enviados',
          icon: 'success',
          confirmButtonText: 'Continuar'
        }).then(() => {
          router.push(`/dash/minuta/${idA}`);
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

  const handleGuardarClick = async (e) => {
    e.preventDefault();
    if (editableDescription.length > 300) {
      Swal.fire({
        title: "Error!",
        text: "La descripción debe tener menos de 300 caracteres",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return; 
    }
    try {
      const response = await axios.post(
        "/api/agreement/", {
          ...formData,
          descripcion: editableDescription
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Acuerdo Creado",
          text: "Se creó correctamente el Acuerdo",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          handleEmails(e);
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error al guardar los datos",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      Swal.fire({
        title: "Error!",
        text: "Error al guardar los datos",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  return (
    <>
      <Icon className='w-10 h-10 cursor-pointer'
        icon={ArrowUturnLeftIcon}
        onClick={() => router.back()}
        variant='solid'
        color='red'
        tooltip='Regresar'
      />

      <form className='w-full px-5 lg:px-40' onSubmit={(e) => handleGuardarClick(e)}>

        <Title className='mt-4'>Datos del acuerdo</Title>
        <Subtitle className='mt-2'>Responsable a cumplir</Subtitle>
        <SearchSelect
          className='mt-1'
          value={formData.responsablec_id}
          onValueChange={(value) => setFormData({ ...formData, responsablec_id: value })}
        >
          {responsables.map((responsable) => (
            <SearchSelectItem key={responsable._id} value={responsable._id}>
              {responsable.nombre} {responsable.apellido_paterno} {responsable.apellido_materno}
            </SearchSelectItem>
          ))}
        </SearchSelect>

        <Subtitle className='mt-2'>Responsable a revisión</Subtitle>
        <SearchSelect
          className='mt-1'
          value={formData.responsabler_id}
          onValueChange={(value) => setFormData({ ...formData, responsabler_id: value })}
        >
          {responsables.map((responsable) => (
            <SearchSelectItem key={responsable._id} value={responsable._id}>
              {responsable.nombre} {responsable.apellido_paterno} {responsable.apellido_materno}
            </SearchSelectItem>
          ))}
        </SearchSelect>

        <Title className='mt-4'>Información general</Title>
        <div className='flex flex-wrap md:flex-nowrap gap-4'>
          <div className="w-full">
            <Subtitle className="mt-2">Título</Subtitle>
            <TextInput
              className='mt-1'
              placeholder='Título'
              value={formData.acuerdo}
              onChange={(e) =>
                setFormData({ ...formData, acuerdo: e.target.value })
              }
            />
          </div>

          <div className="w-full">
            <Subtitle className="mt-2">Fecha de compromiso</Subtitle>
            <TextInput
              className='mt-1'
              placeholder='Fecha de compromiso (DD-MM-YY)'
              value={formData.fecha}
              type='date'
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
            />
          </div>
        </div>

        <Subtitle className="mt-2">Descripción</Subtitle>
        <EditText value={editableDescription} setValue={setEditableDescription} />

        <Button
          className='mt-4 w-full'
          type='submit'
          icon={PaperAirplaneIcon}
          iconPosition='right'
          color='green'
        >
          Guardar
        </Button>

      </form>
    </>
  );
};

export default NuevoAcuerdo;
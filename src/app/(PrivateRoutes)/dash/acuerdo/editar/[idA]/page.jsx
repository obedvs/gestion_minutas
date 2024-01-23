"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import EditText from "@/components/rich_text";
import "@/styles/generarAcuerdo.css";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button, Icon, SearchSelect, SearchSelectItem, Subtitle, TextInput, Title } from "@tremor/react";
import { ArrowUturnLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { apiUrl } from "@/config/config";

const EditarAcuerdo = ({ params }) => {
  const { idA } = params;
  const [responsables, setResponsables] = useState([]);
  const [acuerdoData, setAcuerdoData] = useState(null);
  const [formData, setFormData] = useState({
    asunto: "",
    responsablec_id: "",
    responsabler_id: "",
    acuerdo: "",
    fecha: "",
    descripcion: ""
  });
  const [ editableDescription, setEditableDescription ] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/agreement/${idA}`);
        setAcuerdoData(response.data);
        setFormData(response.data);
        setEditableDescription(response.data.descripcion);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [idA]);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.put(`${ apiUrl }/agreement/${idA}`, {
          ...formData,
          descripcion: editableDescription
        });
        if (response) {
          Swal.fire({
            title: 'Acuerdo Guardado',
            text: 'Los datos se han guardado correctamente.',
            icon: 'success',
            confirmButtonColor: "#22C55E",
            confirmButtonText: 'Continuar',
          }).then(() => {
            // window.location.reload();
            router.back();
          });
        }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: '¡Error!',
        text: 'Error al guardar los datos.',
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  };
  

  if (acuerdoData) {
    return (
      <>   
        <Icon className='w-10 h-10 cursor-pointer' 
          icon={ ArrowUturnLeftIcon } 
          onClick={ () => router.back() } 
          variant='solid' 
          color='red'
          tooltip='Regresar'
        />

        <form className='w-full px-5 lg:px-40' onSubmit={handleSubmit}>
          <Title className='mt-4'>Datos del acuerdo</Title>

          <Subtitle className="mt-2">Responsable a cumplir</Subtitle>
          <SearchSelect
            value={formData.responsablec_id}
            onValueChange={(value) => setFormData({ ...formData, responsablec_id: value })}
          >
            {responsables.map((responsable) => (
              <SearchSelectItem key={responsable._id} value={responsable._id}>
                {responsable.nombre}
              </SearchSelectItem>
            ))}
          </SearchSelect>

          <Subtitle className="mt-2">Responsable a revisión</Subtitle>
          <SearchSelect
            value={formData.responsabler_id}
            onValueChange={(value) => setFormData({ ...formData, responsabler_id: value })}
          >
            {responsables.map((responsable) => (
              <SearchSelectItem key={responsable._id} value={responsable._id}>
                {responsable.nombre} {responsable.apellido_paterno} {responsable.apellido_materno}
              </SearchSelectItem>
            ))}
          </SearchSelect>

          <Title className="mt-5">Información general</Title>
          <Subtitle className="mt-2">Título</Subtitle>
          <TextInput
            className='w-full mt-1'
            label='Título'
            name='acuerdo'
            placeholder='Título'
            value={formData.acuerdo}
            onChange={handleInputChange}
          />
          <Subtitle className="mt-2">Fecha de compromiso</Subtitle>
          <TextInput
            className='w-full mt-1'
            label='Fecha de compromiso'
            name='fecha'
            type='date'
            placeholder='Fecha de compromiso'
            value={formData.fecha}
            onChange={handleInputChange}
          />
          <Subtitle className="mt-2">Descripción</Subtitle>

          <EditText value={ editableDescription } setValue={ setEditableDescription } />

          <Button
            className='w-full mt-4'
            type='submit'
            color='green'
            icon={ PaperAirplaneIcon }
            iconPosition='right'
          >
            Guardar
          </Button>
        </form>

      </>
    );
  }

  return null;
};

export default EditarAcuerdo;

"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import EditText from "@/components/rich_text";
import "@/styles/generarMinuta.css";
import { Title, Icon, Button, TextInput, Select, SelectItem, Subtitle, MultiSelect, MultiSelectItem } from "@tremor/react";
import { ArrowUturnLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { apiUrl } from "@/config/config";

const EditarMinuta = ({ params }) => {
  const { idM } = params;
  const [usersData, setUserData] = useState([]);
  const [minutaData, setMinutaData] = useState(null);
  const [formData, setFormData] = useState({
    asunto: "",
    responsable: "",
    fecha: "",
    hora: "",
    tema: "",
    area: "",
    lugar: "",
    usuario_id: [],
  });
  const [ editableDescription, setEditableDescription ] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/minutes/${idM}`);
        setMinutaData(response.data);
        setFormData(response.data);
        setEditableDescription(response.data.descripcion);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [idM]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/users/`);
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
        const response = await axios.put(`${ apiUrl }/minutes/${idM}`, {
          ...formData,
          // responsable: responsableEncontrado._id,
          descripcion: editableDescription
        });

        if (response) {
          Swal.fire({
            title: "Minuta Guardada",
            text: "Los datos se han guardado",
            icon: "success",
            confirmButtonText: "Cool"
          }).then(() => {
            // window.location.reload();
            router.push('/dash/minutas');
          });
        }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Error al guardar los datos",
        icon: "error",
        confirmButtonText: "Cool"
      });
    }
  };

  if (minutaData) {
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
        <Subtitle className="mt-2">Asunto</Subtitle>
        <TextInput
          className='w-full mt-1'
          label='Asunto'
          name='asunto'
          placeholder='Asunto'
          value={formData.asunto}
          onChange={handleInputChange}
        />

        <Subtitle className='mt-4'>Responsable</Subtitle>
        <Select
          className='w-full mt-1'
          name='responsable'
          value={formData.responsable}
          onValueChange={(value) => setFormData({ ...formData, responsable: value })}
        >
          {usersData.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user.nombre} {user.apellido_paterno} 
            </SelectItem>
          ))}
        </Select>

        <div className='flex flex-col lg:flex-row gap-1'>
          <div className="w-full">
            <Subtitle className='mt-2'>Fecha</Subtitle>
            <TextInput
              className='w-full mt-1'
              label='Fecha'
              type="date"
              name='fecha'
              placeholder='Fecha'
              value={formData.fecha}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="w-full">
            <Subtitle className="mt-2">Hora</Subtitle>
            <TextInput
              className='w-full mt-1'
              label='Hora'
              type='time'
              name='hora'
              placeholder='Hora'
              value={formData.hora}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <Title className='mt-4'>Información general</Title>

        <Subtitle className="mt-2">Tema</Subtitle>
        <TextInput
          className='w-full mt-1'
          label='Tema'
          name='tema'
          placeholder='Tema'
          value={formData.tema}
          onChange={handleInputChange}
        />

        <Subtitle className="mt-2">Area</Subtitle>
        <TextInput
          className='w-full mt-1'
          label='Area'
          name='area'
          placeholder='Area'
          value={formData.area}
          onChange={handleInputChange}
        />

        <Subtitle className="mt-2">Lugar</Subtitle>
        <TextInput
          className='w-full mt-1'
          label='Lugar'
          name='lugar'
          placeholder='Lugar'
          value={formData.lugar}
          onChange={handleInputChange}
        />

        <Subtitle className="mt-2">Invitados</Subtitle>
        <MultiSelect
          className='w-full mt-1'
          name='usuario_id'
          value={formData.usuario_id}
          onValueChange={(value) => setFormData({ ...formData, usuario_id: value })}
        >
          {/* <SearchSelectItem value=''>Selecciona un usuario</SearchSelectItem> */}
          {usersData.map((user) => (
            <MultiSelectItem key={user._id} value={user._id}>
              {user.nombre} {user.apellido_paterno} {user.apellido_materno}
            </MultiSelectItem>
          ))}
        </MultiSelect>

        <Subtitle className="mt-2">Descripcion</Subtitle>

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
  } else {
    return null; // Si no hay datos de la minuta, puedes mostrar un estado de carga o redirigir a otra página
  };
};

export default EditarMinuta;
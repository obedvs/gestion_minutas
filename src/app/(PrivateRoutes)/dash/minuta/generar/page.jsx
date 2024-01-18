"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import EditText from "@/components/rich_text";
import "@/styles/generarMinuta.css";
import Swal from "sweetalert2";
import { Title, Icon, Button, TextInput, Subtitle, SearchSelect, SearchSelectItem, MultiSelect, MultiSelectItem } from "@tremor/react";
import { ArrowUturnLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

const NuevaMinutas = () => {
  const [usersData, setUserData] = useState([]);
  const [datosMinuta, setDatosMinuta] = useState({
    asunto: "",
    responsable: "",
    fecha: "",
    hora: "",
    tema: "",
    area: "",
    lugar: "",
    usuario_id: [],
    descripcion: "",
    estatus: "Activo"
  });
  const [ editableDescription, setEditableDescription ] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://62.72.1.33:3001/users/");
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    setDatosMinuta({
      ...datosMinuta,
      [e.target.name]: e.target.value
    });
  };

  const handleEmails = ( ids = [] ) => {
    if ( ids.length === 0 ) return;
    const emails = ids.map((id) => usersData.find( user => user._id === id ).email);
    // TODO: CHANGE THIS TO THE REAL URL
    axios.post('http://62.72.1.33:3001/send_email', {
      subject: datosMinuta.asunto,
      date: datosMinuta.fecha,
      time: datosMinuta.hora,
      guests: emails,
    }).then((response) => {
      if (!response.status === 200) return
      Swal.fire({
        title: 'Correos enviados',
        icon: 'success',
        confirmButtonText: 'Cool'
      }).then(() => {
        router.push('/dash/minutas');
      })
    })
    .catch((error) => { console.error(error); });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
      axios
        .post("http://62.72.1.33:3001/minutes/", {
          ...datosMinuta,
          descripcion: editableDescription,
        })
        .then((response) => {
          Swal.fire({
            title: "Minuta Guardada",
            icon: "success",
            confirmButtonText: "Cool"
          }).then(() => {
            handleEmails(datosMinuta.usuario_id);
            // router("/Dash/minutas")
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Error al guardar los datos",
            icon: "error",
            confirmButtonText: "Cool"
          });
        });
  };

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
          value={datosMinuta.asunto}
          onChange={handleChange}
        />

        <Subtitle className="mt-2">Responsable</Subtitle>
        <SearchSelect
          className='w-full mt-1'
          name='responsable'
          value={datosMinuta.responsable}
          onValueChange={(value) => setDatosMinuta({ ...datosMinuta, responsable: value })}
        >
          {/* <SearchSelectItem value=''>Selecciona un usuario</SearchSelectItem> */}
          {usersData.map((user) => (
            <SearchSelectItem key={user._id} value={user._id}>
              {user.nombre} {user.apellido_paterno} {user.apellido_materno}
            </SearchSelectItem>
          ))}
        </SearchSelect>

        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full">
            <Subtitle className="mt-2">Fecha</Subtitle>
            <TextInput
              className='w-full mt-1'
              label='Fecha'
              name='fecha'
              type='date'
              placeholder='Fecha'
              value={datosMinuta.fecha}
              onChange={handleChange}
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
              value={datosMinuta.hora}
              onChange={handleChange}
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
          value={datosMinuta.tema}
          onChange={handleChange}
        />

        <Subtitle className="mt-2">Area</Subtitle>
        <TextInput
          className='w-full mt-1'
          label='Area'
          name='area'
          placeholder='Area'
          value={datosMinuta.area}
          onChange={handleChange}
        />

        <Subtitle className="mt-2">Lugar</Subtitle>
        <TextInput
          className='w-full mt-1 mb-1'
          label='Lugar'
          name='lugar'
          placeholder='Lugar'
          value={datosMinuta.lugar}
          onChange={handleChange}
        />

        <Subtitle className="mt-2">Invitados</Subtitle>
        <MultiSelect
          className='w-full mt-1'
          name='usuario_id'
          value={datosMinuta.usuario_id}
          onValueChange={(value) => setDatosMinuta({ ...datosMinuta, usuario_id: value })}
        >
          {/* <SearchSelectItem value=''>Selecciona un usuario</SearchSelectItem> */}
          {usersData.map((user) => (
            <MultiSelectItem key={user._id} value={user._id}>
              {user.nombre} {user.apellido_paterno} {user.apellido_materno} ({user.email})
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
};

export default NuevaMinutas;

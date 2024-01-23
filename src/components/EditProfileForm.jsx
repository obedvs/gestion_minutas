"use client"

import { useEffect, useState } from "react";
import { Button, Title, TextInput, Subtitle } from "@tremor/react"
import { ArchiveBoxXMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { apiUrl } from "@/config/config";

export const EditProfileForm = ({ userData, setIsEditOpen, updateProfilePage, userId }) => {

    const [ userFormData, setUserFormData ] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        email: '',
        cargo: '',
        area: '',
        rfc: '',
        // matricula: '',
    });

    useEffect(() => {
        setUserFormData({
            nombre: userData?.nombre,
            apellido_paterno: userData?.apellido_paterno,
            apellido_materno: userData?.apellido_materno,
            email: userData?.email,
            cargo: userData?.cargo,
            area: userData?.area,
            // matricula: userData?.matricula,
            rfc: userData?.rfc,
            email: userData?.email,
            password: userData?.password,
            token: userData?.token,
        })
    }, [ userData ])

    const onHanldeInputChange = (e) => {
        setUserFormData({
            ...userFormData,
            [e.target.name]: e.target.value
        })
    }

    const updateProfile = async() => {
        try {
            const response = await axios.put(`${ apiUrl }/users/${userId}`, userFormData);
            if ( response.status === 200 ) {
                setIsEditOpen(false);
            }
        } catch (error) {
            console.log(error)   
        }
    }

    const onSendForm = async(e) => {
        e.preventDefault();
        await updateProfile();

        // IN ORDER TO SHOW THE NEW DATA IN THE PROFILE PAGE, WE MAKE A CALL TO THE ENDPOINT AGAIN
        // THIS IS THE REASON WHY WE PASS THE updateProfile FUNCTION AS A PROP
        await updateProfilePage();
    }

    return (

        <>
            <Title>Edita tu perfil</Title>
            <form className="flex flex-col gap-4 mt-5" onSubmit={onSendForm}>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="w-full">
                        <Subtitle> Nombre </Subtitle>
                        <TextInput
                            label='Nombre'
                            placeholder='Nombre'
                            name="nombre"
                            value={userFormData.nombre}
                            onChange={onHanldeInputChange}
                        />
                    </div>

                    <div className="w-full">
                        <Subtitle> Apellido Paterno </Subtitle>
                        <TextInput
                            label='Apellido Paterno'
                            placeholder='Apellido Paterno'
                            name="apellido_paterno"
                            value={userFormData.apellido_paterno}
                            onChange={onHanldeInputChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="w-full">
                        <Subtitle> Apellido Materno </Subtitle>
                        <TextInput
                            label='Apellido Materno'
                            placeholder='Apellido Materno'
                            name="apellido_materno"
                            value={userFormData.apellido_materno}
                            onChange={onHanldeInputChange}
                        />

                    </div>

                    <div className="w-full">
                        <Subtitle> Email </Subtitle>
                        <TextInput
                            label='Email'
                            placeholder='Email'
                            type="email"
                            name="email"
                            value={userFormData.email}
                            onChange={onHanldeInputChange}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="w-full">
                        <Subtitle> RFC </Subtitle>
                        <TextInput
                            label='RFC'
                            placeholder='RFC'
                            name="rfc"
                            value={userFormData.rfc}
                            onChange={onHanldeInputChange}
                        />

                    </div>

                    {/* <div className="w-full">
                        <Subtitle> Matricula </Subtitle>
                        <TextInput
                            label='Matricula'
                            placeholder='Matricula'
                            name="matricula"
                            value={userFormData.matricula}
                            onChange={onHanldeInputChange}
                        />
                    </div> */}
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="w-full">
                        <Subtitle> Cargo </Subtitle>
                        <TextInput
                            label='Cargo'
                            placeholder='Cargo'
                            name="cargo"
                            value={userFormData.cargo}
                            onChange={onHanldeInputChange}
                        />
                    </div>

                    <div className="w-full">
                        <Subtitle> Area </Subtitle>
                        <TextInput
                            label='Area'
                            placeholder='Area'
                            name="area"
                            value={userFormData.area}
                            onChange={onHanldeInputChange}
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center gap-3 mt-5">
                    <Button
                        color="red"
                        className="w-full"
                        onClick={() => setIsEditOpen(false)}
                        variant="secondary"
                        icon={ ArchiveBoxXMarkIcon }
                        iconPosition='right'
                        type="button"
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant='primary'
                        icon={ PaperAirplaneIcon }
                        iconPosition='right'
                        color="green"
                        className="w-full"
                        type="submit"
                    >
                        Guardar
                    </Button>
                </div>

            </form>
        </>
    )

}
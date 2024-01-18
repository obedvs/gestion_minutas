"use client"

import { useState, useEffect } from "react";
import { Button, Title, TextInput, Subtitle } from "@tremor/react"
import { ArchiveBoxXMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export const EditPasswordForm = ({ setIsEditOpen, updateProfilePage, userId }) => {

    const [ newPassowrd, setNewPassword ] = useState('');

    const onHanldeInputChange = (e) => {
        setNewPassword(e.target.value);
    }

    const updateProfile = async() => {
        try {
            const response = await axios.put(`/api/users/${userId}`, { password: newPassowrd });
            if ( response.status === 200 ) {
                setIsEditOpen(false);
            }
        } catch (error) {
            console.log(error)   
        }
    }

    const onSendForm = async(e) => {
        e.preventDefault();
        if ( newPassowrd.length === 0 ) return;
        await updateProfile();
        // IN ORDER TO SHOW THE NEW DATA IN THE PROFILE PAGE, WE MAKE A CALL TO THE ENDPOINT AGAIN
        // THIS IS THE REASON WHY WE PASS THE updateProfile FUNCTION AS A PROP
        await updateProfilePage();
    }

    return (

        <>
            <Title>Cambia tu contraseña</Title>
            <form className="flex flex-col gap-4 mt-5" onSubmit={onSendForm}>

                <div className="flex flex-col md:flex-row gap-3">
                    <div className="w-full">
                        <Subtitle> Nueva contraseña </Subtitle>
                        <TextInput
                            label='Nombre'
                            placeholder='Escribe aquí tu nueva contraseña'
                            name="password"
                            type="password"
                            value={newPassowrd}
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
"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@/styles/perfil.css';
// import Cookies from 'js-cookie';
import { Button, Card, Divider, Icon, Text, Title } from '@tremor/react';
import { BriefcaseIcon, BuildingOffice2Icon, LockClosedIcon, PencilSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { EditProfileForm } from '@/components/EditProfileForm';
import { EditPasswordForm } from '@/components/EditPasswordForm';
import { apiUrl } from '@/config/config';
import Loading from '@/components/Loading';


const Perfil = () =>{
	const idU = sessionStorage.getItem('idUser');
	// const idU = Cookies.get('idUser');
	const [ userData, setUserData ] = useState(null);
	const [ isEditProfileFormOpen, setIsEditProfileFormOpen ] = useState(false);
    const [ isEditPasswordFormOpen, setIsEditPasswordFormOpen ] = useState(false);

	useEffect(() => {
			fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await axios.get(`${ apiUrl }/users/${idU}`);
			setUserData(response.data);
			// console.log(response.data);

		} catch (error) {
			console.error(error);
		}
	};

    if(userData){
        return (
            <Card className='w-full h-full flex flex-col justify-between'>
                <div className='w-full h-full flex flex-col'>
                    <div
                        className='w-full flex flex-col justify-center items-center'
                    >
                        <Icon 
                            icon={ UserCircleIcon }
                            size='xl'
                            variant='solid'
                            color='red'
                            tooltip='Nombre y Correo Electrónico'
                        />

                        <div className='w-full flex flex-col justify-center items-center mt-2'>
                            <Title>{ userData?.nombre } { userData?.apellido_paterno } { userData?.apellido_materno }</Title>
                            <Text>{ userData?.email }</Text>
                        </div>

                    </div>

                    <Divider />

					{
						isEditProfileFormOpen && !isEditPasswordFormOpen && (
							<EditProfileForm 
								userData={ userData } 
								setIsEditOpen={ setIsEditProfileFormOpen } 
								updateProfilePage={ fetchData }
								userId={ idU }
							/>
						)
					}

					{
						isEditPasswordFormOpen && !isEditProfileFormOpen && (
							<EditPasswordForm 
								setIsEditOpen={ setIsEditPasswordFormOpen } 
								updateProfilePage={ fetchData }
								userId={ idU }
							/>
						)
					}

					{
						!isEditProfileFormOpen && !isEditPasswordFormOpen && (
							<div className='w-1/2 flex flex-col gap-3 self-center'>
								<div className='w-1/2 flex items-center gap-3'>
									<Icon 
										icon={ BriefcaseIcon }
										size='md'
										variant='solid'
										color='red'
										tooltip='Cargo del usuario'
									/>
									<div>
										<Title>Cargo:</Title>
										<Text>{ userData?.cargo }</Text>
									</div>
								</div>

								<div className='w-1/2 flex items-center gap-3'>
									<Icon
										icon={ BuildingOffice2Icon }
										size='md'
										variant='solid'
										color='red'
										tooltip='Area de trabajo del usuario'
									/>
									<div>
										<Title>Area:</Title>
										<Text>{ userData?.area }</Text>
									</div>
								</div>
							</div>
						)
					}

                </div>

				{
					!isEditProfileFormOpen && !isEditPasswordFormOpen && (
						<div className='w-full flex flex-col md:flex-row justify-center gap-3'>
							<Button
								className='md:w-1/4 w-full'
								variant='secondary'
								icon={ PencilSquareIcon }
								iconPosition='right'
								onClick={ () => setIsEditProfileFormOpen(true) }
							>
								Editar perfil
							</Button>

							<Button
								className='md:w-1/4 w-full'
								variant='secondary'
								icon={ LockClosedIcon }
								iconPosition='right'
								onClick={ () => setIsEditPasswordFormOpen(true) }
							>
								Cambiar contraseña
							</Button>
						</div>
					)
				}


            </Card>
    )
    } else {
		return <Loading/>
    }
    
}

export default Perfil;
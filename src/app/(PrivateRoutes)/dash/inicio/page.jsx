// "use client"

import React from "react";
// import Cookies from 'js-cookie';
import { Metric, Title, Text, List, ListItem, Card } from "@tremor/react";

const STEPTS = [
    { label: 'Entrar a la interfaz de minutas o en el botón de generar minuta.' },
    { label: 'Generar la minuta con los datos. Volverás a la interfaz anterior al terminar.' },
    { label: 'Añade los invitados a esa minuta. Puedes añadir varios al mismo tiempo.' },
    { label: 'Añade acuerdos, los invitados serán candidatos a ser responsable de algún acuerdo.' },
    { label: 'Al añadir un seguimiento, puedes seleccionar una minuta anterior para traer todos los acuerdos pasados, una vez identificada la minuta puedes ir editando los acuerdos y verificando el estado en que se encuentran.' },
    { label: 'Por último, al añadir una conclusión a la minuta acuerdos y el responsable de levantarla. Finalizara el proceso y podrás descargar el PDF.' },
]

const Inicio = () =>{
    // const idU = Cookies.get('idUser');
    // console.log("logged: " + idU);

    return(
        <>
        <Metric>Bienvenido</Metric>

        <Text className='mt-2 mx-2 text-justify'>
        Este sitio brinda acceso a distintas áreas del sistema, 
        permitiéndote realizar cambios y consultar información relevante. 
        Utiliza el menú para navegar por las diferentes secciones.
        </Text>

        <Text className='mt-2 mx-2 text-justify'>
        Recuerda cerrar sesión cuando hayas terminado de usar el panel. 
        Para hacerlo, busca el botón de "Cerrar Sesión". En computadoras, 
        lo encontrarás en la parte inferior izquierda; en dispositivos móviles, 
        estará en la parte superior derecha. Es importante cerrar sesión antes de 
        cerrar la pestaña del navegador o si te alejas del dispositivo por seguridad.
        </Text>

        <Text className='mt-2 mx-2 text-justify'>
            Este es el sistema de gestión de minutas. Hecho para registrar, invitar y dar seguimiento a las reuniones.
        </Text>

        <Title className='mt-4 mx-2 text-justify'>
            Para generar una minuta debes seguir los siguientes pasos:
        </Title>
        <List className="lg:w-1/3 md:w-1/2 w-full self-center">
            { STEPTS.map((step, index) => (
                <ListItem key={ index } className='whitespace-normal'>
                    <span className="text-justify mx-2">
                        { index + 1 }. { step.label }
                    </span>
                </ListItem>
            )) }
        </List>
        </>
    )
}

export default Inicio;
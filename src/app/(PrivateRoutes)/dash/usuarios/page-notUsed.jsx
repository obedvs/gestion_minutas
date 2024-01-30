"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@/styles/usuarios.css'
import TargetaUsuario from '@/components/Usuarios'
import { Card, Metric } from '@tremor/react';
import { apiUrl } from '@/config/config';

const Usuarios = () => {
  const [usersData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ apiUrl }/users`);
        setUserData(response.data); 

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const areas = [
    'Facultad de Ciencias Químicas Gómez Palacio',
    'Vinculacion Facultad de Ciencias Forestales y Ambientales',
    'Facultad de Ciencias Forestales y Ambientales',
    'Facultad de Ciencias Químicas Durango',
    'CCH',
    'Secretaria Técnica',
    'Red de Investigación',
    'Facultad de Medicina y Nutrición',
    'Facultad de Trabajo Social',
    'Difusión Cultural',
    'No Especificado'
  ];

  if (usersData) {
    return (

      <Card className='w-full h-auto flex flex-col justify-between'>
        {
          areas.map((area) => (
            <React.Fragment key={area}>
              <Metric key={area}>{area}</Metric>
              <div className='my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                {
                  usersData.filter((user) => user.area === area)
                    .map((user, index) => (
                      <TargetaUsuario key={index} User={user} />
                    ))
                }
              </div>
            </React.Fragment>
          ))
        }
      </Card>
    );
  }

  return null;
}

export default Usuarios;




// import logo_UJED from '/assets/img/logoujed.png';
import { Metric } from "@tremor/react";
import Link from "next/link";
// import Image from 'next/image'

const NotFound = () => {
  return (
    <section className='w-full h-screen flex flex-col justify-center items-center gap-4'>
      <img src="/assets/img/logoujed.png" alt="ujed logo" className='w-auto h-52 -mt-4'/>
      <Metric className='text-center'>Lo sentimos, esta página no existe.</Metric>
      <Link href="/" className="font-semibold bg-main rounded-full p-3 text-tremor-metric text-tremor-content-inverted text-center">Volver a Inicio</Link>
    </section>
  );
};

export default NotFound;
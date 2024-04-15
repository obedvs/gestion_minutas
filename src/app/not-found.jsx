import { Metric } from "@tremor/react";
import Link from "next/link";

const NotFound = () => {
  return (
    <section className='flex flex-col items-center justify-center w-full h-screen gap-4'>
      <img src="/assets/img/logoujed.png" alt="ujed logo" className='h-52 w-auto -mt-4'/>
      <Metric className='text-center'>Lo sentimos, esta página no existe.</Metric>
      <Link href="/" className="bg-main text-tremor-metric text-tremor-content-inverted p-3 font-semibold text-center rounded-full">Volver a Inicio</Link>
    </section>
  );
};

export default NotFound;
"use client"

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
import LatBar from '@/components/lat_com';
import Loading from './loading';

const PrivateRoutes = ({ children }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const idFromSession = sessionStorage.getItem('idUser');
        // const idFromCookie = Cookies.get('idUser');
        if (!idFromSession) {
            router.replace('/login');
        } else {
            setLoading(false);
        }
    }, []);

    return loading ? <Loading /> : (
        <LatBar>
            <Suspense fallback={<Loading />}>{children}</Suspense>
        </LatBar>
    );
};

export default PrivateRoutes;
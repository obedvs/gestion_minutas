"use client"

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';

const PublicRoutes = ({ children }) => {

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const idFromCookie = Cookies.get('idUser');
        if (idFromCookie !== undefined) {
            if (idFromCookie) {
                router.replace('/dash/inicio');
            }
        } else {
            setLoading(false);
        }
    }, [router]);

    return loading ? <Loading /> : <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default PublicRoutes;
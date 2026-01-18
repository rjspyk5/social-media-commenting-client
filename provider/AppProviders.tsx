'use client'
import { setUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { UserType } from '@/types/auth/user.types';
import { RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const AppProvider = ({ children, initialUser }: { children: React.ReactNode, initialUser: UserType | null }) => {
    // const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    // const user = useAppSelector(state => state.auth.user);
    // useEffect(() => {
    //     const fetchUser = async () => {
    //         setLoading(true);
    //         try {
    //             dispatch(setUser({ user: initialUser || null }));
    //             setLoading(false);
    //         } catch (error) {
    //             dispatch(setUser({ user: null }));
    //             setLoading(false);
    //             console.log(error)
    //         }
    //     }
    //     if (!user) {
    //         fetchUser();
    //     }
    // }, [user, dispatch, initialUser])

    // if (loading) {
    //     return <div className='h-screen w-screen flex items-center justify-center'><RefreshCw size={50} className="animate-spin" /></div>

    // }
    if (initialUser) {
        dispatch(setUser({ user: initialUser || null }));
    }
    return (<>{children}</>);
};


export default AppProvider;
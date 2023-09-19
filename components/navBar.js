import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/navigation'

export default function NavBar(){

    const router = useRouter();

    return(
        <nav className="block bg-slate-50 w-full z-20 top-0 left-0">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a onClick={() => router.back()}>
                    <BiArrowBack size="2em"/>
                </a>
            </div>
        </nav>
    )
}
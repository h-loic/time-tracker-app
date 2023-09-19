import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/navigation'

export default function NavBar(){

    const router = useRouter();

    return(
        <nav className="block bg-white dark:bg-gray-900 w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a onClick={() => router.back()}>
                    <BiArrowBack size="3em"/>
                </a>
            </div>
        </nav>
    )
}
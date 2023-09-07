'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'

export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  return (
    <div className="p-8">
      <h1 className='text-4xl p-4 text-center'>Time Tracker app</h1>
      <div className='text-2xl p-4'>Bienvenue {session?.data?.user?.email }</div>
      <div className=''>
          <div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Mes informations</div>
          <Link href="/logHours"><div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Noter mes heures</div></Link>
          <Link href="/chantiers"><div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Chantiers</div></Link>
          <div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Ouvriers</div>
        </div>
      <button className='' onClick={() => signOut()}>Logout</button>
    </div>
  )
}

Home.requireAuth = true

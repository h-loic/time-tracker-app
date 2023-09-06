'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'

export default function Menu() {

  return (
    <>
        <h1 className='text-4xl p-4 text-center'>Menu</h1>
        <div className=''>
          <div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Mes informations</div>
          <div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Noter mes heures</div>
          <Link href="/chantiers"><div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Chantiers</div></Link>
          <div className="uppercase text-slate-50 text-center bg-blue-800 p-4 rounded-lg mb-3 mt-3">Ouvriers</div>
        </div>
        </>
  )
}

'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'

export default function Home() {

  return (
    <>
        <h1 className='text-4xl p-4 text-center'>Time Tracker app</h1>
        <Link href="/menu"> se connecter </Link>
        </>
  )
}

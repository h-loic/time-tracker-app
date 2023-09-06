'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import {navigationBar} from '../components/navigationBar'

export default function Home() {

  return (
    <>
        <navigationBar></navigationBar>
        <h1 className='text-4xl p-4 text-center'>Time Tracker app</h1>
        <Link href="/menu"> se connecter </Link>
        </>
  )
}

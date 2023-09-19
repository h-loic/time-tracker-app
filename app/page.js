'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import {
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query, 
  where
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {

  const [worker, setWorker] = useState({});

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  
  useEffect(() => {
    if (session.status != "loading") {
      const workersRef = collection(db, 'workers');
      const q = query(workersRef, where("mail", "==", session.data.user.email));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let itemsArr = []
        querySnapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id });
        });
        let worker = itemsArr[0];
        setWorker(worker)
        return () => unsubscribe();
      });
    }
  }, [session]);

  return (
    <>
    <div className="p-8">
      <h1 className='text-4xl p-4 text-center'>Time Tracker app</h1>
      <div className='text-2xl p-4'>Bienvenue { worker.name }</div>
      <div className=''>
          <Link href="/logHours"><div className="uppercase text-slate-50 text-center bg-teal-800 p-4 rounded-lg mb-5 mt-3">Noter mes heures</div></Link>
          <br/><br/>
          <Link href="/myInformation"><div className="uppercase text-slate-50 text-center bg-slate-400 p-4 rounded-lg mb-3 mt-5">Mes informations</div></Link>
          <Link href="/chantiers"><div className="uppercase text-slate-50 text-center bg-slate-400 p-4 rounded-lg mb-3 mt-3">Chantiers</div></Link>
          <Link href="/workers"><div className="uppercase text-slate-50 text-center bg-slate-400 p-4 rounded-lg mb-3 mt-3">Ouvriers</div></Link>
        </div>
      <button onClick={() => signOut()} className="text-center absolute bottom-0 mb-5 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
        se déconnecter
      </button>
    </div>
    </>
  )
}

Home.requireAuth = true

'use client';
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import NavBar from '../../components/navBar';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  collection,
  addDoc,
  getDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {db} from '../firebase'

export default function Chantiers() {

  const router = useRouter();

  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'workers'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setWorkers(itemsArr);
      return () => unsubscribe();
    });
  }, []);

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const redirectToInformation = (workerMail) =>{
    const encodedEmail = encodeURIComponent(workerMail);
    router.push("/workers/" + encodedEmail)
  }

  return (
    <>
      <NavBar/>
      <h1 className='text-4xl mb-4 p-4 text-center'>Liste des ouvriers</h1>
      <div className=''>
          { workers.map((worker) => (
            <button key={worker.id} onClick={() => redirectToInformation(worker.mail)}  className='w-full'>
              <div className="text-center font-bold text-slate-50 bg-teal-800 p-2 rounded-lg mb-3 mt-3">{ worker.name}</div>
            </button>
          ))}
      </div>
      </>
  )
}

Chantiers.requireAuth = true
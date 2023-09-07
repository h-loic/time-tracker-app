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
import {db} from '../firebase'

export default function MyInformation() {

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
    <div className="p-8">
      <h1 className='text-4xl p-4 text-center'>Time Tracker app</h1>
      <div className='text-2xl p-4'>Bienvenue {worker.name }</div>
      <button className='' onClick={() => signOut()}>Logout</button>
    </div>
  )
}

MyInformation.requireAuth = true

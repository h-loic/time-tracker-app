'use client';
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
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

  return (
    <>
        <h1 className='text-4xl p-4 text-center'>Liste des ouvriers</h1>

        <div className=''>
            { workers.map((worker) => (
                <div key={worker.id} className="text-center text-slate-50 bg-blue-800 p-4 rounded-lg mb-3 mt-3">{ worker.name } {worker.totalHours}</div>
            ))}
        </div>
      </>
  )
}

Chantiers.requireAuth = true
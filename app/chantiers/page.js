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

  const [chantiers, setChantiers] = useState([]);
  const [chantiersShow,setChantiersShow] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'chantiers'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setChantiers(itemsArr);
      setChantiersShow(itemsArr);
      return () => unsubscribe();
    });
  }, []);

  const selectShowCondition = (condition) =>{
    let chantiersFinished = []
    let chantiersNotFinished = []
    if (condition == "all"){
      setChantiersShow(chantiers);
    }else{
      chantiers.map((chantier)=>{
        if (chantier.isFinished){
          chantiersFinished.push(chantier)
        }else{
          chantiersNotFinished.push(chantier)
        }
      })
      if (condition == "notFinished"){
        setChantiersShow(chantiersNotFinished);
      }else{
        setChantiersShow(chantiersFinished);
      }
    }
  }

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  return (
    <>
        <h1 className='text-4xl p-4 text-center'>Baustellen</h1>

        <Link href="addChantier" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ajouter un chantier</Link>

        <div className='grid grid-cols-3 gap-4 mb-5 mt-5'>
          <button onClick={() => selectShowCondition("all")} className="bg-blue-700 text-slate-50 p-2 rounded-lg justify-center">Tous</button>
          <button onClick={() => selectShowCondition("notFinished")} className="bg-blue-700 text-slate-50 p-2 rounded-lg justify-center">En cours</button>
          <button onClick={() => selectShowCondition("Finished")} className="bg-blue-700 text-slate-50 p-2 rounded-lg justify-center">Terminé</button>
        </div>

        <div className=''>
            { chantiersShow.map((chantier) => (
              <Link href={`/chantiers/${chantier.id}`} key={chantier.id}>
                <div className="text-center text-slate-50 bg-blue-800 p-4 rounded-lg mb-3 mt-3">{ chantier.name }</div>
              </Link>
            ))}
        </div>
      </>
  )
}

Chantiers.requireAuth = true
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
import NavBar from '../../components/navBar';
import {AiOutlinePlus} from 'react-icons/ai';
import {BsFillTrashFill} from 'react-icons/bs';

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
      <NavBar/>
      <h1 className='text-4xl p-4 text-center mb-3'>Baustellen</h1>

      <Link href="addChantier" type="button" className="rounded inline-flex items-center text-white bg-teal-800 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm p-2 mr-2 mb-2">
        <AiOutlinePlus className="mr-2"/><div>Nouveau Chantier</div>
      </Link>

      <div className='grid grid-cols-3 gap-4 mb-2 mt-3'>
        <button onClick={() => selectShowCondition("all")} className="bg-teal-700 text-slate-50 p-1 rounded-lg justify-center">Tous</button>
        <button onClick={() => selectShowCondition("notFinished")} className="bg-teal-700 text-slate-50 p-1 rounded-lg justify-center">En cours</button>
        <button onClick={() => selectShowCondition("Finished")} className="bg-teal-700 text-slate-50 p-1 rounded-lg justify-center">Terminé</button>
      </div>
      
      <div className=''>
          { chantiersShow.map((chantier) => (
            <Link href={`/chantiers/${chantier.id}`} key={chantier.id}>
              <div className="text-left text-slate-900 p-1.5 font-bold bg-slate-400 p-4 rounded-lg mb-1.5 mt-1.5">
                { chantier.name }
              </div>
            </Link>
          ))}
      </div>
    </>
  )
}

Chantiers.requireAuth = true
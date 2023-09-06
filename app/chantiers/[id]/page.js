'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs } from "firebase/firestore";
import {db} from '../../firebase'
import { useEffect, useState } from 'react';
import Link from 'next/link'

export default function Details({params : {id}}) {
    const [chantier, setChantier] = useState(null);
  
    useEffect(() => {
      if (id) {
        // Récupérer la tâche spécifique depuis Firestore en fonction de l'ID
        const docRef = doc(db, "chantiers", id);
        const fetchData = async () => {
          const docSnap = await getDoc(docRef);
          const a = docSnap.data();
          console.log(a);
          setChantier(a);
          
        }
        fetchData();
      }
    }, [id]);
  
    return (
      <>
      { chantier == null ?
        <div></div>
        :
        <div>
          <h1 className='text-4xl mb-4 p-4 text-center'>{ chantier.name}</h1>
          <Link href={`/chantiers/edit/${id}` } type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">modifier le chantier</Link>
          <h2 className='text-2xl p-4'>Budget : {chantier.budget}</h2>
          <h2 className='text-2xl p-4'>Nombre heures total : {chantier.totalHours}</h2>
          <h2 className='text-2xl p-4'>Nombre heures restante : {chantier.availableHours}</h2>
          <h2 className='text-2xl p-4'>Nombre heures utilisés : {chantier.usedHours}</h2>
          <h2 className='text-2xl p-4'>Chantier Terminé : { chantier.isFinished ? "oui" : "non"}</h2>
          <h2 className='text-2xl p-4'>Ouvrier ayant contribués :</h2>
        </div>
      }
    </>
    );
  }
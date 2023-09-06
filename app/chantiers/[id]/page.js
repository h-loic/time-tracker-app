'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs } from "firebase/firestore";
import {db} from '../../firebase'
import { useEffect, useState } from 'react';

export default function Details({params : {id}}) {
    const [chantier, setChantier] = useState(null);
  
    useEffect(() => {
      console.log("ok" + id)
      if (id) {
        console.log("ok")
        // Récupérer la tâche spécifique depuis Firestore en fonction de l'ID
        const docRef = doc(db, "chantiers", id);
        const fetchData = async () => {
          console.log("dac")
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
      <h1 className='text-4xl mb-4 p-4 text-center'>{chantier.name}</h1>
      <h2 className='text-2xl p-4'>Budget : {chantier.budget}</h2>
      <h2 className='text-2xl p-4'>Nombre heures total : {chantier.totalHours}</h2>
      <h2 className='text-2xl p-4'>Nombre heures restante : {chantier.availableHours}</h2>
      <h2 className='text-2xl p-4'>Nombre heures utilisés : {chantier.usedHours}</h2>
      <h2 className='text-2xl p-4'>Chantier Terminé : { chantier.isFinished ? "oui" : "non"}</h2>
      <h2 className='text-2xl p-4'>Ouvrier ayant contribués :</h2>
      
    </>
    );
  }
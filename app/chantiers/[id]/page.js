'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import {db} from '../../firebase'
import { useEffect, useState } from 'react';
import Link from 'next/link'

export default function Details({params : {id}}) {
    const [chantier, setChantier] = useState(null);
    const [workers, setWorkers] = useState([])
  
    useEffect(() => {
      if (id) {
        // Récupérer la tâche spécifique depuis Firestore en fonction de l'ID
        const docRef = doc(db, "chantiers", id);
        const fetchData = async () => {
          const docSnap = await getDoc(docRef);
          const a = docSnap.data();
          setChantier(a);
          
        }
        fetchData();

        const getWorkers = async () => {
          const query = await getDocs(collection(db, `chantiers/${id}/workers`))
          let workersfetch = []
          query.forEach(element => {
            workersfetch.push(element.data())
          });
          setWorkers(workersfetch);
        }

        getWorkers();
      }
    }, [id]);

    const changeFinishedStatus = async () => {
      await updateDoc(doc(db, 'chantiers', id), {
          isFinished : !chantier.isFinished
      })
      setChantier({
        name : chantier.name,
        budget : chantier.budget,
        totalHours : chantier.totalHours,
        availableHours : chantier.availableHours,
        usedHours : chantier.usedHours,
        isFinished : !chantier.isFinished
      })
    };
  
    return (
      <>
      { chantier == null ?
        <div></div>
        :
        <div>
          <h1 className='text-4xl mb-4 p-4 text-center'>{ chantier.name}</h1>
          <div className='grid grid-cols-2 gap-4 mb-5 mt-5'>
            <Link href={`/chantiers/edit/${id}` } type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">modifier le chantier</Link>
              <button type="button" onClick={() => changeFinishedStatus()} 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                {chantier.isFinished ? "rouvrir le chantier" : "terminer le chantier"}
                </button>
          </div>
          
          <h2 className='text-2xl p-4'>Budget : {chantier.budget}</h2>
          <h2 className='text-2xl p-4'>Nombre heures total : {chantier.totalHours}</h2>
          <h2 className='text-2xl p-4'>Nombre heures restante : {chantier.availableHours}</h2>
          <h2 className='text-2xl p-4'>Nombre heures utilisés : {chantier.usedHours}</h2>
          <h2 className='text-2xl p-4'>Chantier Terminé : { chantier.isFinished ? "oui" : "non"}</h2>
          <h2 className='text-2xl p-4'>Ouvrier ayant contribués :</h2>
          <div className=''>
            { workers.map((worker) => (
              <Link href={`/`} key={worker.workerId}>
                <div className="text-center text-slate-50 bg-blue-800 p-4 rounded-lg mb-3 mt-3">{ worker.name } { worker.workedHours }</div>
              </Link>
            ))}
        </div>
        </div>
      }
    </>
    );
  }
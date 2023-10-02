'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {db} from '../../firebase'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import NavBar from '../../../components/navBar';
import { useRouter } from 'next/navigation'

export default function Details({params : {id}}) {

    const router = useRouter();

    const [chantier, setChantier] = useState(null);
    const [workers, setWorkers] = useState([])
    const [tasks, setTasks] = useState([])
  
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

        const getTasks = async () => {
          const query2 = await getDocs(collection(db,`chantiers/${id}/tasks`))
          let tasks = []
          query2.forEach(element => {
            tasks.push(element.data())
          })
          setTasks(tasks);
        }
        getTasks();

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

    
    const deleteChantier = () => {
      const docRef = doc(db, "chantiers", id);
      deleteDoc(docRef).then(() => router.back())
    }
  
    return (
      <>
        <NavBar/>
      { chantier == null ?
        <div></div>
        :
        <div>
          <h1 className='text-4xl mb-4 p-4 text-center'>{ chantier.name}</h1>
          <div className='grid grid-cols-2 gap-4 mb-5 mt-5'>
            <Link href={`/chantiers/edit/${id}` } type="button" className="text-center text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-teal-800">modifier le chantier</Link>
              <button type="button" onClick={() => changeFinishedStatus()} 
              className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-blue-800">
                {chantier.isFinished ? "rouvrir le chantier" : "terminer le chantier"}
                </button>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                <tr>
                  <th>
                    Informations Générales 
                  </th>
                  <th>
                  </th>
                </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Budget
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {chantier.budget}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Nombre heures total
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {Math.round(chantier.totalHours)}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Nombre heures restante
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {Math.round(chantier.availableHours)}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Nombre heures utilisés
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {Math.round(chantier.usedHours)}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Chantier Terminé
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  { chantier.isFinished ? "oui" : "non"}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="mt-3 w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                <tr>
                  <th>
                    Répartitions des heures
                  </th>
                  <th>
                  </th>
                </tr>
            </thead>
            <tbody>
              { tasks.map((task) =>(
                <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                  <th className="text-center font-medium text-gray-900 dark:text-white">
                    {task.task}
                  </th>
                  <td className="text-left font-medium text-gray-900 dark:text-white">
                    {task.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="mt-3 w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                <tr>
                  <th>
                    ouvriers ayant participé
                  </th>
                  <th>
                    nombre d'heures travaillé
                  </th>
                </tr>
            </thead>
            <tbody>
              { workers.map((worker) =>(
                <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                  <th className="text-center font-medium text-gray-900 dark:text-white">
                    { worker.name }
                  </th>
                  <td className="text-left font-medium text-gray-900 dark:text-white">
                  { worker.workedHours }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => deleteChantier()} className="text-center absolute bottom-0 mt-5 mb-5 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
            supprimer le chantier
          </button>
        </div>
      }
    </>
    );
  }
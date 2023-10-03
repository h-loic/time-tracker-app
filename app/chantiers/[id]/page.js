'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {db} from '../../firebase'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import NavBar from '../../../components/navBar';
import { useRouter } from 'next/navigation'
import { FaTrashAlt } from 'react-icons/fa';

export default function Details({params : {id}}) {

    const router = useRouter();

    const [chantier, setChantier] = useState(null);
    const [workers, setWorkers] = useState([])
    const [tasks, setTasks] = useState([])
    const [newNote,setNewNote] = useState("")
  
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

    const addNote = async () => {
      const docRef = doc(db, "chantiers", id);
      await updateDoc(docRef, {
        notes : arrayUnion(newNote)
      })
      const updatedChantier = { ...chantier, notes: [...chantier.notes, newNote] };
      setChantier(updatedChantier)
      setNewNote("");
    }
  
    return (
      <>
        <NavBar/>
      { chantier == null ?
        <div></div>
        :
        <div className="">
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
                  Adresse
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {chantier.address}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Quoi
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {chantier.type}
                </td>
              </tr>
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
                <>
                {task.hours != 0 ? 
                  <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                  <th className="text-center font-medium text-gray-900 dark:text-white">
                    {task.task}
                  </th>
                  <td className="text-left font-medium text-gray-900 dark:text-white">
                    {task.hours}
                  </td>
                </tr> :
                <></>
                }
                </>
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

          <div className="ml-3 mt-5 text-md font-bold mb-3">Note</div>
          {chantier.notes.map((note) =>(
            <div className="w-full border border-teal-800 p-1 mt-1 rounded">{note}                            
            </div>
          ))}
          <textarea id="message" rows="4" className="mt-3 placeholder-teal-800 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
           placeholder="votre note..."
           value={newNote} onChange={(e) => setNewNote(e.target.value)} 
           ></textarea>
          <button type="button" onClick={() => addNote()} className="float-right p-2 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-blue-800"
            >ajouter une note
          </button>

          <br/>
          <br/>
          <br/>
          <br/>
          <button onClick={() => deleteChantier()} className="text-center bottom-0 mt-5 mb-5 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
            supprimer le chantier
          </button>
        </div>
      }
    </>
    );
  }
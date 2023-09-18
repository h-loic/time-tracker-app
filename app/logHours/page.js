"use client";
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { forEachChild } from 'typescript';
import { onSnapshot,collection, addDoc, query, where, updateDoc, doc, arrayUnion, increment, setDoc, getDoc } from 'firebase/firestore'
import {db} from '../firebase'
import { useRouter } from 'next/navigation'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function logHours(){

    const session = useSession({
        required: true,
        onUnauthenticated() {
          redirect('/signin');
        },
      });

    const router = useRouter();

    const taskHours = {task : "", hours : 0}
    const chantierTaskHours = [{task : "atelier", hours : 0},{task : "chantier", hours : 0}, {task : "regie", hours : 0}];

    const [date, setDate] = useState(new Date());
    const [worker, setWorker] = useState({});
    const [chantiers, setChantiers] = useState([]);

    const [loaded,setLoaded] = useState(false)

    const [loggedChantiers, setloggedChantiers] = useState([]);

      useEffect(() => {
        if(chantiers.length == 0 && !loaded){
            setLoaded(true)
            const chantiersRef = collection(db, 'chantiers');
            const q = query(chantiersRef, where("isFinished", "==", false));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              let itemsArr = [];
              querySnapshot.forEach((doc) => {
                itemsArr.push({ ...doc.data(), id: doc.id });
              });
              setChantiers(itemsArr);
              setloggedChantiers(oldArray => [...oldArray, {chantier : itemsArr[0].id, taskHours : chantierTaskHours}]);
              return () => unsubscribe();
            });
        }
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

    const handleFormSubmit = async () => {
        let totalHours = 0;

        loggedChantiers.forEach(async chantier => {
          chantier.taskHours.forEach(async task => {
            totalHours+= parseFloat(task.hours)
            const docRef5 = doc(db, `chantiers/${chantier.chantier}/tasks/${task.task}`)
            const document5 = await getDoc(docRef5);
            if (document5.exists()){
                await updateDoc(docRef5, {"hours" : increment(task.hours)})
            }else{
                await setDoc(docRef5, {"hours": task.hours})
            }
          });
        });

        loggedChantiers.forEach(async chantier => {
          const docRef1 = doc(db, `workers/${worker.id}/chantiers/${chantier.chantier}`)
          const document = await getDoc(docRef1);
          if (document.exists()){
              await updateDoc(docRef1, {"chantierId" : chantier.chantier,"chantierHours" : increment(totalHours)})
          }else{
              await setDoc(docRef1, {"chantierId" : chantier.chantier,"chantierHours" : totalHours})
          }
          const docRef2 = doc(db, `workers`,worker.id)
          updateDoc(docRef2, {
              totalHours : increment(totalHours)
          })
  
          const docRef3 = doc(db,"chantiers", chantier.chantier)
          updateDoc(docRef3,{
              availableHours : increment(-totalHours),
              usedHours : increment(totalHours)
          })
  
          const docRef4 = doc(db, `chantiers/${chantier.chantier}/workers/${worker.id}`)
          const document4 = await getDoc(docRef4);
          if (document4.exists()){
              await updateDoc(docRef4, {"name": worker.name,"workerId" : worker.id,"workedHours" : totalHours})
          }else{
              await setDoc(docRef4, {"name": worker.name,"workerId" : worker.id,"workedHours" : increment(totalHours)})
          }

          const docRef6 = doc(db, `workers/${worker.id}/workedDay/${date}`)
          const document6 = await getDoc(docRef6);
          if (document6.exists()){
              await updateDoc(docRef6, {"hours" : totalHours })
          }else{
              await setDoc(docRef6, {"hours" : increment(totalHours) })
          }
        })

        router.back();
    };

    const handleChantierChange = (oldChantierIndex, e) => {
      const { value } = e.target;
      if (loggedChantiers[oldChantierIndex].taskHours == undefined){
        loggedChantiers[oldChantierIndex] = {chantier : value, taskHours : chantierTaskHours};
      }else{
        loggedChantiers[oldChantierIndex].chantier = value;
      }
      setloggedChantiers(loggedChantiers)
    } 

    const handleTaskChange = (event, chantierIndex, taskIndex) => {
      const { value } = event.target;
      loggedChantiers[chantierIndex].taskHours[taskIndex].task = value;
      setloggedChantiers(loggedChantiers)
    }

    const handleNumberHoursChange = (event, chantierIndex, taskIndex) => {
      const { value } = event.target;
      loggedChantiers[chantierIndex].taskHours[taskIndex].hours = value;
      setloggedChantiers(loggedChantiers)
    }

    const addOtherChantier = () => {
      setloggedChantiers(oldArray => [...oldArray, {chantier : chantiers[0].id, taskHours : chantierTaskHours}]);
    }

    const removechantier = (index) => {
      loggedChantiers.splice(index,1);
      setloggedChantiers(oldArray => [...loggedChantiers]);
      console.log(loggedChantiers)
    }

    const addOtherTask = (index) => {
      loggedChantiers[index].taskHours.push(taskHours)
      //setloggedChantiers(loggedChantiers);
      setloggedChantiers(oldArray => [...loggedChantiers]);

    }

    const removeTask = (chantierIndex,taskIndex) => {
      loggedChantiers[chantierIndex].taskHours.splice(taskIndex,1);
      setloggedChantiers(oldArray => [...loggedChantiers]);
    }

    return(
        <>
            <h1 className='text-4xl p-4 text-center'>Rentré vos heures</h1>
            <br/><br/><br/>
            <div>
              <div className='flex items-center justify-center'>Date</div>
              <div className='flex items-center justify-center'>
                <DatePicker
                    className="items-center border-solid border-2 border-blue-600 text-center font-bold"
                    showIcon
                    selected={date}
                    onChange={(date) => setDate(date)}
                  />
              </div>
              <br/><br/>
                <div>
                    { loggedChantiers.map((loggedChantier, index) => (
                      <div key={index}>
                        <div className='border-solid border-2 border-slate-800 p-3'>
                        <label htmlFor="chantierId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sélectionné le chantier</label>
                          <select id="chantierId" value={chantiers.isFinished} name="chantierId" onChange={(e) => handleChantierChange(index, e)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              { chantiers.map((chantier) => (
                                  <option key={chantier.id} value={chantier.id}>{chantier.name}</option>
                              ))}
                          </select>
                          <br/>
                          <div>entré vos heures :</div>
                          <div className='grid grid-cols-2 gap-4 mb-2'>
                              <div className=''>Atelier </div>
                              <div className="">
                                <input placeholder="entré le nombre d'heures"
                                onChange={(e) => handleNumberHoursChange(e, index, 0)} 
                                type="number" name="numberOfHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                              </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4 mb-2'>
                              <div className=''>Chantier </div>
                              <div className="">
                                <input placeholder="entré le nombre d'heures" 
                                onChange={(e) => handleNumberHoursChange(e, index, 1)} 
                                type="number" name="numberOfHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                              </div>
                          </div>
                          <div className='grid grid-cols-2 gap-4 mb-2'>
                              <div className=''>Regie </div>
                              <div className="">
                                <input placeholder="entré le nombre d'heures" 
                                onChange={(e) => handleNumberHoursChange(e, index, 2)} 
                                type="number" name="numberOfHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                              </div>
                          </div>
                          {loggedChantier.taskHours.length > 3 ? loggedChantier.taskHours.map((task,taskIndex) =>(
                            <>
                            { taskIndex < 3 ? <></> :
                            <div key={task.taskIndex} className='grid grid-cols-3 gap-4 mb-2'>
                              <div>
                                <input id={taskIndex + index} name="chantierId" onChange={(e) => handleTaskChange(e,index,taskIndex)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                                </input>
                              </div>
                              <div className="">
                                <input placeholder="entré le nombre d'heures" 
                                onChange={(e) => handleNumberHoursChange(e, index, taskIndex)} 
                                type="number" name="numberOfHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                              </div>
                              <button onClick={() => removeTask(index,taskIndex)}
                              type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                Supprimer
                                </button>
                            </div>
                           }
                           </>
                          )) : <></>
                          } 
                          <button type='button' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={() => addOtherTask(index)}
                          >ajouter une tache</button>
                          <button onClick={() => removechantier(index)}
                            type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                            Supprimer les données de ce chantier
                          </button>
                        </div>
                        <br/>
                      </div>
                    ))
                  }
                <button type='button' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addOtherChantier}>ajouter des heures à un autre chantier</button>
                <br/><br/><br/>
                <button type="button" onClick={() => handleFormSubmit()} className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800">Valider mes heures</button>
                <br/><br/>
                <button type="button" onClick={() => router.back()} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Annuler</button>
              </div>
            </div>
        </>
    )
}

logHours.requireAuth = true
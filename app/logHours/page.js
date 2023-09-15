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

    const taskHours = {task : "tache1", hours : 0}
    const chantierTaskHours = [taskHours];

    const [startDate, setStartDate] = useState(new Date());
    const [worker, setWorker] = useState({});
    const [chantiers, setChantiers] = useState([]);
    const [isDateValidate, setDateValidate] = useState(false);

    const [formData, setFormData] = useState({
        numberOfHours: 0,
        chantierId: null,
    });

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
              setFormData({
                numberOfHours : 0,
                chantierId : itemsArr[0].id
              })
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
      console.log(loggedChantiers)
      /*
        const docRef1 = doc(db, `workers/${worker.id}/chantiers/${formData.chantierId}`)
        const document = await getDoc(docRef1);
        if (document.exists()){
            await updateDoc(docRef1, {"chantierId" : formData.chantierId,"chantierHours" : increment(formData.numberOfHours)})
        }else{
            await setDoc(docRef1, {"chantierId" : formData.chantierId,"chantierHours" : increment(formData.numberOfHours)})
        }
        const docRef2 = doc(db, `workers`,worker.id)
        updateDoc(docRef2, {
            totalHours : increment(formData.numberOfHours)
        })

        const docRef3 = doc(db,"chantiers", formData.chantierId)
        updateDoc(docRef3,{
            availableHours : increment(-formData.numberOfHours),
            usedHours : increment(formData.numberOfHours)
        })

        const docRef4 = doc(db, `chantiers/${formData.chantierId}/workers/${worker.id}`)
        const document4 = await getDoc(docRef4);
        if (document4.exists()){
            await updateDoc(docRef4, {"name": worker.name,"workerId" : worker.id,"workedHours" : increment(formData.numberOfHours)})
        }else{
            await setDoc(docRef4, {"name": worker.name,"workerId" : worker.id,"workedHours" : increment(formData.numberOfHours)})
        }

        router.back();
        */
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleChantierChange = (oldChantierIndex, newChantierId) => {
      if (loggedChantiers[oldChantierIndex].taskHours == undefined){
        loggedChantiers[oldChantierIndex] = {chantier : newChantierId, taskHours : chantierTaskHours};
      }else{
        loggedChantiers[oldChantierIndex].chantier = newChantierId;
      }
      setloggedChantiers(loggedChantiers)
      console.log(loggedChantiers)
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

    const addOtherTask = (index) => {
      loggedChantiers[index].taskHours.push(taskHours)
      setloggedChantiers(loggedChantiers);
      setloggedChantiers(oldArray => [...oldArray]);
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
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
              </div>
              <br/><br/>
                <div>
                    { loggedChantiers.map((loggedChantier, index) => (
                      <div key={loggedChantier.chantier}>
                        <div className='border-solid border-2 border-slate-800 p-3'>
                        <label htmlFor="chantierId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sélectionné le chantier</label>
                          <select id="chantierId" value={formData.isFinished} name="chantierId" onChange={() => handleChantierChange(index, loggedChantier.chantier)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              { chantiers.map((chantier) => (
                                  <option key={chantier.id} value={chantier.id}>{chantier.name}</option>
                              ))}
                          </select>
                          <br/>
                          <div>entré vos tâches</div>
                          { loggedChantier.taskHours.map((task,taskIndex) =>(
                            <div key={task.task} className='grid grid-cols-2 gap-4 mb-2'>
                              <div>
                              <select id="tache" name="chantierId" onChange={(e) => handleTaskChange(e,index,taskIndex)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="tache1">tache 1</option>
                                <option value="tache2">tache 2</option>
                                <option value="tache3">tache 3</option>
                                <option value="tache4">tache 4</option>
                                <option value="autre">autre</option>
                              </select>
                              </div>
                              <div className="">
                                <input placeholder="entré le nombre d'heures" 
                                onChange={(e) => handleNumberHoursChange(e, index, taskIndex)} 
                                type="number" name="numberOfHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                              </div>
                          </div>
                          ))
                          } 
                          <button type='button' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          onClick={() => addOtherTask(index)}
                          >ajouter une tache</button>
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
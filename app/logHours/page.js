"use client";
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { forEachChild } from 'typescript';
import { onSnapshot,collection, addDoc, query, where, updateDoc, doc, arrayUnion, increment, setDoc, getDoc } from 'firebase/firestore'
import {db} from '../firebase'
import { useRouter } from 'next/navigation'

export default function logHours(){

    const session = useSession({
        required: true,
        onUnauthenticated() {
          redirect('/signin');
        },
      });

    const router = useRouter();

    const [worker, setWorker] = useState({});
    const [chantiers, setChantiers] = useState([]);

    const [formData, setFormData] = useState({
        numberOfHours: 0,
        chantierId: null,
    });

      useEffect(() => {
        if(chantiers.length == 0){
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
        router.back();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return(
        <>
            <h1 className='text-4xl p-4 text-center'>Rentrer vos heures</h1>
            <form  onSubmit={handleFormSubmit} method="POST">
                <div className="mb-6">
                    <label htmlFor="numberOfHours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nombre d'heures</label>
                    <input value={formData.numberOfHours} onChange={handleInputChange} type="number" name="numberOfHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required/>
                </div>

                <div className='mb-5'>
                <label htmlFor="chantierId" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sélectionné le chantier</label>
                    <select id="chantierId" value={formData.isFinished} name="chantierId" onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        { chantiers.map((chantier) => (
                            <option key={chantier.id} value={chantier.id}>{chantier.name}</option>
                        ))}
                    </select>
                </div>

                <button type="button" onClick={() => handleFormSubmit()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Valider mes heures</button>
            </form>
        </>
    )
}

logHours.requireAuth = true
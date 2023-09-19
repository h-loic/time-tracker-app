'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import {
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query, 
  where,
  getDocs,
  useCollectionData
} from 'firebase/firestore';
import {db} from '../firebase'

export default function MyInformation() {


  const [worker, setWorker] = useState({});
  const [chantiers, setChantiers] = useState([]);

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });
  
  useEffect(() => {
    if (session.status != "loading") {
      let worker = null;
      const workersRef = collection(db, 'workers');
      const q = query(workersRef, where("mail", "==", session.data.user.email));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        let itemsArr = []
        querySnapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id });
        });
        worker = itemsArr[0];
        setWorker(worker)
        const chantiersArray = []
        const querySnapshot2 = await getDocs(collection(db,  `workers/${worker.id}/chantiers`));
          querySnapshot2.forEach(async (doco) => {
            const docData = doco.data();
            console.log(docData)
            const docRef3 = doc(db, "chantiers", docData.chantierId );
            const docSnap = await getDoc(docRef3);
            const doc2 = docSnap.data();
            chantiersArray.push({"chantierHours" : docData.chantierHours, "name" : doc2.name, "chantierId" : docData.chantierId});
            setChantiers(chantiersArray)
        });
        return () => unsubscribe();
      });
    }
  }, [session]);

  return (
    <div className="p-8">
      <h1 className='text-4xl p-4 text-center mb-5'>Mes informations</h1>
      <h2 className='text-2xl p-4'>nom : {worker.name}</h2>
      <h2 className='text-2xl p-4'>heures total travailler : {worker.totalHours}</h2>
      <h2 className='text-2xl p-4'>chantiers réalisés : </h2>
      <div className=''>
            { chantiers.map((chantier) => (
              <Link href={`/chantiers/${chantier.chantierId}`} key={chantier.chantierId}>
                <div className="text-center text-slate-50 bg-blue-800 p-4 rounded-lg mb-3 mt-3">{ chantier.name }  {chantier.chantierHours}h</div>
              </Link>
            ))}
        </div>
    </div>
  )
}

MyInformation.requireAuth = true

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
import NavBar from '../../components/navBar';

export default function MyInformation() {


  const [worker, setWorker] = useState({});
  const [chantiers, setChantiers] = useState([]);
  const [monthHours,setMonthHours] = useState(0);

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
        /*
        const chantiersArray = []
        const querySnapshot2 = await getDocs(collection(db,  `workers/${worker.id}/chantiers`));
          querySnapshot2.forEach(async (doco) => {
            const docData = doco.data();
            const docRef3 = doc(db, "chantiers", docData.chantierId );
            const docSnap = await getDoc(docRef3);
            const doc2 = docSnap.data();
            chantiersArray.push({"chantierHours" : docData.chantierHours, "name" : doc2.name, "chantierId" : docData.chantierId});
            setChantiers(chantiersArray)
        });
        */
        const dateActuelle = new Date();
        dateActuelle.setDate(1); // Définir le jour sur 1 pour obtenir le premier jour du mois
        const timestampOfTheMonth = dateActuelle.getTime();


        let totalMonthHours = 0;
        const workersRef2 = collection(db, `workers/${worker.id}/workedDay/`);
        const q2 = query(workersRef2, where("timestamp", ">", timestampOfTheMonth));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          totalMonthHours+= doc.data().hours
        });
        setMonthHours(totalMonthHours);
        return () => unsubscribe();
      });
    }
  }, [session]);

  return (
    <>
      <NavBar/>
      <div className="pb-8 pl-8 pr-8">
        <h1 className='text-4xl p-4 text-center mb-5'>{worker.name}</h1>
        <h2 className='text-2xl p-4'>heures total travailler : {monthHours}</h2>

      </div>
    </>
  )
}

MyInformation.requireAuth = true

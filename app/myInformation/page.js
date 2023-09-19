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
  const [weekHours,setWeekHours] = useState(0);
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

        let totalWeekHours = 0
        const dateActuelle = new Date();
        const jourActuel = dateActuelle.getDay();
        const premierJourDeLaSemaine = 1; // 0 pour dimanche, 1 pour lundi, 2 pour mardi, etc.
        const joursASoustraire = (jourActuel - premierJourDeLaSemaine + 7) % 7;
        dateActuelle.setDate(dateActuelle.getDate() - joursASoustraire);
        const timestampOfTheWeek = dateActuelle.getTime();
        const workersRef2 = collection(db, `workers/${worker.id}/workedDay/`);
        const q2 = query(workersRef2, where("timestamp", ">", timestampOfTheWeek));
        const querySnapshot2 = await getDocs(q2);
        querySnapshot2.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          totalWeekHours+= doc.data().hours
        });
        setWeekHours(totalWeekHours);

        let totalMonthHours = 0;
        dateActuelle.setDate(1); // Définir le jour sur 1 pour obtenir le premier jour du mois
        const timestampOfTheMonth = dateActuelle.getTime();
        const workersRef3 = collection(db, `workers/${worker.id}/workedDay/`);
        const q3 = query(workersRef3, where("timestamp", ">", timestampOfTheMonth));
        const querySnapshot3 = await getDocs(q3);
        querySnapshot3.forEach((doc) => {
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
        <h2 className='text-2xl p-4'>heures travallé cette semaine : {weekHours}</h2>
        <h2 className='text-2xl p-4'>heures travallé ce mois : {monthHours}</h2>
      </div>
    </>
  )
}

MyInformation.requireAuth = true

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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineLeft,AiOutlineRight } from 'react-icons/ai';

export default function MyInformation() {


  const [worker, setWorker] = useState({});
  const [monthHours,setMonthHours] = useState(0);
  const [date, setDate] = useState(new Date());

  const [tableData,setTableData] = useState({})
  const [selectedMonth, setSelectedMonth] = useState(undefined);
  const noWork = {"hours" : 0, "message" : "", "day" : 0};
  const [alreadyLoaded,setAlreadyLoaded] = useState(false)

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
  
  function getNumberOfDaysInMonth(year, month) {
    // Month is 0-based, so January is 0, February is 1, etc.
    const lastDayOfMonth = new Date(year, month + 1, 0);
    return lastDayOfMonth.getDate();
  }

  useEffect(() => {
    if (session.status != "loading" && !alreadyLoaded) {
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

        let dateActuelle = new Date();
        let totalMonthHours = 0;
        setDate(new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), 1));

        let year = dateActuelle.getFullYear();
        let month = dateActuelle.getMonth();
        let taille = getNumberOfDaysInMonth(year, month); 
        let tableau = Array.from({ length: taille }, () => noWork);

        let firstDay = new Date(year, month, 1);
        const moisSuivant = month === 11 ? 0 : month + 1;
        if (moisSuivant == 0) {
          year+=1
        }
        const nextMonth = new Date(year, moisSuivant, 1);
        let timestampOfTheNextMonth = nextMonth.getTime();
        let timestampOfTheMonth = firstDay.getTime();

        let workersRef3 = collection(db, `workers/${worker.id}/workedDay/`);
        let q3 = query(workersRef3, where("timestamp", ">=", timestampOfTheMonth), where("timestamp", "<", timestampOfTheNextMonth));
        let querySnapshot3 = await getDocs(q3);
        querySnapshot3.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          let data = doc.data() 
          let tempTimestamp = data.timestamp;
          let tempDate = new Date(tempTimestamp);
          tableau[tempDate.getDate()-1] = {"hours" : data.hours, "message" : data.message, "day" : tempDate.getDay()}
          totalMonthHours+= data.hours
        });

        tableData[firstDay.getTime()] = tableau;
        setTableData(tableData)
        setSelectedMonth(firstDay.getTime());
        setMonthHours(totalMonthHours);

        setAlreadyLoaded(true)
        return () => unsubscribe();
      });
    }
  }, [session]);

  const loadMonthBefore = async () => {
    let timestampOfTheNextMonth = date.getTime();
    let annee = date.getFullYear();
    let mois = date.getMonth();
    let moisPrecedent = mois === 0 ? 11 : mois - 1;
    if (moisPrecedent == 11) {
      annee-=1
    }
    let MonthDate = new Date(annee, moisPrecedent, 1);
    setDate(MonthDate)
    let year = MonthDate.getFullYear();
    let month = MonthDate.getMonth();
    let totalMonthHours = 0;
    let taille = getNumberOfDaysInMonth(year, month); 
    tableData[MonthDate.getTime()] = [];
    let tableau = Array.from({ length: taille }, () => noWork);
    MonthDate.setDate(1); // Définir le jour sur 1 pour obtenir le premier jour du mois
    let timestampOfTheMonth = MonthDate.getTime();
    let workersRef3 = collection(db, `workers/${worker.id}/workedDay/`);

    let q3 = query(workersRef3,where("timestamp", "<", timestampOfTheNextMonth), where("timestamp", ">=", timestampOfTheMonth));
    let querySnapshot3 = await getDocs(q3);
    querySnapshot3.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let data = doc.data() 
      let tempTimestamp = data.timestamp;
      let tempDate = new Date(tempTimestamp);
      tableau[tempDate.getDate()-1] = {"hours" : data.hours, "message" : data.message, "day" : tempDate.getDay()}
      totalMonthHours+= data.hours
    });
    tableData[MonthDate.getTime()] = tableau;
    setTableData(...[tableData])
    setSelectedMonth(MonthDate.getTime());
    setMonthHours(totalMonthHours);
  }

  const loadMonthNext = async () => {
    let annee = date.getFullYear();
    let mois = date.getMonth();
    let moisSuivant = mois === 11 ? 0 : mois + 1;
    if (moisSuivant == 0) {
      annee+=1
    }
    let MonthDate = new Date(annee, moisSuivant, 1);
    setDate(MonthDate)
    let year = MonthDate.getFullYear();
    let month = MonthDate.getMonth();
    let totalMonthHours = 0;
    let taille = getNumberOfDaysInMonth(year, month); 
    tableData[MonthDate.getTime()] = [];
    let tableau = Array.from({ length: taille }, () => noWork);
    MonthDate.setDate(1); // Définir le jour sur 1 pour obtenir le premier jour du mois
    let timestampOfTheMonth = MonthDate.getTime();

    let premierJourDuMoisSuivant = new Date(MonthDate);
    premierJourDuMoisSuivant.setMonth(MonthDate.getMonth() + 1);
    premierJourDuMoisSuivant.setDate(1);
    let timestampOfTheNextMonth = premierJourDuMoisSuivant.getTime();
    let workersRef3 = collection(db, `workers/${worker.id}/workedDay/`);
    let q3 = query(workersRef3,where("timestamp", ">=", timestampOfTheMonth), where("timestamp", "<", timestampOfTheNextMonth));
    let querySnapshot3 = await getDocs(q3);
    querySnapshot3.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      let data = doc.data() 
      let tempTimestamp = data.timestamp;
      let tempDate = new Date(tempTimestamp);
      tableau[tempDate.getDate()-1] = {"hours" : data.hours, "message" : data.message, "day" : tempDate.getDay()}
      totalMonthHours+= data.hours
    });
    tableData[MonthDate.getTime()] = tableau;
    setTableData(...[tableData])
    setSelectedMonth(MonthDate.getTime());
    setMonthHours(totalMonthHours);
  }

  return (
    <>
      <NavBar/>
      <div className="pb-8 pl-8 pr-8">
        <h1 className='text-2xl text-center mb-5'>{worker.name}</h1>
      </div>
      <div className='grid grid-cols-3 mb-5'>
        <a onClick={() => loadMonthBefore()}><AiOutlineLeft className='float-left font-bold' size="3em"/></a>
        <div className='text-center text-2xl font-bold'>{months[date.getMonth()]}</div>
        <a onClick={() => loadMonthNext()}><AiOutlineRight className='float-right font-bold' size="3em" /></a>
      </div>
          { tableData[selectedMonth] == undefined ? 
          <div>loading</div>
          :
            <table className="w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                    <tr>
                      <th>
                        Date
                      </th>
                      <th>
                        Heures
                      </th>
                      <th>
                        Message
                      </th>
                    </tr>
                </thead>
                <tbody>
              {tableData[selectedMonth].map((day, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th className="font-medium text-gray-900 dark:text-white">
                    {index+1}
                  </th>
                  <td className="">
                    {day.hours}
                  </td>
                  <td className="">
                    {day.message}
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        }
        <div className='w-full p-2 border-2 border-teal-800'>Total Heure :  {monthHours} </div>
    </>
  )
}

MyInformation.requireAuth = true

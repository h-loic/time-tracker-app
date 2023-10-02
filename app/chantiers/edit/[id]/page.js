'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs, setDoc } from "firebase/firestore";
import {db} from '../../../firebase'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NavBar from '../../../../components/navBar';

export default function EditChantier({params : {id}}) {
    const router = useRouter();
    const [chantier, setChantier] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        budget: 0,
      });

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        await setDoc(doc(db, 'chantiers', id), {
            name : formData.name,
            budget : formData.budget,
            totalHours : formData.totalHours,
            availableHours : formData.availableHours,
            usedHours : formData.usedHours,
            isFinished : formData.isFinished
        })
        router.back();
      };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    useEffect(() => {
      if (id) {
        // Récupérer la tâche spécifique depuis Firestore en fonction de l'ID
        const docRef = doc(db, "chantiers", id);
        const fetchData = async () => {
          const docSnap = await getDoc(docRef);
          const a = docSnap.data();
          setChantier(a);
          setFormData({
            name : a.name,
            budget : a.budget,
            totalHours : a.totalHours,
            availableHours : a.availableHours,
            usedHours : a.usedHours,
            isFinished : a.isFinished
          })
        }
        fetchData();
      }
    }, [id]);
  
    return (
        <>
            <NavBar/>
            { chantier == null ?
                <div></div>
                :
                <div>
                <h1 className='text-4xl mb-4 p-4 text-center'>Modifier { chantier.name}</h1>
                <form  onSubmit={handleFormSubmit} method="POST">
                    <div className="mb-6">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input value={formData.name} onChange={handleInputChange} type="text" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required/>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">budget</label>
                        <input value={formData.budget} onChange={handleInputChange} type="number" name="budget" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="totalHours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nombre heures total</label>
                        <input value={formData.totalHours} onChange={handleInputChange} type="number" name="totalHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="availableHours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nombre heures dispo</label>
                        <input value={formData.availableHours} onChange={handleInputChange} type="number" name="availableHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="usedHours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">nombre heures utilisés</label>
                        <input value={formData.usedHours} onChange={handleInputChange} type="number" name="usedHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="usedHours" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">chantier terminé</label>
                        <select id="countries" value={formData.isFinished} name="isFinished" onChange={handleInputChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value={false}>non</option>
                            <option value={true}>oui</option>
                        </select>
                    </div>
                    <button type="submit" className="mb-4 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">Modifier</button>
                    <button type="button" onClick={() => router.back()} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-red-800">Annuler</button>
                </form>
                </div>
            }
        </>
    );
  }
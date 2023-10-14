'use client';
import { collection, updateDoc } from "firebase/firestore";
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
      const [availableHours, setAvailableHours] = useState(0);

    const handleFormSubmit = async (e) => {
        let usedHours;
        if (formData.usedHours == "" || isNaN(formData.usedHours) || formData.usedHours == undefined || Number.isNaN(formData.usedHours)){
            usedHours = 0;
       }else{
           usedHours = formData.usedHours
       }
        let budget;
        if (formData.budget == "" || isNaN(formData.budget) || formData.budget == undefined || Number.isNaN(formData.budget)){
            budget = 0;
        }else{
            budget = formData.budget
        }
        let materiel;
        if (formData.materiel == "" || isNaN(formData.materiel) || formData.materiel == undefined || Number.isNaN(formData.materiel)){
            materiel = 0;
        }else{
            materiel = formData.materiel
        }
        let hoursPrice;
        if (formData.hoursPrice == "" || isNaN(formData.hoursPrice) || formData.hoursPrice == undefined || Number.isNaN(formData.hoursPrice)){
            hoursPrice = 0;
        }else{
            hoursPrice = formData.hoursPrice
        }
        let availableHours2;
        if (availableHours == "" || isNaN(availableHours) || availableHours == undefined || Number.isNaN(availableHours)){
            if (hoursPrice == 0){
                availableHours2 = 0
            }else{
                availableHours2 = ((budget - materiel) / hoursPrice) - usedHours
            }
        }else{
            availableHours2 = availableHours
        }
        e.preventDefault()
        await updateDoc(doc(db, 'chantiers', id), {
            name : formData.name,
            address : formData.address,
            type : formData.type,
            budget : budget,
            materiel : materiel,
            hoursPrice : hoursPrice,
            totalHours : parseInt(formData.totalHours),
            availableHours : availableHours2,
            usedHours : parseInt(formData.usedHours),
            isFinished : formData.isFinished,
        })
        router.back();
      };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (name == "budget") {
            setAvailableHours(((value-formData.materiel)/formData.hoursPrice)-usedHours)
        }else if (name == "materiel"){
            setAvailableHours(((formData.budget-value)/formData.hoursPrice)-usedHours)
        }else if (name == "hoursPrice"){
             setAvailableHours(((formData.budget-formData.materiel)/value)-usedHours)
        }
    };

  
    useEffect(() => {
      if (id) {
        // Récupérer la tâche spécifique depuis Firestore en fonction de l'ID
        const docRef = doc(db, "chantiers", id);
        const fetchData = async () => {
          const docSnap = await getDoc(docRef);
          const a = docSnap.data();
          setChantier(a);
          setAvailableHours(a.availableHours)
          setFormData({
            name : a.name,
            address :  a.address,
            type : a.type,
            budget : a.budget,
            materiel : a.materiel,
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
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input value={formData.name} onChange={handleInputChange} type="text" name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required/>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Adresse</label>
                        <input value={formData.address} onChange={handleInputChange} type="text" name="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required/>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">Quoi</label>
                        <input value={formData.type} onChange={handleInputChange} type="text" name="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="" required/>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900">budget</label>
                        <input value={formData.budget} onChange={handleInputChange} type="number" name="budget" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="materiel" className="block mb-2 text-sm font-medium text-gray-900">Prix matériel</label>
                        <input value={formData.materiel} onChange={handleInputChange} type="number" name="materiel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="totalHours" className="block mb-2 text-sm font-medium text-gray-900">nombre heures total</label>
                        <input value={formData.totalHours} onChange={handleInputChange} type="number" name="totalHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="availableHours" className="block mb-2 text-sm font-medium text-gray-900">nombre heures dispo</label>
                        <input value={formData.availableHours} onChange={handleInputChange} type="number" name="availableHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="usedHours" className="block mb-2 text-sm font-medium text-gray-900">nombre heures utilisés</label>
                        <input value={formData.usedHours} onChange={handleInputChange} type="number" name="usedHours" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="usedHours" className="block mb-2 text-sm font-medium text-gray-900">chantier terminé</label>
                        <select id="countries" value={formData.isFinished} name="isFinished" onChange={handleInputChange} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value={false}>non</option>
                            <option value={true}>oui</option>
                        </select>
                    </div>
                    <button type="submit" className="mb-4 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Modifier</button>
                    <button type="button" onClick={() => router.back()} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Annuler</button>
                </form>
                </div>
            }
        </>
    );
  }
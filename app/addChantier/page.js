"use client";
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link'
import { forEachChild } from 'typescript';
import { collection, addDoc } from 'firebase/firestore'
import {db} from '../firebase'
import { useRouter } from 'next/navigation'
import NavBar from '../../components/navBar';


export default function addChantier() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        budget: 0,
        materiel : 0,
        hoursPrice : 0,
        type : '',
      });
    const [availableHours, setAvailableHours] = useState(0);

    const handleFormSubmit = async (e) => {
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
                availableHours2 = (budget - materiel) / hoursPrice
            }
        }else{
            availableHours2 = availableHours
        }
        e.preventDefault()
        await addDoc(collection(db, 'chantiers'), {
            name : formData.name,
            address : formData.address,
            type : formData.type,
            budget : budget,
            materiel : materiel,
            hoursPrice : hoursPrice,
            totalHours : availableHours2,
            availableHours : availableHours2,
            usedHours : 0,
            workerContribution : {},
            isFinished : false,
            notes : []
        })
        router.back();
      };

    const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name == "budget") {
        setAvailableHours((value-formData.materiel)/formData.hoursPrice)
    }else if (name == "materiel"){
        setAvailableHours((formData.budget-value)/formData.hoursPrice)
    }else if (name == "hoursPrice"){
         setAvailableHours((formData.budget-formData.materiel)/value)
    }
    };

    const session = useSession({
        required: true,
        onUnauthenticated() {
          redirect('/signin');
        },
      });

    return (
        <>
            <NavBar/>
            <h1 className='text-4xl p-4 text-center'>Nouveau chantier</h1>
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
                    <label htmlFor="hoursPrice" className="block mb-2 text-sm font-medium text-gray-900">Prix de l'heure</label>
                    <input value={formData.hoursPrice} onChange={handleInputChange} type="number" name="hoursPrice" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                </div>
                <div className="mb-6">
                    <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900">Nombre d'heures dispo :</label>
                    <div className='text-xl text-center'>{availableHours}</div>
                </div>
                <button type="submit" className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Créer</button>
            </form>
        </>
    )
}

addChantier.requireAuth = true
"use client";
import React, { useState } from 'react';
import Link from 'next/link'
import { forEachChild } from 'typescript';
import { collection, addDoc } from 'firebase/firestore'
import {db} from '../firebase'
import { useRouter } from 'next/navigation'


export default function addChantier() {

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        budget: 0,
      });
    const [availableHours, setAvailableHours] = useState(0);

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        await addDoc(collection(db, 'chantiers'), {
            name : formData.name,
            budget : formData.budget,
            totalHours : availableHours,
            availableHours : availableHours,
            usedHours : 0,
            workerContribution : {},
            isFinished : false
        })
        router.push('/')
      };

    const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name == "budget") {
        setAvailableHours(value*0.9)
    }
    };

    return (
        <>
            <h1 className='text-4xl p-4 text-center'>Nouveau chantier</h1>
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
                    <label htmlFor="budget" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre d'heures dispo :</label>
                    <div className='text-xl text-center'>{availableHours}</div>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Créer</button>
            </form>
        </>
    )
}
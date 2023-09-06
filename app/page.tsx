import Image from 'next/image'
import Link from 'next/link'
import { collection, addDoc } from 'firebase/firestore'

export default function Home() {
  return (
    <>
        <h1 className='text-4xl p-4 text-center'>Baustellen</h1>

        <Link href="addChantier" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ajouter un chantier</Link>

        <div className='grid grid-cols-3 gap-4 mb-5 mt-5'>
          <div className="bg-blue-700 text-slate-50 p-2 rounded-lg justify-center">Tous</div>
          <div className="bg-blue-700 text-slate-50 p-2 rounded-lg justify-center">En cours</div>
          <div className="bg-blue-700 text-slate-50 p-2 rounded-lg justify-center">Terminé</div>
        </div>

        <div className=''>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">01</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">02</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">03</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">01</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">02</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">03</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">01</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">02</div>
            <div className="bg-blue-800 p-4 rounded-lg mb-3 mt-3">03</div>
        </div>
        </>
  )
}

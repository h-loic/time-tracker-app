'use client';
import { AuthErrorCodes, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signIn } from 'next-auth/react';

export default function Signup() {

    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
     const [passwordAgain, setPasswordAgain] = useState('');

  const signup = async() => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential)=>{
            console.log(userCredential)
            try{
              const docRef = await addDoc(collection(db, "workers"),{
                name,
                workerId: `${userCredential.user.uid}`,
                totalHours : 0,
                mail : email,
                chantiers : [],
              });
              signIn('credentials', {email, password, redirect: true, callbackUrl: '/'})
            }catch (e){
              console.error("Error :", e);
      }
    }
    ).catch( err => {
      if (err.code == "auth/email-already-in-use"){
        setError("mail déjà utilisé")
      }
      else if (err.code == AuthErrorCodes.WEAK_PASSWORD){
        setError("mot de passe trop faible")
      }
    })
  };
  
  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Créer un compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6">
                    Nom
                </label>
                <div className="mt-2">
                    <input
                    id="name"
                    name="name"
                    type="name"
                    autoComplete="name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full rounded-md border bg-white/5 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6">
                Adresse mail
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border bg-white/5 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6">
                  Mot de passe
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border bg-white/5 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6">
                  valider le mot de passe
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="passwordAgain"
                  name="passwordAgain"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  required
                  className="block w-full rounded-md border bg-white/5 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className='text-red-800'>
              {error}
              <br/>
              { password != passwordAgain ? "mdp différent" : ""}
            </div>
            <div>
              <button
                disabled={(!email || !password || !passwordAgain) || (password !== passwordAgain)}
                onClick={() => signup()}
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Créer le compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
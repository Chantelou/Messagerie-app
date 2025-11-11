"use client"

import { useEffect, useState } from 'react';
import { Contact, Message } from '@/types';
import Amis from '@/components/Amis';
import Discutions from '@/components/Discutions';
import { LoginMidleware } from '@/controllers/LoginMidleware';
import { useRouter } from 'next/navigation';
import ActivePushNotifications from '@/components/ActivePushNotifications';
import { Bounce, ToastContainer } from 'react-toastify';


function App() {



  const [currentContact, setCurrentContact] = useState('Marie');


  const contacts: Contact[] = [
    { name: 'Marie', status: 'En ligne', color: '#25D366' },
    { name: 'Thomas', status: 'En ligne', color: '#128C7E' },
    { name: 'Sophie', status: 'Vu à 09:15', color: '#999' },
    { name: 'Lucas', status: 'En ligne', color: '#25D366' }
  ];

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    LoginMidleware(router, setLoading, "chat")
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <p>Chargement en cours....</p>
        </main>
      </div>
    )
  }

  return (
    <div className="chat-container">
      {/* On demande l'autorisation des notifications push */}
      <ActivePushNotifications />

      <Amis />
      <Discutions contacts={contacts} currentContact={currentContact} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

    </div>
  );
}

export default App;

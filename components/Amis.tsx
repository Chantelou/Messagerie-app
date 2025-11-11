"use client"
import React, { useEffect, useState } from 'react'
import { Contact } from '@/types'
import { useUserStore } from '@/store'
import { GetAllUsers } from '@/controllers/GetAllusers'
import useSWR from 'swr'
import { LogOut } from 'lucide-react'
import { Logout } from '@/controllers/Logout'
import axios from 'axios'
import ChangeStatus from '@/controllers/ChangeStatus'
import { handleBeforeUnload } from '@/controllers/handleBeforeUnload'
import { handleVisibilityChange } from '@/controllers/handleVisibilityChange'
import { CurentUserStore } from '@/store/CurentUserStore'

function Amis() {

  //On importe la liste des utilisateurs depuis le store ainsi que la fonction pour mettre à jour cette liste
  const { ListeUsers, setListeUsers } = useUserStore()

  const { currentUser, setCurrentUser} = CurentUserStore()
  
  const [me, setMe] = useState("")

  //on va utiliser le SWR pour revalider les données en temps reel (la liste des utilisateurs)
  //Cela va nous permettre de savoir qui est en ligne ou hors ligne
  const { data, error, isLoading } = useSWR('/api/get-users', GetAllUsers, {
    refreshInterval: 10000 //On verifie si les données ont été mis à jour dans la db à chaque 10s
  })

  //la fonction Array.isArray permet de tester si c'est bien un tableau js
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setListeUsers(data); // ✅ seulement quand `data` change
    }
  }, [data, setListeUsers]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")!)?.id || null
    if (user) {
      setMe(user)
    }
  }, [])

  useEffect(() => {
    // ✅ Vérifie bien qu'on est dans le navigateur
    if (typeof window !== "undefined") {
      // ✅ Ajout des écouteurs d’événements
      document.addEventListener("visibilitychange", () => handleVisibilityChange(me)); //Quand on change l'onglet
      window.addEventListener("beforeunload", () => handleBeforeUnload(me)); //Quand on ferme l'application ou le navigateur

      // ✅ Nettoyage des écouteurs
      return () => {
        document.removeEventListener("visibilitychange", () => handleVisibilityChange(me));
        window.removeEventListener("beforeunload", () => handleBeforeUnload(me));
      };
    }
  }, [me]);

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <div className='flex justify-between items-center'>
          <h2>Discussions</h2>
          <button title='btn' type='button' onClick={() => Logout()} className='btn btn-error'><LogOut /></button>
        </div>
      </div>

      <div className="sidebar-contacts">
        {ListeUsers?.map((contact) => (
          <>
            {contact?.id !== me && (
              <button
                key={contact.name}
                className={`contact-item ${currentUser?.name === contact.name ? 'active' : ''}`}
                onClick={() => setCurrentUser(contact)}
              >
                <div className="contact-avatar">
                  {contact?.name![0]}
                  <span className={`contact-status-dot ${contact?.status === "online" ? "bg-green-500" : "bg-gray-500"}`}></span>
                </div>
                <div className="contact-info">
                  <div className="contact-name">{contact?.name!}</div>
                  <div className="contact-status">{contact?.status!}</div>
                </div>
              </button>
            )}

          </>

        ))}
      </div>
    </div>
  )
}

export default Amis

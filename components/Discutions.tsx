"use client"
import { Info, MessageSquare, Phone, Send, Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Contact, Message } from '../types';
import MessageReceived from './MessageReceived';
import SendMessage from './SendMessage';
import { CurentUserStore } from '@/store/CurentUserStore';
import axios from 'axios';
import { GetMessages } from '@/controllers/GetMessages';
import useSWR from 'swr';
import { OnsignalPushSubscribe } from '@/controllers/PushSubscribe';

function Discutions({ currentContact, contacts }: { currentContact: string, contacts: Contact[] }) {

    const { currentUser } = CurentUserStore()

    const [messages, setMessages] = useState<Message[]>([
       /*  { id: 1, text: 'Bonjour ! Comment ça va ?', sender: 'Marie', recever: "moi", time: '10:30' }, */
    ]);

    //On ecoute en temps reels les messages reçus
    const { data, error, isLoading } = useSWR('/api/get-all-messages', GetMessages, {
            refreshInterval: 2000, // On vérifie si les données ont été mises à jour dans la DB toutes les 2s
        }
    );

    useEffect(() => {

        //On filtre pour ne garder que les messages avec la personne qu'on est entrain de discuter
        if(data && Array.isArray(data) && data.length > 0 && currentUser) {

            const donnees: Message[] = data
            const filtre = donnees.filter(item => item.sender === currentUser?.id || item.recever === currentUser?.id)
            setMessages(filtre)
        }
    }, [data, currentUser])

    //On demande l'autorisation pour activer les notifications push
   /*  useEffect(() => {
        OnsignalPushSubscribe()
    }, []) */

    if(error) {
        console.log(error)
    }

    return (
        <>

            {!currentUser ? (
                <div className='flex flex-col gap-2 justify-center text-center items-center h-screen w-screen'>
                    <h3 className=' text-black'><MessageSquare size={50} /></h3>
                    <h1 className='text-3xl text-black'>Commencer à discuter</h1>
                    <p className='text-gray-500'>Selectionnez un amis à gauche pour demarrer le chat</p>
                </div>
            ) : (
                <div className="chat-main">
                    <div className="chat-header">
                        <div className="header-info">
                            <div className="header-avatar">
                                {currentUser?.name![0]}
                            </div>
                            <div className="header-details">
                                <div className="header-name">{currentUser?.name!}</div>
                                <div className="header-status">{currentUser?.status}</div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="header-btn">
                                <Phone size={20} />
                            </button>
                            <button className="header-btn">
                                <Video size={20} />
                            </button>
                            <button className="header-btn">
                                <Info size={20} />
                            </button>
                        </div>
                    </div>

                    <MessageReceived messages={messages} />
                    <SendMessage messages={messages} setMessages={setMessages} />

                </div>
            )}

        </>

    )
}

export default Discutions

"use client"
import React, { useEffect, useState } from 'react'
import { Message } from '@/types';
import { Image, Mic, Microchip, Send } from 'lucide-react';
import { CurentUserStore } from '@/store/CurentUserStore';
import axios from 'axios';
import { upload } from "@imagekit/next";
import imageCompression from "browser-image-compression";
import { ToastError } from '@/controllers/ToastMessage';
import AudioSend from './AudioSend';

function SendMessage({ messages, setMessages }: {
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}) {

    const [newMessage, setNewMessage] = useState('');
    const { currentUser } = CurentUserStore()

    const [recording, setRecording] = useState(false) // État pour savoir si l'enregistrement audio est en cours


    const [file, setFile] = useState<File | null>(null) //Pour l'envoi de l'image dans la db
    const [preview, setPreview] = useState("") //Pour voir un aperçu de l'image avant l'envoie

    const handleSendMessage = async (e?: React.FormEvent | null, url?: string | null) => {
        try {

            e?.preventDefault();

            let textToSend = "" //message à envoyé

            //Si c'est une image qu'on envoi
            if (url && url !== "") {
                textToSend = url
            } else {
                textToSend = newMessage
            }

            if (textToSend === "") return;

            //On recupère l'heure où le message a été envoyé
            const now = new Date();
            const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

            const message: Message = {
                text: textToSend,
                sender: JSON.parse(localStorage.getItem("user")!)?.id || "moi",
                recever: currentUser?.id!,
                time: time
            };

            const req = await axios.post("/api/new-message", message)
            setMessages([...messages, message]);
            setNewMessage('');

        } catch (error) {
            console.log(error)
            alert("Message non envoyé")
        } finally {
            setPreview("")
        }
    };


    //On ecoute les entréé de saisie du champs input
    const [isTyping, setIsTyping] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewMessage(value);
        setIsTyping(value.length > 0); //Si le champs n'est pas vide alors isTyping devient true
    };

    //Recuperons une image depuis le champs input file
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        //On recupère l'image selectionner
        const fichier = e.target?.files![0]
        setFile(fichier)

        //On converti l'image en base64 pour voir son aperçu avant envoie
        const lien = URL.createObjectURL(fichier)
        setPreview(lien)
    }


    const UploadImageAvecImageKit = async () => {
        try {

            const response = await fetch("/api/image-kit-auth");
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;

            if (!file) return ToastError("Selectionnecter une image");

            if (file && file.size > 1024 * 1024) return ToastError("Selectionner une image inférireur à 1Mb")

            // Options de compression
            const options = {
                maxWidthOrHeight: 800,
                useWebWorker: true,
                fileType: "image/webp",
            };

            // Convertir l'image en WebP
            const compressedImage = await imageCompression(file, options);

            //Envoie à imageKit.io
            const uploadResponse = await upload({ expire, token, signature, publicKey, file: compressedImage, fileName: `${Date.now()}.webp` });
            console.log("Upload response:", uploadResponse.url);

            const url = uploadResponse.url //On recupère l'url de l'image générer par imagekit.io

            //On envoi l'image au destinataire
            handleSendMessage(null, url)

        } catch (error) {
            console.log(error)
            return { message: "error" }
        }
    }

    return (
        <div className="chat-input-area">
            {preview && preview !== "" ? (
                <div className='flex justify-end flex-col'>
                    <img className='w-full mb-4 rounded-3xl' src={preview || ""} alt="" />
                    <div className="flex items-center justify-end gap-5">
                        <button onClick={() => setPreview("")} type='button' className="btn rounded-3xl bg-red-500 hover:bg-red-400 text-white ">Annuler</button>
                        <button type='button' onClick={() => UploadImageAvecImageKit()} className="btn rounded-3xl bg-green-500 hover:bg-green-400 text-white ">Envoyer</button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSendMessage} className="input-form">
                    {/* Si l'enregistrement audio n'est pas en cours, on affiche le champs de saisie et le bouton pour les images */}
                    {!recording && (
                        <>
                            {!isTyping && (
                                <>
                                    <input onChange={(e) => handleFile(e)} title='file' type="file" id='file' className="hidden" accept="image/*" />
                                    <label htmlFor='file' title='btn' className="send-button bg-blue-500 hover:bg-blue-400">
                                        <Image size={20} />
                                    </label>
                                </>
                            )}
                            <input
                                id='input'
                                type="text"
                                className="message-input"
                                placeholder="Écrivez un message..."
                                value={newMessage}
                                onChange={handleInputChange}
                            />
                        </>
                    )}

                    {!isTyping ? (
                        <AudioSend recording={recording} setRecording={setRecording} handleSendMessage={handleSendMessage} />
                    ) : (
                        <button title='btn' type="submit" className="send-button bg-green-500 hover:bg-green-400">
                            <Send size={20} />
                        </button>
                    )}
                </form>

            )}


        </div>
    )
}

export default SendMessage

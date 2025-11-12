// "use client" indique à Next.js que ce fichier sera exécuté côté client (navigateur)
"use client"

// Import de React et des hooks principaux (useState, useEffect, useRef, useMemo)
import React, { useEffect, useRef, useState } from "react";

// Import des composants et hooks du SDK VideoSDK pour gérer les réunions
import {
    MeetingProvider, // Fournit le contexte de la réunion à tous les enfants
    MeetingConsumer, // Permet de consommer ce contexte
    useMeeting,      // Hook pour interagir avec la réunion (join, leave, toggle mic/webcam)
    useParticipant,  // Hook pour obtenir les infos d'un participant
    VideoPlayer,     // Composant pour afficher la vidéo d'un participant
} from "@videosdk.live/react-sdk";
import { Camera, CameraOff, Mic, MicOff, StopCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { CurentUserStore } from "@/store/CurentUserStore";
import axios from "axios";
import { Message } from "@/types";
import { ParamValue } from "next/dist/server/request/params";

// Token d'authentification fourni par VideoSDK (à remplacer par votre vrai token)
export const authToken = process.env.NEXT_PUBLIC_VIDEOSDK_TOKEN;

// Fonction pour créer une réunion via l'API VideoSDK
const createMeeting = async () => {
    // Appel HTTP POST pour créer une salle (meeting)
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${authToken}`, // Authentification via le token
            "Content-Type": "application/json", // Format JSON
        },
        body: JSON.stringify({}), // Corps vide, mais on pourrait ajouter des configs
    });

    // Récupération de l'ID de la salle depuis la réponse JSON
    const { roomId } = await res.json();
    return roomId; // Retourne l'ID de la réunion créée
};

// Composant pour permettre à l'utilisateur de rejoindre ou créer une réunion
function JoinScreen({ getMeetingAndToken }: { getMeetingAndToken: (meeting?: string) => void }) {
    const [meetingId, setMeetingId] = useState<string | null>(null); // Stocke l'ID saisi par l'utilisateur

    // Fonction appelée au clic sur le bouton
    const onClick = async () => {
        await getMeetingAndToken(meetingId!); // Appelle la fonction pour rejoindre ou créer une réunion
    };

    return (
        <div className="w-full h-screen flex justify-center items-center flex-col gap-3">
            <h3>Appel video</h3>
            <button className="btn btn-primary" onClick={onClick}>Lancer un nouvel appel</button>

            <span> ou rejoindre un appel en cours</span>

            {/* Champ pour saisir l'ID d'une réunion existante */}
            <input
                type="text"
                placeholder="Entrez l'Id de l'appel"
                onChange={(e) => {
                    setMeetingId(e.target.value); // Met à jour l'état quand l'utilisateur tape
                }}
                className="input"
            />
            <button className="btn btn-error" onClick={onClick}>Rejoindre</button>
        </div>
    );
}

// Composant pour afficher un participant avec sa vidéo et son audio
function ParticipantView(props: { participantId: string }) {
    const micRef = useRef<HTMLAudioElement | null>(null); // Référence pour le lecteur audio
    const { micStream, webcamOn, micOn, isLocal, displayName } =
        useParticipant(props.participantId); // Récupère les infos du participant

    // Hook qui gère l'audio du participant
    useEffect(() => {
        if (micRef.current) {
            if (micOn && micStream) {
                const mediaStream = new MediaStream(); // Création d'un flux média
                mediaStream.addTrack(micStream.track); // Ajout de la piste audio du participant

                micRef.current.srcObject = mediaStream; // Assigne le flux au lecteur audio
                micRef.current
                    .play()
                    .catch((error) =>
                        console.error("videoElem.current.play() failed", error) // Gestion des erreurs
                    );
            } else {
                micRef.current.srcObject = null; // Si le micro est éteint, on coupe l'audio
            }
        }
    }, [micStream, micOn]); // Se déclenche quand le flux ou l'état du micro change

    return (
        <div key={props.participantId}>
            <div className="card shadow-xl">
                <div className="card-body">
                    {/* Affiche la vidéo seulement si la webcam est allumée */}
                    {webcamOn ? (
                        <>
                            <VideoPlayer
                                participantId={props.participantId} // Identifiant du participant
                                type="video" // Type de flux ("video" ou "share" pour le partage d'écran)
                                containerStyle={{
                                    height: "100%",
                                    width: "100%",
                                }}
                                className="h-full"
                                classNameVideo="h-full w-full rounded-xl"
                                videoStyle={{}}
                            />
                        </>
                    ) : (
                        <img
                            src="https://nerdschalk.com/content/images/wp-content/uploads/2020/12/zoom-leave-meeting-fi.png"
                            alt="Image de remplacement si la webcam est désactivée"
                            className="h-full w-full rounded-xl"
                        />
                    )}
                    {/* Affiche le nom du participant et l'état de sa webcam et micro */}
                    {/*  <p className="w-flull flex">
                        Participants: {displayName} | <Camera />: {webcamOn ? "ON" : "OFF"} | <Mic />:{" "}
                        {micOn ? "ON" : "OFF"}
                    </p> */}
                    {/* Lecteur audio du participant */}
                    <audio ref={micRef} autoPlay muted={isLocal} />
                    {/*  {JSON.parse(localStorage.getItem("user")!)?.id === } */}
                    <div className="flex justify-center text-center">
                        <Controls webcamOn={webcamOn} micOn={micOn} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant pour les contrôles (quitter, micro, webcam)
function Controls({ webcamOn, micOn }: { webcamOn: boolean, micOn: boolean }) {
    const { leave, toggleMic, toggleWebcam } = useMeeting(); // Hooks pour contrôler la réunion
    return (
        <div className="flex gap-3 items-center mb-4">
            <button title="btn" className="send-button bg-red-500 hover:bg-red-400" onClick={() => leave()}><StopCircle size={30} /></button> {/* Quitter la réunion */}
            <button title="btn" className="send-button bg-gray-500 hover:bg-gray-400" onClick={() => toggleMic()}>
                {micOn ? <Mic size={30} /> : <MicOff size={30} />}
            </button> {/* Activer/désactiver micro */}
            <button title="btn" className="send-button bg-green-500 hover:bg-green-400" onClick={() => toggleWebcam()}>
                {webcamOn ? <Camera size={30} /> : <CameraOff size={30} />}
            </button> {/* Activer/désactiver webcam */}
        </div>
    );
}

// Composant principal affichant la réunion et tous les participants
function MeetingView(props: {
    onMeetingLeave: () => void, // Callback quand la réunion est quittée
    meetingId: string,          // ID de la réunion
}) {
    const [joined, setJoined] = useState<string | null>(null); // Etat pour savoir si on a rejoint
    const { join } = useMeeting(); // Fonction pour rejoindre la réunion
    const { participants } = useMeeting({
        onMeetingJoined: () => {
            setJoined("JOINED"); // Mise à jour quand la réunion est rejointe
        },
        onMeetingLeft: () => {
            props.onMeetingLeave(); // Appelle la fonction parent quand on quitte
        },
    });

    const joinMeeting = () => {
        setJoined("JOINING"); // Affiche "Joining..." avant d'être connecté
        join(); // Rejoint la réunion
    };

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col h-screen w-full items-center justify-center">
                <h3>Id de l'appel: {props.meetingId}</h3>
                {joined && joined == "JOINED" ? (
                    <div>
                        <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Affiche tous les participants */}
                            {[...participants.keys()].map((participantId) => (
                                <ParticipantView
                                    participantId={participantId}
                                    key={participantId}
                                />
                            ))}
                        </div>
                    </div>
                ) : joined && joined == "JOINING" ? (
                    <p>Appel en cours...</p>
                ) : (
                    <button className="btn btn-primary" id="decrocheBtn" onClick={joinMeeting}>Décrocher</button>
                )}
            </div>
        </div>
    );
}


// Composant principal qui gère la logique complète de la vidéo
function VideoLive() {

    const { idUserToCall } = useParams() //id de l'utilisateur avec la quel on veut discuter par appel

    const { currentUser } = CurentUserStore() //L'utilisateur avec qui on veut discuter

    const [meetingId, setMeetingId] = useState<string | null>(null); // Stocke l'ID de la réunion actuelle

    // Fonction pour récupérer ou créer une réunion
    const getMeetingAndToken = async (id?: string) => {
        const meetingId = id && id.trim().length > 0 ? id : await createMeeting();
        console.log(meetingId)
        setMeetingId(meetingId); // Met à jour l'état avec l'ID
        return meetingId;
    };

    // Callback pour réinitialiser l'état après avoir quitté la réunion
    const onMeetingLeave = () => {
        setMeetingId(null);
    };


     const handleSendMessage = async (url: string) => {
        try {

            //On recupère l'heure où le message a été envoyé
            const now = new Date();
            const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

            const message: Message = {
                text: url,
                sender: JSON.parse(localStorage.getItem("user")!)?.id || "moi",
                recever: currentUser?.id!,
                time: time
            };

            const req = await axios.post("/api/new-message", message)
           
        } catch (error) {
            console.log(error)
            alert("Message non envoyé")
        } 
    };


    //On génère l'id de l'app au chargement de la page
    useEffect(() => {
        if (typeof window !== undefined) {
            const appel = async () => {

                console.log(currentUser?.id)
                const decrocheBtn = document.getElementById("decrocheBtn")

                if (currentUser?.id !== idUserToCall) { //On rejoind un appel (invité)
                    const idmeet = String(idUserToCall)
                    setMeetingId(idmeet && idmeet)
                    //On attend quelques milliseconde avant de rejoindre l'appel automatiquement
                   setTimeout(() => {
                        decrocheBtn?.click()
                   }, 100);

                } else { //On lance un nouvel appel
                    //Si l'id de l'appel existe dejà, on decroche l'appel immediatement
                    if (meetingId && meetingId !== "") {
                        decrocheBtn?.click()
                    } else {
                        const idmeet = await getMeetingAndToken() //Créé un nouveau id

                        //On envoi l'id de l'appel au destinataire
                        const urlToJoint = `${process.env.NEXT_PUBLIC_URL}/${idmeet}`

                        handleSendMessage(urlToJoint)
                        console.log(urlToJoint)

                        decrocheBtn?.click()
                    }
                }
            }
            appel()
        }

    }, [meetingId])


    // Si on a un token et un meetingId, on affiche la réunion, sinon l'écran de join
    return authToken && meetingId ? (
        <MeetingProvider
            config={{
                meetingId,
                micEnabled: true,   // Micro activé par défaut
                webcamEnabled: true, // Webcam activée par défaut
                name: JSON.parse(localStorage.getItem("user")!)?.name || "Invité",  // Nom du participant local
                debugMode: false,
            }}
            token={authToken} // Token pour rejoindre la réunion
        >
            <MeetingConsumer>
                {() => (
                    <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
                )}
            </MeetingConsumer>
        </MeetingProvider>
    ) : (
        <JoinScreen getMeetingAndToken={getMeetingAndToken} />
    );
}

export default VideoLive; // Export par défaut du composant principal

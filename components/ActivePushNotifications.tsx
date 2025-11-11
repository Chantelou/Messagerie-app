"use client"
import { SaveTokenPush } from '@/controllers/SaveTokenPush';
import { ToastSucces } from '@/controllers/ToastMessage';
import { getToken, messaging, onMessage } from '@/firebase/config';
import React, { useEffect } from 'react'

function ActivePushNotifications() {


    useEffect(() => {
        if (typeof window === "undefined" || !messaging) return;

        // Enregistre le service worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((reg) => console.log("Service Worker FCM enregistré :", reg.scope))
                .catch((err) => console.error("Erreur SW:", err));
        }

        // Demande la permission à l'utilisateur
        Notification.requestPermission().then(async (permission) => {
            if (permission === "granted") {
                try {
                    const token = await getToken(messaging, {
                        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
                    });
                    //On sauvegarde le token dans la db
                    SaveTokenPush(token)
                } catch (error) {
                    console.error("Erreur de token:", error);
                }
            }
        });

        // Écoute des notifications reçues en avant-plan ( quand l'application est ouverte)
        onMessage(messaging, (payload) => {
            console.log("Notification reçue :", payload);
            ToastSucces(`Nouvelle notification: ${payload.notification?.body}`)
            navigator.serviceWorker.getRegistration().then((reg) => {
                if (reg) {
                    reg.showNotification(payload?.notification?.title!, {
                        body: payload.notification?.body,
                        icon: payload.notification?.icon || "",
                    });
                }
            });
        });
    }, []);

    return null
}

export default ActivePushNotifications

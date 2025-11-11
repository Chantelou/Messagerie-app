// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAKYeoys5-8_bUf7j2RdWxuG4VyHzS4RBQ",
  authDomain: "messagerie-a02dc.firebaseapp.com",
  databaseURL: "https://messagerie-a02dc-default-rtdb.firebaseio.com",
  projectId: "messagerie-a02dc",
  storageBucket: "messagerie-a02dc.firebasestorage.app",
  messagingSenderId: "741330710819",
  appId: "1:741330710819:web:21a0ed1dea05388f5e9c96"
});

const messaging = firebase.messaging();

//Message en arriere plan
messaging.onBackgroundMessage((payload) => {
  console.log("Notification reçue en arrière-plan:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

//Message en premier plan
messaging.onMessage((payload) => {
  console.log("Notification reçue en premier-plan:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

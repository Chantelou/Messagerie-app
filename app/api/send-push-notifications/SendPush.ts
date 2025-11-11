import axios from "axios";

const { JWT } = require('google-auth-library');

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  // Vérifier si le token en cache est encore valide
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  
  const jwtClient = new JWT(
    process.env.FIREBASE_CLIENT_EMAIL!,
    null,
    process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/firebase.messaging']
  );
  
  const tokens = await jwtClient.authorize();
  
  // Mettre en cache (expire dans 55 minutes)
  cachedToken = tokens.access_token;
  tokenExpiry = Date.now() + (55 * 60 * 1000);
  
  return cachedToken;
}

// Utilisation
export async function SendNotification(userToken: string, title: string, body: string ) {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios.post(
      `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`,
     {
      message: {
        token: userToken,
        notification: {
          title: title,
          body: body
        },
        data: {},
        // Priorité haute pour envoi immédiat
        android: {
          priority: 'high',
          ttl: '3600s'
        },
        apns: {
          headers: {
            'apns-priority': '10',
            'apns-expiration': String(Math.floor(Date.now() / 1000) + 3600)
          }
        }
      }
    },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Notification envoyée avec succès:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi:', error.response?.data || error.message);
    throw error;
  }
}

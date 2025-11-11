
import OneSignal from 'react-onesignal';

export const OnsignalPushSubscribe = async () => {
    try {
        let externalId = Date.now() + Math.random().toString()

        await OneSignal.init({ appId: '0acae9ea-b3b5-4115-b785-2e90396195a8' })
        await OneSignal.Slidedown.promptPush()
        
        //On donne un externalID si pas dispo
        if (!localStorage.getItem("onsignal-external-id")) {
            await OneSignal.login(externalId);
            localStorage.setItem("onsignal-external-id", externalId)
        }
    } catch (error) {
        console.log(error)
    }
    
}

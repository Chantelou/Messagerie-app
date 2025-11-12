"use client"
import dynamic from "next/dynamic";

// Import du composant dynamiquement (⚡ ssr désactivé) pour eviter son execution coté serveur au lancement de l'app
const VideoLive = dynamic(() => import("@/components/VideoLive"), {
  ssr: false,
});

function page() {

  return (
    <div>
      <VideoLive />
    </div>
  )
}

export default page

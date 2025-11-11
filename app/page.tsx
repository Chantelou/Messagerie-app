"use client"

import { Login } from "@/controllers/Login";
import { LoginMidleware } from "@/controllers/LoginMidleware";
import { SaveUser } from "@/controllers/SaveUser";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    LoginMidleware(router, setLoading, "accueil")
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <button onClick={() => Login(router)} className="btn btn-error">Se connecter avec google</button>
      </main>
    </div>
  );
}

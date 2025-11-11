"use client"
import { Message } from '@/types'
import { useEffect, useState } from 'react'
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function MessageReceived({ messages }: { messages: Message[] }) {

    const [user, setUser] = useState("")

    useEffect(() => {
        if (typeof window !== undefined) {

            Fancybox.bind("[data-fancybox]", {}); //On initialise Fancybox

            const id = JSON.parse(localStorage.getItem("user")!)?.id || ""
            setUser(id)
        }
    }, [])

    return (
        <div className="messages-container">
            {messages?.map((message) => (
                <div
                    key={message.id}
                    className={`message-wrapper ${message.sender === user ? 'sent' : "received"}`}
                >
                    <div className="message-bubble overflow-hidden">

                        <div className="message-text">{message.text
                            && message.text.includes("https://ik.imagekit.io/")
                            && message.text.includes(".webp") ? (
                            <>
                                {/* c'est une image */}
                                <a href={message.text || ""} data-fancybox>
                                    <img src={message.text || ""} alt="image" width={"100px"} height={"100px"} className='object-cover' />
                                </a>
                            </>

                        ) : message.text.includes("https://ik.imagekit.io/")
                            && message.text.includes(".webm") ? (
                            <>
                                {/* c'est audio */}
                                <audio src={message.text || ""} controls></audio>
                            </>
                        ) : (
                            <>
                                {/* c'est du texte */}
                                <span>{message.text}</span>
                            </>
                        )}</div>
                        <div className="message-time">{message.time}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MessageReceived

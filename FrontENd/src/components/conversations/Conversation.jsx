import axios from 'axios'
import { useEffect, useState } from 'react'
import './conversation.css'

export default function Conversation({conversation, currentUser}) {
    const [user, setUser] = useState()
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    useEffect(() => {
        const friendId = conversation.members.find((m) => m !== currentUser._id)
        const getUser = async () =>  {
            try{
                const res = await axios('/users?userId=' + friendId)
                setUser(res.data)
            } catch(err) {
                console.log(err);
            }
        }
        getUser()
    }, [currentUser, conversation])
    return (
        <div className='conversation'>
            <img src={user?.profilePicture 
                ? PF + user.profilePicture 
                : PF+"avatar.png"} alt="img" className="conversationImg" /> 
            <span className="conversationName">{user?.username}</span>
        </div>
    )
}
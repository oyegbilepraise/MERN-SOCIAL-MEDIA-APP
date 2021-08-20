import axios from 'axios'
import { useEffect, useState } from 'react'
import './chatOnline.css'

export default function chatOnline({onlineUser, currentId, setCurrentChat}) {
    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const handleClick = async (user) => {
        try{
            const res = axios.get(`/conversations/find/${currenId}/${user._id}`)
            setCurrentChat(res.data)
        }catch(err){
            console.log(err);
        }
    }


    useEffect(() => {
        const getfriends = async () => {
            const res = await axios.get('/users/friends/' + currentId)
            setFriends(res.data)
        }
    }, [currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUser.includes(f._id)))
    }, [friends, onlineUser])

    return (
        <div className='chatOnline'>
            {onlineFriends.map((o) => {
                <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
                <div className="chatOnlineImgContainer">
                    <img src={o.profilePicture ? PF + o.profilePicture : PF+'person/noavatar.png'} alt="" className='chatOnlineImg' />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{o.username}</span>
            </div>
            })}
        </div>
    )
}

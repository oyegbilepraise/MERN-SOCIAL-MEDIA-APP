import './messenger.css'
import Topbar from '../../components/topbar/Topbar'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/message'
import ChatOnline from '../../components/chatOnline/chatOnline'
import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import {io} from 'socket.io-client'


export default function Messenger() {
    const [conversations, setconversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const socket = useRef(io('ws://localhost:8900'))
    const [arivalMessage, setArivalMessage] = useState(null)
    const [onlineUser, setOnlineUser] = useState([])
    const {user} = useContext(AuthContext)
    const scrollRef = useRef()

    useEffect(() => {  
        socket.current = io('ws://localhost:8900')
        socket.current.on('getMessage', data => {
            setArivalMessage({
                sender: data.senderId,
                text: data.text, 
                createdAt: Date.now()
            })  
        })
    }, [])

    useEffect(() => {
        arivalMessage && 
        currentChat?.members.includes(arivalMessage.sender) &&
        setMessages((prev) => [...prev, arivalMessage])
    }, [arivalMessage, currentChat])

    useEffect(() => {  
        socket.current.emit('addUser', user._id)
        socket.current.on('getUsers', users => {
            setOnlineUser(user.followings.filter((f) => users.some((u) => u.userId === f)))
        })
    }, [user])

    useEffect(() => {
        const getConversations = async () => {
            try{
                const res = await axios.get('/conversations/' + user._id)
                setconversations(res.data)
            }catch(err){
                console.log(err);
            }
        }
        getConversations()
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            try{
                const res = await axios.get('/messages/' + currentChat?._id)
                setMessages(res.data)
            }catch(err){
                console.log(err);
            }
        }
        getMessages()
    }, [currentChat])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "Smooth"})
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId : currentChat._id
        }

        const receiverId = currentChat.members.find(member => member !== user._id)

        socket.current.emit('sendMessage', {
            senderId: user._id,
            receiverId,
            text: newMessage
        })


        try{
            const res = await axios.post('/messages', message)
            setMessages([...messages, res.data])
            setNewMessage('')
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
        <Topbar />
        <div className='messenger'>
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <input type="text" placeholder='search for friends' className="chatMenuInput" />
                    {conversations.map((c) => (
                        <div onClick={() => setCurrentChat(c)}>
                            <Conversation conversation={c} currentUser={user} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ?
                    <>
                    <div className="chatBoxTop">
                        {messages.map((m) => (
                        <div ref={scrollRef}>
                            <Message message={m} own={m.sender === user._id} />
                        </div>
                        ))}
                    </div>
                    <div className="chatBoxBottom">
                        <input type="text" className='chatMessageInput' placeholder='enter ya message...' onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
                        <button className='chatSubmitButton' onClick={handleSubmit}>Chat</button>
                    </div> </> : 
                    <span className='noConversationText'>Open a Conversation to start a chat</span>}
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <ChatOnline onlineUser={onlineUser} currentId={user._id} setCurrentChat={setCurrentChat}/>
                </div>
            </div>
        </div>
        </>
    )
}

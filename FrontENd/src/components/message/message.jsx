import './message.css'
import {format} from 'timeago.js'

export default function message({message, own}) {
    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageTop">
                <img src="/assets/avatar.png" alt="" className='messageImg'/>
                <p className='messageText '>{message.text}</p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}

import React from 'react';

const Messages = props => {
    let { messages } = props

    messages = messages.map( (message, i) => {
        return <li className={`message message--${message.status.toLowerCase()}`} key={i}>{message.message}</li>
    })

    return (
        <ul className="messages">
            {messages}
        </ul>
    )
}

export default Messages

import React from 'react'

const NoDataScreen = ({ message, style, autosize }) => {
    return <div className={`no-data-message ${autosize ? '!h-auto' : ''}`} style={style}>
        <div className='no-data-message-text'>{message}</div>
    </div>
}

export default NoDataScreen
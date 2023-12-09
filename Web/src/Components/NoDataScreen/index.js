import React from 'react'

const NoDataScreen = ({ message, style }) => {
    return <div className='no-data-message' style={style}>
        <div className='no-data-message-text'>{message}</div>
    </div>
}

export default NoDataScreen
import React from 'react'

const Notfoundpage = ({ text, autoHeight }) => {
    return <div className={`w-full   flex justify-center items-center ${autoHeight ? ' !h-auto ' : 'not-found-message h-[calc(100vh-25.4px-2rem)] '}`}>
        <div className={`${autoHeight ? 'no-data-message !h-auto': 'no-data-message'}`}>
            <div className='no-data-message-text'>{text ? text : 'Böyle Bir sayfa Bulunamadı'}</div>
        </div>

    </div>
}

export default Notfoundpage
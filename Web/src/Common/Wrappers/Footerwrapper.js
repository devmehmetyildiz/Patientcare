import React from 'react'

export default function Footerwrapper({ children }) {
    return (
        <div className='flex flex-row w-full justify-between py-4  items-center'>
            {children}
        </div>
    )
}

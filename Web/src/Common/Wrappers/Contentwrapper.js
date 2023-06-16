import React from 'react'

export default function Contentwrapper({ children }) {
    return (
        <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            {children}
        </div>
    )
}

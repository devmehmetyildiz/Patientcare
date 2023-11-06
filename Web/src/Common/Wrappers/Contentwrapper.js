import React from 'react'

export default function Contentwrapper({ children }) {
    return (
        <div className='w-full bg-white px-4 py-2 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            {children}
        </div>
    )
}

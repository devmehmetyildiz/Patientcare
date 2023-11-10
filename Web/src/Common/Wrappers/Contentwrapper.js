import React, { useEffect, useState } from 'react'

export default function Contentwrapper({ children }) {
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const contentContainer = document.getElementById('content-container');
            const overflow = contentContainer.scrollHeight > contentContainer.clientHeight;
            setIsOverflowing(overflow);
        };

        window.addEventListener('resize', checkOverflow);
        checkOverflow(); // Run on initial render

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    let style = {}
    isOverflowing && (style.overflowY = 'auto')

    return (
        <div id="content-container" style={style} className='w-full max-h-[calc(80vh-59px-2rem)] bg-white px-4 pt-2 pb-4 rounded-t-lg shadow-md outline outline-[1px] outline-gray-200'>
            {children}
        </div>
    )
}

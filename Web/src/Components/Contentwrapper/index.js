import React, { useEffect, useState } from 'react'

export default function Contentwrapper({ children, additionalStyle, isfullscreen, scrollable }) {
    const [isOverflowing, setIsOverflowing] = useState(false);

    const checkOverflow = () => {
        const contentContainer = document.getElementById('content-container');
        const overflow = contentContainer.scrollHeight > contentContainer.clientHeight;
        setIsOverflowing(overflow);
    };
    useEffect(() => {
        //checkOverflow(); // Run on initial render
    });

    let style = {}
    isOverflowing && (style.overflowY = 'auto')

    return (
        <div
            id="content-container"
            style={style}
            className={`w-full ${isfullscreen ? '' : 'max-'}h-[calc(80vh-59px-2rem)] z-0 bg-white px-4 pt-2 pb-4 rounded-t-lg shadow-md outline outline-[1px] outline-gray-200 ${additionalStyle}`}>
            {children}
        </div>
    )
}

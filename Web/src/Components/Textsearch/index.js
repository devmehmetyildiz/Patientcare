import React, { useEffect, useState } from 'react'
import { Input, Search } from 'semantic-ui-react'

export default function Index({ data, columns, handleData, Config }) {

    const [text, Settext] = useState('')
    console.log('text: ', text);

    useEffect(() => {
        let responsedata = (data || []).map(row => {
            console.log('row: ', row);
            Object.keys(row).map((cell) => {
                (columns || []).find(u=>u.acc)
                console.log('cell: ', cell);
            })
        })
    }, [data])

    return (
        <div className='w-full flex justify-start items-center my-2'>
            <Input
                icon='search'
                iconPosition='left'
                placeholder='Arama...'
                onChange={(e) => {
                    Settext(e.target.value)
                }}
                value={text}
            />
        </div>
    )
}

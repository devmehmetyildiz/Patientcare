import React from 'react'
import { Header } from 'semantic-ui-react'

export default function Headerwrapper({ children }) {
    return (
        <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none' }} as='h1' attached='top' >
                {children}
            </Header>
        </div>
    )
}

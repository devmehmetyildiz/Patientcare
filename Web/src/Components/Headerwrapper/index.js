import React from 'react'
import { Header } from 'semantic-ui-react'

export default function Headerwrapper({ children }) {
    return (
        <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
                {children}
            </Header>
        </div>
    )
}

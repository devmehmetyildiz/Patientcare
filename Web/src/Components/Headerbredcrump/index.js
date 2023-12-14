import React from 'react'
import { Breadcrumb } from 'semantic-ui-react'

export default function Headerbredcrump({ children }) {
    return (
        <Breadcrumb size='big'>
            {children}
        </Breadcrumb>
    )
}

import React from 'react'

export default function index(props) {
    return (
        <div {...props}>
            {props.children}
        </div>
    )
}

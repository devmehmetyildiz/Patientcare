import React, { Component } from 'react'
import {  Loader } from 'semantic-ui-react'

export class LoadingPage extends Component {
    render() {
        return (
            <div className='w-full h-[calc(100vh-25.4px-2rem)] flex justify-center items-center '>
                <Loader size='large' active inline='centered' >Yükleniyor...</Loader>
            </div >
        )
    }
}
export default LoadingPage
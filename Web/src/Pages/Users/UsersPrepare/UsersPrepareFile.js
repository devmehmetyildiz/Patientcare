import React from 'react'
import Fileupload from '../../../Components/Fileupload'

export default function UsersPrepareFile(props) {

    const { fillnotification, Usagetypes, selectedFiles, setselectedFiles, Profile } = props

    return (
        <Fileupload
            fillnotification={fillnotification}
            Usagetypes={Usagetypes}
            selectedFiles={selectedFiles}
            setselectedFiles={setselectedFiles}
            Profile={Profile}
        />
    )
}

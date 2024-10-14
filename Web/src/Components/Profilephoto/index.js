import React, { useEffect, useState } from 'react'
import validator from '../../Utils/Validator'
import DownloadPngFile from '../../Utils/DownloadFile'
import { Loader } from 'semantic-ui-react'

export default function Profilephoto(props) {

    const { fileID, fillnotification, Profile, Imgheigth, right } = props

    const [img, setImg] = useState(null)
    const [sended, setSended] = useState(false)

    useEffect(() => {
        if (validator.isUUID(fileID) && fillnotification && Profile && !sended) {
            setSended(true)
            DownloadPngFile({ fileID: fileID, fillnotification: fillnotification, Profile: Profile, setImg })
        }
    }, [fileID, fillnotification, Profile, sended])

    const objectHeigth = Imgheigth ? Imgheigth : '100px'

    return (
        img ? <div className={` ${right ? 'absolute top-2 right-2' : ''} `}>
            <img
                alt='pp'
                src={img}
                className="rounded-full"
                style={{ width: objectHeigth, height: objectHeigth }}
            />
        </div> : <div className={` ${right ? 'absolute top-2 right-2' : ''} `} style={{ width: objectHeigth, height: objectHeigth }}>
            <Loader />
        </div>
    )
}

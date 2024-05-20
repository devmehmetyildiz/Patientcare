import React, { useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import Literals from './Literals'

export default function PersonelshiftsFastcreate(props) {
    const {
        Profile,
        Personelshifts,
        GetfastcreatedPersonelshifts,
        selectedProfession,
        selectedStartdate,
        setPersonelshifts
    } = props


    const {
        fastcreatedlist,
        isLoading,
        isFastcreatesuccess,
    } = Personelshifts

    useEffect(() => {
        if (isFastcreatesuccess) {
            setPersonelshifts(fastcreatedlist)
        }
    }, [isFastcreatesuccess])

    return (
        <Button className='!bg-[#2355a0] !text-white' floated='right' disabled={isLoading} onClick={(e) => {
            e.preventDefault()
            GetfastcreatedPersonelshifts({
                data: {
                    ProfessionID: selectedProfession,
                    Startdate: selectedStartdate
                }
            })
        }} >{Literals.Button.Autofill[Profile.Language]}</Button>
    )
}

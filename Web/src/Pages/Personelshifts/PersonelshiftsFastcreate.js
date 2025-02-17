import React, { useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import privileges from '../../Constants/Privileges'

export default function PersonelshiftsFastcreate(props) {
    const {
        Profile,
        Personelshifts,
        GetFastCreatedPersonelshift,
        selectedProfession,
        selectedStartdate,
        setPersonelshifts,
        removeFastCreatedList
    } = props

    const t = Profile?.i18n?.t

    const {
        fastCreatedList,
        isFastCreatedListLoading,
        isFastCreatedListSuccess
    } = Personelshifts

    useEffect(() => {
        if (isFastCreatedListSuccess) {
            setPersonelshifts(fastCreatedList)
            removeFastCreatedList()
        }
    }, [isFastCreatedListSuccess, removeFastCreatedList])

    return (
        <Button className='!bg-[#2355a0] !text-white' floated='right' loading={isFastCreatedListLoading} disabled={isFastCreatedListLoading} onClick={(e) => {
            e.preventDefault()
            if (validator.isHavePermission(privileges.personelshiftfastcreate, Profile?.roles))
                GetFastCreatedPersonelshift({
                    data: {
                        ProfessionID: selectedProfession,
                        Startdate: selectedStartdate
                    }
                })
        }} >{t('Common.Button.Fill')}</Button>
    )
}

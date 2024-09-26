import React from 'react'
import { Label } from 'semantic-ui-react'

export default function UserDetailShift(props) {

    const { Shiftdefines, Profile, user } = props

    const t = Profile?.i18n?.t
    const activeshiftdefineID = user?.ShiftdefineID
    const activeshiftdefine = (Shiftdefines.list || []).find(u => u.Uuid === activeshiftdefineID)

    return (
        <div className='relative bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
            <div className='my-4 !text-[#2355a0] text-lg font-extrabold' >{(t('Pages.Users.Detail.Shift.Header'))}</div>
            {activeshiftdefine
                ? <Label size='large' className='!text-white' basic >{activeshiftdefine?.Name}</Label>
                : <div className=' font-semibold text-[#777777dd]'>
                    {t('Pages.Users.Detail.Shift.Messages.NoShiftFound')}
                </div>}
        </div>
    )
}

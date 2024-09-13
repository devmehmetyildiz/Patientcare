import React from 'react'
import { GENDER_OPTION } from '../../../Utils/Constants'
import { Header } from 'semantic-ui-react'
import Formatdate from '../../../Utils/Formatdate'

export default function UsersDetailInfo(props) {

    const { user, Profile } = props

    const t = Profile?.i18n?.t


    const getAge = (dateOfBirth, dateToCalculate) => {
        const dob = new Date(dateOfBirth).getTime();
        const dateToCompare = new Date(dateToCalculate).getTime();
        const age = (dateToCompare - dob) / (365 * 24 * 60 * 60 * 1000);
        return Math.floor(age);
    };

    const Age = user?.Dateofbirth ? getAge(user?.Dateofbirth, new Date()) : t('Common.NoDataFound')
    const Gender = GENDER_OPTION.find(u => u.value === user?.Gender)?.text[Profile?.Language] || t('Common.NoDataFound')
    const CountryID = user?.CountryID || t('Common.NoDataFound')
    const Dateofbirth = user?.Dateofbirth ? Formatdate(user?.Dateofbirth, true) : t('Common.NoDataFound')
    const Phonenumber = user?.Phonenumber || t('Common.NoDataFound')
    const Bloodgroup = user?.Bloodgroup || t('Common.NoDataFound')
    const Foreignlanguage = user?.Foreignlanguage || t('Common.NoDataFound')
    const Graduation = user?.Graduation || t('Common.NoDataFound')

    const Columns = [
        { label: t('Pages.Users.Detail.Info.Label.Age'), value: Age },
        { label: t('Pages.Users.Detail.Info.Label.Gender'), value: Gender },
        { label: t('Pages.Users.Detail.Info.Label.CountryID'), value: CountryID },
        { label: t('Pages.Users.Detail.Info.Label.Dateofbirth'), value: Dateofbirth },
        { label: t('Pages.Users.Detail.Info.Label.Phonenumber'), value: Phonenumber },
        { label: t('Pages.Users.Detail.Info.Label.Bloodgroup'), value: Bloodgroup },
        { label: t('Pages.Users.Detail.Info.Label.Foreignlanguage'), value: Foreignlanguage },
        { label: t('Pages.Users.Detail.Info.Label.Graduation'), value: Graduation },
    ]

    return (
        <div className='bg-white shadow-lg w-full rounded-lg flex flex-col gap-4 justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
            <div className='w-full flex justify-start items-start'>
                <div className='font-bold text-xl '> {t('Pages.Users.Detail.Info.Header')}</div>
            </div>
            {Columns.map((item, index) => {
                return <div key={index} className='w-full flex justify-center items-center gap-2'>
                    <div className='w-full text-right font-bold'>
                        {`${item.label}:`}
                    </div>
                    <div className='w-full text-left font-semibold text-[#777777dd]'>
                        {item.value}
                    </div>
                </div>
            })}
        </div>
    )
}

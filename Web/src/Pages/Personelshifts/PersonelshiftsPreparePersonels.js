import React from "react"
import PersonelshiftsPreparePersonelsdetail from "../../Containers/Personelshifts/PersonelshiftsPreparePersonelsdetail"
import { NoDataScreen, Pagedivider } from "../../Components";

export default function PersonelshiftsPreparePersonels({ professionUsers, Startdate, startDay, lastDay, professionFloors, personelshifts, setPersonelshifts, Profile }) {

    const t = Profile?.i18n?.t

    const usedUsers = [...new Set([...(personelshifts).map(u => u?.PersonelID)])];

    const freeUsercount = (professionUsers || []).filter(u => !usedUsers.includes(u?.Uuid)).length

    return (
        <div className="w-full">
            <div className="font-bold text-lg text-black">{t('Pages.Personelshifts.Page.PreparePersonelHeader')}</div>
            <Pagedivider />
            <div>
                <div className='w-full flex flex-row flex-wrap justify-start items-start'>
                    {freeUsercount > 0
                        ? professionUsers.filter(u => !usedUsers.includes(u?.Uuid)).map(user => {
                            return <PersonelshiftsPreparePersonelsdetail
                                Startdate={Startdate}
                                startDay={startDay}
                                lastDay={lastDay}
                                key={user?.Uuid}
                                user={user}
                                personelshifts={personelshifts}
                                setPersonelshifts={setPersonelshifts}
                                professionFloors={professionFloors}
                            />
                        })
                        : <NoDataScreen
                            message={t('Pages.Personelshifts.Messages.NoFreeUserFound')}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'auto' }}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

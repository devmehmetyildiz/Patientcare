import React from "react"
import PersonelshiftsPrepareShiftsdetail from "../../Containers/Personelshifts/PersonelshiftsPrepareShiftsdetail"
import { Card } from "semantic-ui-react"
import { Getshiftstartdate } from "../../Utils/Formatdate"
import { Pagedivider } from "../../Components"

export default function PersonelshiftsPrepareShifts({ readOnly, isGeneralshift, Startdate, startDay, lastDay, personelshifts, setPersonelshifts, professionFloors, professionUsers, Profile }) {

    const t = Profile?.i18n?.t

    let columns = []
    columns.push({ name: "PersonelID", label: t('Pages.Personelshifts.Column.Personel'), width: 3 })
    columns.push({ name: "ShiftID", label: t('Pages.Personelshifts.Column.Shift'), width: 3 })

    for (let index = startDay; index <= lastDay; index++) {
        columns.push({ name: index, label: `${index}` })
    }

    return <div className="w-full">
        <div className="font-bold text-lg text-black">{t('Pages.Personelshifts.Page.PrepareShiftHeader')}</div>
        <Pagedivider />
        <div>
            {isGeneralshift
                ? <div className='flex flex-col justify-center items-center w-full gap-4'>
                    <PersonelshiftsPrepareShiftsdetail
                        readOnly={readOnly}
                        columns={columns}
                        personelshifts={personelshifts}
                        setPersonelshifts={setPersonelshifts}
                        professionUsers={professionUsers}
                    />
                </div>
                : <div className='flex flex-col justify-center items-center w-full gap-4'>
                    {professionFloors.sort((a, b) => b.Gender - a.Gender).map((floor, index) => {
                        return <PersonelshiftsPrepareShiftsdetail
                            readOnly={readOnly}
                            key={floor?.Uuid}
                            floor={floor}
                            columns={columns}
                            personelshifts={personelshifts}
                            setPersonelshifts={setPersonelshifts}
                            professionUsers={professionUsers}
                            isLast={index === (professionFloors || []).length - 1}
                        />
                    })}
                </div>}
        </div>
    </div>


}
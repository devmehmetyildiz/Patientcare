import React from "react"
import PersonelshiftsPrepareShiftsdetail from "../../Containers/Personelshifts/PersonelshiftsPrepareShiftsdetail"
import Literals from "./Literals"
import { Card } from "semantic-ui-react"
import { Getshiftstartdate } from "../../Utils/Formatdate"


export default function PersonelshiftsPrepareShifts({ isGeneralshift, Startdate, startDay, lastDay, personelshifts, setPersonelshifts, professionFloors, professionUsers, Profile }) {

    let columns = []
    columns.push({ name: "PersonelID", label: Literals.Columns.Personel[Profile.Language], width: 3 })
    columns.push({ name: "ShiftID", label: Literals.Columns.Shift[Profile.Language], width: 3 })
    
    for (let index = startDay; index <= lastDay; index++) {
        columns.push({ name: index, label: `${index}` })
    }
    
    return <Card fluid>
        <Card.Content header={Literals.Page.Pageprepareshiftheader[Profile.Language]} />
        <Card.Content extra>
            {isGeneralshift
                ? <div className='flex flex-col justify-center items-center w-full gap-4'>
                    <PersonelshiftsPrepareShiftsdetail
                        columns={columns}
                        personelshifts={personelshifts}
                        setPersonelshifts={setPersonelshifts}
                        professionUsers={professionUsers}
                    />
                </div>
                : <div className='flex flex-col justify-center items-center w-full gap-4'>
                    {professionFloors.sort((a, b) => b.Gender - a.Gender).map(floor => {
                        return <PersonelshiftsPrepareShiftsdetail
                            key={floor?.Uuid}
                            floor={floor}
                            columns={columns}
                            personelshifts={personelshifts}
                            setPersonelshifts={setPersonelshifts}
                            professionUsers={professionUsers}
                        />
                    })}
                </div>}
        </Card.Content>
    </Card>


}
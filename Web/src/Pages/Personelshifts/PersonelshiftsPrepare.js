import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card } from 'semantic-ui-react'
import PersonelshiftsPrepareShifts from '../../Containers/Personelshifts/PersonelshiftsPrepareShifts'
import PersonelshiftsPreparePersonels from '../../Containers/Personelshifts/PersonelshiftsPreparePersonels'

export default function PersonelshiftsPrepare(props) {
    const { Users, Floors, selectedProfessionID, Professions, selectedStartdate, startDay, lastDay, personelshifts, setPersonelshifts, Profile } = props

    const t = Profile?.i18n?.t

    const professionUsers = (Users.list || []).filter(u => u.Includeshift && u.Isactive && u.ProfessionID === selectedProfessionID)

    const selectedProfession = (Professions.list || []).find(u => u.Uuid === selectedProfessionID)

    const professionFloors = ((selectedProfession?.Floors || '').split(',') || []).map(flooruuid => {
        return (Floors.list || []).find(u => u?.Uuid === flooruuid)
    }).filter(u => u)


    const isGeneralshift = (professionFloors || []).length <= 0;

    return (<DndProvider backend={HTML5Backend}>
        <Card fluid>
            <Card.Content header={t('Pages.Personelshifts.Page.PrepareHeader')} />
            <Card.Content extra>
                <PersonelshiftsPreparePersonels
                    Startdate={selectedStartdate}
                    startDay={startDay}
                    lastDay={lastDay}
                    personelshifts={personelshifts}
                    setPersonelshifts={setPersonelshifts}
                    professionUsers={professionUsers}
                    professionFloors={professionFloors}
                />
            </Card.Content>
            <Card.Content extra>
                <PersonelshiftsPrepareShifts
                    personelshifts={personelshifts}
                    setPersonelshifts={setPersonelshifts}
                    Startdate={selectedStartdate}
                    startDay={startDay}
                    lastDay={lastDay}
                    selectedProfession={selectedProfession}
                    professionFloors={professionFloors}
                    professionUsers={professionUsers}
                    isGeneralshift={isGeneralshift}
                    Profile={Profile}
                />
            </Card.Content>
        </Card>
    </DndProvider>
    )
}
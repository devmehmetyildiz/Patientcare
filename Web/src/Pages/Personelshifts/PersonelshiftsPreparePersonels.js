import React from "react"
import PersonelshiftsPreparePersonelsdetail from "../../Containers/Personelshifts/PersonelshiftsPreparePersonelsdetail"
import { Card } from "semantic-ui-react";
import Literals from "./Literals";
import { NoDataScreen } from "../../Components";

export default function PersonelshiftsPreparePersonels({ professionUsers, Startdate, startDay, lastDay, professionFloors, personelshifts, setPersonelshifts, Profile }) {

    const usedUsers = [...new Set([...personelshifts.map(u => u?.PersonelID)])];
    const freeUsercount = (professionUsers || []).filter(u => !usedUsers.includes(u?.Uuid)).length
    return (
        <div className='p-8'>
            <Card fluid>
                <Card.Content header={Literals.Page.Pagepreparepersonelheader[Profile.Language]} />
                <Card.Content extra>
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
                                message={Literals.Messages.Nofreeuserfound[Profile.Language]}
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 'auto' }}
                            />
                        }
                    </div>
                </Card.Content>
            </Card>
        </div>
    )
}

import React from "react";
import { useDrop } from "react-dnd";
import { Card, Label, Table } from "semantic-ui-react";
import PersonelshiftsPrepareShiftsdetailDaycell from "../../Containers/Personelshifts/PersonelshiftsPrepareShiftsdetailDaycell";
import PersonelshiftsPrepareShiftsdetailRemove from "../../Containers/Personelshifts/PersonelshiftsPrepareShiftsdetailRemove";
import { Pagedivider } from "../../Components";

export default function PersonelshiftsPrepareShiftsdetail({ columns, personelshifts, professionUsers, setPersonelshifts, floor, Shiftdefines, Profile, isLast }) {

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'label',
        drop: () => ({ floor: floor }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const decoratedPersonels = (professionUsers || []).map(user => {

        const userShifts = (personelshifts || []).filter(u => u.FloorID === (floor?.Uuid || '') && u.PersonelID === user?.Uuid)

        if ((userShifts || []).length > 0) {
            const res = {}
            res.PersonelID = user?.Uuid
            res.ShiftID = userShifts[0]?.ShiftID
            userShifts.forEach(usershift => {
                res[usershift?.Day] = {
                    Isworking: usershift?.Isworking,
                    Isonannual: usershift?.Isonannual,
                    Annualtype: usershift?.Annualtype,
                }
            })
            return res
        } else {
            return null
        }
    })
        .filter(u => u)
        .sort((a, b) => (Shiftdefines?.list || []).find(u => u?.Uuid === a.ShiftID)?.Priority - (Shiftdefines?.list || []).find(u => u?.Uuid === b.ShiftID)?.Priority)


    return <div ref={drop} data-testid={floor?.Uuid} className={`w-full flex flex-col justify-start items-start `}>
        <Table size='small' celled className={`${canDrop ? 'opacity-50' : ''} ${isOver ? 'opacity-100 !shadow-lg' : ''} transition-all ease-in-out duration-500`}>
            <Table.Header>
                <Table.Row>
                    {columns.map((col, index) => {
                        return <Table.HeaderCell singleLine key={col.name} width={col.width}>
                            {index === 0 && <Label ribbon size='large' as='a' className={`${floor?.Gender === '0' ? '!bg-[#2355a0]' : '!bg-red-700'} !text-white !w-full !ml-1 !mb-1`} image >
                                {floor?.Name || "Genel Kurum"}
                            </Label>}
                            {col.label}
                        </Table.HeaderCell>
                    })}
                    <Table.HeaderCell singleLine key="remove" ></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {decoratedPersonels.map(personelshift => {
                    const personel = (professionUsers || []).find(u => u?.Uuid === personelshift?.PersonelID)
                    const shift = (Shiftdefines.list || []).find(u => u?.Uuid === personelshift?.ShiftID)
                    return <Table.Row key={personelshift?.PersonelID}>
                        <Table.Cell className="text-sm">
                            <Label basic size="mini">{`${personel?.Name} ${personel?.Surname}`}</Label>
                        </Table.Cell>
                        <Table.Cell className="text-sm">
                            <Label basic size="mini">{`${shift?.Name} (${shift?.Starttime}-${shift?.Endtime})`}</Label>
                        </Table.Cell >
                        {Object.keys(personelshift).map((shiftkey, index) => {
                            if (shiftkey !== "PersonelID" && shiftkey !== "ShiftID") {
                                return <PersonelshiftsPrepareShiftsdetailDaycell
                                    index={index}
                                    personelshift={personelshift}
                                    personelshifts={personelshifts}
                                    setPersonelshifts={setPersonelshifts}
                                    shiftkey={shiftkey}
                                    Profile={Profile}
                                    key={index}
                                />
                            }
                        })}
                        <Table.Cell >
                            <PersonelshiftsPrepareShiftsdetailRemove
                                personelshift={personelshift}
                                personelshifts={personelshifts}
                                setPersonelshifts={setPersonelshifts}
                            />
                        </Table.Cell >
                    </Table.Row>
                })}
            </Table.Body>
        </Table>
        {!isLast ?
            <Pagedivider />
            : null}
    </div >
}

import React, { useState } from "react"
import { Button, Card, Form, Icon, Image, Label, Popup, Table } from "semantic-ui-react"
import { ANNUALTYPES } from "../../Utils/Constants";
import { FormInput, Profilephoto } from "../../Components";
import Literals from "./Literals";
import validator from "../../Utils/Validator";


export default function PersonelshiftsPrepareShiftsdetailDaycell({ personelshift, personelshifts, setPersonelshifts, Users,  Usagetypes, shiftkey, index, fillPersonelshiftnotification, Profile }) {
    const dayValue = personelshift[shiftkey]

    const [open, setOpen] = useState(false)
    const [annualtype, setAnnualtype] = useState(dayValue?.Annualtype)

    const user = (Users.list || []).find(u => u.Uuid === personelshift?.PersonelID)
    const ishavePP = (user?.Files || [])
        .find(u => (u.Usagetype.split(',') || [])
            .map(uuids => { return (Usagetypes.list || []).find(type => type.Uuid === uuids)?.Value || '' }).includes('PP'))

    const Annualoptions = (ANNUALTYPES || []).map(type => {
        return { key: type.value, text: type.Name, value: type.value }
    })

    const handleChange = () => {

        let selectedDay = personelshifts.find(u => u.Day === Number(shiftkey) && u.ShiftID === personelshift?.ShiftID && u?.PersonelID === personelshift?.PersonelID);
        let errors = []
        if (!validator.isNumber(annualtype)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Annualtyperequired[Profile.Language] })
        }
        if (!selectedDay) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Dayrequired[Profile.Language] })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillPersonelshiftnotification(error)
            })
        } else {
            if (selectedDay) {
                selectedDay.Annualtype = annualtype
                selectedDay.Isworking = (annualtype === 0 ? true : false)
                selectedDay.Isonannual = (annualtype === 0 ? false : true)
            }
            setPersonelshifts(personelshifts)
            setOpen(false)
        }
    }

    return (
        <Table.Cell key={index} className="text-sm">
            <Popup
                onClose={() => {
                    setOpen(false)
                    setAnnualtype(dayValue?.Annualtype)
                }}
                onOpen={() => {
                    setOpen(true)
                }}
                open={open}
                trigger={<div className=" w-7 h-7 flex justify-center items-center  cursor-pointer m-0 p-0 ">
                    <Icon className='inset-0' name={dayValue?.Isworking === 1 || dayValue?.Isworking === true ? "checkmark" : "close"} color={dayValue.Isworking ? 'green' : 'red'} />
                </div>}
                wide
                on='click'
                hideOnScroll
            >
                <Card>
                    <Card.Content>
                        {ishavePP
                            ? <Profilephoto
                                fileID={ishavePP?.Uuid}
                                fillnotification={fillPersonelshiftnotification}
                                Profile={Profile}
                                Imgheigth="40px"
                            />
                            : <Image
                                floated='right'
                                size='mini'
                                src={`https://react.semantic-ui.com/images/avatar/large/${user?.Gender === "0" ? 'steve.jpg' : 'molly.png'}`}
                            />
                        }
                        <Card.Header>{`${user?.Name} ${user?.Surname}`}</Card.Header>
                        <Card.Meta>{`${Literals.Columns.Day[Profile.Language]} ${shiftkey}`}</Card.Meta>
                        <Card.Meta><Label color={ANNUALTYPES.find(u => u?.value === dayValue?.Annualtype)?.color}>{ANNUALTYPES.find(u => u?.value === dayValue?.Annualtype)?.Name}</Label></Card.Meta>
                        <Card.Description>
                            <Form>
                                <FormInput
                                    search={false}
                                    required
                                    placeholder={Literals.Columns.Annualtype[Profile.Language]}
                                    name="annualtype"
                                    options={Annualoptions}
                                    value={annualtype}
                                    formtype="dropdown"
                                    onChange={(e, data) => {
                                        setAnnualtype(data.value)
                                    }}
                                />
                            </Form>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui two buttons'>
                            <Button content={Literals.Button.Approve[Profile.Language]} className='!bg-[#2355a0] !text-white' onClick={() => { handleChange() }} />
                        </div>
                    </Card.Content>
                </Card>
            </Popup>
        </Table.Cell>
    )
}
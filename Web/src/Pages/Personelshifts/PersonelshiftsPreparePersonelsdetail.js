import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Breadcrumb, Button, Confirm, Dropdown, Form, Label, Modal, Popup } from "semantic-ui-react";
import { Contentwrapper, FormInput, Headerbredcrump, Headerwrapper } from '../../Components'
import Literals from './Literals'
import validator from "../../Utils/Validator";

export default function PersonelshiftsPreparePersonelsdetail({ user, Profile, Startdate, startDay, lastDay, Shiftdefines, personelshifts, setPersonelshifts, fillPersonelshiftnotification }) {

    const [personelhistory, setPersonelhistory] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [usershift, setUsershift] = useState('')
    const [dropresult, setDropresult] = useState(null)
    const [dropuser, setDropuser] = useState(null)

    const [{ isDragging }, drag] = useDrag({
        type: 'label',
        item: { user },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                setDropresult(dropResult.floor)
                setDropuser(item.user)
                setConfirm(true)
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    });

    const handleClick = (e) => {
        e.preventDefault()
        if (e.nativeEvent.button === 0) {

        } else if (e.nativeEvent.button === 2) {
            setPersonelhistory(true)
        }
    };

    const Shiftoptions = (Shiftdefines.list || []).filter(u => u.Isactive).map(shift => {
        return { key: shift.Uuid, text: shift.Name, value: shift.Uuid }
    })



    return <React.Fragment>
        <Popup
            on='click'
            pinned
            size="huge"
            hideOnScroll
            trigger={<div
                ref={drag}
                onClick={handleClick}
                onContextMenu={handleClick}
                className='p-[2px]' key={user?.Uuid}>
                <Label size='tiny' as='a' className={`${isDragging && 'opacity-40'} !bg-[#2355a0] !text-white !w-full select-none`} image >
                    {`${user?.Name} ${user?.Surname}`}
                </Label>
            </div>
            }
        >
            <Form className="w-full">
                <Form.Group widths={'equal'}>
                    <FormInput
                        required
                        placeholder="Vardiya Seçiniz"
                        name="Patientstatus"
                        options={Shiftoptions}
                        value={usershift}
                        formtype="dropdown"
                        onChange={(e, data) => {
                            setUsershift(data.value)
                        }}
                    />
                </Form.Group>
            </Form>
        </Popup>
        <Modal
            onClose={() => setPersonelhistory(false)}
            onOpen={() => setPersonelhistory(true)}
            open={personelhistory}
        >
            <Modal.Header>{`${user?.Name} ${user?.Surname}`}</Modal.Header>
            <Modal.Content image>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setPersonelhistory(false)}>
                    {Literals.Button.Close[Profile.Language]}
                </Button>
            </Modal.Actions>
        </Modal>
        <Confirm
            open={confirm}
            onCancel={() => {
                setDropresult(null)
                setDropuser(null)
                setUsershift('')
                setConfirm(false)
            }}
            cancelButton="Vazgeç"
            confirmButton="Ekle"
            content={
                <div className='p-2'>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Breadcrumb.Section>{`${user?.Name} ${user?.Surname}`}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Contentwrapper>
                        <Form className="w-full">
                            <Form.Group widths={'equal'}>
                                <FormInput
                                    required
                                    placeholder="Vardiya Seçiniz"
                                    name="Patientstatus"
                                    options={Shiftoptions}
                                    value={usershift}
                                    formtype="dropdown"
                                    onChange={(e, data) => {
                                        setUsershift(data.value)
                                    }}
                                />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                </div>
            }
            onConfirm={() => {
                let errors = []
                if (!validator.isUUID(dropuser?.Uuid)) {
                    errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Userrequired[Profile.Language] })
                }
                if (!validator.isUUID(usershift)) {
                    errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Shiftrequired[Profile.Language] })
                }
                if (errors.length > 0) {
                    console.log('errors: ', errors);
                    errors.forEach(error => {
                        fillPersonelshiftnotification(error)
                    })
                    return false
                } else {
                    let data = []
                    for (let index = startDay; index <= lastDay; index++) {
                        data.push({
                            ShiftID: usershift,
                            PersonelID: dropuser?.Uuid,
                            FloorID: dropresult?.Uuid || '',
                            Day: index,
                            Isworking: true,
                            Isonannual: false,
                            Annualtype: 0
                        })
                    }

                    setPersonelshifts([...personelshifts, ...data])
                    setDropresult(null)
                    setDropuser(null)
                    setUsershift('')
                    setConfirm(false)
                }
            }}
        />
    </React.Fragment>
}

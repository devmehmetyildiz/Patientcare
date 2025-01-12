import React, { useState } from "react";
import { useDrag } from "react-dnd";
import { Breadcrumb, Button, Confirm, Form, Label, Modal, Popup } from "semantic-ui-react";
import { Contentwrapper, Footerwrapper, FormInput, Headerbredcrump, Headerwrapper } from '../../Components'
import validator from "../../Utils/Validator";
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from "../../Utils/Constants";

export default function PersonelshiftsPreparePersonelsdetail({ user, Profile, Startdate, startDay, lastDay, Shiftdefines, professionFloors, personelshifts, setPersonelshifts, fillPersonelshiftnotification }) {

    const [personelhistory, setPersonelhistory] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [usershift, setUsershift] = useState('')
    const [userfloor, setUserfloor] = useState('')
    const [dropresult, setDropresult] = useState(null)
    const [dropuser, setDropuser] = useState(null)

    const t = Profile?.i18n?.t

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

    const handleClick = (e, User) => {
        e.preventDefault()
        if (e.nativeEvent.button === 0) {
        } else if (e.nativeEvent.button === 2) {
            setPersonelhistory(true)
        }
    };

    const Shiftoptions = (Shiftdefines.list || []).filter(u => u.Isactive).map(shift => {
        return { key: shift.Uuid, text: shift.Name, value: shift.Uuid }
    })

    const Floorsoptions = (professionFloors || []).filter(u => u.Isactive).map(floor => {
        return { key: floor.Uuid, text: floor.Name, value: floor.Uuid }
    })

    const getLabelColorByGender = (gender) => {
        switch (gender) {
            case GENDER_OPTION_MEN:
                return '#2355a0'
            case GENDER_OPTION_WOMEN:
                return '#b91c1c'
            default:
                return '#bababa'
        }
    }

    return <React.Fragment>
        <Popup
            on='click'
            pinned
            size="small"
            hideOnScroll
            position="top center"
            onClose={() => {
                setDropresult(null)
                setDropuser(null)
                setUsershift('')
                setUserfloor('')
                setConfirm(false)
            }}
            trigger={<div
                ref={drag}
                onClick={handleClick}
                onContextMenu={handleClick}
                className='p-[2px]' key={user?.Uuid}>
                <Label style={{ backgroundColor: getLabelColorByGender(user?.Gender) }} size='tiny' as='a' className={`${isDragging && 'opacity-40'} !text-white !w-full select-none`} image >
                    {`${user?.Name} ${user?.Surname}`}
                </Label>
            </div>
            }
        >
            <Headerwrapper>
                <Headerbredcrump>
                    <Breadcrumb.Section>{`${user?.Name} ${user?.Surname}`}</Breadcrumb.Section>
                </Headerbredcrump>
            </Headerwrapper>
            <Contentwrapper additionalStyle="w-[25vmax]">
                <Form className="w-full">
                    <Form.Group widths={'equal'}>
                        <FormInput
                            required
                            placeholder="Vardiya Seçiniz"
                            name="patientshift"
                            options={Shiftoptions}
                            value={usershift}
                            formtype="dropdown"
                            onChange={(e, data) => {
                                setUsershift(data.value)
                            }}
                        />
                        {Floorsoptions.length > 0 && <FormInput
                            required
                            placeholder="Kat Seçiniz"
                            name="patientfloor"
                            options={Floorsoptions}
                            value={userfloor}
                            formtype="dropdown"
                            onChange={(e, data) => {
                                setUserfloor(data.value)
                            }}
                        />}
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Footerwrapper>
                <Button
                    onClick={() => {
                        let errors = []
                        if (!validator.isUUID(usershift)) {
                            errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.ShiftRequired') })
                        }
                        if (Floorsoptions.length > 0 && !validator.isUUID(userfloor)) {
                            errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.FloorRequired') })
                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPersonelshiftnotification(error)
                            })
                            return false
                        } else {
                            let data = []
                            for (let index = startDay; index <= lastDay; index++) {
                                data.push({
                                    ShiftID: usershift,
                                    PersonelID: user?.Uuid,
                                    FloorID: Floorsoptions.length > 0 ? userfloor : '',
                                    Day: index,
                                    Isworking: true,
                                    Isonannual: false,
                                    Annualtype: 0,
                                    Isstartday: index === startDay ? true : false
                                })
                            }
                            setPersonelshifts([...personelshifts, ...data])
                            setDropresult(null)
                            setDropuser(null)
                            setUsershift('')
                            setUserfloor('')
                            setConfirm(false)
                        }
                    }}
                    floated="right"
                    type='submit'
                    className='!bg-[#2355a0] !text-white'
                >
                    {t('Common.Button.Approve')}
                </Button>
            </Footerwrapper>
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
                    {t('Common.Button.Close')}
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
                                    placeholder={t('Pages.Personelshifts.Messages.SelectShift')}
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
                    errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.UserRequired') })
                }
                if (!validator.isUUID(usershift)) {
                    errors.push({ type: 'Error', code: t('Pages.Personelshifts.Page.Header'), description: t('Pages.Personelshifts.Messages.ShiftRequired') })
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
                            Annualtype: 0,
                            Isstartday: index === startDay ? true : false
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

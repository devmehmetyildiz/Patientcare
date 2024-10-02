import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Table, Button, Modal, Dropdown, Icon, Label } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import SupportplansCreate from '../../Containers/Supportplans/SupportplansCreate'
import { SUPPORTPLAN_TYPE_CAREPLAN, SUPPORTPLAN_TYPE_PSYCHOSOCIAL, SUPPORTPLAN_TYPE_RATING } from '../../Utils/Constants'

export default function PatientsEditsupportplan(props) {

    const PAGE_NAME = 'PatientsEditsupportplan'
    const [isDatafetched, setIsDatafetched] = useState(false)
    const [modalopen, setModalopen] = useState(false)
    const [createmodalopen, setCreatemodalopen] = useState(false)
    const [selectedsupportplanid, setSelectedsupportplanid] = useState('')
    const [newgroupname, setNewgroupname] = useState('')
    const context = useContext(FormContext)

    const { GetPatient, GetPatientdefines, GetSupportplanlists, GetSupportplans, match, history, PatientID, AddSupportplanlists, fillPatientnotification, UpdatePatientsupportplans } = props
    const { Patients, Patientdefines, Supportplanlists, Supportplans, Profile } = props

    const Id = match?.params?.PatientID || PatientID

    const t = Profile?.i18n?.t

    const { selected_record } = Patients

    const isLoadingstatus =
        Patients.isLoading ||
        Patientdefines.isLoading ||
        Supportplanlists.isLoading ||
        Supportplans.isLoading



    const selectedtype = context.formstates[`${PAGE_NAME}/Type`]

    const activeSupportplans = context.formstates[`${PAGE_NAME}/Supportplans`]

    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

    const Supportplanoption = (Supportplans.list || []).filter(u => u.Isactive && u.Type === selectedtype).map(plan => {
        return { key: plan.Uuid, text: plan.Name, value: plan.Uuid }
    })

    const Supportplanlistoption = (Supportplanlists.list || []).filter(u => u.Isactive && u.Type === selectedtype).map(planlist => {
        return { key: planlist.Uuid, text: planlist.Name, value: planlist.Uuid }
    })

    const selectedSupportplanlist = (Supportplanlists.list || []).filter(u => u.Isactive).find(u => u.Uuid === selectedsupportplanid);
    const selectedSupportplans = (selectedSupportplanlist?.Supportplanuuids || []).map(u => {
        const suppportplan = (Supportplans.list || []).filter(u => u.Isactive).find(plan => plan.Uuid === u.PlanID)
        return suppportplan
    }).filter(u => u)

    const Supportplantypeoptions = [
        { key: 1, text: t('Common.Supportplan.Types.Careplan'), value: SUPPORTPLAN_TYPE_CAREPLAN },
        { key: 2, text: t('Common.Supportplan.Types.Psychosocial'), value: SUPPORTPLAN_TYPE_PSYCHOSOCIAL },
        { key: 3, text: t('Common.Supportplan.Types.Rating'), value: SUPPORTPLAN_TYPE_RATING },
    ]

    const isTypeselected = !(selectedtype === null || selectedtype === undefined)


    const handleSubmit = (e) => {
        e.preventDefault()
        const data = context.getForm(PAGE_NAME)
        data.Supportplans = data.Supportplans.map(u => {
            return (Supportplans.list || []).filter(plan => plan.Isactive).find(plan => plan.Uuid === u)
        }).filter(u => u)
        let errors = []
        if (!validator.isArray(data.Supportplans)) {
            errors.push({ type: 'Error', code: t('Pages.Patients.Page.Header'), description: t('Pages.Patients.PatientsEditsupportplan.Messages.SupportplansRequired') })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            UpdatePatientsupportplans({
                data: {
                    PatientID: Id,
                    Type: selectedtype,
                    Supportplans: data.Supportplans
                }, history, redirectID: Id
            })
        }
    }

    const Cellwrapper = (children, columnname) => {
        return Profile.Ismobile ?
            <div className='w-full flex justify-between items-center'>
                <Label>{columnname}</Label>
                {children}
            </div> :
            children
    }

    useEffect(() => {
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !isDatafetched) {
            setIsDatafetched(true)
            context.setForm(PAGE_NAME, { ...selected_record, Supportplans: selected_record.Supportplanuuids.map(u => { return u.PlanID }) })
        }
    })

    useEffect(() => {
        if (isTypeselected && selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus) {
            context.setForm(PAGE_NAME,
                {
                    ...selected_record,
                    Supportplans: (selected_record?.Supportplanuuids || []).
                        map(u => {
                            const suppportplan = (Supportplans.list || []).find(item => item.Uuid === u.PlanID)
                            if (suppportplan && suppportplan?.Type === selectedtype) {
                                return u.PlanID
                            } else {
                                return null
                            }
                        }).filter(u => u)
                })
        }
    }, [selectedtype])

    useEffect(() => {
        if (validator.isUUID(Id)) {
            GetPatient(Id)
            GetPatientdefines()
            GetPatientdefines()
            GetSupportplanlists()
            GetSupportplans()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }, [Id])

    return (isLoadingstatus ? <LoadingPage /> :
        <React.Fragment>
            <Pagewrapper >
                <Headerwrapper>
                    <Headerbredcrump>
                        <Link to={"/Patients"}>
                            <Breadcrumb.Section>{t('Pages.Patients.Page.Header')}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Link to={"/Patients/" + Id}>
                            <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>{t('Pages.Patients.PatientsEditsupportplan.Page.Header')}</Breadcrumb.Section>
                    </Headerbredcrump>
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <div className='w-full flex flex-col justify-center items-center'>
                        <div className='w-full flex flex-row justify-between items-center'>
                            <Label
                                onClick={() => {
                                    context.setFormstates({
                                        ...context.formstates,
                                        [`${PAGE_NAME}/Type`]: null
                                    })
                                }}
                                size='large'
                                className=' !bg-[#2355a0] !text-white cursor-pointer'
                            >
                                {isTypeselected
                                    ? Supportplantypeoptions.find(u => u.value === selectedtype)?.text || t('Pages.Patients.PatientsEditsupportplan.Messages.NoTypeSelected')
                                    : t('Pages.Patients.PatientsEditsupportplan.Messages.NoTypeSelected')}
                            </Label>
                            {isTypeselected ?
                                <div className='w-full flex flex-row justify-end items-center'>
                                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { setCreatemodalopen(true) }} >{t('Pages.Patients.PatientsEditsupportplan.Buttons.Saveplan')}</Button>
                                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { setModalopen(true) }} >{t('Pages.Patients.PatientsEditsupportplan.Buttons.Selectplan')}</Button>
                                </div>
                                : null}
                        </div>
                        {isTypeselected ?
                            <Form className='w-full'>
                                <Form.Group widths='equal'>
                                    <FormInput page={PAGE_NAME} required placeholder={t('Pages.Patients.PatientsEditsupportplan.Column.Supportplans')} name="Supportplans" multiple options={Supportplanoption} formtype='dropdown' modal={SupportplansCreate} />
                                </Form.Group>
                                <Pagedivider />
                                <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                                    {!Profile.Ismobile &&
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={7}>{t('Pages.Patients.PatientsEditsupportplan.Column.Name')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditsupportplan.Column.Info')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditsupportplan.Column.Remove')}</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>}
                                    <Table.Body>
                                        {(activeSupportplans || []).map(planID => {
                                            const supportplan = (Supportplans.list || []).filter(u => u.Isactive).find(u => u.Uuid === planID)
                                            return <Table.Row key={Math.random()}>
                                                <Table.Cell className='table-last-section'>
                                                    {Cellwrapper(<Label>{`${supportplan?.Name}`}</Label>, t('Pages.Patients.PatientsEditsupportplan.Column.Name'))}
                                                </Table.Cell>
                                                <Table.Cell className='table-last-section'>
                                                    {Cellwrapper(<Label>{`${supportplan?.Info || ''}`}</Label>, t('Pages.Patients.PatientsEditsupportplan.Column.Info'))}
                                                </Table.Cell>
                                                <Table.Cell >
                                                    {Cellwrapper(
                                                        <Icon className='type-conversion-remove-icon' link color={'red'} name={'minus circle'}
                                                            onClick={() => {
                                                                context.setFormstates({
                                                                    ...context.formstates,
                                                                    [`${PAGE_NAME}/Supportplans`]: (context.formstates[`${PAGE_NAME}/Supportplans`] || []).filter(u => u !== supportplan?.Uuid)
                                                                })
                                                            }} />
                                                        , t('Pages.Patients.PatientsEditsupportplan.Column.Remove'))}
                                                </Table.Cell>
                                            </Table.Row>
                                        })}
                                    </Table.Body>
                                </Table>
                            </Form>
                            :
                            <div className='w-full'>
                                <Form>
                                    <Form.Group widths={'equal'}>
                                        <Form.Field>
                                            <label
                                                className='text-[#000000de]'>
                                                {t('Pages.Patients.PatientsEditsupportplan.Column.Type')}
                                            </label>
                                            <Dropdown
                                                value={selectedtype}
                                                clearable
                                                search
                                                fluid
                                                selection
                                                options={Supportplantypeoptions}
                                                onChange={(e, data) => {
                                                    context.setFormstates({
                                                        ...context.formstates,
                                                        [`${PAGE_NAME}/Type`]: data.value
                                                    })
                                                }}
                                            />
                                        </Form.Field>
                                    </Form.Group>
                                </Form>
                            </div>
                        }
                    </div>
                </Contentwrapper>
                {isTypeselected ?
                    <Footerwrapper>
                        <Gobackbutton
                            history={history}
                            redirectUrl={Id ? `/Patients/${Id}` : `/Patients`}
                            buttonText={t('Common.Button.Goback')}
                        />
                        <Submitbutton
                            isLoading={isLoadingstatus}
                            buttonText={t('Common.Button.Update')}
                            submitFunction={handleSubmit}
                        />
                    </Footerwrapper>
                    : null}
            </Pagewrapper >
            <PatientsEditsupportSelect
                open={modalopen}
                setOpen={setModalopen}
                selectedID={selectedsupportplanid}
                setSelectedID={setSelectedsupportplanid}
                selectedSupportplans={selectedSupportplans}
                Supportplanlistoption={Supportplanlistoption}
                context={context}
                PAGE_NAME={PAGE_NAME}
                Profile={Profile}
            />
            <PatientsEditsupportplanSave
                selectedtype={selectedtype}
                newgroupname={newgroupname}
                setNewgroupname={setNewgroupname}
                open={createmodalopen}
                setOpen={setCreatemodalopen}
                context={context}
                Profile={Profile}
                PAGE_NAME={PAGE_NAME}
                fillPatientnotification={fillPatientnotification}
                AddSupportplanlists={AddSupportplanlists}
                Supportplans={Supportplans}
            />
        </React.Fragment>
    )
}



function PatientsEditsupportSelect(props) {

    const { selectedID, setSelectedID, open, setOpen, context, PAGE_NAME,
        Profile, Supportplanlistoption, selectedSupportplans,
    } = props

    const t = Profile?.i18n?.t

    const Cellwrapper = (children, columnname) => {
        return Profile.Ismobile ?
            <div className='w-full flex justify-between items-center'>
                <Label>{columnname}</Label>
                {children}
            </div> :
            children
    }

    return (
        <Modal
            onClose={() => {
                setSelectedID('')
                setOpen(false)
            }}
            onOpen={() => {
                setSelectedID('')
                setOpen(true)
            }}
            open={open}
        >
            <Modal.Header>{t('Pages.Patients.PatientsEditsupportplan.Page.ReadyList')}</Modal.Header>
            <Modal.Content image className='!block'>
                <Modal.Description>
                    <Contentwrapper>
                        <Form className='w-full'>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>{t('Pages.Patients.PatientsEditsupportplan.Page.ReadyList')}</label>
                                    <Dropdown
                                        clearable
                                        search
                                        fluid
                                        selection
                                        onChange={(e, data) => { setSelectedID(data.value) }}
                                        options={Supportplanlistoption}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                        {(selectedSupportplans || []).length > 0 ?
                            <Contentwrapper>
                                <Table celled>
                                    {!Profile.Ismobile &&
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={7}>{t('Pages.Patients.PatientsEditsupportplan.Column.Name')}</Table.HeaderCell>
                                                <Table.HeaderCell width={1}>{t('Pages.Patients.PatientsEditsupportplan.Column.Info')}</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>}
                                    <Table.Body>
                                        {selectedSupportplans.map(supportplan => {
                                            return <Table.Row key={Math.random()}>
                                                <Table.Cell >
                                                    {Cellwrapper(<Label>{`${supportplan?.Name}`}</Label>, t('Pages.Patients.PatientsEditsupportplan.Column.Name'))}
                                                </Table.Cell>
                                                <Table.Cell >
                                                    {Cellwrapper(<Label>{`${supportplan?.Info || ''}`}</Label>, t('Pages.Patients.PatientsEditsupportplan.Column.Info'))}
                                                </Table.Cell>
                                            </Table.Row>
                                        })}
                                    </Table.Body>
                                </Table>
                            </Contentwrapper>
                            : null}
                    </Contentwrapper>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    color='black'
                    onClick={() => {
                        setSelectedID('')
                        setOpen(false)
                    }}
                >
                    {t('Common.Button.Close')}
                </Button>
                <Button
                    content={t('Common.Button.Add')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        context.setFormstates({
                            ...context.formstates,
                            [`${PAGE_NAME}/Supportplans`]: (selectedSupportplans || []).map(u => { return u?.Uuid })
                        })
                        setSelectedID('')
                        setOpen(false)
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}



function PatientsEditsupportplanSave(props) {

    const { newgroupname, setNewgroupname, open, setOpen, context, Profile, selectedtype,
        PAGE_NAME, fillPatientnotification, AddSupportplanlists, Supportplans } = props

    const t = Profile?.i18n?.t

    return (
        <Modal
            onClose={() => {
                setOpen(false)
                setNewgroupname('')
            }}
            onOpen={() => {
                setOpen(true)
                setNewgroupname('')
            }}
            open={open}
        >
            <Modal.Header> {t('Pages.Patients.PatientsEditsupportplan.Page.Save')}</Modal.Header>
            <Modal.Content image className='!block'>
                <Modal.Description>
                    <Contentwrapper>
                        <Form className='w-full'>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <Form.Input
                                        placeholder={t('Pages.Patients.PatientsEditsupportplan.Column.Supportplanlistname')}
                                        label={t('Pages.Patients.PatientsEditsupportplan.Column.Supportplanlistname')}
                                        fluid
                                        onChange={(e) => {
                                            setNewgroupname(e.target.value)
                                        }}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setNewgroupname('')
                }}>
                    {t('Common.Button.Close')}
                </Button>
                <Button
                    content={t('Common.Button.Add')}
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        const plans = (context.formstates[`${PAGE_NAME}/Supportplans`] || []).map(u => {
                            return (Supportplans.list || []).filter(plan => plan.Isactive).find(plan => plan.Uuid === u)
                        }).filter(u => u)
                        const Name = newgroupname;

                        let errors = []
                        if (!validator.isString(Name)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.Page.Header'), description: t('Pages.Patients.PatientsEditsupportplan.Messages.NameRequired"') })
                        }
                        if (!validator.isArray(plans)) {
                            errors.push({ type: 'Error', code: t('Pages.Patients.Page.Header'), description: t('Pages.Patients.PatientsEditsupportplan.Messages.SupportplansRequired') })
                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillPatientnotification(error)
                            })
                        } else {
                            AddSupportplanlists({
                                data: {
                                    Name,
                                    Type: selectedtype,
                                    Supportplans: plans,
                                }
                            })
                            setOpen(false)
                            setNewgroupname('')
                        }
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

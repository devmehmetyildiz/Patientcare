import React, { useContext, useEffect, } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import {
    Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump,
    Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton
} from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import { Formatfulldate } from '../../Utils/Formatdate'

export default function MainteanceplansEdit(props) {

    const PAGE_NAME = "MainteanceplansEdit"

    const { Mainteanceplans, Equipments, Equipmentgroups, Users, Profile, closeModal, history, match, MainteanceplanID } = props
    const { EditMainteanceplans, GetMainteanceplan, GetUsers, fillMainteanceplannotification, GetEquipments, GetEquipmentgroups } = props

    const context = useContext(FormContext)

    const Id = MainteanceplanID || match?.params?.MainteanceplanID
    const t = Profile?.i18n?.t

    const isLoading = Mainteanceplans.isLoading || Equipments.isLoading || Equipmentgroups.isLoading

    const Equipmentgroupoptions = (Equipmentgroups.list || []).filter(u => u.Isactive).map(group => {
        return { key: group.Uuid, text: group?.Name, value: group.Uuid }
    })

    const Equipmentoptions = (Equipments.list || []).filter(u => u.Isactive && u.EquipmentgroupID === context.formstates[`${PAGE_NAME}/EquipmentgroupID`]).map(equipment => {
        return { key: equipment.Uuid, text: equipment?.Name, value: equipment.Uuid }
    })

    const Useroptions = (Users.list || []).filter(u => u.Isactive && u.Isworker && u.Isworking).map(user => {
        return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = context.getForm(PAGE_NAME)
        let errors = []

        if (!validator.isUUID(data.UserID)) {
            errors.push({ type: 'Error', code: t('Pages.Mainteanceplans.Page.Header'), description: t('Pages.Mainteanceplans.Messages.UserRequired') })
        }
        if (!validator.isUUID(data.EquipmentID)) {
            errors.push({ type: 'Error', code: t('Pages.Mainteanceplans.Page.Header'), description: t('Pages.Mainteanceplans.Messages.EquipmentRequired') })
        }
        if (!validator.isISODate(data.Startdate)) {
            errors.push({ type: 'Error', code: t('Pages.Mainteanceplans.Page.Header'), description: t('Pages.Mainteanceplans.Messages.StartdateRequired') })
        }
        if (!validator.isNumber(data.Dayperiod)) {
            errors.push({ type: 'Error', code: t('Pages.Mainteanceplans.Page.Header'), description: t('Pages.Mainteanceplans.Messages.DayperiodRequired') })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillMainteanceplannotification(error)
            })
        } else {
            EditMainteanceplans({
                data: { ...Mainteanceplans.selected_record, ...data },
                history,
                redirectUrl: "/Mainteanceplans",
                closeModal,
            })
        }
    }

    useEffect(() => {
        if (validator.isUUID(Id)) {
            GetUsers()
            GetEquipmentgroups()
            GetEquipments()
            GetMainteanceplan(Id)
        } else {
            fillMainteanceplannotification({
                type: 'Error',
                code: t('Pages.Mainteanceplans.Page.Header'),
                description: t('Pages.Mainteanceplans.Messages.UnsupportedMainteanceplan'),
            });
        }
    }, [])

    useEffect(() => {
        if (!Mainteanceplans.isLoading && !Equipmentgroups.isLoading && !Equipments.isLoading && validator.isObject(Mainteanceplans.selected_record)) {
            const equipment = (Equipments.list || []).find(u => u.Uuid === Mainteanceplans.selected_record?.EquipmentID)
            const equipmentgroup = (Equipmentgroups.list || []).find(u => u.Uuid === equipment?.EquipmentgroupID)
            context.setForm(PAGE_NAME, {
                ...Mainteanceplans.selected_record,
                Startdate: Formatfulldate(Mainteanceplans?.selected_record?.Startdate),
                EquipmentgroupID: equipmentgroup?.Uuid
            })
        }
    }, [Mainteanceplans.selected_record, Equipmentgroups.isLoading, Equipments.isLoading])

    return (isLoading ? <LoadingPage /> :
        <Pagewrapper>
            <Headerwrapper>
                <Headerbredcrump>
                    <Link to={"/Mainteanceplans"}>
                        <Breadcrumb.Section >{t('Pages.Mainteanceplans.Page.Header')}</Breadcrumb.Section>
                    </Link>
                    <Breadcrumb.Divider icon='right chevron' />
                    <Breadcrumb.Section>{t('Pages.Mainteanceplans.Page.EditHeader')}</Breadcrumb.Section>
                </Headerbredcrump>
                {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
            </Headerwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Mainteanceplans.Column.Equipmentgroup')} name="EquipmentgroupID" options={Equipmentgroupoptions} formtype='dropdown' />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Mainteanceplans.Column.Equipment')} name="EquipmentID" options={Equipmentoptions} formtype='dropdown' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Mainteanceplans.Column.User')} name="UserID" options={Useroptions} formtype='dropdown' />
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Mainteanceplans.Column.Startdate')} name="Startdate" type='datetime-local' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormInput page={PAGE_NAME} required placeholder={t('Pages.Mainteanceplans.Column.Dayperiod')} name="Dayperiod" type='number' />
                        <FormInput page={PAGE_NAME} placeholder={t('Pages.Mainteanceplans.Column.Info')} name="Info" />
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Footerwrapper>
                <Gobackbutton
                    history={history}
                    redirectUrl={"/Mainteanceplans"}
                    buttonText={t('Common.Button.Goback')}
                />
                <Submitbutton
                    isLoading={Mainteanceplans.isLoading}
                    buttonText={t('Common.Button.Update')}
                    submitFunction={handleSubmit}
                />
            </Footerwrapper>
        </Pagewrapper >
    )
}

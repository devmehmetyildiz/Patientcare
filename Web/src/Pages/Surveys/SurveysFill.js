import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Dimmer, DimmerDimmable, Dropdown, Form, Label, Loader, Modal } from 'semantic-ui-react'
import { useLazyGetUsersQuery } from '../../Api/Features/Users'
import { SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'
import { useLazyGetPatientsQuery } from 'Api/Features/Patients'
import { useLazyGetPatientdefinesQuery } from 'Api/Features/Patientdefines'

export default function SurveysFill(props) {

    const PAGE_NAME = "SurveysFill"
    const { open, setOpen, record, setRecord } = props
    const Profile = useSelector(state => state.Profile)
    const t = Profile?.i18n?.t

    const [patients, setPatients] = useState([])
    const [users, setUsers] = useState([])
    const [patientContacts, setPatientContants] = useState([])

    const [GetUsers, { data: Users, isLoading: isUserLoading }] = useLazyGetUsersQuery()
    const [GetPatients, { data: Patients, isLoading: isPatientLoading }] = useLazyGetPatientsQuery()
    const [GetPatientdefines, { data: Patientdefines, isLoading: isPatientdefinesLoading }] = useLazyGetPatientdefinesQuery()

    const patientOption = useMemo(() => {
        const data = (Patients.list || [])
            .filter(u => u.Isactive && u.Isalive && !u.Isleft && !Ispreregistration)
            .map(patient => {
                const patientdefine = (Patientdefines || []).find(u => u.Uuid === patient?.PatientdefineID)
                return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname}`, value: patient.Uuid }
            })
        return data || []
    }, [Patients, Patientdefines])

    const userOption = useMemo(() => {
        const data = (Users.list || [])
            .filter(u => u.Isactive && u.Isworker)
            .map(user => {
                return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
            })
        return data || []
    }, [Users])

    const formContent = useMemo(() => {

        switch (record?.Type) {
            case SURVEY_TYPE_PATIENT:
                return <React.Fragment>
                    <Form.Field>
                        <Label content={t('Pages.Surveys.Column.Patients')} />
                        <Dropdown
                            placeholder={t('Pages.Surveys.Column.Patients')}
                            fluid
                            search
                            selection
                            options={patientOption}
                            onChange={(e, value) => {
                                setPatients(value.data)
                            }}
                        />
                    </Form.Field>
                </React.Fragment>
            case SURVEY_TYPE_USER:
                <React.Fragment>
                    <Form.Field>
                        <Label content={t('Pages.Surveys.Column.Users')} />
                        <Dropdown
                            placeholder={t('Pages.Surveys.Column.Users')}
                            fluid
                            search
                            selection
                            options={userOption}
                            onChange={(e, value) => {
                                setUsers(value.data)
                            }}
                        />
                    </Form.Field>
                </React.Fragment>
            case SURVEY_TYPE_PATIENTCONTACT:
                <React.Fragment>

                </React.Fragment>

            default:
                <React.Fragment>

                </React.Fragment>
                break;
        }
    }, [record?.Type])

    useEffect(() => {
        if (open) {

            setPatientContants([])
            setPatients([])
            setUsers([])

            switch (record?.Type) {
                case SURVEY_TYPE_PATIENT:
                    GetPatients()
                    break;
                case SURVEY_TYPE_USER:
                    GetUsers()
                    break;
            }
        }
    }, [open])


    return (
        <DimmerDimmable blurring >
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
            >
                <Modal.Header >{t('Pages.Surveys.Page.FillHeader')}</Modal.Header>
                <Modal.Content image>
                    <Dimmer inverted active={isUserLoading || isPatientLoading || isPatientdefinesLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <Form>
                            {formContent}
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => {
                        setOpen(false)
                        setRecord(null)
                    }}>
                        {t('Common.Button.Giveup')}
                    </Button>
                    <Button
                        content={t('Common.Button.Fill')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => {

                        }}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </DimmerDimmable>
    )
}

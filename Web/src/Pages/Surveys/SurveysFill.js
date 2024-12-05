import React, { useEffect, useMemo, useState } from 'react'
import { Button, Dimmer, DimmerDimmable, Dropdown, Form, Label, Loader, Modal, Radio, Table } from 'semantic-ui-react'
import { SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'
import { Pagedivider } from '../../Components'
import validator from '../../Utils/Validator'

export default function SurveysFill(props) {

    const { open, setOpen, record, setRecord, Surveys, Patients, Patientdefines, Users, Profile } = props
    const { GetPatients, GetPatientdefines, GetUsers, fillSurveynotification, FillSurveys, GetSurveys } = props

    const t = Profile?.i18n?.t

    const [personels, setPersonels] = useState([])
    const [fetchedSurvey, setFetchedSurvey] = useState([])

    const dataOptions = useMemo(() => {
        let data = []
        const surveyResults = record?.Type === SURVEY_TYPE_PATIENTCONTACT
            ? (record?.Surveyresults || []).filter(u => u.Isactive).map(u => u.User)
            : (record?.Surveyresults || []).filter(u => u.Isactive).map(u => u.UserID)

        switch (record?.Type) {
            case SURVEY_TYPE_PATIENT:
                data = (Patients.list || [])
                    .filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration)
                    .filter(u => !surveyResults.includes(u.Uuid || ''))
                    .map(patient => {
                        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                        return { key: patient.Uuid, text: `${patientdefine?.Firstname} ${patientdefine?.Lastname}`, value: patient.Uuid }
                    })
                break;
            case SURVEY_TYPE_PATIENTCONTACT:
                (Patients.list || [])
                    .filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration)
                    .filter(u => !(surveyResults.includes(u.Contactname1 || '') || surveyResults.includes(u.Contactname2 || '')))
                    .forEach(patient => {
                        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

                        const contactname1Base = patientdefine?.Contactname1
                        const contactname2Base = patientdefine?.Contactname2

                        const contactName1 = `${contactname1Base} (${patientdefine?.Firstname} ${patientdefine?.Lastname})`
                        const contactName2 = `${contactname2Base} (${patientdefine?.Firstname} ${patientdefine?.Lastname})`

                        if (contactname1Base && (contactname1Base || '').trim().length > 0) {
                            data.push({
                                key: `${patientdefine?.Uuid}-1`,
                                text: contactName1,
                                value: contactName1,
                            })
                        }

                        if (contactname2Base && (contactname2Base || '').trim().length > 0) {
                            data.push({
                                key: `${patientdefine?.Uuid}-1`,
                                text: contactName2,
                                value: contactName2,
                            })
                        }
                    });
                break;
            case SURVEY_TYPE_USER:
                data = (Users.list || [])
                    .filter(u => u.Isactive && u.Isalive && !u.Isleft && !u.Ispreregistration)
                    .filter(u => !surveyResults.includes(u.Uuid || ''))
                    .map(user => {
                        return { key: user.Uuid, text: `${user?.Name} ${user?.Surname}`, value: user.Uuid }
                    })
                break;
        }
        return data || []
    }, [record, Patients, Patientdefines, Users])

    const isButtonDisabled = () => {
        return (personels || []).length === 0
    }

    const setResult = (key, result) => {
        setFetchedSurvey(prev => [...prev.map(item => {
            return item.key === key ? { ...item, Result: result } : item
        })])
    }

    const renderRadioButtons = (key, result) => {

        const startNumber = record?.Minnumber || 0
        const endNumber = record?.Maxnumber || 0

        let Buttons = []

        for (let index = startNumber; index <= endNumber; index++) {
            Buttons.push(
                <Radio key={Math.random()} className='mx-2' onChange={(e) => setResult(key, index)} checked={result === index} label={String(index)} />
            )
        }

        return <React.Fragment>
            {Buttons.map(item => item)}
        </React.Fragment>
    }

    const handleSubmit = () => {
        let errors = []
        let decoratedSurveyResults = []
        let reqData = []

        const t = Profile?.i18n?.t

        for (const resultModel of fetchedSurvey) {
            decoratedSurveyResults.push({
                SurveyID: record?.Uuid,
                SurveydetailID: resultModel?.Uuid,
                Answer: resultModel.Result
            })
        }

        switch (record?.Type) {
            case SURVEY_TYPE_PATIENT:
                for (const personel of personels) {
                    for (const decoratedSurveyResult of decoratedSurveyResults) {
                        reqData.push({
                            ...decoratedSurveyResult,
                            UserID: personel
                        })
                    }
                }
                break;
            case SURVEY_TYPE_PATIENTCONTACT:
                for (const personel of personels) {
                    for (const decoratedSurveyResult of decoratedSurveyResults) {
                        reqData.push({
                            ...decoratedSurveyResult,
                            User: personel
                        })
                    }
                }
                break;
            case SURVEY_TYPE_USER:
                for (const personel of personels) {
                    for (const decoratedSurveyResult of decoratedSurveyResults) {
                        reqData.push({
                            ...decoratedSurveyResult,
                            UserID: personel
                        })
                    }
                }
                break;
        }

        for (const request of reqData) {

            const {
                SurveyID,
                SurveydetailID,
                Answer,
                UserID,
                User
            } = request

            if (!validator.isUUID(SurveyID)) {
                errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.SurveyIDRequired') })
            }
            if (!validator.isUUID(SurveydetailID)) {
                errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.SurveydetailIDRequired') })
            }
            if (!validator.isNumber(Answer)) {
                errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.AnswerRequired') })
            }
            if (record?.Type === SURVEY_TYPE_PATIENTCONTACT) {
                if (!validator.isString(User)) {
                    errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.UserRequired') })
                }
            } else {
                if (!validator.isUUID(UserID)) {
                    errors.push({ type: 'Error', code: t('Pages.Surveys.Page.Header'), description: t('Pages.Surveys.Messages.UserIDRequired') })
                }
            }
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillSurveynotification(error)
            })
        } else {
            FillSurveys({
                data: reqData,
                onSuccess: () => {
                    setOpen(false)
                    setPersonels([])
                    setFetchedSurvey([])
                    GetSurveys()
                }
            })
        }

    }

    useEffect(() => {
        if (open) {
            setPersonels([])
            setFetchedSurvey([])

            switch (record?.Type) {
                case SURVEY_TYPE_PATIENT:
                    GetPatients()
                    GetPatientdefines()
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
                <Modal.Content >
                    <Dimmer inverted active={Users.isLoading || Patientdefines.isLoading || Patients.isLoading || Surveys.isLoading}>
                        <Loader inverted active />
                    </Dimmer>
                    <Modal.Description>
                        <Label className='!bg-[#2355a0] !text-white' basic>{t('Pages.Surveys.Messages.SelectPersonels')}</Label>
                        <Pagedivider />
                        <Form>
                            <Form.Group widths={'equal'}>
                                <Form.Field>
                                    <Label content={t('Pages.Surveys.Column.Personels')} className='!my-2 !bg-[#2355a0] !text-white' />
                                    <Dropdown
                                        placeholder={t('Pages.Surveys.Column.Personels')}
                                        fluid
                                        search
                                        multiple
                                        clearable
                                        selection
                                        options={dataOptions}
                                        onChange={(e, dropdownMeta) => {
                                            setPersonels(dropdownMeta.value)
                                        }}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                        <Pagedivider />
                        <div className='w-full h-12'>
                            <Button
                                disabled={isButtonDisabled()}
                                onClick={() => {
                                    setFetchedSurvey((record?.Surveydetails || []).map(u => {
                                        return {
                                            Uuid: u.Uuid,
                                            Question: u.Question,
                                            Result: null,
                                            key: Math.random()
                                        }
                                    }))
                                }}
                                floated='right'
                                className='!bg-[#2355a0] !text-white'>
                                {t('Pages.Surveys.Label.GetSurvey')}
                            </Button>
                        </div>
                        <Pagedivider />
                        {(fetchedSurvey || []).length > 0 ?
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{t('Pages.Surveys.Label.Question')}</Table.HeaderCell>
                                        <Table.HeaderCell>{t('Pages.Surveys.Label.Result')}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {(fetchedSurvey || []).map((detail, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>{detail?.Question}</Table.Cell>
                                            <Table.Cell>
                                                {renderRadioButtons(detail.key, detail.Result)}
                                            </Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                            </Table>
                            : null}

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
                        className='!bg-[#2355a0] !text-white'
                        content={t('Common.Button.Fill')}
                        labelPosition='right'
                        icon='checkmark'
                        onClick={() => handleSubmit()}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </DimmerDimmable >
    )
}

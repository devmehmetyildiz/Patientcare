import React from 'react'
import { Button, Label, Modal, Table } from 'semantic-ui-react'
import { SURVEY_TYPE_PATIENT, SURVEY_TYPE_PATIENTCONTACT, SURVEY_TYPE_USER } from '../../Utils/Constants'
import { Pagedivider } from '../../Components'

export default function SurveysDetail(props) {

    const { open, setOpen, record, setRecord, Profile } = props

    const t = Profile?.i18n?.t

    const Surveytypeoption = [
        { key: 1, text: t('Option.Surveytypes.Patient'), value: SURVEY_TYPE_PATIENT },
        { key: 2, text: t('Option.Surveytypes.Patientcontant'), value: SURVEY_TYPE_PATIENTCONTACT },
        { key: 3, text: t('Option.Surveytypes.User'), value: SURVEY_TYPE_USER },
    ]

    const {
        Type,
        Name,
        Minnumber,
        Maxnumber,
        Surveydetails,
    } = record || {}

    const decoratedType = Surveytypeoption.find(u => u.value === Type)?.text || t('Common.NoDataFound')

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header >{t('Pages.Surveys.Page.Detaileader')}</Modal.Header>
            <Modal.Content image>
                <div className='flex flex-col w-full gap-2'>
                    <div className='flex gap-4'>
                        <Label
                            className='!bg-[#2355a0] !text-white !ml-6'
                            ribbon
                            size='big'>
                            <div className='flex flex-col gap-2'>
                                <span>{`${t('Pages.Surveys.Column.Name')} : ${Name}`}</span>
                                <span>{`${t('Pages.Surveys.Column.Type')} : ${decoratedType}`}</span>
                            </div>
                        </Label>
                        <Label
                            className='!bg-[#2355a0] !text-white !ml-6'
                            ribbon
                            size='big'>
                            <div className='flex flex-col gap-2'>
                                <span>{`${t('Pages.Surveys.Column.Maxnumber')} : ${Maxnumber}`}</span>
                                <span>{`${t('Pages.Surveys.Column.Minnumber')} : ${Minnumber}`}</span>
                            </div>
                        </Label>
                    </div>
                    <Pagedivider />
                    <div>
                        <Label
                            className='!bg-[#2355a0] !text-white'
                            size='large'
                        >
                            {t('Pages.Surveys.Column.Questions')}
                        </Label>

                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{t('Pages.Surveys.Column.Question')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(Surveydetails || []).map((detail, index) => {
                                    return <Table.Row key={index}>
                                        <Table.Cell>{detail.Question}</Table.Cell>
                                    </Table.Row>
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setRecord(null)
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

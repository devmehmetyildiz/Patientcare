import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Modal } from 'semantic-ui-react'
import { Pagedivider } from '../../Components'

export default function TrainingsFastAdd(props) {
    const { context, PAGE_NAME, open, setOpen, Users, Professions, Profile, fillTrainingnotification } = props

    const t = Profile?.i18n?.t

    const [selected, setSelected] = useState([])

    const professions = (Professions.list || []).filter(u => u.Isactive)

    useEffect(() => {
        if (open) {
            setSelected([])
        }
    }, [open])

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size='tiny'
        >
            <Modal.Header>{t('Pages.Trainings.Page.FastaddHeader')}</Modal.Header>
            <Modal.Content>
                <Form>
                    {professions.map((profession, index) => {
                        return <Form.Field key={index} >
                            <Checkbox
                                toggle
                                label={profession?.Name || t('Common.NoDataFound')}
                                checked={selected.includes(profession?.Uuid) ? true : false}
                                onChange={() => {
                                    if (selected.find(u => u === profession?.Uuid) ? true : false) {
                                        setSelected(selected.filter(u => u !== profession?.Uuid))
                                    } else {
                                        setSelected([...selected, profession?.Uuid])
                                    }
                                }}
                            />
                        </Form.Field>
                    })}
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
                <Button
                    onClick={() => {
                        setSelected(professions.map(u => u.Uuid))
                    }}
                    className=' !bg-[#2355a0] !text-white'
                    content={t('Common.Button.Selectall')}
                />
                <Button
                    content={t('Common.Button.Save')}
                    labelPosition='right'
                    icon='checkmark'
                    className=' !bg-[#2355a0] !text-white'
                    onClick={() => {
                        if (selected.length <= 0) {
                            fillTrainingnotification({ type: 'Error', code: t('Pages.Trainings.Page.FastaddHeader'), description: t('Pages.Trainings.Messages.ProfessionRequired') })
                        } else {
                            const users = (Users.list || []).filter(u => u.Isactive && u.Isworker).filter(user => {
                                return selected.includes(user?.ProfessionID) ? true : false
                            })
                            context.setFormstates({
                                ...context.formstates,
                                [`${PAGE_NAME}/Trainingusers`]: ((users || []).map(u => u.Uuid)) || [],
                            })
                            setOpen(false)
                        }
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal >
    )
}
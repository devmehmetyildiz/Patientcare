import React, { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Label, Modal } from 'semantic-ui-react'
import { Contentwrapper, FormInput } from '../../Components'
import { FormContext } from '../../Provider/FormProvider'
import validator from '../../Utils/Validator'

export default function UsersEditcaseModal(props) {
    const {
        isUserspage,
        isUserdetailpage,
        open,
        setOpen,
        record,
        setRecord,
        Profile,
        Users,
        Cases,
        Departments,
        fillUsernotification,
        GetUser,
        GetUsers,
        EditUsercase,
        GetCases,
        GetDepartments
    } = props

    const PAGE_NAME = 'UsersEditcaseModal'
    const t = Profile?.i18n?.t || null
    const context = useContext(FormContext)

    const [ispastdatemovement, setIspastdatemovement] = useState(false)

    const user = record

    useEffect(() => {
        context.clearForm(PAGE_NAME)
        if (open) {
            GetCases()
            GetDepartments()

        }
    }, [open])

    const CaseOption = (Cases.list || [])
        .filter(u => u.Isactive)
        .map(casedata => {
            const departmentuuids = (casedata?.Departmentuuids || []).map(u => u.DepartmentID);
            let Ishavepersonels = false
            departmentuuids.forEach(departmentuuid => {
                const department = (Departments.list || []).find(u => u.Uuid === departmentuuid)
                if (department?.Ishavepersonels === true || department?.Ishavepersonels === 1) {
                    Ishavepersonels = true
                }
            });
            return Ishavepersonels === true && casedata?.CaseStatus === 0 ? { key: casedata.Uuid, text: casedata.Name, value: casedata.Uuid } : false
        }).filter(u => u)

    const selectedCase = (Cases.list || []).find(u => u.Uuid === user?.CaseID)

    const selectedOccureddate = context.formstates[`${PAGE_NAME}/Occureddate`]

    const nextmovements = (ispastdatemovement && validator.isISODate(selectedOccureddate)) ? (user?.Movements || []).filter(u => new Date(u.Occureddate).getTime() >= new Date(selectedOccureddate).getTime()) : null
    const isNeedEndDate = (ispastdatemovement && validator.isISODate(selectedOccureddate)) ? (nextmovements || []).length > 0 : false

    return open
        ? <Modal
            onClose={() => {
                setOpen(false)
                setRecord(null)
            }}
            onOpen={() => {
                setOpen(true)
            }}
            open={open}
        >
            <Modal.Header>{`${t('Pages.Users.UsersEditcaseModal.Page.Header')} - ${user?.Name} ${user?.Surname}`}</Modal.Header>
            <Modal.Header>
                <div className='w-full flex justify-between items-center'>
                    <Label className='!bg-[#2355a0] !text-white' size='big'>{`${t('Pages.Users.UsersEditcaseModal.Label.Oldcase')}`}
                        <Label.Detail>
                            {selectedCase?.Name || t('Common.NoDataFound')}
                        </Label.Detail>
                    </Label>
                    <Checkbox
                        toggle
                        className='m-2'
                        id={'ispastdatemovement'}
                        checked={ispastdatemovement}
                        onClick={(e) => {
                            setIspastdatemovement(e.target.checked ? true : false)
                        }}
                        label={t('Pages.Users.UsersEditcaseModal.Label.Pastdatemovement')} />
                </div>
            </Modal.Header>
            <Modal.Content>
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.UsersEditcaseModal.Label.Case')} name="CaseID" options={CaseOption} formtype='dropdown' />
                        </Form.Group>
                        {ispastdatemovement ?
                            <Form.Group widths={'equal'}>
                                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.UsersEditcaseModal.Label.Occureddate')} name="Occureddate" type='datetime-local' />
                                {isNeedEndDate ?
                                    <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.UsersEditcaseModal.Label.Occuredenddate')} name="Occuredenddate" type='datetime-local' />
                                    : null}
                            </Form.Group>
                            : null}
                    </Form>
                </Contentwrapper>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setRecord(null)
                }}>
                    {t('Common.Button.Goback')}
                </Button>
                <Button
                    content={t('Common.Button.Update')}
                    labelPosition='right'
                    className='!bg-[#2355a0] !text-white'
                    icon='checkmark'
                    onClick={() => {
                        const data = context.getForm(PAGE_NAME)

                        let errors = []
                        if (!validator.isUUID(data?.CaseID)) {
                            errors.push({ type: 'Error', code: t('Pages.Users.UsersEditcaseModal.Page.Header'), description: t('Pages.Users.UsersEditcaseModal.Messages.CaseRequired') })
                        }
                        if (ispastdatemovement && !validator.isISODate(data?.Occureddate)) {
                            errors.push({ type: 'Error', code: t('Pages.Users.UsersEditcaseModal.Page.Header'), description: t('Pages.Users.UsersEditcaseModal.Messages.OccureddateRequired') })
                        } else {
                            if (isNeedEndDate && !validator.isISODate(data?.Occuredenddate)) {
                                errors.push({ type: 'Error', code: t('Pages.Users.UsersEditcaseModal.Page.Header'), description: t('Pages.Users.UsersEditcaseModal.Messages.OccureddateendRequired') })
                            } else {
                                if ((nextmovements || []).length > 0) {
                                    const nextmovement = nextmovements[0]

                                    if (new Date(data?.Occuredenddate).getTime() >= new Date(nextmovement?.Occureddate).getTime()) {
                                        errors.push({ type: 'Error', code: t('Pages.Users.UsersEditcaseModal.Page.Header'), description: t('Pages.Users.UsersEditcaseModal.Messages.Occuredenddatetoobig') })
                                    }
                                }
                            }

                        }
                        if (errors.length > 0) {
                            errors.forEach(error => {
                                fillUsernotification(error)
                            })
                        } else {
                            let body = {
                                UserID: user?.Uuid,
                                CaseID: data?.CaseID,
                                Ispastdate: isNeedEndDate ? true : false
                            }

                            if (ispastdatemovement) {
                                body.Occureddate = data.Occureddate
                                if (isNeedEndDate) {
                                    body.Occuredenddate = data.Occuredenddate
                                }
                            }

                            EditUsercase({
                                data: body,
                                onSuccess: () => {
                                    if (isUserspage) {
                                        GetUsers()
                                    }
                                    if (isUserdetailpage) {
                                        GetUser(user?.Uuid)
                                    }
                                    setOpen(false)
                                    setRecord(null)
                                }
                            })
                        }
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>
        : null
}

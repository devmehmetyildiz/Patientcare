import React, { useContext, useEffect, useState } from 'react'
import { Form, Tab } from 'semantic-ui-react'
import UsersPrepareApp from './UsersPrepareApp'
import UsersPrepareWorker from './UsersPrepareWorker'
import UsersPrepareFile from './UsersPrepareFile'
import UsersPrepareKnowledge from './UsersPrepareKnowledge'
import { FormInput, Pagedivider } from '../../../Components'
import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from '../../../Utils/Constants'
import { FormContext } from '../../../Provider/FormProvider'

export default function UsersPrepare(props) {
    const { Profile, PAGE_NAME, selectedFiles, setselectedFiles, fillnotification, Usagetypes, Roles, Professions, isEditpage } = props

    const t = Profile?.i18n?.t
    const [passwordSame, setPasswordSame] = useState(false)
    const { getRecord, record } = useContext(FormContext)


    useEffect(() => {
        const password = getRecord(PAGE_NAME, 'Password')
        const passwordRe = getRecord(PAGE_NAME, 'PasswordRe')
        setPasswordSame(password !== passwordRe)
    }, [record])

    return (
        <Form>
            <Form.Group widths={'equal'}>
                <FormInput disabled={isEditpage} page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Username')} name="Username" validationfunc={(e) => USERNAME_REGEX.test(e)} validationmessage={t('Pages.Users.Messages.UsernameHint')} attention={t('Pages.Users.Messages.UsernameHint')} />
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Email')} name="Email" validationfunc={(e) => EMAIL_REGEX.test(e)} validationmessage={t('Pages.Users.Messages.EmailHint')} attention={t('Pages.Users.Messages.EmailHint')} />
            </Form.Group>
            {!isEditpage
                ? <Form.Group widths={'equal'}>
                    <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Password')} name="Password" type='password' validationfunc={(e) => PASSWORD_REGEX.test(e)} validationmessage={t('Pages.Users.Messages.PasswordHint')} attention={t('Pages.Users.Messages.PasswordHint')} />
                    <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.PasswordRe')} name="PasswordRe" type='password' nonValid={passwordSame} nonValidMessage={t('Pages.Users.Messages.PasswordSameHint')} />
                </Form.Group>
                : null
            }
            <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Name')} name="Name" />
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Surname')} name="Surname" />
            </Form.Group>
            <Pagedivider />
            <Tab
                className="w-full !bg-transparent"
                panes={[
                    {
                        menuItem: t('Pages.Users.Prepare.Tab.AppHeader'),
                        pane: {
                            key: 'app',
                            content: <UsersPrepareApp
                                Roles={Roles}
                                Profile={Profile}
                                PAGE_NAME={PAGE_NAME}
                            />
                        }
                    },
                    {
                        menuItem: t('Pages.Users.Prepare.Tab.KnowledgeHeader'),
                        pane: {
                            key: 'knowledge',
                            content: <UsersPrepareKnowledge
                                Profile={Profile}
                                PAGE_NAME={PAGE_NAME}
                            />
                        }
                    },
                    {
                        menuItem: t('Pages.Users.Prepare.Tab.WorkerHeader'),
                        pane: {
                            key: 'worker',
                            content: <UsersPrepareWorker
                                Professions={Professions}
                                Profile={Profile}
                                PAGE_NAME={PAGE_NAME}
                            />
                        }
                    },
                    {
                        menuItem: t('Pages.Users.Prepare.Tab.FileHeader'),
                        pane: {
                            key: 'file',
                            content: <UsersPrepareFile
                                fillnotification={fillnotification}
                                Usagetypes={Usagetypes}
                                selectedFiles={selectedFiles}
                                setselectedFiles={setselectedFiles}
                                Profile={Profile}
                            />
                        }
                    },
                ]}
                renderActiveOnly={false}
            />
        </Form>
    )
}

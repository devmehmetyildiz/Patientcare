import React from 'react'
import { Form, Tab } from 'semantic-ui-react'
import UsersPrepareApp from './UsersPrepareApp'
import UsersPrepareWorker from './UsersPrepareWorker'
import UsersPrepareFile from './UsersPrepareFile'
import UsersPrepareKnowledge from './UsersPrepareKnowledge'
import { FormInput, Pagedivider } from '../../../Components'

export default function UsersPrepare(props) {
    const { Profile, PAGE_NAME, selectedFiles, setselectedFiles, fillnotification, Usagetypes, Roles, Professions, isEditpage } = props
    const t = Profile?.i18n?.t

    return (
        <Form>
            <Form.Group widths={'equal'}>
                <FormInput disabled={isEditpage} page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Username')} name="Username" />
                {!isEditpage
                    ? <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Password')} name="Password" type='password' />
                    : null
                }
            </Form.Group>
            <Form.Group widths={'equal'}>
                <FormInput page={PAGE_NAME} required placeholder={t('Pages.Users.Prepare.Label.Email')} name="Email" />
            </Form.Group>
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

import React, { useEffect } from 'react'
import Pagewrapper from '../../../Components/Pagewrapper'
import validator from '../../../Utils/Validator'
import { Dimmer, DimmerDimmable, Dropdown, Loader } from 'semantic-ui-react'
import UserDetailProfile from './UserDetailProfile'
import UserDetailFiles from './UserDetailFiles'
import UserDetailCase from './UserDetailCase'
import UsersDetailInfo from './UsersDetailInfo'

export default function UsersDetail(props) {

    const { GetUser, fillUsernotification, UserID, match, history, Profile,
        Cases, Users, Files, Departments, Roles, Usagetypes, GetFiles,
        GetCases, GetRoles, GetProfessions, GetUsagetypes, GetDepartments } = props

    const Id = match?.params?.UserID || UserID
    const t = Profile?.i18n?.t

    useEffect(() => {
        if (validator.isUUID(Id)) {
            GetUser(Id)
            GetCases()
            GetProfessions()
            GetRoles()
            GetCases()
            GetFiles()
            GetDepartments()
            GetUsagetypes()
        } else {
            fillUsernotification({
                type: 'Success',
                code: t('Pages.Users.Page.DetailHeader'),
                description: t('Pages.Users.Detail.Messages.UnsupportedUserID'),
            });
            history.length > 1 ? history.goBack() : history.push('/Patients')
        }
    }, [])

    const isLoadingstatus = false
    const { selected_record: user } = Users

    return (
        <Pagewrapper>
            <DimmerDimmable blurring={isLoadingstatus} dimmed>
                <Dimmer active={isLoadingstatus} inverted>
                    <Loader>Yükleniyor</Loader>
                </Dimmer>
                <div className='w-full flex flex-col md:flex-row lg:flex-row justify-center items-center md:items-start lg:items-start'>
                    <div className=' w-[30%] flex flex-col justify-start items-center'>
                        <UserDetailProfile
                            user={user}
                            Roles={Roles}
                            Files={Files}
                            Usagetypes={Usagetypes}
                            Profile={Profile}
                        />
                        <UserDetailCase
                            user={user}
                            Cases={Cases}
                            Departments={Departments}
                            Profile={Profile}
                        />
                        <UsersDetailInfo
                            user={user}
                            Profile={Profile}
                        />
                    </div>
                    <div className=' w-full mx-4 flex flex-col justify-start items-center'>
                        <div className='px-4 pb-2 w-full'>
                            <Dropdown
                                text={t('Pages.Users.Detail.Label.Process')}
                                icon='filter'
                                floating
                                fluid
                                labeled
                                button
                                className='!bg-[#2355a0] !text-white icon'
                            >
                                <Dropdown.Menu>

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <UserDetailFiles
                            user={user}
                            Files={Files}
                            Usagetypes={Usagetypes}
                            fillnotification={fillUsernotification}
                            Profile={Profile}
                        />
                    </div>
                </div>
            </DimmerDimmable>
        </Pagewrapper >
    )
}

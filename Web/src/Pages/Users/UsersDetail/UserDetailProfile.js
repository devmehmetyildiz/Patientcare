import React from 'react'
import { Button, Header, Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { Profilephoto } from '../../../Components'
import validator from '../../../Utils/Validator'
import privileges from '../../../Constants/Privileges'

export default function UserDetailProfile(props) {

    const { user, Files, Usagetypes, Roles, Profile, fillnotification } = props

    const history = useHistory()
    const t = Profile?.i18n?.t
    const userRoles = Profile?.roles

    const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const ppFile = (Files.list || []).find(u => u.ParentID === user?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

    const userName = `${user?.Name} ${user?.Surname}` || t('Common.NoDataFound')
    // const Isworker = user?.Isworker ? true : false
    const roles = (user?.Roleuuids || []).map(u => { return u.RoleID }).map(u => {
        return (Roles?.list || []).find(role => role?.Uuid === u)?.Name || t('Common.NoDataFound')
    }).join(',')


    return (
        <div className='relative bg-white shadow-lg w-full  rounded-lg flex flex-col justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
            {ppFile
                ? <Profilephoto
                    fileID={ppFile?.Uuid}
                    fillnotification={fillnotification}
                    Profile={Profile}
                />
                : <Header className='!m-0 !p-0' as='h2' icon textAlign='center'><Icon name='users' circular /></Header>
            }
            <div className='mt-4 !text-[#2355a0] text-2xl font-extrabold' >{userName}</div>
            <Header className='!m-0 !p-0 !mt-1 !text-[#bebebe]' as='h4'>{`${t('Pages.Users.Detail.Profile.Label.Username')} : ${user?.Username || t('Common.NoDataFound')}`}</Header>
            <Header className='!m-0 !p-0 !mt-1 !text-[#bebebe]' as='h4'>{`${t('Pages.Users.Detail.Profile.Label.Roles')} : ${roles || t('Common.NoDataFound')}`}</Header>
            <div className='mt-4'>
                <Button
                    disabled={!validator.isHavePermission(privileges.userupdate, userRoles)}
                    className='!bg-[#2355a0] !text-white !mt-8 mb-4'
                    fluid
                    onClick={() => { history.push(`/Users/${user?.Uuid}/edit`, { redirectUrl: "/Users/" + user?.Uuid }) }}>
                    {t('Pages.Users.Detail.Profile.Label.Defineupdate')}
                </Button>
            </div>
            <div
                onClick={() => { history.length > 1 ? history.goBack() : history.push(`/Users`) }}
                className='absolute left-0 top-0 p-2 rotate-180 cursor-pointer'
            >
                <Icon className='!text-[#2355a0]' size='large' name='sign-out alternate' />
            </div>
        </div>
    )
}

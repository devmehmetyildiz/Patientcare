import React from 'react'
import config from '../../../Config'
import { ROUTES } from '../../../Utils/Constants'
import { Button, Header, Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import Formatdate from '../../../Utils/Formatdate'

export default function UserDetailProfile(props) {

    const { user, Files, Usagetypes, Roles, Profile } = props
    console.log('user: ', user);

    const history = useHistory()
    const t = Profile?.i18n?.t

    const usagetypePP = (Usagetypes.list || []).find(u => u.Value === 'PP')?.Uuid || null
    const files = (Files.list || []).find(u => u.ParentID === user?.Uuid && (((u.Usagetype || '').split(',')) || []).includes(usagetypePP) && u.Isactive)

    const userName = `${user?.Name} ${user?.Surname}` || t('Common.NoDataFound')
    const Isworker = user?.Isworker ? true : false
    const roles = (user?.Roleuuids || []).map(u => { return u.RoleID }).map(u => {
        return (Roles?.list || []).find(role => role?.Uuid === u)?.Name || t('Common.NoDataFound')
    }).join(',')

    return (
        <div className='relative bg-white shadow-lg w-full  rounded-lg flex flex-col justify-center items-center  p-4 m-4 mt-0 min-w-[250px]'>
            {files
                ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${files?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                : <Header className='!m-0 !p-0' as='h2' icon textAlign='center'><Icon name='users' circular /></Header>
            }
            <div className='mt-4 !text-[#2355a0] text-2xl font-extrabold' >{userName}</div>
            <Header className='!m-0 !p-0 !mt-1 !text-[#bebebe]' as='h4'>{`${t('Pages.Users.Detail.Profile.Label.Username')} : ${user?.Username || t('Common.NoDataFound')}`}</Header>
            <Header className='!m-0 !p-0 !mt-1 !text-[#bebebe]' as='h4'>{`${t('Pages.Users.Detail.Profile.Label.Roles')} : ${roles || t('Common.NoDataFound')}`}</Header>
            <div className='mt-4'>
                <Button
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

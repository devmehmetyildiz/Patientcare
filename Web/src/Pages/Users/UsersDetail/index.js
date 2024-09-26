import React, { useEffect, useState } from 'react'
import Pagewrapper from '../../../Components/Pagewrapper'
import validator from '../../../Utils/Validator'
import { Dimmer, DimmerDimmable, Dropdown, Icon, Loader } from 'semantic-ui-react'
import UserDetailProfile from './UserDetailProfile'
import UserDetailFiles from './UserDetailFiles'
import UserDetailCase from './UserDetailCase'
import UsersDetailInfo from './UsersDetailInfo'
import UsersDetailBreakdowns from './UsersDetailBreakdowns'
import UsersDetailMainteancies from './UsersDetailMainteancies'
import UsersDetailEquipments from './UsersDetailEquipments'
import UserDetailShift from './UserDetailShift'
import UsersDetailPurchaseorders from './UsersDetailPurchaseorders'
import UserDetailTimeline from './UserDetailTimeline'
import UsersEditcaseModal from '../../../Containers/Users/UsersEditcaseModal'

export default function UsersDetail(props) {

    const { fillUsernotification, GetUsers, GetFiles, GetEquipmentgroups,
        GetEquipments, GetPurchaseorders, GetBreakdowns, GetMainteancies, GetShiftdefines,
        GetCases, GetRoles, GetProfessions, GetUsagetypes, GetDepartments,
        GetFloors, GetRooms, GetBeds } = props

    const { Profile, Cases, Users, Files, Departments, Roles, Usagetypes, Equipmentgroups,
        Equipments, Purchaseorders, Breakdowns, Mainteancies, Shiftdefines, Floors, Rooms, Beds } = props

    const { UserID, match, history, } = props

    const [openeditcase, setOpeneditcase] = useState(false)
    const [record, setRecord] = useState(null)

    const Id = match?.params?.UserID || UserID
    const t = Profile?.i18n?.t

    useEffect(() => {
        if (validator.isUUID(Id)) {
            GetUsers()
            GetCases()
            GetProfessions()
            GetRoles()
            GetCases()
            GetFiles()
            GetDepartments()
            GetUsagetypes()
            GetEquipmentgroups()
            GetEquipments()
            GetPurchaseorders()
            GetBreakdowns()
            GetMainteancies()
            GetShiftdefines()
            GetFloors()
            GetRooms()
            GetBeds()
        } else {
            fillUsernotification({
                type: 'Success',
                code: t('Pages.Users.Page.DetailHeader'),
                description: t('Pages.Users.Detail.Messages.UnsupportedUserID'),
            });
            history.length > 1 ? history.goBack() : history.push('/Patients')
        }
    }, [])

    const isLoadingstatus = Users.isLoading
    const user = (Users.list || []).find(u => u.Uuid === Id)

    return (
        <div className='w-full'>
            <Pagewrapper>
                <DimmerDimmable blurring={isLoadingstatus} dimmed>
                    <Dimmer active={isLoadingstatus} inverted>
                        <Loader>Yükleniyor</Loader>
                    </Dimmer>
                    <div className='w-full flex flex-col md:flex-row lg:flex-row justify-center items-center md:items-start lg:items-start'>
                        <div className=' lg:w-[30%] md:w-[30%] w-[80%] min-w-[250px] flex flex-col justify-start items-center'>
                            <UserDetailProfile
                                user={user}
                                Roles={Roles}
                                Files={Files}
                                Usagetypes={Usagetypes}
                                Profile={Profile}
                                fillnotification={fillUsernotification}
                            />
                            <UserDetailCase
                                user={user}
                                Cases={Cases}
                                Departments={Departments}
                                Profile={Profile}
                            />
                            <UserDetailShift
                                user={user}
                                Shiftdefines={Shiftdefines}
                                Profile={Profile}
                            />
                            <UsersDetailInfo
                                user={user}
                                Profile={Profile}
                            />
                        </div>
                        <div className=' w-full min-w-0 mx-4 flex flex-col justify-start items-center'>
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
                                        <Dropdown.Item
                                            onClick={() => {
                                                setRecord(user)
                                                setOpeneditcase(true)
                                            }}>
                                            <Icon name='attention' className='right floated' />
                                            {t('Pages.Users.Detail.Button.Editcase')}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { history.push(`/Users/${Id}/Movements`) }}>
                                            <Icon name='conversation' className='right floated' />
                                            {t('Pages.Users.Detail.Button.Editmovements')}
                                        </Dropdown.Item>
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
                            <UserDetailTimeline
                                user={user}
                                Cases={Cases}
                                Users={Users}
                                Departments={Departments}
                                Profile={Profile}
                            />
                            <UsersDetailEquipments
                                user={user}
                                Equipmentgroups={Equipmentgroups}
                                Equipments={Equipments}
                                Floors={Floors}
                                Rooms={Rooms}
                                Beds={Beds}
                                fillnotification={fillUsernotification}
                                Profile={Profile}
                            />
                            <UsersDetailBreakdowns
                                user={user}
                                Breakdowns={Breakdowns}
                                Equipmentgroups={Equipmentgroups}
                                Equipments={Equipments}
                                fillnotification={fillUsernotification}
                                Profile={Profile}
                            />
                            <UsersDetailMainteancies
                                user={user}
                                Mainteancies={Mainteancies}
                                Equipmentgroups={Equipmentgroups}
                                Equipments={Equipments}
                                fillnotification={fillUsernotification}
                                Profile={Profile}
                            />
                            <UsersDetailPurchaseorders
                                user={user}
                                Purchaseorders={Purchaseorders}
                                Cases={Cases}
                                fillnotification={fillUsernotification}
                                Profile={Profile}
                            />
                        </div>
                    </div>
                </DimmerDimmable>
                <UsersEditcaseModal
                    isUserdetailpage
                    open={openeditcase}
                    setOpen={setOpeneditcase}
                    record={record}
                    setRecord={setRecord}
                />
            </Pagewrapper >
        </div>
    )
}

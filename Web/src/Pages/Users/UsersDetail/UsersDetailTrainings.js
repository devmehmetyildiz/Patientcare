import React, { useState } from 'react'
import { Confirm, Icon, Table, Transition } from 'semantic-ui-react'
import { Formatfulldate } from '../../../Utils/Formatdate'

export default function UsersDetailTrainings(props) {

    const [open, setOpen] = useState(true)
    const [confirm, setConfirm] = useState(false)

    const { user, Trainings, Profile, GetUsers, CompleteTrainingusers } = props

    const t = Profile?.i18n?.t

    const decoratedList = (Trainings.list || []).filter(u => u.Isactive && (u?.Trainingusers || []).map(u => u.UserID).includes(user?.Uuid)).map(training => {

        const traininguserdata = (training?.Trainingusers || []).find(u => u?.UserID === user?.Uuid)
        return traininguserdata?.Iscompleted === false ? {
            name: `${training?.Name || t('Common.NoDataFound')}`,
            place: `${training?.Place || t('Common.NoDataFound')}`,
            duration: `${training?.Duration || t('Common.NoDataFound')}`,
            date: `${Formatfulldate(training?.Trainingdate, true)}`,
            info: training?.Description || '',
            Uuid: traininguserdata?.Uuid
        } : null
    }).filter(u => u)

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.Trainings.Header')}</div>
                    <div >
                        {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
                    </div>
                </div>
                <Transition visible={open} animation='slide down' duration={500}>
                    <div className='w-full'>
                        {(decoratedList || []).length > 0
                            ? <Table >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>{t('Pages.Users.Detail.Trainings.Label.Name')}</Table.HeaderCell>
                                        <Table.HeaderCell>{t('Pages.Users.Detail.Trainings.Label.Place')}</Table.HeaderCell>
                                        <Table.HeaderCell>{t('Pages.Users.Detail.Trainings.Label.Duration')}</Table.HeaderCell>
                                        <Table.HeaderCell>{t('Pages.Users.Detail.Trainings.Label.Date')}</Table.HeaderCell>
                                        <Table.HeaderCell>{t('Pages.Users.Detail.Trainings.Label.Info')}</Table.HeaderCell>
                                        <Table.HeaderCell>{t('Pages.Users.Detail.Trainings.Label.Enter')}</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {decoratedList.map((training, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>{training?.name}</Table.Cell>
                                            <Table.Cell>{training?.place}</Table.Cell>
                                            <Table.Cell>{training?.duration}</Table.Cell>
                                            <Table.Cell>{training?.date}</Table.Cell>
                                            <Table.Cell>{training?.info}</Table.Cell>
                                            <Table.Cell>
                                                <div
                                                    className='cursor-pointer'
                                                    onClick={() => { setConfirm(true) }}
                                                >
                                                    <Icon className='text-[#2355a0]' name='object ungroup' />
                                                </div>
                                                <Confirm
                                                    cancelButton={t('Common.Button.Giveup')}
                                                    confirmButton={t('Common.Button.Approve')}
                                                    content={`${training?.name} ${t('Pages.Users.Detail.Trainings.Messages.Check')}`}
                                                    open={confirm}
                                                    onCancel={() => { setConfirm(false) }}
                                                    onConfirm={() => {
                                                        let body = {
                                                            data: training,
                                                            onSuccess: () => {
                                                                GetUsers()
                                                                setConfirm(false)
                                                            }
                                                        }
                                                        CompleteTrainingusers(body)
                                                    }}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                            </Table>
                            : <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>}
                    </div>
                </Transition>
            </div>

        </div>
    )
}

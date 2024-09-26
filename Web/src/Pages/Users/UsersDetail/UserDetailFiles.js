import React, { useState } from 'react'
import { Icon, Table, Transition } from 'semantic-ui-react'
import validator from '../../../Utils/Validator'
import { Filepreview } from '../../../Components'

export default function UserDetailFiles(props) {
    const { user, Files, Usagetypes, Profile, fillnotification } = props

    const [open, setOpen] = useState(true)
    const [selectedfile, setSelectedfile] = useState(null)

    const t = Profile?.i18n?.t

    const userFiles = (Files.list || []).filter(u => u.ParentID === user?.Uuid)

    const decoratedList = (userFiles || []).map(file => {
        const usagetype = ((file?.Usagetype || '').split(',') || []).map(usagetypeID => {
            const rawUsagetype = ((Usagetypes.list || []).find(u => u.Uuid === usagetypeID))
            return rawUsagetype?.Name
        })
        return { label: file?.Name, link: file?.Uuid, usagetype: usagetype }
    })

    return (
        <div className='w-full px-4 mt-4'>
            <Filepreview
                fileurl={selectedfile}
                setFileurl={setSelectedfile}
                Profile={Profile}
                fillnotification={fillnotification}
            />
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div onClick={() => { setOpen(prev => !prev) }} className='w-full flex justify-between cursor-pointer items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.File.Header')}</div>
                    <div >
                        {open ? <Icon name='angle up' /> : <Icon name='angle down' />}
                    </div>
                </div>
                <Transition visible={open} animation='slide down' duration={500}>
                    <div className='w-full'>
                        <Table >
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.File.Label.Name')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.File.Label.Usagetype')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('Pages.Users.Detail.File.Label.Download')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {(decoratedList || []).length > 0
                                    ? decoratedList.map((file, index) => {
                                        return <Table.Row key={index}>
                                            <Table.Cell>
                                                <Icon className='text-[#2355a0]' name='file alternate' size='large' />
                                                {file?.label}
                                            </Table.Cell>
                                            <Table.Cell>{file?.usagetype}</Table.Cell>
                                            <Table.Cell>
                                                {validator.isUUID(file.link) &&
                                                    <div className='cursor-pointer' onClick={() => { setSelectedfile(file.link) }}>
                                                        <Icon color='blue' name='download' />
                                                    </div>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    })
                                    : <Table.Row>
                                        <Table.Cell>
                                            <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>
                                        </Table.Cell>
                                    </Table.Row>}
                            </Table.Body>
                        </Table>
                    </div>
                </Transition>
            </div>
        </div>
    )
}

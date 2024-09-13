import React, { useState } from 'react'
import { Dimmer, Icon, Loader, Table } from 'semantic-ui-react'
import validator from '../../../Utils/Validator'
import axios from 'axios'
import config from '../../../Config'
import { ROUTES } from '../../../Utils/Constants'

export default function UserDetailFiles(props) {
    const { user, Files, Usagetypes, Profile, fillnotification } = props
    const [fileDownloading, setfileDownloading] = useState(false)
    const t = Profile?.i18n?.t

    const userFiles = (Files.list || []).filter(u => u.ParentID === user?.Uuid)

    const decoratedList = (userFiles || []).map(file => {
        const usagetype = ((file?.Usagetype || '').split(',') || []).map(usagetypeID => {
            const rawUsagetype = ((Usagetypes.list || []).find(u => u.Uuid === usagetypeID))
            return rawUsagetype?.Name
        })
        return { label: file?.Name, link: file?.Uuid, usagetype: usagetype }
    })

    const downloadFile = (fileID, fileName) => {
        setfileDownloading(true)
        axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
            responseType: 'blob'
        }).then((res) => {
            setfileDownloading(false)
            const fileType = res.headers['content-type']
            const blob = new Blob([res.data], {
                type: fileType
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            if (fileType.includes('pdf')) {
                window.open(url)
                a.href = null;
                window.URL.revokeObjectURL(url);
            }
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((err) => {
            setfileDownloading(false)
            fillnotification([{ type: 'Error', code: t('Pages.Users.Detail.File.Header'), description: err.message }])
            console.log(err.message)
        });
    }

    return (
        <div className='w-full px-4 mt-4'>
            <Dimmer active={fileDownloading}>
                <Loader />
            </Dimmer>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div className='w-full flex justify-start items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Users.Detail.File.Header')}</div>
                </div>
                <Table >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>{t('Pages.Users.Detail.Label.Name')}</Table.HeaderCell>
                            <Table.HeaderCell>{t('Pages.Users.Detail.Label.Usagetype')}</Table.HeaderCell>
                            <Table.HeaderCell>{t('Pages.Users.Detail.Label.Download')}</Table.HeaderCell>
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
                                            <div className='cursor-pointer' onClick={() => { downloadFile(file.link, file.label) }}>
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
        </div>
    )
}

import React, { useState, useCallback } from 'react'
import { Button, Dimmer, Dropdown, Form, Icon, Label, Loader, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import validator from '../../Utils/Validator'
import { useDropzone } from 'react-dropzone';
import axios from 'axios'

export const FileuploadPrepare = (files, notification, Literals, Profile) => {

    const DataCleaner = (data) => {
        if (data.Id !== undefined) {
            delete data.Id;
        }
        if (data.Createduser !== undefined) {
            delete data.Createduser;
        }
        if (data.Createtime !== undefined) {
            delete data.Createtime;
        }
        if (data.Updateduser !== undefined) {
            delete data.Updateduser;
        }
        if (data.Updatetime !== undefined) {
            delete data.Updatetime;
        }
        if (data.Deleteduser !== undefined) {
            delete data.Deleteduser;
        }
        if (data.Deletetime !== undefined) {
            delete data.Deletetime;
        }
        return data
    }

    const nameRequired = {
        en: "Name Required",
        tr: "İsim gerekli"
    }

    const uncleanfiles = [...files]

    let errors = []
    files.forEach(data => {
        if (!data.Name || data.Name === '') {
            errors.push({ type: 'Error', code: Literals.addcode[Profile?.Language], description: nameRequired[Profile?.Language] })
        }
    });
    if (errors.length > 0) {
        errors.forEach(error => {
            notification(error)
        })

        return null
    } else {

        const files = uncleanfiles.map(data => {
            return DataCleaner({ ...data, Usagetype: (data.Usagetype || []).join(',') })
        });

        const formData = new FormData();
        files.forEach((data, index) => {
            Object.keys(data).forEach(element => {
                formData.append(`list[${index}].${element}`, data[element])
            });
        })

        return formData
    }

}

export default function Fileupload(props) {

    const { fillnotification, Usagetypes, Profile, Literals, selectedFiles, setselectedFiles } = props
    const [fileDownloading, setfileDownloading] = useState(false)

    const AddNewFile = () => {
        setselectedFiles([...selectedFiles, {
            Name: '',
            ParentID: '',
            Filename: '',
            Filefolder: '',
            Filepath: '',
            Filetype: '',
            Usagetype: [],
            Canteditfile: false,
            File: {},
            key: Math.random(),
            WillDelete: false,
            fileChanged: true,
            Order: selectedFiles.length,
        }])
    }

    const removeFile = (key, order) => {
        const index = selectedFiles.findIndex(file => file.key === key)
        let selectedfiles = selectedFiles

        if (selectedfiles[index].Uuid) {
            selectedfiles[index].WillDelete = !(selectedfiles[index].WillDelete)
            setselectedFiles([...selectedfiles])
        } else {
            let files = selectedfiles.filter(file => file.key !== key)
            files.filter(file => file.Order > order).forEach(file => file.Order--)
            setselectedFiles([...files])
        }
    }

    const handleFilechange = (key) => {
        const index = selectedFiles.findIndex(file => file.key === key)
        let selectedfiles = selectedFiles
        if (selectedfiles[index].WillDelete) {
            return
        }
        if (selectedfiles[index].fileChanged) {
            return
        }
        selectedfiles[index].fileChanged = !(selectedfiles[index].fileChanged)
        selectedfiles[index].File = {}
        setselectedFiles([...selectedfiles])
    }

    const selectedFilesChangeHandler = (key, property, value) => {
        let selectedfiles = selectedFiles
        const index = selectedfiles.findIndex(file => file.key === key)
        if (property === 'Order') {
            selectedfiles.filter(file => file.Order === value)
                .forEach((file) => file.Order = selectedfiles[index].Order > value ? file.Order + 1 : file.Order - 1)
        }
        if (property === 'File') {
            if (value.target.files && value.target.files.length > 0) {
                selectedfiles[index][property] = value.target.files[0]
                selectedfiles[index].Filename = selectedfiles[index].File?.name
                selectedfiles[index].Name = selectedfiles[index].File?.name
                selectedfiles[index].fileChanged = false
            }
        } else {
            selectedfiles[index][property] = value
        }
        setselectedFiles([...selectedfiles])
    }

    const onDrop = useCallback((acceptedFiles) => {
        let files = []
        for (const file of acceptedFiles) {
            files.push({
                Name: file?.name,
                ParentID: '',
                Filename: file?.name,
                Filefolder: '',
                Filepath: '',
                Filetype: '',
                Usagetype: [],
                Canteditfile: false,
                File: file,
                key: Math.random(),
                WillDelete: false,
                fileChanged: false,
                Order: selectedFiles.length,
            })
        }
        setselectedFiles([...selectedFiles, ...files])
    }, []);

    const downloadFile = (fileID, fileName, Profile) => {
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
            fillnotification([{ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: err.message }])
            console.log(err.message)
        });
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, noClick: true });

    const usagetypes = (Usagetypes.list || []).filter(u => u.Isactive).map(type => {
        return { key: type.Uuid, text: type.Name, value: type.Uuid }
    })

    return <React.Fragment>
        <Dimmer active={fileDownloading}>
            <Loader />
        </Dimmer>
        <div {...getRootProps()} className={isDragActive ? `opacity-50 shadow-blue-700 shadow-lg transition-all ease-in-out duration-300` : null}>
            <input {...getInputProps()} />
            <Table celled className='list-table' key='product-create-type-conversion-table' >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={1}>{Literals.Columns.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                        <Table.HeaderCell width={3}>{Literals.Columns.TableColumnsFileName[Profile.Language]}</Table.HeaderCell>
                        <Table.HeaderCell width={3}>{Literals.Columns.TableColumnsUsagetype[Profile.Language]}</Table.HeaderCell>
                        <Table.HeaderCell width={9}>{Literals.Columns.TableColumnsFile[Profile.Language]}</Table.HeaderCell>
                        <Table.HeaderCell width={9}>{Literals.Columns.TableColumnsUploadStatus[Profile.Language]}</Table.HeaderCell>
                        <Table.HeaderCell width={1}>{Literals.Columns.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {selectedFiles.sort((a, b) => a.Order - b.Order).map((file, index) => {
                        return <Table.Row key={file.key}>
                            <Table.Cell>
                                <Button.Group basic size='small'>
                                    <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { selectedFilesChangeHandler(file.key, 'Order', file.Order - 1) }} />
                                    <Button type='button' disabled={index + 1 === selectedFiles.length} icon='angle down' onClick={() => { selectedFilesChangeHandler(file.key, 'Order', file.Order + 1) }} />
                                </Button.Group>
                            </Table.Cell>
                            <Table.Cell>
                                <Form.Input disabled={file.WillDelete} value={file.Name} placeholder={Literals.Columns.TableColumnsFileName[Profile.Language]} name="Name" fluid onChange={(e) => { selectedFilesChangeHandler(file.key, 'Name', e.target.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                                <Dropdown disabled={file.WillDelete} value={file.Usagetype} placeholder={Literals.Columns.TableColumnsUsagetype[Profile.Language]} name="Usagetype" clearable selection search fluid multiple options={usagetypes} onChange={(e, data) => { selectedFilesChangeHandler(file.key, 'Usagetype', data.value) }} />
                            </Table.Cell>
                            <Table.Cell>
                                {file.fileChanged
                                    ? <Form.Field>
                                        <Form.Input
                                            disabled={file.WillDelete}
                                            type='File'
                                            name="File"
                                            fluid
                                            onChange={(e) => { selectedFilesChangeHandler(file.key, 'File', e) }}
                                        />
                                    </Form.Field>
                                    : <div className='flex flex-row'>
                                        <Label color='blue'>{file.Filename}</Label>
                                        {validator.isUUID(file.Uuid) &&
                                            <div className='cursor-pointer' onClick={() => { downloadFile(file.Uuid, file.Name, Profile) }}>
                                                <Icon color='blue' name='download' />
                                            </div>
                                        }
                                    </div>}
                            </Table.Cell>
                            <Table.Cell>
                                {file.fileChanged
                                    ? <Icon disabled={!file.WillDelete} onClick={() => { handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='red' name='times circle' />
                                    : <Icon onClick={() => { handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='green' name='checkmark' />
                                }
                            </Table.Cell>
                            <Table.Cell className='table-last-section'>
                                <Icon className='type-conversion-remove-icon' link color={file.WillDelete ? 'green' : 'red'} name={`${file.WillDelete ? 'checkmark' : 'minus circle'}`}
                                    onClick={() => { removeFile(file.key, file.Order) }} />
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='7'>
                            <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { AddNewFile() }}>{Literals.Button.Addnewfile[Profile.Language]}</Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    </React.Fragment>
}
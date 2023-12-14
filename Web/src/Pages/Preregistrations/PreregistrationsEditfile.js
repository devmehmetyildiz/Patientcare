import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Dropdown, Form, Header, Icon, Label, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import config from '../../Config'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { useDropzone } from 'react-dropzone';
import { Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default function PreregistrationsEditfile(props) {

    const [patient, setPatient] = useState({})
    const [isDatafetched, setisDatafetched] = useState(false)
    const [selectedFiles, setselectedFiles] = useState([])

    useEffect(() => {
        const { GetPatient, match, history, GetFiles, GetPatientdefines, PatientID } = props
        const Id = match?.params?.PatientID || PatientID
        if (Id) {
            GetPatient(Id)
            GetFiles()
            GetPatientdefines()
        } else {
            history.push("/Preregistrations")
        }
    }, [])

    useEffect(() => {
        const { Files, Patients, Patientdefines } = props
        const { selected_record, isLoading } = Patients
        if (selected_record && !Patientdefines.isLoading && !Files.isLoading && Object.keys(selected_record).length > 0 &&
            selected_record.Id !== 0 && !isLoading && !isDatafetched) {
            var response = (Files.list || []).filter(u => u.ParentID === selected_record?.Uuid).map(element => {
                return {
                    ...element,
                    key: Math.random()
                }
            });
            setselectedFiles([...response] || [])
            setisDatafetched(true)
            setPatient(selected_record)
        }
    })

    const AddNewFile = () => {
        if (validator.isUUID(patient?.Uuid)) {
            setselectedFiles(oldfiles => [...oldfiles, {
                Name: '',
                ParentID: patient?.Uuid,
                Filename: '',
                Filefolder: '',
                Filepath: '',
                Filetype: '',
                Usagetype: '',
                Canteditfile: false,
                File: {},
                key: Math.random(),
                WillDelete: false,
                fileChanged: true,
                Order: selectedFiles.length,
            }])
        } else {
            const { fillFilenotification, Profile } = props
            fillFilenotification({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PatientIDdidntcatch[Profile.Language] })

        }
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

    const handleSubmit = (e) => {
        e.preventDefault()

        const { EditFiles, history, fillFilenotification, Profile } = props
        const uncleanfiles = [...selectedFiles]

        let errors = []
        selectedFiles.forEach(data => {
            if (!data.Name || data.Name === '') {
                errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Filenamerequired[Profile.Language] })
            }
        });
        if (errors.length > 0) {
            errors.forEach(error => {
                fillFilenotification(error)
            })
        } else {
            const files = uncleanfiles.map(data => {
                return DataCleaner(data)
            });

            const formData = new FormData();
            files.forEach((data, index) => {
                Object.keys(data).forEach(element => {
                    formData.append(`list[${index}].${element}`, data[element])
                });
            })

            EditFiles({ data: formData, history, url: "/Preregistrations" })
        }
    }

    const onDrop = useCallback((acceptedFiles) => {
        if (validator.isUUID(patient?.Uuid)) {
            let files = []
            for (const file of acceptedFiles) {
                files.push({
                    Name: file?.name,
                    ParentID: patient?.Uuid,
                    Filename: file?.name,
                    Filefolder: '',
                    Filepath: '',
                    Filetype: '',
                    Usagetype: '',
                    Canteditfile: false,
                    File: file,
                    key: Math.random(),
                    WillDelete: false,
                    fileChanged: false,
                    Order: selectedFiles.length,
                })
            }
            setselectedFiles(oldfiles => [...oldfiles, ...files])
        } else {
            const { fillFilenotification, Profile } = props
            fillFilenotification({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.PatientIDdidntcatch[Profile.Language] })

        }
    }, [patient]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, noClick: true });

    const { Files, Patients, Profile, history, Patientdefines, PatientID, match } = props
    const { isLoading, isDispatching } = Patients

    const patientDefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
    const patientPp = (Files.list || []).find(u => u.ParentID === patient?.Uuid && u.Usagetype === 'PP' && u.Isactive)
    const Id = match?.params?.PatientID || PatientID
    const usagetypes = [
        { key: Literals.Options.usageType0[Profile.Language], text: Literals.Options.usageType0[Profile.Language], value: Literals.Options.usageType0[Profile.Language] },
        { key: Literals.Options.usageType1[Profile.Language], text: Literals.Options.usageType1[Profile.Language], value: Literals.Options.usageType1[Profile.Language] },
        { key: Literals.Options.usageType2[Profile.Language], text: Literals.Options.usageType2[Profile.Language], value: "PP" },
        { key: Literals.Options.usageType3[Profile.Language], text: Literals.Options.usageType3[Profile.Language], value: Literals.Options.usageType3[Profile.Language] },
        { key: Literals.Options.usageType4[Profile.Language], text: Literals.Options.usageType4[Profile.Language], value: Literals.Options.usageType4[Profile.Language] },
        { key: Literals.Options.usageType5[Profile.Language], text: Literals.Options.usageType5[Profile.Language], value: Literals.Options.usageType5[Profile.Language] },
        { key: Literals.Options.usageType6[Profile.Language], text: Literals.Options.usageType6[Profile.Language], value: Literals.Options.usageType6[Profile.Language] },
        { key: Literals.Options.usageType7[Profile.Language], text: Literals.Options.usageType7[Profile.Language], value: Literals.Options.usageType7[Profile.Language] },
        { key: Literals.Options.usageType8[Profile.Language], text: Literals.Options.usageType8[Profile.Language], value: Literals.Options.usageType8[Profile.Language] },
    ]

    return (
        Files.isLoading || Files.isDispatching || isLoading || isDispatching ? <LoadingPage /> :
            <Pagewrapper>
                <Headerwrapper>
                    <Headerbredcrump>
                        <Link to={"/Preregistrations"}>
                            <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                        </Link>
                        <Breadcrumb.Divider icon='right chevron' />
                        <Breadcrumb.Section>{Literals.Page.Pageeditfileheader[Profile.Language]}</Breadcrumb.Section>
                    </Headerbredcrump>
                </Headerwrapper>
                <Pagedivider />
                <Contentwrapper>
                    <Header as='h2' icon textAlign='center'>
                        {patientPp
                            ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${patientPp?.Uuid}`} className="rounded-full !w-[100px] !h-[100px]" />
                            : <Icon name='users' circular />}
                        <Header.Content>{`${patientDefine?.Firstname} ${patientDefine?.Lastname} - ${patientDefine?.CountryID}`}</Header.Content>
                    </Header>
                    <Form>
                        <div {...getRootProps()} className={isDragActive ? `opacity-50 shadow-blue-700 shadow-lg transition-all ease-in-out duration-300` : null}>
                            <input {...getInputProps()} />
                            <Table celled  >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}>{Literals.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={3}>{Literals.Options.TableColumnsFileName[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={3}>{Literals.Options.TableColumnsUploadStatus[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={9}>{Literals.Options.TableColumnsFile[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={9}>{Literals.Options.TableColumnsUploadStatus[Profile.Language]}</Table.HeaderCell>
                                        <Table.HeaderCell width={1}>{Literals.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
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
                                                <Form.Input disabled={file.WillDelete} value={file.Name} placeholder={Literals.Options.TableColumnsFileName[Profile.Language]} name="Name" fluid onChange={(e) => { selectedFilesChangeHandler(file.key, 'Name', e.target.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Dropdown disabled={file.WillDelete} value={file.Usagetype} placeholder={Literals.Options.TableColumnsUsagetype[Profile.Language]} name="Usagetype" clearable selection search fluid options={usagetypes} onChange={(e, data) => { selectedFilesChangeHandler(file.key, 'Usagetype', data.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                {file.fileChanged
                                                    ? <Form.Input disabled={file.WillDelete} className='w-full flex justify-center items-center' type='File' name="File" fluid onChange={(e) => { selectedFilesChangeHandler(file.key, 'File', e) }} />
                                                    : <>
                                                        <Label color='blue'>{file.Filename}</Label>
                                                        {validator.isUUID(file.Uuid) &&
                                                            <a
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                href={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file.Uuid}`}
                                                            >
                                                                <Icon name='download' />
                                                            </a>}
                                                    </>}
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
                    </Form>
                </Contentwrapper>
                <Footerwrapper>
                    <Gobackbutton
                        history={history}
                        redirectUrl={Id ? `/Patients/${Id}` : `/Patients`}
                        buttonText={Literals.Button.Goback[Profile.Language]}
                    />
                    <Submitbutton
                        isLoading={isLoading}
                        buttonText={Literals.Button.Update[Profile.Language]}
                        submitFunction={handleSubmit}
                    />
                </Footerwrapper>
            </Pagewrapper >
    )
}
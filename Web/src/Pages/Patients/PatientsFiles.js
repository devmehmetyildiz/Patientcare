import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Label, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import config from '../../Config'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Literals from './Literals'

export default class PatientsFiles extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
            selectedFiles: [],
            showImage: true
        }
    }

    componentDidMount() {
        const { GetPatient, match, history, GetFiles, GetPatientdefines, PatientID } = this.props
        const Id = match.params.PatientID || PatientID
        if (Id) {
            GetPatient(Id)
            GetFiles()
            GetPatientdefines()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const { Files, Patients, Patientdefines } = this.props
        const { selected_record, isLoading } = Patients
        if (selected_record && !Files.isLoading && !Patientdefines.isLoading && Object.keys(selected_record).length > 0 &&
            selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
            var response = (Files.list || []).filter(u => u.ParentID === selected_record.Uuid).map(element => {
                return {
                    ...element,
                    key: Math.random()
                }
            });
            this.setState({
                selectedFiles: response, isDatafetched: true
            })
        }
    }

    render() {

        const { Files, Patients, Profile, history, Patientdefines, PatientID, match } = this.props
        const { selected_record, isLoading, isDispatching } = Patients

        const Id = match.params.PatientID || PatientID
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)

        const usagetypes = [
            { key: Literals.Options.usageType0[Profile.Language], text: Literals.Options.usageType0[Profile.Language], value: Literals.Options.usageType0[Profile.Language] },
            { key: Literals.Options.usageType1[Profile.Language], text: Literals.Options.usageType1[Profile.Language], value: Literals.Options.usageType1[Profile.Language] },
            { key: Literals.Options.usageType2[Profile.Language], text: Literals.Options.usageType2[Profile.Language], value: "PP" },
            { key: Literals.Options.usageType3[Profile.Language], text: Literals.Options.usageType3[Profile.Language], value: Literals.Options.usageType3[Profile.Language] },
            { key: Literals.Options.usageType4[Profile.Language], text: Literals.Options.usageType4[Profile.Language], value: Literals.Options.usageType4[Profile.Language] },
            { key: Literals.Options.usageType5[Profile.Language], text: Literals.Options.usageType5[Profile.Language], value: Literals.Options.usageType5[Profile.Language] },
            { key: Literals.Options.usageType6[Profile.Language], text: Literals.Options.usageType6[Profile.Language], value: Literals.Options.usageType6[Profile.Language] },
            { key: Literals.Options.usageType7[Profile.Language], text: Literals.Options.usageType7[Profile.Language], value: Literals.Options.usageType7[Profile.Language] },
        ]

        return (
            Files.isLoading || Files.isDispatching || isLoading || isDispatching ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patients"}>
                                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Link to={"/Patients/" + Id}>
                                <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditfileheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Header as='h2' icon textAlign='center'>
                            {(Files.list || []).filter(u => u.Usagetype === 'PP' && u.ParentID === selected_record.Uuid).length > 0 ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${(Files.list || []).filter(u => u.ParentID === selected_record.Uuid).find(u => u.Usagetype === 'PP')?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                                : <Icon name='users' circular />}
                            <Header.Content>{`${(Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)?.Firstname} 
                            ${(Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)?.Lastname} - ${(Patientdefines.list || []).find(u => u.Uuid === selected_record.PatientdefineID)?.CountryID}`}</Header.Content>
                        </Header>
                        <Form onSubmit={this.handleSubmit}>
                            <Table celled className='list-table' key='product-create-type-conversion-table' >
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
                                    {this.state.selectedFiles.sort((a, b) => a.Order - b.Order).map((file, index) => {
                                        return <Table.Row key={file.key}>
                                            <Table.Cell>
                                                <Button.Group basic size='small'>
                                                    <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedFilesChangeHandler(file.key, 'Order', file.Order - 1) }} />
                                                    <Button type='button' disabled={index + 1 === this.state.selectedFiles.length} icon='angle down' onClick={() => { this.selectedFilesChangeHandler(file.key, 'Order', file.Order + 1) }} />
                                                </Button.Group>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Form.Input disabled={file.WillDelete} value={file.Name} placeholder={Literals.Options.TableColumnsFileName[Profile.Language]} name="Name" fluid onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'Name', e.target.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Dropdown disabled={file.WillDelete} value={file.Usagetype} placeholder={Literals.Options.TableColumnsUsagetype[Profile.Language]} name="Usagetype" clearable selection fluid options={usagetypes} onChange={(e, data) => { this.selectedFilesChangeHandler(file.key, 'Usagetype', data.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                {file.fileChanged ? <Form.Input className='w-full flex justify-center items-center' disabled={file.WillDelete} type='File' name="File" fluid onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'File', e) }} />
                                                    : <><Label active={!file.WillDelete}>{file.Filename}</Label>{(file.Uuid && file.Uuid !== "") && <a target="_blank" rel="noopener noreferrer" href={`${config.services.File}${ROUTES.FILE}/Downloadfile/${file.Uuid}`} ><Icon name='download' /></a>}</>}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {!file.fileChanged ? <Icon onClick={() => { this.handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='green' name='checkmark' />
                                                    : <Icon active={!file.WillDelete} onClick={() => { this.handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='red' name='times circle' />}
                                            </Table.Cell>
                                            <Table.Cell className='table-last-section'>
                                                <Icon className='type-conversion-remove-icon' link color={file.WillDelete ? 'green' : 'red'} name={`${file.WillDelete ? 'checkmark' : 'minus circle'}`}
                                                    onClick={() => { this.removeFile(file.key, file.Order) }} />
                                            </Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                                <Table.Footer>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='7'>
                                            <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewFile() }}>{Literals.Button.Addnewfile[Profile.Language]}</Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                            <Footerwrapper>
                                {history && <Button onClick={(e) => {
                                    e.preventDefault()
                                    history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
                                }} floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>}
                                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
                            </Footerwrapper>
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { EditFiles, history, fillFilenotification, Profile, match, PatientID } = this.props
        const uncleanfiles = [...this.state.selectedFiles]

        let errors = []
        this.state.selectedFiles.forEach(data => {
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
                return this.DataCleaner(data)
            });

            const formData = new FormData();
            files.forEach((data, index) => {
                Object.keys(data).forEach(element => {
                    formData.append(`list[${index}].${element}`, data[element])
                });
            })
            const Id = match.params.PatientID || PatientID
            EditFiles({ data: formData, history, url: Id ? `/Patients/${Id}` : "/Patients" })
        }
    }

    AddNewFile = () => {
        const { Patients } = this.props
        this.setState({
            selectedFiles: [...this.state.selectedFiles,
            {
                Name: '',
                ParentID: Patients.selected_record.Uuid,
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
                Order: this.state.selectedFiles.length,
            }]
        })
    }


    removeFile = (key, order) => {
        const index = this.state.selectedFiles.findIndex(file => file.key === key)
        let selectedFiles = this.state.selectedFiles

        if (selectedFiles[index].Uuid) {
            selectedFiles[index].WillDelete = !(selectedFiles[index].WillDelete)
            this.setState({ selectedFiles: selectedFiles })
        } else {
            let files = selectedFiles.filter(file => file.key !== key)
            files.filter(file => file.Order > order).forEach(file => file.Order--)
            this.setState({ selectedFiles: files })
        }
    }

    handleFilechange = (key) => {
        const index = this.state.selectedFiles.findIndex(file => file.key === key)
        let selectedFiles = this.state.selectedFiles
        if (selectedFiles[index].WillDelete) {
            return
        }
        if (selectedFiles[index].fileChanged) {
            return
        }
        selectedFiles[index].fileChanged = !(selectedFiles[index].fileChanged)
        selectedFiles[index].File = {}
        this.setState({ selectedFiles: selectedFiles })
    }

    selectedFilesChangeHandler = (key, property, value) => {
        let selectedFiles = this.state.selectedFiles
        const index = selectedFiles.findIndex(file => file.key === key)
        if (property === 'Order') {
            selectedFiles.filter(file => file.Order === value)
                .forEach((file) => file.Order = selectedFiles[index].Order > value ? file.Order + 1 : file.Order - 1)
        }
        if (property === 'File') {
            if (value.target.files && value.target.files.length > 0) {
                selectedFiles[index][property] = value.target.files[0]
                selectedFiles[index].Filename = selectedFiles[index].File?.name
                selectedFiles[index].Name = selectedFiles[index].File?.name
                selectedFiles[index].fileChanged = false
            }
        } else {
            selectedFiles[index][property] = value
        }
        this.setState({ selectedFiles: selectedFiles })
    }

    DataCleaner = (data) => {
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

}

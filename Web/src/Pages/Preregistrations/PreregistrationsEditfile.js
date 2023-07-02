import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Label, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import config from '../../Config'

export default class PreregistrationsEditfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
            selectedFiles: [],
            showImage: true
        }
    }

    componentDidMount() {
        const { GetPatient, match, history } = this.props
        if (match.params.PatientID) {
            GetPatient(match.params.PatientID)
        } else {
            history.push("/Preregistrations")
        }
    }

    componentDidUpdate() {
        const { Files, removeFilenotification, Patients, removePatientnotification } = this.props
        const { selected_record, isLoading } = Patients
        if (selected_record && Object.keys(selected_record).length > 0 &&
            selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
            var response = (selected_record.Files || []).map(element => {
                return {
                    ...element,
                    key: Math.random()
                }
            });
            this.setState({
                selectedFiles: response, isDatafetched: true
            })
        }
        Notification(Files.notifications, removeFilenotification)
        Notification(Patients.notifications, removePatientnotification)
    }


    render() {

        const { Files, Patients } = this.props
        const { selected_record, isLoading, isDispatching } = Patients


        const usagetypes = [
            { key: 'Genel Depolama', value: 'Genel Depolama', text: 'Genel Depolama' },
            { key: 'Hasta Dosyaları', value: 'Hasta Dosyaları', text: 'Hasta Dosyaları' },
            { key: 'PP', value: 'PP', text: 'PP' },
            { key: 'ilk görüşme formu', value: 'ilk görüşme formu', text: 'ilk görüşme formu' },
            { key: 'engelli teslim etme-alma formu', value: 'engelli teslim etme-alma formu', text: 'engelli teslim etme-alma formu' },
            { key: 'ilk kabul formu', value: 'ilk kabul formu', text: 'ilk kabul formu' },
            { key: 'engelli mülkiyeti teslim alma formu', value: 'engelli mülkiyeti teslim alma formu', text: 'engelli mülkiyeti teslim alma formu' },
            { key: 'genel vücut kontrol formu', value: 'genel vücut kontrol formu', text: 'genel vücut kontrol formu' },
        ]

        return (
            Files.isLoading || Files.isDispatching || isLoading || isDispatching ? <LoadingPage /> :
                <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
                    <div className='w-full mx-auto align-middle'>
                        <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
                            <Breadcrumb size='big'>
                                <Link to={"/Preregistrations"}>
                                    <Breadcrumb.Section >Ön Kayıtlar</Breadcrumb.Section>
                                </Link>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>Dosyalar</Breadcrumb.Section>
                            </Breadcrumb>
                        </Header>
                    </div>
                    <Divider className='w-full  h-[1px]' />
                    <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
                        <Header as='h2' icon textAlign='center'>
                            {(selected_record.Files || []).filter(u => u.Usagetype === 'PP').length > 0 ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${(selected_record.Files || []).find(u => u.Usagetype === 'PP')?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                                : <Icon name='users' circular />}
                            <Header.Content>{`${selected_record.Patientdefine?.Firstname} ${selected_record.Patientdefine?.Lastname} - ${selected_record.Patientdefine?.CountryID}`}</Header.Content>
                        </Header>
                        <Form onSubmit={this.handleSubmit}>
                            <Table celled className='list-table' key='product-create-type-conversion-table' >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell width={1}>Sıra</Table.HeaderCell>
                                        <Table.HeaderCell width={3}>Dosya Adı</Table.HeaderCell>
                                        <Table.HeaderCell width={3}>Kullanım Türü</Table.HeaderCell>
                                        <Table.HeaderCell width={9}>Dosya</Table.HeaderCell>
                                        <Table.HeaderCell width={9}>Yüklenme Durumu</Table.HeaderCell>
                                        <Table.HeaderCell width={1}>Sil</Table.HeaderCell>
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
                                                <Form.Input disabled={file.WillDelete} value={file.Name} placeholder="Dosya Adı" name="Name" fluid onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'Name', e.target.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Dropdown disabled={file.WillDelete} value={file.Usagetype} placeholder='Ürün Tanımı' name="Usagetype" clearable selection fluid options={usagetypes} onChange={(e, data) => { this.selectedFilesChangeHandler(file.key, 'Usagetype', data.value) }} />
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
                                            <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewFile() }}>Dosya Ekle</Button>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Footer>
                            </Table>
                            <div className='flex flex-row w-full justify-between py-4  items-center'>
                                <Link to="/Preregistrations">
                                    <Button floated="left" color='grey'>Geri Dön</Button>
                                </Link>
                                <Button floated="right" type='submit' color='blue'>Kaydet</Button>
                            </div>
                        </Form>
                    </div>
                </div>
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { EditFiles, history, fillFilenotification } = this.props
        const uncleanfiles = [...this.state.selectedFiles]

        let errors = []
        this.state.selectedFiles.forEach(data => {
            if (!data.Name || data.Name === '') {
                errors.push({ type: 'Error', code: 'Files', description: 'İsim Boş Olamaz' })
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

            EditFiles({ data: formData, history, url: "/Preregistrations" })
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

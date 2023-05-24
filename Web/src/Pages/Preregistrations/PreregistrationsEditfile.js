import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Label, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

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
        const { Patients } = this.props
        const { selected_record, isLoading } = Patients
        if (selected_record && Object.keys(selected_record).length > 0 &&
            selected_record.id !== 0 && !isLoading && !this.state.isDatafetched) {
            var response = (selected_record.files || [])
            response.forEach(element => {
                element.key = Math.random()
            });
            this.setState({
                selectedFiles: response, isDatafetched: true
            })
        }
    }


    render() {

        const { Files, removeFilenotification, Patients, removePatientnotification } = this.props
        const { selected_record, isLoading, isDispatching } = Patients
        Notification(Files.notifications, removeFilenotification)
        Notification(Patients.notifications, removePatientnotification)

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
                            {(selected_record.files || []).filter(u => u.usagetype === 'PP').length > 0 ? <img alt='pp' src={`${process.env.REACT_APP_BACKEND_URL}/${ROUTES.FILE}/GetImage?guid=${selected_record.concurrencyStamp}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                                : <Icon name='users' circular />}
                            <Header.Content>{`${selected_record.patientdefine?.firstname} ${selected_record.patientdefine?.lastname} - ${selected_record.patientdefine?.countryID}`}</Header.Content>
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
                                    {this.state.selectedFiles.sort((a, b) => a.order - b.order).map((file, index) => {
                                        return <Table.Row key={file.key}>
                                            <Table.Cell>
                                                <Button.Group basic size='small'>
                                                    <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedFilesChangeHandler(file.key, 'order', file.order - 1) }} />
                                                    <Button type='button' disabled={index + 1 === this.state.selectedFiles.length} icon='angle down' onClick={() => { this.selectedFilesChangeHandler(file.key, 'order', file.order + 1) }} />
                                                </Button.Group>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Form.Input disabled={file.willDelete} value={file.name} placeholder="Dosya Adı" name="name" fluid onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'name', e.target.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Dropdown disabled={file.willDelete} value={file.usagetype} placeholder='Ürün Tanımı' name="usagetype" clearable selection fluid options={usagetypes} onChange={(e, data) => { this.selectedFilesChangeHandler(file.key, 'usagetype', data.value) }} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                {file.fileChanged ? <Form.Input className='w-full flex justify-center items-center' disabled={file.willDelete} type='file' name="file" fluid onChange={(e) => { this.selectedFilesChangeHandler(file.key, 'file', e) }} />
                                                    : <><Label active={!file.willDelete}>{file.filename}</Label>{(file.concurrencyStamp && file.concurrencyStamp !== "") && <a target="_blank" rel="noopener noreferrer" href={`${process.env.REACT_APP_BACKEND_URL}/File/Getfile?guid=${file.concurrencyStamp}`} ><Icon name='download' /></a>}</>}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {!file.fileChanged ? <Icon onClick={() => { this.handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='green' name='checkmark' />
                                                    : <Icon active={!file.willDelete} onClick={() => { this.handleFilechange(file.key, file.fileChanged) }} className='cursor-pointer' color='red' name='times circle' />}
                                            </Table.Cell>
                                            <Table.Cell className='table-last-section'>
                                                <Icon className='type-conversion-remove-icon' link color={file.willDelete ? 'green' : 'red'} name={`${file.willDelete ? 'checkmark' : 'minus circle'}`}
                                                    onClick={() => { this.removeFile(file.key, file.order) }} />
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
        const files = [...this.state.selectedFiles]

        let errors = []
        this.state.selectedFiles.forEach(data => {
            if (!data.name || data.name === '') {
                errors.push({ type: 'Error', code: 'Files', description: 'İsim Boş Olamaz' })
            }
        });
        if (errors.length > 0) {
            errors.forEach(error => {
                fillFilenotification(error)
            })
        } else {
            files.forEach(data => {
                if (!data.updateTime) {
                    delete data.updateTime
                }
                if (!data.deleteTime) {
                    delete data.deleteTime
                }
                delete data.fileChanged
                delete data.key
            });

            const formData = new FormData();
            files.forEach((data, index) => {
                Object.keys(data).forEach(element => {
                    formData.append(`list[${index}].${element}`, data[element])
                });
            })

            EditFiles(formData, history, "/Preregistrations")
        }
    }

    AddNewFile = () => {
        const { Patients } = this.props
        this.setState({
            selectedFiles: [...this.state.selectedFiles,
            {
                id: 0,
                name: '',
                parentid: Patients.selected_record.concurrencyStamp,
                filename: '',
                filefolder: '',
                filepath: '',
                filetype: '',
                usagetype: '',
                canteditfile: false,
                file: {},
                key: Math.random(),
                concurrencyStamp: '',
                createdUser: '',
                updatedUser: '',
                deleteUser: '',
                willDelete: false,
                fileChanged: true,
                isActive: true,
                order: this.state.selectedFiles.length,
            }]
        })
    }


    removeFile = (key, order) => {
        const index = this.state.selectedFiles.findIndex(file => file.key === key)
        let selectedFiles = this.state.selectedFiles

        if (selectedFiles[index].concurrencyStamp) {
            selectedFiles[index].willDelete = !(selectedFiles[index].willDelete)
            this.setState({ selectedFiles: selectedFiles })
        } else {
            let files = selectedFiles.filter(file => file.key !== key)
            files.filter(file => file.order > order).forEach(file => file.order--)
            this.setState({ selectedFiles: files })
        }
    }

    handleFilechange = (key) => {
        const index = this.state.selectedFiles.findIndex(file => file.key === key)
        let selectedFiles = this.state.selectedFiles
        if (selectedFiles[index].willDelete) {
            return
        }
        if (selectedFiles[index].fileChanged) {
            return
        }
        selectedFiles[index].fileChanged = !(selectedFiles[index].fileChanged)
        selectedFiles[index].file = {}
        this.setState({ selectedFiles: selectedFiles })
    }

    selectedFilesChangeHandler = (key, property, value) => {
        let selectedFiles = this.state.selectedFiles
        const index = selectedFiles.findIndex(file => file.key === key)
        if (property === 'order') {
            selectedFiles.filter(file => file.order === value)
                .forEach((file) => file.order = selectedFiles[index].order > value ? file.order + 1 : file.order - 1)
        }
        if (property === 'file') {
            if (value.target.files && value.target.files.length > 0) {
                selectedFiles[index][property] = value.target.files[0]
                selectedFiles[index].filename = selectedFiles[index].file?.name
                selectedFiles[index].name = selectedFiles[index].file?.name
                selectedFiles[index].fileChanged = false
            }
        } else {
            selectedFiles[index][property] = value
        }
        this.setState({ selectedFiles: selectedFiles })
    }

}

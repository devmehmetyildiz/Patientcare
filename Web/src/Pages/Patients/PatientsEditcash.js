import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Grid, Icon, Label, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Settings, MobileTable, NoDataScreen, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, DataTable } from '../../Components'
import { CASHYPES } from '../../Utils/Constants'
import PatientcashmovementsDelete from '../../Containers/Patientcashmovements/PatientcashmovementsDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class PatientsEditcash extends Component {

    PAGE_NAME = 'PatientsEditcash'

    constructor(props) {
        super(props)
        this.state = {
            isDatafetched: false,
        }
    }

    componentDidMount() {
        const {
            GetPatientcashmovements, GetPatientcashregisters, GetPatientdefines, GetPatients, match, history, PatientID
        } = this.props
        let Id = PatientID || match?.params?.PatientID
        if (validator.isUUID(Id)) {
            GetPatientcashmovements()
            GetPatientcashregisters()
            GetPatientdefines()
            GetPatients()
        } else {
            history.length > 1 ? history.goBack() : history.push(Id ? `/Patients/${Id}` : `/Patients`)
        }
    }

    componentDidUpdate() {
        const { Patients, Patientdefines, Patientcashmovements, Patientcashregisters } = this.props
        const { selected_record } = Patients

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Patientcashmovements.isLoading ||
            Patientcashregisters.isLoading

        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoadingstatus && !this.state.isDatafetched) {
            this.setState({ isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {

        const { Patients, Patientdefines, Patientcashmovements, Patientcashregisters, handleSelectedPatientcashmovement, handleDeletemodal,
            Profile, match, PatientID } = this.props

        const Id = match?.params?.PatientID || PatientID

        const isLoadingstatus =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Patientcashmovements.isLoading ||
            Patientcashregisters.isLoading

        const list = (Patientcashmovements.list || []).filter(u => u.PatientID === Id).map(item => {
            return {
                ...item,
                edit: <Link to={`/Patientcashmovements/${item.Uuid}/edit?PatientID=${item?.Uuid}`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedPatientcashmovement(item)
                    handleDeletemodal(true)
                }} />
            }
        })

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: Literals.Editcash.Id[Profile.Language], accessor: 'Id', },
            { Header: Literals.Editcash.Uuid[Profile.Language], accessor: 'Uuid' },
            { Header: Literals.Editcash.Patient[Profile.Language], accessor: 'PatientID', Cell: col => this.patientCellhandler(col) },
            { Header: Literals.Editcash.Register[Profile.Language], accessor: 'RegisterID', Cell: col => this.registerCellhandler(col) },
            { Header: Literals.Editcash.Movementtype[Profile.Language], accessor: 'Movementtype', Cell: col => this.typeCellhandler(col) },
            { Header: Literals.Editcash.Movementvalue[Profile.Language], accessor: 'Movementvalue', Cell: col => this.cashCellhandler(col) },
            { Header: Literals.Editcash.Createduser[Profile.Language], accessor: 'Createduser' },
            { Header: Literals.Editcash.Updateduser[Profile.Language], accessor: 'Updateduser' },
            { Header: Literals.Editcash.Createtime[Profile.Language], accessor: 'Createtime' },
            { Header: Literals.Editcash.Updatetime[Profile.Language], accessor: 'Updatetime' },
            { Header: Literals.Editcash.edit[Profile.Language], accessor: 'edit', disableProps: true },
            { Header: Literals.Editcash.delete[Profile.Language], accessor: 'delete', disableProps: true }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = 'PatientsEditcash'
        const initialConfig = GetInitialconfig(Profile, metaKey)

        const patient = (Patients.list || []).find(u => u.Uuid === Id)
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)

        let patientCash = 0.0;
        (Patientcashmovements.list || []).filter(u => u.PatientID === Id && u.Isactive).forEach(cash => {
            patientCash += cash.Movementtype * cash.Movementvalue
        })
        const [integerPart, decimalPart] = patientCash.toFixed(2).split('.')

        return (
            isLoadingstatus ? <LoadingPage /> :
                <Pagewrapper >
                    <Headerwrapper>
                        <Grid columns='2' >
                            <Grid.Column width={8}>
                                <Headerbredcrump>
                                    <Link to={"/Patients"}>
                                        <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                    </Link>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Link to={"/Patients/" + Id}>
                                        <Breadcrumb.Section>{`${patientdefine?.Firstname} ${patientdefine?.Lastname}`}</Breadcrumb.Section>
                                    </Link>
                                    <Breadcrumb.Divider icon='right chevron' />
                                    <Breadcrumb.Section>{Literals.Page.Pageeditcashheader[Profile.Language]}</Breadcrumb.Section>
                                </Headerbredcrump>
                            </Grid.Column>
                            <Settings
                                Profile={Profile}
                                Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                                Pagecreatelink={`/Patientcashmovements/Create?PatientID=${Id}`}
                                Columns={Columns}
                                list={list}
                                initialConfig={initialConfig}
                                metaKey={metaKey}
                                Showcreatebutton
                                Showcolumnchooser
                                Showexcelexport
                            />
                        </Grid>
                    </Headerwrapper>
                    <Pagedivider />
                    <div className='w-full flex justify-start items-center'>
                        <Label className='!bg-[#2355a0] !text-white' size='big'>Cüzdan : {integerPart}.{decimalPart}₺</Label>
                    </div>
                    <Pagedivider />
                    {list.length > 0 ?
                        <div className='w-full mx-auto '>
                            {Profile.Ismobile ?
                                <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                                <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                        </div> : <NoDataScreen message={Literals.Messages.Nomovementfind[Profile.Language]} />
                    }
                    <PatientcashmovementsDelete />
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { history, Profile, fillPatientnotification, Editpatientcase, match, PatientID } = this.props
        let Id = PatientID || match?.params?.PatientID
        const data = this.context.getForm(this.PAGE_NAME)
        let errors = []
        if (!validator.isUUID(data.CaseID)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.WarehouseReuired[Profile.Language] })
        }

        if (errors.length > 0) {
            errors.forEach(error => {
                fillPatientnotification(error)
            })
        } else {
            Editpatientcase({
                data: {
                    PatientID: Id,
                    CaseID: data.CaseID
                }, history, redirectID: Id
            })
        }
    }

    typeCellhandler = (col) => {
        return CASHYPES.find(u => u.value === col.value) ? CASHYPES.find(u => u.value === col.value).Name : col.value
    }

    cashCellhandler = (col) => {
        return col.value + ' TL'
    }

    patientCellhandler = (col) => {
        const { Patients, Patientdefines } = this.props
        if (Patientdefines.isLoading || Patients.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const patient = (Patients.list || []).find(u => u.Uuid === col.value)
            const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
            return `${patientdefine?.Firstname} ${patientdefine?.Lastname}-${patientdefine?.CountryID}`
        }
    }

    registerCellhandler = (col) => {
        const { Patientcashregisters } = this.props
        if (Patientcashregisters.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            const register = (Patientcashregisters.list || []).find(u => u.Uuid === col.value)
            return register?.Name || "tanımsız"
        }
    }
}
PatientsEditcash.contextType = FormContext

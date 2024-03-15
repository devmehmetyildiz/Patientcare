import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button, Label, Dropdown, Tab, Grid, Table, Icon } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, DataTable, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class Patientfollowup extends Component {


    componentDidMount() {
        const { GetPatients, GetPatientdefines, GetPatienttypes, GetCostumertypes, GetCases } = this.props
        GetPatients()
        GetPatientdefines()
        GetPatienttypes()
        GetCostumertypes()
        GetCases()
    }

    render() {
        const { Patients, Patientdefines, Profile, history, closeModal, Cases, Patienttypes, Costumertypes } = this.props

        const isLoading =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Cases.isLoading ||
            Costumertypes.isLoading ||
            Patienttypes.isLoading


        const disbandedCases = (Cases.list || []).filter(u => u.Patientstatus === 4 || u.Patientstatus === 6).map(u => u?.Uuid)

        const patients = (Patients.list || [])
            .filter(u => u.Isactive && !u.Iswaitingactivation)
            .filter(u => !((disbandedCases || []).includes(u?.CaseID)))

        const patienttypes = (Patienttypes.list || []).filter(u => u.Isactive)
        const costumertypes = (Costumertypes.list || []).filter(u => u.Isactive)

        const disbandedPatients = (Patients.list || [])
            .filter(u => u.Isactive && !u.Iswaitingactivation)
            .filter(u => (disbandedCases || []).includes(u?.CaseID))

        return (
            isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Patientfollowup"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                        </Headerbredcrump>
                        {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <Tab
                                className="w-full bg-white"
                                panes={[
                                    {
                                        menuItem: 'Hasta Türlerine Göre',
                                        pane: {
                                            key: 'patienttypes',
                                            content: <PatienttypeTab
                                                patients={patients}
                                                patienttypes={patienttypes}
                                                Patientdefines={Patientdefines}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: 'Müşteri Türlerine Göre',
                                        pane: {
                                            key: 'costumertypes',
                                            content: <CostumertypeTab
                                                patients={patients}
                                                costumertypes={costumertypes}
                                                Patientdefines={Patientdefines}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: 'Ayrılanlar / Vefat Edenler',
                                        pane: {
                                            key: 'disbanded',
                                            content: <DisbandedTab
                                                patients={disbandedPatients}
                                                Cases={Cases}
                                                Patientdefines={Patientdefines}
                                                Patienttypes={Patienttypes}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                ]}
                                renderActiveOnly={false}
                            />
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }
}
Patientfollowup.contextType = FormContext




function PatienttypeTab({ patients, patienttypes, Patientdefines, Profile }) {


    const colProps = {
        sortable: true,
        canGroupBy: true,
        canFilter: true
    }

    const nameCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }

    const countryIDCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return patientdefine?.CountryID
    }

    const dateCellhandler = (value) => {
        if (value) {
            return value.split('T')[0]
        }
        return null
    }

    const Columns = [
        { Header: Literals.Columns.Name[Profile.Language], accessor: row => nameCellhandler(row), Title: true },
        { Header: Literals.Columns.CountryID[Profile.Language], accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: Literals.Columns.Happensdate[Profile.Language], accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    return <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        {patienttypes.map(patienttype => {
            const decoratedpatients = patients.map(patient => {
                const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
                return patientdefine?.PatienttypeID === patienttype?.Uuid ? patient : null
            })
                .filter(u => u)
                .map(item => {
                    return {
                        ...item,
                        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                    }
                });

            return decoratedpatients.length > 0 ? <div className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{patienttype?.Name}</Label>

                <div className='w-full mx-auto '>
                    {Profile.Ismobile ?
                        <MobileTable Columns={Columns} Data={decoratedpatients} Profile={Profile} /> :
                        <DataTable Columns={Columns} Data={decoratedpatients} />}
                </div>
                <Pagedivider />
            </div > : null
        })}
    </div>
}

function CostumertypeTab({ patients, costumertypes, Profile, Patientdefines }) {

    const colProps = {
        sortable: true,
        canGroupBy: true,
        canFilter: true
    }

    const nameCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }

    const countryIDCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return patientdefine?.CountryID
    }

    const dateCellhandler = (value) => {
        if (value) {
            return value.split('T')[0]
        }
        return null
    }

    const Columns = [
        { Header: Literals.Columns.Name[Profile.Language], accessor: row => nameCellhandler(row), Title: true },
        { Header: Literals.Columns.CountryID[Profile.Language], accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: Literals.Columns.Happensdate[Profile.Language], accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    return <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        {costumertypes.map(costumertype => {
            const decoratedpatients = patients.map(patient => {
                const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
                return patientdefine?.CostumertypeID === costumertype?.Uuid ? patient : null
            })
                .filter(u => u)
                .map(item => {
                    return {
                        ...item,
                        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                    }
                });

            return decoratedpatients.length > 0 ? <div className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{costumertype?.Name}</Label>
                <div className='w-full mx-auto '>
                    {Profile.Ismobile ?
                        <MobileTable Columns={Columns} Data={decoratedpatients} Profile={Profile} /> :
                        <DataTable Columns={Columns} Data={decoratedpatients} />}
                </div>
                <Pagedivider />
            </div > : null
        })}
    </div>
}

function DisbandedTab({ patients, Cases, Patientdefines, Profile, Patienttypes }) {

    let cases = []

    cases = cases.concat((Cases.list || []).filter(u => u.Isactive && u.Patientstatus === 6))
    cases = cases.concat((Cases.list || []).filter(u => u.Isactive && u.Patientstatus === 4))

    const colProps = {
        sortable: true,
        canGroupBy: true,
        canFilter: true
    }

    const nameCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
    }

    const countryIDCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return patientdefine?.CountryID
    }
    const deathCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return patientdefine?.Dateofdeath
    }

    const getAge = (dateOfBirth, dateToCalculate) => {
        const dob = new Date(dateOfBirth).getTime();
        const dateToCompare = new Date(dateToCalculate).getTime();
        const age = (dateToCompare - dob) / (365 * 24 * 60 * 60 * 1000);
        return Math.floor(age);
    };


    const ageCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        const birthdate = new Date(patientdefine?.Dateofbirth)
        const deathdate = patientdefine?.Dateofdeath ? new Date(patientdefine?.Dateofdeath) : new Date()
        return getAge(birthdate, deathdate)
    }

    const agewithdeathCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        const birthdate = new Date(patientdefine?.Dateofbirth)
        const deathdate = new Date()
        return getAge(birthdate, deathdate)
    }

    const patienttypeCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        const patienttype = (Patienttypes.list || []).find(u => u.Uuid === patientdefine?.PatienttypeID)
        return patienttype?.Name
    }

    const dateCellhandler = (value) => {
        if (value) {
            return value.split('T')[0]
        }
        return null
    }

    const leaveColumns = [
        { Header: Literals.Columns.Name[Profile.Language], accessor: row => nameCellhandler(row), Title: true },
        { Header: Literals.Columns.CountryID[Profile.Language], accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: Literals.Columns.Happensdate[Profile.Language], accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: Literals.Columns.Leavedate[Profile.Language], accessor: row => dateCellhandler(row?.Leavedate), },
        { Header: Literals.Columns.Age[Profile.Language], accessor: row => ageCellhandler(row), },
        { Header: Literals.Columns.Patienttype[Profile.Language], accessor: row => patienttypeCellhandler(row), },
        { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const deathColumns = [
        { Header: Literals.Columns.Name[Profile.Language], accessor: row => nameCellhandler(row), Title: true },
        { Header: Literals.Columns.CountryID[Profile.Language], accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: Literals.Columns.Happensdate[Profile.Language], accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: Literals.Columns.Dateofdeath[Profile.Language], accessor: row => deathCellhandler(row), },
        { Header: Literals.Columns.Age[Profile.Language], accessor: row => agewithdeathCellhandler(row), },
        { Header: Literals.Columns.Patienttype[Profile.Language], accessor: row => patienttypeCellhandler(row), },
        { Header: Literals.Columns.actions[Profile.Language], accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    return (cases.map(casedata => {

        const decoratedpatients = patients.filter(patient => patient?.CaseID === casedata?.Uuid).map(item => {
            return {
                ...item,
                actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
            }
        })

        return <div className='flex flex-col w-full' >
            <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{casedata?.Name}</Label>
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={casedata?.Patientstatus === 6 ? leaveColumns : deathColumns} Data={decoratedpatients} Profile={Profile} /> :
                    <DataTable Columns={casedata?.Patientstatus === 6 ? leaveColumns : deathColumns} Data={decoratedpatients} />}
            </div>
            <Pagedivider />
        </div>
    }))
}

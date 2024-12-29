import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button, Label, Tab, Icon } from 'semantic-ui-react'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, DataTable, Headerbredcrump, Headerwrapper, LoadingPage, MobileTable, Pagedivider, Pagewrapper } from '../../Components'
import Formatdate from '../../Utils/Formatdate'
import { DEPENDENCY_OPTION_FULLY, DEPENDENCY_OPTION_NON, DEPENDENCY_OPTION_PARTIAL, GENDER_OPTION_MEN, GENDER_OPTION_WOMEN, MEDICALBOARDREPORT_OPTION_MENTAL, MEDICALBOARDREPORT_OPTION_PHYSICAL, MEDICALBOARDREPORT_OPTION_SPIRITUAL } from '../../Utils/Constants'

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
        const { Patients, Patientdefines, Profile, closeModal, Cases, Patienttypes, Costumertypes } = this.props

        const t = Profile?.i18n?.t

        const isLoading =
            Patients.isLoading ||
            Patientdefines.isLoading ||
            Cases.isLoading ||
            Costumertypes.isLoading ||
            Patienttypes.isLoading


        const disbandedCases = (Cases.list || []).filter(u => u.Isactive).filter(u => u.Patientstatus === 4 || u.Patientstatus === 6).map(u => u?.Uuid)

        const patients = (Patients.list || [])
            .filter(u => u.Isactive && !u.Iswaitingactivation)
            .filter(u => !((disbandedCases || []).includes(u?.CaseID)))

        const medicalboardreportoptions = [
            { key: 0, text: t('Option.Medicalboardreportoption.Spiritual'), value: MEDICALBOARDREPORT_OPTION_SPIRITUAL },
            { key: 1, text: t('Option.Medicalboardreportoption.Physical'), value: MEDICALBOARDREPORT_OPTION_PHYSICAL },
            { key: 2, text: t('Option.Medicalboardreportoption.Mental'), value: MEDICALBOARDREPORT_OPTION_MENTAL }
        ]

        const dependencyoptions = [
            { key: 0, text: t('Option.Dependencyoption.Fully'), value: DEPENDENCY_OPTION_FULLY },
            { key: 1, text: t('Option.Dependencyoption.Partial'), value: DEPENDENCY_OPTION_PARTIAL },
            { key: 2, text: t('Option.Dependencyoption.Non'), value: DEPENDENCY_OPTION_NON }
        ]

        const genderoptions = [
            { key: 0, text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
            { key: 1, text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN }
        ]

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
                                <Breadcrumb.Section >{t('Pages.Patientfollowup.Page.Header')}</Breadcrumb.Section>
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
                                        menuItem: t('Pages.Patientfollowup.Tab.Patienttype'),
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
                                        menuItem: t('Pages.Patientfollowup.Tab.Patientcase'),
                                        pane: {
                                            key: 'patientcases',
                                            content: <PatientcasesTab
                                                patients={patients}
                                                cases={Cases}
                                                Patientdefines={Patientdefines}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: t('Pages.Patientfollowup.Tab.Patientmedicalreport'),
                                        pane: {
                                            key: 'patientreporttype',
                                            content: <PatientmedicalboardreportTab
                                                patients={patients}
                                                medicalboardreportoptions={medicalboardreportoptions}
                                                Patientdefines={Patientdefines}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: t('Pages.Patientfollowup.Tab.Patientdependency'),
                                        pane: {
                                            key: 'patientreporttype',
                                            content: <PatientdependencyTab
                                                patients={patients}
                                                dependencyoptions={dependencyoptions}
                                                Patientdefines={Patientdefines}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: t('Pages.Patientfollowup.Tab.Patientgender'),
                                        pane: {
                                            key: 'patientgenders',
                                            content: <PatientgenderTab
                                                patients={patients}
                                                genderoptions={genderoptions}
                                                Patientdefines={Patientdefines}
                                                Profile={Profile}
                                            />
                                        }
                                    },
                                    {
                                        menuItem: t('Pages.Patientfollowup.Tab.Patientcostumertype'),
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
                                        menuItem: t('Pages.Patientfollowup.Tab.Patientdisand'),
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




function PatientcasesTab({ patients, cases, Patientdefines, Profile }) {

    const t = Profile?.i18n?.t

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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    return <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        {(cases.list || []).map(casedata => {
            const decoratedpatients = patients.map(patient => {
                return patient?.CaseID === casedata?.Uuid ? patient : null
            })
                .filter(u => u)
                .map(item => {
                    return {
                        ...item,
                        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                    }
                });

            return decoratedpatients.length > 0 ? <div className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{casedata?.Name}</Label>

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

function PatienttypeTab({ patients, patienttypes, Patientdefines, Profile }) {

    const t = Profile?.i18n?.t

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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
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

function PatientmedicalboardreportTab({ patients, medicalboardreportoptions, Patientdefines, Profile }) {

    const t = Profile?.i18n?.t

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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    return <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        {medicalboardreportoptions.map(report => {
            const decoratedpatients = patients.map(patient => {
                const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
                return patientdefine?.Medicalboardreport === report?.value ? patient : null
            })
                .filter(u => u)
                .map(item => {
                    return {
                        ...item,
                        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                    }
                });

            return decoratedpatients.length > 0 ? <div className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{report?.text}</Label>

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

function PatientdependencyTab({ patients, dependencyoptions, Patientdefines, Profile }) {

    const t = Profile?.i18n?.t

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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })


    return <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        {dependencyoptions.map(dependency => {
            const decoratedpatients = patients.map(patient => {
                const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
                return patientdefine?.Dependency === dependency?.value ? patient : null
            })
                .filter(u => u)
                .map(item => {
                    return {
                        ...item,
                        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                    }
                });

            return decoratedpatients.length > 0 ? <div className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{dependency?.text}</Label>

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

function PatientgenderTab({ patients, genderoptions, Patientdefines, Profile }) {

    const t = Profile?.i18n?.t

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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    return <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
        {genderoptions.map(gender => {
            const decoratedpatients = patients.map(patient => {
                const patientdefine = (Patientdefines.list || []).find(define => define?.Uuid === patient?.PatientdefineID)
                return patientdefine?.Gender === gender?.value ? patient : null
            })
                .filter(u => u)
                .map(item => {
                    return {
                        ...item,
                        actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                    }
                });

            return decoratedpatients.length > 0 ? <div className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{gender?.text}</Label>

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
    const t = Profile?.i18n?.t

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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
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
    const t = Profile?.i18n?.t

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
        return Formatdate(patientdefine?.Dateofdeath)
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
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.Leavedate'), accessor: row => dateCellhandler(row?.Leavedate), },
        { Header: t('Pages.Patientfollowup.Columns.Age'), accessor: row => ageCellhandler(row), },
        { Header: t('Pages.Patientfollowup.Columns.Patienttype'), accessor: row => patienttypeCellhandler(row), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const deathColumns = [
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Happensdate'), accessor: row => dateCellhandler(row?.Happensdate), },
        { Header: t('Pages.Patientfollowup.Columns.Dateofdeath'), accessor: row => deathCellhandler(row), },
        { Header: t('Pages.Patientfollowup.Columns.Age'), accessor: row => ageCellhandler(row), },
        { Header: t('Pages.Patientfollowup.Columns.Patienttype'), accessor: row => patienttypeCellhandler(row), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
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

import React from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { DataTable, MobileTable, Pagedivider } from '../../Components'
import { Link } from 'react-router-dom'
import Formatdate from '../../Utils/Formatdate'

export default function PatientfollowupDisbanded(props) {

    const { patients, Cases, Patientdefines, Profile, Patienttypes, bedCount } = props

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
            return Formatdate(value, true)
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

    return (cases.map((casedata, index) => {

        const decoratedpatients = patients.filter(patient => patient?.CaseID === casedata?.Uuid).map(item => {
            return {
                ...item,
                actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
            }
        })

        return <div key={index} className='flex flex-col w-full' >
            <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{casedata?.Name}</Label>
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={casedata?.Patientstatus === 6 ? leaveColumns : deathColumns} Data={decoratedpatients} Profile={Profile} /> :
                    <DataTable Columns={casedata?.Patientstatus === 6 ? leaveColumns : deathColumns} Data={decoratedpatients} additionalCountPrefix={bedCount} />}
            </div>
            <Pagedivider />
        </div>
    }))
}
import React from 'react'
import { Icon, Label } from 'semantic-ui-react'
import { DataTable, MobileTable, Pagedivider } from '../../Components'
import { Link } from 'react-router-dom'

export default function PatientmedicalboardreportTab(props) {

    const { patients, medicalboardreportoptions, Patientdefines, Profile, bedCount } = props

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
        {medicalboardreportoptions.map((report, index) => {
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

            return decoratedpatients.length > 0 ? <div key={index} className='w-full gap-2'>
                <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{report?.text}</Label>

                <div className='w-full mx-auto '>
                    {Profile.Ismobile ?
                        <MobileTable Columns={Columns} Data={decoratedpatients} Profile={Profile} /> :
                        <DataTable Columns={Columns} Data={decoratedpatients} additionalCountPrefix={bedCount} />}
                </div>
                <Pagedivider />
            </div > : null
        })}
    </div>
}
import React, { useEffect, useState } from 'react'
import { Dropdown, Icon, Label } from 'semantic-ui-react'
import { DataTable, MobileTable, NoDataScreen, Pagedivider } from '../../Components'
import { Link } from 'react-router-dom'
import { COL_PROPS } from '../../Utils/Constants'
import Formatdate from '../../Utils/Formatdate'
import { useLocation, useHistory } from 'react-router-dom'

export default function PatientfollowupPatientages(props) {

    const { patients, Patientdefines, Profile, bedCount } = props

    const [selectedType, setSelectedType] = useState('All')
    const location = useLocation()
    const history = useHistory()
    const params = new URLSearchParams(location?.search)

    const t = Profile?.i18n?.t

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

    const birthDateCellhandler = (row) => {
        const patient = row
        const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
        return Formatdate(patientdefine?.Dateofbirth)
    }

    const AgeList = [
        { value: "age1", name: "0-6", min: 0, max: 6 },
        { value: "age2", name: "7-12", min: 7, max: 12 },
        { value: "age3", name: "13-18", min: 13, max: 18 },
        { value: "age4", name: "19-64", min: 19, max: 64 },
        { value: "age5", name: "65+", min: 65, max: Infinity },
    ]

    const typeOptions = [
        { key: 'All', text: t('Pages.Patientfollowup.Columns.AllRecord'), value: 'All' },
        ...AgeList.map(u => ({ key: u?.value, text: u?.name, value: u.value }))
    ]

    const Columns = [
        { Header: t('Common.Column.Id'), accessor: "Id", Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Name'), accessor: row => nameCellhandler(row), Title: true },
        { Header: t('Pages.Patientfollowup.Columns.Age'), accessor: 'age', Title: true },
        { Header: t('Pages.Patientfollowup.Columns.CountryID'), accessor: row => countryIDCellhandler(row), Subtitle: true },
        { Header: t('Pages.Patientfollowup.Columns.Dateofbirth'), accessor: row => birthDateCellhandler(row), },
        { Header: t('Pages.Patientfollowup.Columns.actions'), accessor: 'actions', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...COL_PROPS } })




    const panes = (AgeList || []).filter(u => selectedType === 'All' ? true : u.value === selectedType).map((ageData, index) => {
        const decoratedpatients = patients
            .map((patient) => {
                const patientdefine = (Patientdefines.list || []).find((u) => u.Uuid === patient?.PatientdefineID);

                if (!patientdefine || !patientdefine.Dateofbirth) return null;

                const birthDate = new Date(patientdefine.Dateofbirth);
                const currentDate = new Date();
                let age = currentDate.getFullYear() - birthDate.getFullYear();
                const monthDiff = currentDate.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                    age--;
                }

                if (age >= ageData.min && age <= ageData.max) {
                    return {
                        ...patient,
                        age,
                    };
                }
                return null;
            })
            .filter(u => u)
            .map(item => {
                return {
                    ...item,
                    actions: <Link to={`/Patients/${item.Uuid}`} ><Icon size='large' color='blue' className='row-edit' name='magnify' /> </Link>
                }
            });

        return decoratedpatients.length > 0 ? <div key={index} className='w-full gap-2'>
            <Label as={'a'} size='big' className='!bg-[#2355a0] !text-white ' >{ageData.name}</Label>
            <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                    <MobileTable Columns={Columns} Data={decoratedpatients} Profile={Profile} /> :
                    <DataTable Columns={Columns} Data={decoratedpatients} additionalCountPrefix={bedCount} />}
            </div>
            <Pagedivider />
        </div > : null
    }).filter(u => u)

    useEffect(() => {
        if (params.has('type')) {
            if (params.get('type') && typeOptions.find(u => u.value === params.get('type'))) {
                setSelectedType(params.get('type'))
            } else {
                setSelectedType('All')
            }
        }
    }, [params])


    return <div className='p-4 w-full flex flex-col justify-center items-center'>
        <div className='w-full flex justify-end items-center'>
            <Dropdown
                placeholder={t('Pages.Patientfollowup.Columns.SelectRecord')}
                search
                selection
                value={selectedType}
                onChange={(e, data) => {
                    params.has('type')
                        ? params.set('type', data.value)
                        : params.append('type', data.value)
                    history.push(`${location.pathname}?${params.toString()}`)
                }}
                options={typeOptions} />
        </div>
        <Pagedivider />
        <div className={`grid grid-cols-1 ${(panes || []).length > 1 ? ' md:grid-cols-2 ' : ''} w-full gap-4`}>
            {panes.length <= 0
                ? <NoDataScreen autosize message={t('Common.NoDataFound')} />
                : panes}
        </div>
    </div>
}
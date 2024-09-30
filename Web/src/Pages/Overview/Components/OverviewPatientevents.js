import React from 'react'
import { Contentwrapper, Headerwrapper } from '../../../Components'
import { Breadcrumb, Dimmer, DimmerDimmable, Feed, Icon, Loader, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Formatfulldate } from '../../../Utils/Formatdate'

export default function OverviewPatientevents(props) {
    const { Patients, Patientdefines, Patienteventdefines, Profile } = props

    const t = Profile?.i18n?.t


    const monthstart = new Date()
    monthstart.setDate(1)
    monthstart.setHours(0)
    monthstart.setMinutes(0)
    monthstart.setSeconds(0)

    const monthend = new Date()
    monthend.setHours(0)
    monthend.setMinutes(0)
    monthend.setSeconds(0)


    const checkDateIfItsBigger = (_startdate, _enddate) => {
        const startdate = new Date(_startdate)
        const enddate = new Date(_enddate)

        if (startdate.getTime() > enddate.getTime()) {
            return true
        } else {
            return false
        }
    }


    const isLoading = Patients.isLoading || Patientdefines.isLoading || Patienteventdefines.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const patientevents = (Patienteventdefines.list || []).filter(u => u.Isactive).map(u => u.Uuid)

    const currentPatients = patients
        .filter(u => !(checkDateIfItsBigger(u.Leavedate, monthstart) && !checkDateIfItsBigger(u.Leavedate, monthend)))
        .filter(u => !(checkDateIfItsBigger(u.Deathdate, monthstart) && !checkDateIfItsBigger(u.Deathdate, monthend)))

    let feedList = []

    const patienteventlist = currentPatients.flatMap(patient => {
        return patient.Events
    })

    patientevents.forEach((eventdefine, index) => {

        const event = (Patienteventdefines.list || []).find(u => u.Uuid === eventdefine)
        const patients = patienteventlist.filter(u => u.EventID === eventdefine)

        if (patients.length > 0) {
            const name = `${patients.length}${t('Pages.Overview.Patients.Label.Eventprefix')}${event?.Eventname || t('Common.NoDataFound')}${t('Pages.Overview.Patients.Label.Eventprefix1')}`

            const content = <div className='flex flex-col justify-start items-start gap-2'>
                {patients.map((event, index) => {
                    const patient = (Patients.list || []).find(u => u.Uuid === event?.PatientID)
                    const patientdefine = (Patientdefines.list || []).find(u => u.Uuid === patient?.PatientdefineID)
                    const name = `${patientdefine?.Firstname} ${patientdefine?.Lastname}`
                    return <div className='flex flex-row flex-nowrap overflow-hidden whitespace-nowrap' key={index}>
                        <Link to={`Patients/${patient?.Uuid}`}>
                            {name}
                        </Link>
                        -
                        {Formatfulldate(event?.Occureddate, true)}
                    </div>
                })}
            </div>

            feedList.push({
                content: <Popup
                    on={'click'}
                    hideOnScroll
                    content={content}
                    trigger={<Feed.Event key={index} className='cursor-pointer' >
                        <Feed.Label>
                            <Icon name='arrow alternate circle right ' color='grey' />
                        </Feed.Label>
                        <Feed.Content>
                            {name}
                        </Feed.Content>
                    </Feed.Event>}
                />
            })
        }
    });

    return <Contentwrapper >
        <DimmerDimmable>
            <Dimmer active={isLoading} inverted>
                <Loader inline={'centered'} inverted />
            </Dimmer>
            <Headerwrapper>
                <Breadcrumb size='big'>
                    <Breadcrumb.Section>{t('Pages.Overview.Tab.Patients')}</Breadcrumb.Section>
                </Breadcrumb>
            </Headerwrapper>
            <Feed>
                {feedList.map(u => u.content)}
            </Feed>
        </DimmerDimmable >
    </Contentwrapper>
}

import React from 'react'
import { Contentwrapper, Headerwrapper } from '../../../Components'
import { Breadcrumb, Dimmer, DimmerDimmable, Feed, Icon, Loader } from 'semantic-ui-react'

export default function OverviewPatients(props) {
    const { Patients, Patientdefines, Cases, Profile } = props

    const t = Profile?.i18n?.t

    const checkDateIfItsBigger = (_startdate, _enddate) => {
        const startdate = new Date(_startdate)
        const enddate = new Date(_enddate)

        if (startdate.getTime() > enddate.getTime()) {
            return true
        } else {
            return false
        }
    }

    const current = new Date()
    current.setDate(1)
    current.setHours(0)
    current.setMinutes(0)
    current.setSeconds(0)

    const isLoading = Patients.isLoading || Patientdefines.isLoading || Cases.isLoading

    const patients = (Patients.list || []).filter(u => u.Isactive && u.Ischecked && u.Isapproved && !u.Ispreregistration)

    const patientcases = [...new Set([...(patients || []).map(u => u.CaseID)])]

    const livepatients = patients.filter(u => u.Isalive && !u.Isleft)

    const deadpatients = patients.filter(u => !u.Isalive && checkDateIfItsBigger(u.Deathdate, current))

    const leftpatients = patients.filter(u => u.Isleft && checkDateIfItsBigger(u.Leavedate, current))

    const counts = {
        live: livepatients.length,
        dead: deadpatients.length,
        left: leftpatients.length,
    }

    const patientcard = [
        { text: t('Pages.Overview.Patients.Label.Live'), value: counts.live, icon: <Icon name='user' color='blue' /> },
        { text: t('Pages.Overview.Patients.Label.Dead'), value: counts.dead, icon: <Icon name='user close' color='red' /> },
        { text: t('Pages.Overview.Patients.Label.Left'), value: counts.left, icon: <Icon name='sign out' color='grey' /> },
    ]


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
                {patientcard.map((card, index) => {
                    return <Feed.Event key={index}>
                        <Feed.Label>
                            {card.icon}
                        </Feed.Label>
                        <Feed.Content>
                            {card.text}<a className='ml-2 font-extrabold'>{card.value}</a>
                        </Feed.Content>
                    </Feed.Event>
                })}
                {patientcases.map((patientcase, index) => {

                    const count = patients.filter(u => u.CaseID === patientcase)
                    const casedata = (Cases.list || []).find(u => u.Uuid === patientcase)

                    return <Feed.Event key={index}>
                        <Feed.Label>
                            <Icon name='user' color='blue' />
                        </Feed.Label>
                        <Feed.Content>
                            {`${t('Pages.Overview.Patients.Label.Caseprefix')}  ${casedata?.Name || t('Common.NoDataFound')}`}<a className='ml-2 font-extrabold'>{count.length}</a>
                        </Feed.Content>
                    </Feed.Event>
                })}
            </Feed>
        </DimmerDimmable >
    </Contentwrapper>
}

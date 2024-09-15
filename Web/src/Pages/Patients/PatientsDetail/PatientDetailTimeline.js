import React, { useEffect, useState } from 'react';
import Timeline, { DateHeader, TimelineHeaders, TimelineMarkers, TodayMarker } from 'react-calendar-timeline';
import {
    PATIENTS_MOVEMENTTYPES_APPROVE, PATIENTS_MOVEMENTTYPES_CANCELAPPROVE, PATIENTS_MOVEMENTTYPES_CANCELCHECK,
    PATIENTS_MOVEMENTTYPES_CASECHANGE, PATIENTS_MOVEMENTTYPES_CHECK, PATIENTS_MOVEMENTTYPES_COMPLETE,
    PATIENTS_MOVEMENTTYPES_CREATE, PATIENTS_MOVEMENTTYPES_DEAD, PATIENTS_MOVEMENTTYPES_LEFT,
    PATIENTS_MOVEMENTTYPES_PLACECHANGE, PATIENTS_MOVEMENTTYPES_UPDATE
} from '../../../Utils/Constants';
import { Card, Container, Icon, Loader, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/tr';
import 'react-calendar-timeline/lib/Timeline.css';
import '../../../Assets/css/react-calender-timeline.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

export default function PatientDetailTimeline(props) {

    moment.locale('tr');

    const [visible, setVisible] = useState(false)

    const defaultTimeStart = moment(new Date().setHours(-0))
    const defaultTimeEnd = moment(new Date().setHours(24))

    const { patient, Cases, Users, Departments, Profile } = props
    const t = Profile?.i18n?.t

    const Patientcases = (Cases.list || []).filter(u => u.Isactive).map(cases => {
        let departments = (cases.Departmentuuids || [])
            .map(u => {
                const department = (Departments.list || []).find(department => department.Uuid === u.DepartmentID)
                if (department) {
                    return department
                } else {
                    return null
                }
            })
            .filter(u => u !== null);
        let ishavepatients = false;
        (departments || []).forEach(department => {
            if (department?.Ishavepatients) {
                ishavepatients = true
            }
        });

        if (ishavepatients) {
            return cases
        } else {
            return null
        }
    }).filter(u => u !== null);

    const groups = Patientcases.map(patientcase => {
        return { id: patientcase?.Uuid, title: patientcase?.Name || t('Common.NoDataFound') }
    })

    const Movementtypes = [
        { name: t('Common.Patient.Movementtypes.Create'), value: PATIENTS_MOVEMENTTYPES_CREATE },
        { name: t('Common.Patient.Movementtypes.Update'), value: PATIENTS_MOVEMENTTYPES_UPDATE },
        { name: t('Common.Patient.Movementtypes.Check'), value: PATIENTS_MOVEMENTTYPES_CHECK },
        { name: t('Common.Patient.Movementtypes.Approve'), value: PATIENTS_MOVEMENTTYPES_APPROVE },
        { name: t('Common.Patient.Movementtypes.Complete'), value: PATIENTS_MOVEMENTTYPES_COMPLETE },
        { name: t('Common.Patient.Movementtypes.Cancelcheck'), value: PATIENTS_MOVEMENTTYPES_CANCELCHECK },
        { name: t('Common.Patient.Movementtypes.Cancelapprove'), value: PATIENTS_MOVEMENTTYPES_CANCELAPPROVE },
        { name: t('Common.Patient.Movementtypes.Left'), value: PATIENTS_MOVEMENTTYPES_LEFT },
        { name: t('Common.Patient.Movementtypes.Dead'), value: PATIENTS_MOVEMENTTYPES_DEAD },
        { name: t('Common.Patient.Movementtypes.Casechange'), value: PATIENTS_MOVEMENTTYPES_CASECHANGE },
        { name: t('Common.Patient.Movementtypes.Placechange'), value: PATIENTS_MOVEMENTTYPES_PLACECHANGE },
    ]

    const items = (patient?.Movements || []).map((movement, index) => {

        const nextIndex = index + 1;
        const calculatedEndtime = (patient?.Movements || []).length - 1 < nextIndex
            ? new Date()
            : new Date((patient.Movements[nextIndex])?.Occureddate)

        const casedata = (Cases.list || []).find(u => u.Uuid === movement?.CaseID)

        return {
            id: movement?.Uuid,
            group: movement?.CaseID,
            title: casedata?.Name || t('Common.NoDataFound'),
            start_time: moment(new Date(movement?.Occureddate)),
            end_time: moment(calculatedEndtime)
        }
    })

    useEffect(() => {
        setTimeout(() => {
            setVisible(true)
        }, [3000])
    }, [visible])

    useEffect(() => {
        if (!Cases.isLoading) {
            setVisible(false)
        }
    }, [Cases.isLoading])

    return (
        <div className='w-full px-4 mt-4 z-10'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div className='w-full flex justify-start items-start'>
                    <div className='font-bold text-xl font-poppins'>{t('Pages.Patients.PatientsDetail.PatientDetailTimeline.Header')}</div>
                </div>
                {visible
                    ? <div className='flex justify-start items-start w-full '>
                        <Timeline
                            className='w-[80vmax] md:w-[35vmax] lg:w-[60vw] '
                            groups={groups}
                            items={items}
                            itemsSorted
                            itemTouchSendsClick={false}
                            stackItems
                            itemHeightRatio={0.75}
                            showCursorLine
                            canMove={false}
                            canResize={false}
                            defaultTimeStart={defaultTimeStart}
                            defaultTimeEnd={defaultTimeEnd}
                            locale='tr'
                            itemRenderer={({ item, itemContext, getItemProps }) => {
                                const movement = (patient?.Movements || []).find(u => u.Uuid === item.id)
                                const type = Movementtypes.find(u => u.value === movement?.Type)?.name || t('Common.NoDataFound')
                                const user = (Users.list || []).find(u => u.Uuid === movement?.UserID)
                                const casedata = (Cases.list || []).find(u => u.Uuid === movement?.CaseID)
                                const username = `${user?.Name} ${user?.Surname} (${user?.Username})`
                                return (
                                    <Popup
                                        on={'hover'}
                                        trigger={<div {...getItemProps({
                                            style: casedata?.Iscalculateprice ? null : {
                                                backgroundColor: 'red'
                                            }
                                        })}
                                        className='text-ellipsis whitespace-nowrap overflow-hidden'
                                        >
                                            {itemContext.title}
                                        </div>}
                                        content={<Card>
                                            <Card.Content>
                                                <Card.Header>{`${t('Pages.Patients.PatientsDetail.PatientDetailTimeline.Label.Type')} : ${type}`}</Card.Header>
                                                <Card.Meta>
                                                    <span className='date'>{`${t('Pages.Patients.PatientsDetail.PatientDetailTimeline.Label.Occureddate')} : ${moment(new Date(movement?.Occureddate)).format('DD.MM.YYYY')}`}</span>
                                                </Card.Meta>
                                                <Card.Description>
                                                    {`${t('Pages.Patients.PatientsDetail.PatientDetailTimeline.Label.Case')} : ${casedata?.Name || t('Common.NoDataFound')}`}
                                                </Card.Description>
                                            </Card.Content>
                                            <Card.Content extra>
                                                <a>
                                                    <Icon name='user' />
                                                    <Link to={`Users/${user?.Uuid}`}>{user ? username : t('Common.NoDataFound')}</Link>
                                                </a>
                                            </Card.Content>
                                        </Card>}
                                    />
                                );
                            }}
                            groupRenderer={({ group }) => {
                                return (
                                    <Popup
                                        on={'hover'}
                                        content={group.title}
                                        trigger={<div className={`cursor-pointer custom-group overflow-hidden whitespace-nowrap text-ellipsis`}>
                                            <span className="title overflow-hidden whitespace-nowrap text-ellipsis">{group.title}</span>
                                        </div>}
                                    />

                                )
                            }}
                        >
                            <TimelineMarkers>
                                <TodayMarker>
                                    {({ styles }) => (
                                        <div style={{ ...styles, backgroundColor: 'red' }} />
                                    )}
                                </TodayMarker>
                            </TimelineMarkers>
                            <TimelineHeaders className="sticky">
                                <DateHeader unit="primaryHeader" />
                                <DateHeader />
                            </TimelineHeaders>
                        </Timeline>
                    </div>
                    : <Loader size='large' active inline='centered' >Yükleniyor...</Loader>
                }
            </div>
        </div >
    );
}

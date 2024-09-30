import React, { useEffect, useState } from 'react';
import Timeline, { DateHeader, TimelineHeaders, TimelineMarkers, TodayMarker } from 'react-calendar-timeline';
import {
    PERSONEL_MOVEMENTTYPES_CASECHANGE,
    PERSONEL_MOVEMENTTYPES_WORKEND,
    PERSONEL_MOVEMENTTYPES_WORKSTART
} from '../../../Utils/Constants';
import { Card, Icon, Loader, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/tr';
import 'react-calendar-timeline/lib/Timeline.css';
import '../../../Assets/css/react-calender-timeline.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Formatfulldate } from '../../../Utils/Formatdate';

export default function UserDetailTimeline(props) {

    moment.locale('tr');

    const [visible, setVisible] = useState(false)

    const defaultTimeStart = moment(new Date().setHours(-0))
    const defaultTimeEnd = moment(new Date().setHours(24))

    const { user, Cases, Users, Departments, Profile } = props
    const t = Profile?.i18n?.t

    const Personelcases = (Cases.list || []).filter(u => u.Isactive).map(cases => {
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
        let Ishavepersonels = false;
        (departments || []).forEach(department => {
            if (department?.Ishavepersonels) {
                Ishavepersonels = true
            }
        });

        if (Ishavepersonels) {
            return cases
        } else {
            return null
        }
    }).filter(u => u !== null);

    const groups = Personelcases.map(personelcase => {
        return { id: personelcase?.Uuid, title: personelcase?.Name || t('Common.NoDataFound') }
    })

    const Movementtypes = [
        { name: t('Common.Personels.Movementtypes.Workstart'), value: PERSONEL_MOVEMENTTYPES_WORKSTART },
        { name: t('Common.Personels.Movementtypes.Workend'), value: PERSONEL_MOVEMENTTYPES_WORKEND },
        { name: t('Common.Personels.Movementtypes.Casechange'), value: PERSONEL_MOVEMENTTYPES_CASECHANGE },
    ]

    const items = (user?.Movements || []).map((movement, index) => {

        const nextIndex = index + 1;
        const calculatedEndtime = (user?.Movements || []).length - 1 < nextIndex
            ? new Date()
            : new Date((user.Movements[nextIndex])?.Occureddate)

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
                    <div className='font-bold text-xl font-poppins'>{t('Pages.Users.Detail.Timeline.Header')}</div>
                </div>
                {visible
                    ? <div className='flex justify-start items-start w-full '>
                        <Timeline
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
                            minZoom={24 * 60 * 60 * 1000}
                            maxZoom={365 * 24 * 60 * 60 * 1000}
                            zoomSpeed={0.05}
                            itemRenderer={({ item, itemContext, getItemProps }) => {
                                const movement = (user?.Movements || []).find(u => u.Uuid === item.id)
                                const type = Movementtypes.find(u => u.value === movement?.Type)?.name || t('Common.NoDataFound')
                                const saveduser = (Users.list || []).find(u => u.Uuid === movement?.UserID)
                                const casedata = (Cases.list || []).find(u => u.Uuid === movement?.CaseID)
                                const username = `${user?.Name} ${user?.Surname} (${user?.Username})`
                                return (
                                    <Popup
                                        on={'hover'}
                                        trigger={<div {...getItemProps()}
                                            className='text-ellipsis whitespace-nowrap overflow-hidden'
                                        >
                                            {itemContext.title}
                                        </div>}
                                        content={<Card>
                                            <Card.Content>
                                                <Card.Header>{`${t('Pages.Users.Detail.Timeline.Label.Type')} : ${type}`}</Card.Header>
                                                <Card.Meta>
                                                    <span className='date'>{`${t('Pages.Users.Detail.Timeline.Label.Occureddate')} : ${Formatfulldate(movement?.Occureddate, true)}`}</span>
                                                </Card.Meta>
                                                <Card.Description>
                                                    {`${t('Pages.Users.Detail.Timeline.Label.Case')} : ${casedata?.Name || t('Common.NoDataFound')}`}
                                                </Card.Description>
                                            </Card.Content>
                                            <Card.Content extra>
                                                <a>
                                                    <Icon name='user' />
                                                    {saveduser ? <Link to={`Users/${saveduser?.Uuid}`}>{saveduser ? username : t('Common.NoDataFound')}</Link> : movement?.UserID}
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

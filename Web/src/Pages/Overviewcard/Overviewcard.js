import React, { useCallback, useEffect, useState } from 'react'
import { Contentwrapper, Headerwrapper, Pagedivider, Pagewrapper } from '../../Components'
import { Breadcrumb, Dropdown, Form, Grid, GridColumn, Tab } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import OverviewcardTrainingusercount from '../../Containers/Overviewcard/OverviewcardTrainingusercount'
import OverviewcardTrainingpatientcontactcount from '../../Containers/Overviewcard/OverviewcardTrainingpatientcontactcount'
import OverviewcardPatientvisitcount from '../../Containers/Overviewcard/OverviewcardPatientvisitcount'
import OverviewcardUserincidentcount from '../../Containers/Overviewcard/OverviewcardUserincidentcount'
import OverviewcardUserleftcount from '../../Containers/Overviewcard/OverviewcardUserleftcount'
import OverviewcardCompletedfilecountforpatient from '../../Containers/Overviewcard/OverviewcardCompletedfilecountforpatient'

export default function Overviewcard(props) {

    const { Profile } = props

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)

    const t = Profile?.i18n?.t

    const panes = [
        { menuItem: t('Pages.Overviewcard.Tab.Trainingusercount'), render: () => <OverviewcardTrainingusercount startDate={startDate} endDate={endDate} /> },
        { menuItem: t('Pages.Overviewcard.Tab.Trainingpatientcontactcount'), render: () => <OverviewcardTrainingpatientcontactcount startDate={startDate} endDate={endDate} /> },
        { menuItem: t('Pages.Overviewcard.Tab.Patientvisitcount'), render: () => <OverviewcardPatientvisitcount startDate={startDate} endDate={endDate} /> },
        { menuItem: t('Pages.Overviewcard.Tab.Userincidentcount'), render: () => <OverviewcardUserincidentcount startDate={startDate} endDate={endDate} /> },
        { menuItem: t('Pages.Overviewcard.Tab.Userleftcount'), render: () => <OverviewcardUserleftcount startDate={startDate} endDate={endDate} /> },
        { menuItem: t('Pages.Overviewcard.Tab.CompletedFileCountForPatients'), render: () => <OverviewcardCompletedfilecountforpatient startDate={startDate} endDate={endDate} /> },
    ]

    const getDateOption = useCallback((props) => {
        const isEndDate = props?.isEndDate

        const start = new Date()
        start.setFullYear(2020, 0, 1)
        start.setHours(0, 0, 0, 0)

        const end = new Date();
        end.setMonth(end.getMonth() + 1)
        end.setDate(0)
        const months = [];
        let index = 0
        while (start <= end) {
            index++
            if (isEndDate) {
                const preferredEnddate = new Date(start)
                preferredEnddate.setMonth(preferredEnddate.getMonth() + 6)
                preferredEnddate.setDate(0)
                months.push({
                    key: index,
                    text: preferredEnddate.toLocaleDateString('tr'),
                    value: preferredEnddate.getTime()
                });
            } else {
                months.push({
                    key: index,
                    text: start.toLocaleDateString('tr'),
                    value: start.getTime()
                });
            }
            start.setMonth(start.getMonth() + 6);
        }
        return months
    }, [])

    useEffect(() => {
        const current = new Date()
        current.setFullYear(current.getFullYear(), current.getMonth() > 5 ? 6 : 0, 1)
        current.setHours(0, 0, 0, 0)
        setStartDate(current.getTime())
        current.setMonth(current.getMonth() + 6)
        current.setDate(0)
        setEndDate(current.getTime())
    }, [])

    return (
        <Pagewrapper>
            <Headerwrapper>
                <Grid columns='2' >
                    <GridColumn width={8}>
                        <Breadcrumb size='big'>
                            <Link to={"/Overviewcard"}>
                                <Breadcrumb.Section>{t('Pages.Overviewcard.Page.Header')}</Breadcrumb.Section>
                            </Link>
                        </Breadcrumb>
                    </GridColumn>
                </Grid>
            </Headerwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <Form.Field>
                            <label className='text-[#000000de]'>{t('Pages.Overviewcard.Label.Startdate')}</label>
                            <Dropdown
                                options={getDateOption()}
                                value={startDate}
                                search
                                fluid
                                selection
                                onChange={(e, data) => {
                                    setStartDate(data.value)
                                }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label className='text-[#000000de]'>{t('Pages.Overviewcard.Label.Enddate')}</label>
                            <Dropdown
                                options={getDateOption({ isEndDate: true })}
                                value={endDate}
                                search
                                fluid
                                selection
                                onChange={(e, data) => {
                                    setEndDate(data.value)
                                }}
                            />
                        </Form.Field>
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Pagedivider />
            <Contentwrapper>
                <Tab
                    className="w-full !bg-transparent"
                    renderActiveOnly
                    panes={panes}
                />
            </Contentwrapper>
        </Pagewrapper>
    )
}

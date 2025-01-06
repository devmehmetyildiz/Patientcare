import React, { Component, useState } from 'react'
import { Accordion, Breadcrumb, Button, Grid, GridColumn, Header, Icon, Segment, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Headerbredcrump, Pagewrapper, Headerwrapper, Pagedivider } from '../../Components'

import './About.css'

import Changelogs from './Changelogs'

import AboutDetail from './AboutDetail'

export default function About() {

    const [activeIndex, setActiveIndex] = useState([])

    return (
        <Pagewrapper>
            <Headerwrapper>
                <Grid columns='2' >
                    <GridColumn width={8}>
                        <Breadcrumb size='big'>
                            <Headerbredcrump>
                                <Link to={"/About"}>
                                    <Breadcrumb.Section>Elder Camp</Breadcrumb.Section>
                                </Link>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>About</Breadcrumb.Section>
                            </Headerbredcrump>
                        </Breadcrumb>
                    </GridColumn>
                </Grid>
            </Headerwrapper>
            <Pagedivider />
            <Transition transitionOnMount={true} animation='fade down' duration={300} className="w-full">
                <Segment className='about-page-bottom-segment w-full' >
                    <Header as='h3' className='change-log-header'>
                        <Icon name='code branch' />Versiyonlar
                    </Header>
                    <Segment className='change-log-wrapper '>
                        <div className='time-line '>
                            {
                                Changelogs && Changelogs.length > 0 ?
                                    Changelogs.map((item, key) => {
                                        const isOpened = activeIndex.find(u => u === item.version) ? true : false;
                                        return (<div key={key} className='time-line-item '>
                                            <Accordion>
                                                <Accordion.Title
                                                    active={isOpened ? true : false}
                                                    index={0}
                                                    onClick={() => {
                                                        isOpened ? setActiveIndex(activeIndex.filter(u => u !== item.version)) :
                                                            setActiveIndex([...activeIndex, item.version])
                                                    }}>
                                                    <div className='time-line-item-marker '>
                                                        <div className={`time-line-item-marker-text `} >Version {item.version} <Icon name={isOpened ? 'angle up' : 'angle down'} /></div>
                                                        <Pagedivider />
                                                    </div>
                                                </Accordion.Title>
                                                <Accordion.Content active={isOpened}>
                                                    <div className='time-line-item-content'>
                                                        <AboutDetail
                                                            tag={item.version + 'feature'}
                                                            type={'feature'}
                                                            title={`Yenilikler`}
                                                            items={(item?.features || [])}
                                                        />
                                                        <AboutDetail
                                                            tag={item.version + 'change'}
                                                            type={'change'}
                                                            title={`Değişiklikler`}
                                                            items={(item?.changes || [])}
                                                        />
                                                        <AboutDetail
                                                            tag={item.version + 'bug'}
                                                            type={'bug'}
                                                            title={`Hata Çözümleri`}
                                                            items={(item?.bugs || [])}
                                                        />
                                                        <AboutDetail
                                                            tag={item.version + 'no-issue'}
                                                            type={'no-issue'}
                                                            title={`Genel`}
                                                            items={(item?.withoutIssues || [])}
                                                        />
                                                    </div>
                                                </Accordion.Content>
                                            </Accordion>
                                        </div>)
                                    }
                                    ) : null
                            }
                        </div>
                    </Segment>
                </Segment>
            </Transition>
        </Pagewrapper >
    )
}
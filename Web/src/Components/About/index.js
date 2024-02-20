import React, { Component } from 'react'
import { Accordion, Breadcrumb, Button, Grid, GridColumn, Header, Icon, Segment, Transition } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { Headerbredcrump, Pagewrapper, Headerwrapper, Pagedivider } from '../../Components'
import {
    version1_0_0_0,
    version1_0_0_1,
    version1_0_0_10,
    version1_0_0_11,
    version1_0_0_12,
    version1_0_0_13,
    version1_0_0_14,
    version1_0_0_15,
    version1_0_0_16,
    version1_0_0_2,
    version1_0_0_3,
    version1_0_0_4,
    version1_0_0_5,
    version1_0_0_6,
    version1_0_0_7,
    version1_0_0_8,
    version1_0_0_9
} from './Changelogs'
import './About.css'

export default class About extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeIssue: '',
            activeIndex: []
        }
    }

    render() {
        const Changelogs = [
            version1_0_0_16,
            version1_0_0_15,
            version1_0_0_14,
            version1_0_0_13,
            version1_0_0_12,
            version1_0_0_11,
            version1_0_0_10,
            version1_0_0_9,
            version1_0_0_8,
            version1_0_0_7,
            version1_0_0_6,
            version1_0_0_5,
            version1_0_0_4,
            version1_0_0_3,
            version1_0_0_2,
            version1_0_0_1,
            version1_0_0_0
        ]

        return (
            <Pagewrapper>
                <Headerwrapper>
                    <Grid columns='2' >
                        <GridColumn width={8}>
                            <Breadcrumb size='big'>
                                <Headerbredcrump>
                                    <Link to={"/Cases"}>
                                        <Breadcrumb.Section>Elder Care</Breadcrumb.Section>
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
                                            const isOpened = this.state.activeIndex.find(u => u === item.version) ? true : false;
                                            return (<div key={key} className='time-line-item '>
                                                <Accordion>
                                                    <Accordion.Title
                                                        active={isOpened ? true : false}
                                                        index={0}
                                                        onClick={() => {
                                                            isOpened ?
                                                                this.setState({ activeIndex: this.state.activeIndex.filter(u => u !== item.version) }) :
                                                                this.setState({ activeIndex: [...this.state.activeIndex, item.version] })
                                                        }}>
                                                        <div className='time-line-item-marker '>
                                                            <div className={`time-line-item-marker-text `} >Version {item.version} <Icon name={isOpened ? 'angle up' : 'angle down'} /></div>
                                                            <Pagedivider />
                                                        </div>
                                                    </Accordion.Title>
                                                    <Accordion.Content active={isOpened}>
                                                        <div className='time-line-item-content'>
                                                            {
                                                                [
                                                                    this.getReleaseDetailDecoration(item.version + 'feature', 'feature', `Features`, (item?.features || [])),
                                                                    this.getReleaseDetailDecoration(item.version + 'change', 'change', `Changes`, (item?.changes || [])),
                                                                    this.getReleaseDetailDecoration(item.version + 'bug', 'bug', 'Bug Fixes', (item?.bugs || [])),
                                                                    this.getReleaseDetailDecoration(item.version + 'no-issue', 'no-issue', 'No issue', (item?.withoutIssues || [])),
                                                                ]
                                                            }
                                                        </div>
                                                    </Accordion.Content>
                                                </Accordion>

                                            </div>)
                                        }
                                        ) : 'There is no release'
                                }
                            </div>
                        </Segment>
                    </Segment>
                </Transition>
            </Pagewrapper >
        )
    }

    getReleaseDetailDecoration = (tag, type, title, items) => {
        if (items.length === 0) {
            return null
        } else {
            return <div key={`tag-${tag}${type}`} className={`type-${type}`}>
                <h5 className='log-type'>{title}</h5>
                <div className='log-issues'>
                    {type === 'no-issue' ?
                        <div className='log-issues-row'>
                            <div className='log-issue-row-header' onClick={() => this.setState({ activeIssue: this.state.activeIssue !== `${tag}${type}` ? `${tag}${type}` : null })}>
                                {(items || []).length > 0 && <Button size='tiny' icon={`chevron ${this.state.activeIssue === `${tag}${type}` ? 'down' : 'right'}`} />}
                                The changes without related issue
                            </div>
                            {
                                (items || []).length > 0 && (this.state.activeIssue === `${tag}${type}`) &&
                                <div className='log-issue-row-commits'>
                                    {
                                        items.map((item, index) => <div key={`commit-${index}`} className='log-issue-row-commits-row'>
                                            {item.commits}
                                        </div>)
                                    }
                                </div>
                            }
                        </div>
                        :
                        items.map((item, index) => <div key={`issue-${index}`} className='log-issues-row'>
                            <div className='log-issue-row-header' onClick={() => this.setState({ activeIssue: this.state.activeIssue !== `${tag}${item.title}` ? `${tag}${item.title}` : null })}>
                                {(item.commits || []).length > 0 && <Button size='tiny' icon={`chevron ${this.state.activeIssue === `${tag}${item.title}` ? 'down' : 'right'}`} />}
                                {item.title}
                            </div>
                            {
                                (item.commits || []).length > 0 && (this.state.activeIssue === `${tag}${item.title}`) &&
                                <div className='log-issue-row-commits'>
                                    {
                                        (item.commits || []).map((commit, commitIndex) => <div key={`commit-${commitIndex}`} className='log-issue-row-commits-row'>
                                            {commit}
                                        </div>)
                                    }
                                </div>
                            }
                        </div>)
                    }
                </div>
            </div>
        }
    }
}

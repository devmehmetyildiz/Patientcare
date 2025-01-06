import React, { useState } from 'react'
import { Button } from 'semantic-ui-react'

export default function AboutDetail({ tag, type, title, items, opened }) {

    const [activeIssue, setActiveIssue] = useState(opened ? items.map(u => `${tag}${u.title}`) : [])

    if (items.length === 0) {
        return null
    } else {
        return <div key={`tag-${tag}${type}`} className={`type-${type}`}>
            <h5 className='log-type'>{title}</h5>
            <div className='log-issues'>
                {type === 'no-issue' ?
                    <div className='log-issues-row'>
                        <div className='log-issue-row-header' onClick={() =>
                            setActiveIssue(prev =>
                                prev.includes(`${tag}${type}`)
                                    ? [...prev.filter(u => u !== `${tag}${type}`),]
                                    : [...prev, `${tag}${type}`]
                            )
                        }
                        >
                            {(items || []).length > 0 && <Button size='tiny' icon={`chevron ${activeIssue.includes(`${tag}${type}`) ? 'down' : 'right'}`} />}
                            The changes without related issue
                        </div>
                        {
                            (items || []).length > 0 && (activeIssue.includes(`${tag}${type}`)) &&
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
                        <div className='log-issue-row-header' onClick={() =>
                            setActiveIssue(prev =>
                                prev.includes(`${tag}${item.title}`)
                                    ? [...prev.filter(u => u !== `${tag}${item.title}`),]
                                    : [...prev, `${tag}${item.title}`]
                            )
                        }
                        >
                            {(item.commits || []).length > 0 && <Button size='tiny' icon={`chevron ${activeIssue.includes(`${tag}${item.title}`) ? 'down' : 'right'}`} />}
                            {item.title}
                        </div>
                        {
                            (item.commits || []).length > 0 && (activeIssue.includes(`${tag}${item.title}`)) &&
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
        </div >
    }
}

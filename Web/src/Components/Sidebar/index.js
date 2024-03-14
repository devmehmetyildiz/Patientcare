import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { Collapse } from 'react-collapse';
import { withRouter } from 'react-router-dom';
import { Popup } from "semantic-ui-react"
import config from '../../Config';
import { Link } from 'react-router-dom';
import Pagedivider from '../Pagedivider';
import { getSidebarroutes } from '../../Utils/Constants';

export function Sidebar(props) {

    const { iconOnly, isMobile, Profile, hideMobile } = props

    const [Pages, setPages] = useState(getSidebarroutes(Profile))
    const [settedPage, setsettedPage] = useState(-1)
    const openCollapse = (e) => {
        if (!isMobile) {
            const olddata = Pages
            olddata.forEach(element => {
                if (element.id === e) {
                    element.isOpened = !element.isOpened
                } else {
                    element.isOpened = false
                }
            });
            setPages([...olddata])
        }
    }

    const closeCollapse = () => {
        const olddata = Pages
        olddata.forEach(element => {
            element.isOpened = false
        });
        setPages([...olddata])
    }

    useEffect(() => {
        closeCollapse()
    }, [iconOnly])

    useEffect(() => {
        setPages(getSidebarroutes(Profile))
    }, [Profile.Language])

    const version = `V${config.version}`
    return (
        <div className={`${iconOnly ? `${hideMobile ? 'w-[0px] ' : 'w-[50px] '}` : 'w-[250px] overflow-x-hidden overflow-y-auto'} relative flex flex-col z-40 justify-start items-start mt-[58.61px]  h-[calc(100vh-58.61px)] bg-white dark:bg-Contentfg  transition-all ease-in-out duration-500`}>
            {Pages.map((item, index) => {
                let willshow = false;
                (item.items || []).forEach(subitem => {
                    if (iconOnly) {
                        if (subitem.permission && !hideMobile) {
                            willshow = true
                        }
                    } else {
                        if (subitem.permission) {
                            willshow = true
                        }
                    }
                })
                return willshow ? <div key={index} className='w-full flex items-start flex-col relative'
                    onMouseEnter={() => { iconOnly && openCollapse(item.id) }}
                    onMouseLeave={() => { iconOnly && closeCollapse() }}
                >
                    <div className='group py-2 mr-8 flex flex-row rounded-r-full hover:bg-[#c1d8e159] dark:hover:bg-NavHoverbg w-full justify-between items-center cursor-pointer transition-all duration-300'
                        onClick={() => { iconOnly ? setsettedPage(item.id === settedPage ? -1 : item.id) : openCollapse(item.id) }}>
                        <div className='flex flex-row items-center justify-center'>
                            <div className={`ml-3 p-2 text-lg text-purple-600 rounded-full ${settedPage === item.id ? 'bg-[#91131333]' : 'bg-[#6c729333]'}  group-hover:bg-[#7eb7ce] dark:group-hover:bg-Contentfg transition-all duration-300`}>
                                {item.icon}
                            </div>
                            <h1 className={`${iconOnly ? 'hidden' : 'visible'} m-0 ml-2 text-TextColor whitespace-nowrap  text-sm tracking-wider font-semibold  group-hover:text-[#2b7694] transition-all duration-1000`}>
                                {item.title}
                            </h1>
                        </div>
                        {item.items ? <IoIosArrowDown className='text-md mr-4 text-TextColor ' /> : null}
                    </div>
                    {!iconOnly ?
                        <Collapse isOpened={item.isOpened ? item.isOpened : false}>
                            {(item.items || []).map((subitem, index) => {
                                return subitem.permission ? <h1 key={index + index} onAuxClick={() => { window.open(subitem.url, "_blank") }} onClick={() => { props.history.push(subitem.url) }} className=' m-0 cursor-pointer hover:text-[#2b7694] whitespace-nowrap dark:hover:text-white text-TextColor text-sm w-full px-8 py-1' > {subitem.subtitle}</h1> : null
                            })}
                        </Collapse>
                        : <div className={`${settedPage === item.id ? 'visible' : (item.isOpened && settedPage === -1) ? 'visible' : 'hidden'} transition-all ease-in-out p-4 whitespace-nowrap duration-500 max-h-[calc(100vh-300px-10px)] overflow-y-auto
                    cursor-pointer shadow-lg left-[50px] top-0 z-50 absolute bg-white dark:bg-NavHoverbg rounded-sm`}
                            onMouseLeave={() => {
                                closeCollapse()
                            }}>
                            {item.url ? <h3 className='m-0 cursor-pointer hover:text-[#2b7694] dark:hover:text-white text-TextColor font-bold font-Common'>{item.title}</h3> : <h3 className='text-TextColor font-bold font-Common'>{item.title}</h3>}
                            <div className='h-full overflow-auto'>
                                <Collapse isOpened={settedPage === item.id ? true : (item.isOpened ? item.isOpened : false)}>
                                    {(item.items || []).map((subitem, index) => {
                                        return subitem.permission ? <h1
                                            key={index + index + index}
                                            onAuxClick={() => {
                                                setsettedPage(-1)
                                                closeCollapse()
                                                props.history.push(subitem.url)
                                            }}
                                            onClick={() => {
                                                setsettedPage(-1)
                                                closeCollapse()
                                                props.history.push(subitem.url)
                                            }} className='hover:text-[#2b7694] m-0 whitespace-nowrap dark:hover:text-white text-TextColor text-sm w-full px-2 py-1'>{subitem.subtitle}</h1> : null
                                    })}
                                </Collapse>
                            </div>
                        </div>}
                </div> : null
            })}
            {!hideMobile && <div className='h-full mt-auto mb-2 w-full mx-auto flex justify-center items-end'>
                <div className='w-full flex flex-col justify-center items-center cursor-pointer group'>
                    <Pagedivider />
                    <Link to="/About">
                        {!iconOnly ?
                            <div className='
                            py-1 px-8 rounded-full bg-[#2355a0] text-white 
                            font-bold hover:shadow-2xl relative versionbutton
                            transition-all ease-out duration-1000
                            hover:shadow-gray-800 hover:bg-[#325992]'
                            >
                                {version}
                            </div>
                            :
                            <Popup
                                position='bottom right'
                                trigger={<div className='w-[25px] h-[25px] text-center flex justify-center items-center rounded-full bg-[#2355a0] text-white 
                          font-bold hover:shadow-2xl relative versionbutton
                          transition-all ease-out duration-1000
                          hover:shadow-gray-800 hover:bg-[#325992]' >V</div>}
                            >
                                {version}
                            </Popup>
                        }
                    </Link>
                </div>
            </div>}
        </div >
    )
}


export default withRouter(Sidebar)
import React, { useEffect, useState } from 'react'
import { TbGauge, Tb3DRotate, TbAccessPoint, TbActivity } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import { Collapse } from 'react-collapse';
import { withRouter } from 'react-router-dom';
import Literals from "../Utils/Literalregistrar"

export function Sidebar(props) {

    const { iconOnly, isMobile, Profile } = props
    const Sidebarliterals = {
        Setting: {
            en: "Settings",
            tr: "Ayarlar"
        },
        Warehouse: {
            en: "Warehouse Management",
            tr: "Ambar Yönetimi"
        },
        Orders: {
            en: "Orders",
            tr: "Siparişler"
        },
        Patients: {
            en: "Patients",
            tr: "Hastalar"
        },
        Organisation: {
            en: "Organisation Management",
            tr: "Kurum Yönetimi"
        },
        System: {
            en: "System Management",
            tr: "Sistem Yönetimi"
        },
    }

    const defaultpages = [
        {
            id: 1,
            title: Sidebarliterals.Organisation[Profile.Language],
            url: "/Dashboard",
            icon: <TbGauge className=' text-blue-700' />
        },
        {
            id: 2,
            title: Sidebarliterals.Patients[Profile.Language],
            isOpened: false,
            icon: <Tb3DRotate className='text-red-700' />,
            items: [
                { id: 1, subtitle: Literals.Preregistrations.Page.Pageheader[Profile.Language], url: "/Preregistrations" },
                { id: 2, subtitle: "Kurumdaki Hastalar", url: "/Patients" },
                { id: 3, subtitle: Literals.Patientmovements.Page.Pageheader[Profile.Language], url: "/Patientmovements" },
                { id: 4, subtitle: Literals.Patientdefines.Page.Pageheader[Profile.Language], url: "/Patientdefines" },
                { id: 5, subtitle: Literals.Patientstocks.Page.Pageheader[Profile.Language], url: "/Patientstocks" },
                { id: 6, subtitle: Literals.Patientstockmovements.Page.Pageheader[Profile.Language], url: "/Patientstockmovements" },
            ]
        },
        {
            id: 3,
            title: Sidebarliterals.Orders[Profile.Language],
            isOpened: false,
            icon: <TbAccessPoint className='text-orange-300' />,
            items: [
                { id: 1, subtitle: Literals.Purchaseorders.Page.Pageheader[Profile.Language], url: "/Purchaseorders" },
                { id: 2, subtitle: Literals.Purchaseorderstocks.Page.Pageheader[Profile.Language], url: "/Purchaseorderstocks" },
                { id: 3, subtitle: Literals.Purchaseorderstockmovements.Page.Pageheader[Profile.Language], url: "/Purchaseorderstockmovements" },
            ]
        },
        {
            id: 4,
            title: Sidebarliterals.Warehouse[Profile.Language],
            isOpened: false,
            icon: <TbActivity className='text-green-400' />,
            items: [
                { id: 1, subtitle: Literals.Warehouses.Page.Pageheader[Profile.Language], url: "/Warehouses" },
                { id: 2, subtitle: Literals.Medicines.Page.Pageheader[Profile.Language], url: "/Medicines" },
                { id: 3, subtitle: Literals.Stocks.Page.Pageheader[Profile.Language], url: "/Stocks" },
                { id: 4, subtitle: Literals.Stockmovements.Page.Pageheader[Profile.Language], url: "/Stockmovements" },
            ]
        },
        {
            id: 5,
            title: Sidebarliterals.System[Profile.Language],
            isOpened: false,
            icon: <TbGauge className='text-purple-400' />,
            items: [
                { id: 1, subtitle: Literals.Rules.Page.Pageheader[Profile.Language], url: "/Rules" },
                { id: 2, subtitle: Literals.Mailsettings.Page.Pageheader[Profile.Language], url: "/Mailsettings" },
                { id: 3, subtitle: Literals.Printtemplates.Page.Pageheader[Profile.Language], url: "/Printtemplates" },
            ]
        },
        {
            id: 6,
            title: Sidebarliterals.Setting[Profile.Language],
            isOpened: false,
            icon: <MdSettings className='text-green-800' />,
            items: [
                { id: 1, subtitle: Literals.Roles.Page.Pageheader[Profile.Language], url: "/Roles" },
                { id: 2, subtitle: Literals.Departments.Page.Pageheader[Profile.Language], url: "/Departments" },
                { id: 3, subtitle: Literals.Stations.Page.Pageheader[Profile.Language], url: "/Stations" },
                { id: 4, subtitle: Literals.Users.Page.Pageheader[Profile.Language], url: "/Users" },
                { id: 5, subtitle: Literals.Cases.Page.Pageheader[Profile.Language], url: "/Cases" },
                { id: 6, subtitle: Literals.Units.Page.Pageheader[Profile.Language], url: "/Units" },
                { id: 7, subtitle: Literals.Stockdefines.Page.Pageheader[Profile.Language], url: "/Stockdefines" },
                { id: 8, subtitle: Literals.Users.Page.Pageheader[Profile.Language], url: "/Users" },
                { id: 9, subtitle: Literals.Files.Page.Pageheader[Profile.Language], url: "/Files" },
                { id: 10, subtitle: Literals.Patienttypes.Page.Pageheader[Profile.Language], url: "/Patienttypes" },
                { id: 11, subtitle: Literals.Costumertypes.Page.Pageheader[Profile.Language], url: "/Costumertypes" },
                { id: 12, subtitle: Literals.Tododefines.Page.Pageheader[Profile.Language], url: "/Tododefines" },
                { id: 13, subtitle: Literals.Todogroupdefines.Page.Pageheader[Profile.Language], url: "/Todogroupdefines" },
                { id: 14, subtitle: Literals.Checkperiods.Page.Pageheader[Profile.Language], url: "/Checkperiods" },
                { id: 15, subtitle: Literals.Periods.Page.Pageheader[Profile.Language], url: "/Periods" },
            ]
        },
    ]

    const [Pages, setPages] = useState(defaultpages)
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
        setPages(defaultpages)
    }, [Profile.Language])

    return (
        <div className={`${iconOnly ? 'w-[50px]' : 'w-[250px]'} flex flex-col justify-start items-start mt-[58.61px] bg-white dark:bg-Contentfg  transition-all ease-in-out duration-500`}>
            <div className='flex flex-col w-full'>
                <div className=''>
                    {Pages.map((item, index) => {
                        return <div key={index} className='w-full flex items-start flex-col relative'
                            onMouseEnter={() => { iconOnly && openCollapse(item.id) }}
                            onMouseLeave={() => { iconOnly && closeCollapse() }}
                        >
                            <div className='group py-2 mr-8 flex flex-row rounded-r-full hover:bg-[#c1d8e159] dark:hover:bg-NavHoverbg w-full justify-between items-center cursor-pointer transition-all duration-300'
                                onClick={() => { iconOnly ? setsettedPage(item.id === settedPage ? -1 : item.id) : openCollapse(item.id) }}>
                                <div className='flex flex-row items-center justify-center'>
                                    <div className={`ml-2 p-2 text-lg text-purple-600 rounded-full ${settedPage === item.id ? 'bg-[#91131333]' : 'bg-[#6c729333]'}  group-hover:bg-[#7eb7ce] dark:group-hover:bg-Contentfg transition-all duration-300`}>
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
                                        return <h1 key={index + index} onAuxClick={() => { window.open(subitem.url, "_blank") }} onClick={() => { props.history.push(subitem.url) }} className=' m-0 cursor-pointer hover:text-[#2b7694] whitespace-nowrap dark:hover:text-white text-TextColor text-sm w-full px-8 py-1' > {subitem.subtitle}</h1>
                                    })}
                                </Collapse>
                                : <div className={`${settedPage === item.id ? 'visible' : (item.isOpened && settedPage === -1) ? 'visible' : 'hidden'} transition-all ease-in-out p-4 whitespace-nowrap duration-500 cursor-pointer shadow-lg left-[50px] top-0 z-50 absolute bg-white dark:bg-NavHoverbg`}
                                    onMouseLeave={() => {
                                        closeCollapse()
                                    }}>
                                    {item.url ? <h3 className='m-0 cursor-pointer hover:text-[#2b7694] dark:hover:text-white text-TextColor font-bold font-Common'>{item.title}</h3> : <h3 className='text-TextColor font-bold font-Common'>{item.title}</h3>}
                                    <div className='h-full overflow-auto'>
                                        <Collapse isOpened={settedPage === item.id ? true : (item.isOpened ? item.isOpened : false)}>
                                            {(item.items || []).map((subitem, index) => {
                                                return <h1
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
                                                    }} className='hover:text-[#2b7694] m-0 whitespace-nowrap dark:hover:text-white text-TextColor text-sm w-full px-2 py-1'>{subitem.subtitle}</h1>
                                            })}
                                        </Collapse>
                                    </div>
                                </div>}
                        </div>
                    })}

                </div>
            </div>
        </div >
    )



}
export default withRouter(Sidebar)
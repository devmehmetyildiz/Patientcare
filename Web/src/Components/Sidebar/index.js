import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { Collapse } from 'react-collapse';
import { withRouter } from 'react-router-dom';
import { Popup } from "semantic-ui-react"
import config from '../../Config';
import { Link } from 'react-router-dom';
import Pagedivider from '../Pagedivider';
import Literals from '../../Utils/Literalregistrar';
import { Tb3DRotate, TbActivity, TbGauge, TbCalendar, TbReportMoney } from "react-icons/tb"
import { MdSettings } from "react-icons/md"

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

export const getSidebarroutes = (Profile) => {

    const { roles } = Profile

    const t = Profile?.i18n?.t

    const checkAuth = (authname) => {
        let isAvailable = false
        if (roles.includes('admin') || roles.includes(authname)) {
            isAvailable = true
        }
        return isAvailable
    }

    const Sidebarliterals = {
        Setting: {
            en: "Settings",
            tr: "Ayarlar"
        },
        Warehouse: {
            en: "Warehouse Management",
            tr: "Ambar Yönetimi"
        },
        Claimpayments: {
            en: "Claim Payments",
            tr: "Hakedişler"
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
        Shifts: {
            en: "Shift Management",
            tr: "Vardiya Yönetimi"
        },
    }

    const defaultpages = [
        {
            id: 1,
            title: Sidebarliterals.Organisation[Profile.Language],
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Overview.Page.Header'), url: "/Overview", permission: checkAuth('overviewview') },
                { id: 5, subtitle: Literals.Patientfollowup.Page.Pageheader[Profile.Language], url: "/Patientfollowup", permission: checkAuth('patientview') },
                { id: 3, subtitle: Literals.Placeviews.Page.Pageheader[Profile.Language], url: "/Placeviews", permission: checkAuth('placeviewview') },
                { id: 4, subtitle: Literals.Companycashmovements.Page.Pageheader[Profile.Language], url: "/Companycashmovements", permission: checkAuth('companycashmovementview') },
                { id: 1, subtitle: t('Pages.Approve.Page.Header'), url: "/Approve", permission: checkAuth('roleview') },
                { id: 2, subtitle: t('Pages.Trainings.Page.Header'), url: "/Trainings", permission: checkAuth('roleview') },
            ]
        },
        {
            id: 2,
            title: Sidebarliterals.Claimpayments[Profile.Language],
            isOpened: false,
            icon: <TbReportMoney className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Claimpayments.Page.Header'), url: "/Claimpayments", permission: checkAuth('claimpaymentview') },
                { id: 2, subtitle: t('Pages.Claimpaymentparameters.Page.Header'), url: "/Claimpaymentparameters", permission: checkAuth('claimpaymentparameterview') },
            ]
        },
        {
            id: 3,
            title: Sidebarliterals.Shifts[Profile.Language],
            isOpened: false,
            icon: <TbCalendar className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Personelshifts.Page.Pageheader[Profile.Language], url: "/Personelshifts", permission: checkAuth('personelshiftview') },
                { id: 2, subtitle: Literals.Personelpresettings.Page.Pageheader[Profile.Language], url: "/Personelpresettings", permission: checkAuth('personelpresettingview') },
                { id: 3, subtitle: Literals.Professionpresettings.Page.Pageheader[Profile.Language], url: "/Professionpresettings", permission: checkAuth('professionpresettingview') },
                { id: 4, subtitle: Literals.Shiftdefines.Page.Pageheader[Profile.Language], url: "/Shiftdefines", permission: checkAuth('shiftdefineview') },
            ]
        },
        {
            id: 4,
            title: Sidebarliterals.Patients[Profile.Language],
            isOpened: false,
            icon: <Tb3DRotate className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Preregistrations.Page.Pageheader[Profile.Language], url: "/Preregistrations", permission: checkAuth('preregistrationview') },
                { id: 2, subtitle: Literals.Patients.Page.Pageheader[Profile.Language], url: "/Patients", permission: checkAuth('patientview') },
                { id: 3, subtitle: Literals.Patientdefines.Page.Pageheader[Profile.Language], url: "/Patientdefines", permission: checkAuth('patientdefineview') },
                { id: 4, subtitle: Literals.Patientcashmovements.Page.Pageheader[Profile.Language], url: "/Patientcashmovements", permission: checkAuth('patientcashmovementview') },
                { id: 5, subtitle: Literals.Careplans.Page.Pageheader[Profile.Language], url: "/Careplans", permission: checkAuth('careplanview') },
            ]
        },
        {
            id: 5,
            title: Sidebarliterals.Warehouse[Profile.Language],
            isOpened: false,
            icon: <TbActivity className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Purchaseorder.Page.Header'), url: "/Purchaseorders", permission: checkAuth('purchaseorderview') },
                { id: 2, subtitle: Literals.Warehouses.Page.Pageheader[Profile.Language], url: "/Warehouses", permission: checkAuth('warehouseview') },
                { id: 3, subtitle: Literals.Stocks.Page.Pageheader[Profile.Language], url: "/Stocks", permission: checkAuth('stockview') },
                { id: 4, subtitle: Literals.Stockmovements.Page.Pageheader[Profile.Language], url: "/Stockmovements", permission: checkAuth('stockmovementview') },
                { id: 5, subtitle: Literals.Equipmentgroups.Page.Pageheader[Profile.Language], url: "/Equipmentgroups", permission: checkAuth('equipmentgroupview') },
                { id: 6, subtitle: Literals.Equipments.Page.Pageheader[Profile.Language], url: "/Equipments", permission: checkAuth('equipmentview') },
                { id: 7, subtitle: Literals.Breakdowns.Page.Pageheader[Profile.Language], url: "/Breakdowns", permission: checkAuth('breakdownview') },
                { id: 8, subtitle: Literals.Mainteancies.Page.Pageheader[Profile.Language], url: "/Mainteancies", permission: checkAuth('mainteanceview') },
            ]
        },
        {
            id: 6,
            title: Sidebarliterals.System[Profile.Language],
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Files.Page.Pageheader[Profile.Language], url: "/Files", permission: checkAuth('fileview') },
                { id: 2, subtitle: Literals.Rules.Page.Pageheader[Profile.Language], url: "/Rules", permission: checkAuth('ruleview') },
                { id: 3, subtitle: Literals.Mailsettings.Page.Pageheader[Profile.Language], url: "/Mailsettings", permission: checkAuth('mailsettingview') },
                { id: 4, subtitle: Literals.Printtemplates.Page.Pageheader[Profile.Language], url: "/Printtemplates", permission: checkAuth('printtemplateview') },
                { id: 5, subtitle: Literals.Appreports.Page.Pageheader[Profile.Language], url: "/Appreports", permission: checkAuth('admin') },
                { id: 6, subtitle: t('Pages.Log.Page.Header'), url: "/Logs", permission: checkAuth('admin') },
            ]
        },
        {
            id: 7,
            title: Sidebarliterals.Setting[Profile.Language],
            isOpened: false,
            icon: <MdSettings className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Roles.Page.Pageheader[Profile.Language], url: "/Roles", permission: checkAuth('roleview') },
                { id: 2, subtitle: t('Pages.Departments.Page.Header'), url: "/Departments", permission: checkAuth('departmentview') },
                { id: 3, subtitle: t('Pages.Users.Page.Header'), url: "/Users", permission: checkAuth('userview') },
                { id: 4, subtitle: t('Pages.Cases.Page.Header'), url: "/Cases", permission: checkAuth('caseview') },
                { id: 4, subtitle: t('Pages.Patienteventdefines.Page.Header'), url: "/Patienteventdefines", permission: checkAuth('patienteventdefineview') },
                { id: 5, subtitle: Literals.Units.Page.Pageheader[Profile.Language], url: "/Units", permission: checkAuth('unitview') },
                { id: 6, subtitle: Literals.Stocktypes.Page.Pageheader[Profile.Language], url: "/Stocktypes", permission: checkAuth('stocktypeview') },
                { id: 7, subtitle: Literals.Stocktypegroups.Page.Pageheader[Profile.Language], url: "/Stocktypegroups", permission: checkAuth('stocktypegroupview') },
                { id: 8, subtitle: Literals.Stockdefines.Page.Pageheader[Profile.Language], url: "/Stockdefines", permission: checkAuth('stockdefineview') },
                { id: 9, subtitle: Literals.Floors.Page.Pageheader[Profile.Language], url: "/Floors", permission: checkAuth('floorview') },
                { id: 10, subtitle: Literals.Rooms.Page.Pageheader[Profile.Language], url: "/Rooms", permission: checkAuth('roomview') },
                { id: 11, subtitle: Literals.Beds.Page.Pageheader[Profile.Language], url: "/Beds", permission: checkAuth('bedview') },
                { id: 12, subtitle: Literals.Patientcashregisters.Page.Pageheader[Profile.Language], url: "/Patientcashregisters", permission: checkAuth('patientcashregisterview') },
                { id: 13, subtitle: Literals.Patienttypes.Page.Pageheader[Profile.Language], url: "/Patienttypes", permission: checkAuth('patienttypeview') },
                { id: 14, subtitle: Literals.Costumertypes.Page.Pageheader[Profile.Language], url: "/Costumertypes", permission: checkAuth('costumertypeview') },
                { id: 15, subtitle: Literals.Periods.Page.Pageheader[Profile.Language], url: "/Periods", permission: checkAuth('periodview') },
                { id: 16, subtitle: Literals.Tododefines.Page.Pageheader[Profile.Language], url: "/Tododefines", permission: checkAuth('tododefineview') },
                { id: 17, subtitle: Literals.Todogroupdefines.Page.Pageheader[Profile.Language], url: "/Todogroupdefines", permission: checkAuth('todogroupdefineview') },
                { id: 18, subtitle: Literals.Usagetypes.Page.Pageheader[Profile.Language], url: "/Usagetypes", permission: checkAuth('usagetypeview') },
                { id: 19, subtitle: Literals.Professions.Page.Pageheader[Profile.Language], url: "/Professions", permission: checkAuth('professionview') },
                { id: 20, subtitle: t('Pages.Supportplans.Page.Header'), url: "/Supportplans", permission: checkAuth('supportplanview') },
                { id: 21, subtitle: Literals.Supportplanlists.Page.Pageheader[Profile.Language], url: "/Supportplanlists", permission: checkAuth('supportplanlistview') },
                { id: 22, subtitle: Literals.Helpstatus.Page.Pageheader[Profile.Language], url: "/Helpstatus", permission: checkAuth('helpstatuview') },
                { id: 23, subtitle: Literals.Makingtypes.Page.Pageheader[Profile.Language], url: "/Makingtypes", permission: checkAuth('makingtypeview') },
                { id: 24, subtitle: Literals.Ratings.Page.Pageheader[Profile.Language], url: "/Ratings", permission: checkAuth('ratingview') },
                { id: 25, subtitle: Literals.Requiredperiods.Page.Pageheader[Profile.Language], url: "/Requiredperiods", permission: checkAuth('requiredperiodview') },
            ]
        },
    ]
    return defaultpages
}

export default withRouter(Sidebar)
import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { Collapse } from 'react-collapse';
import { withRouter } from 'react-router-dom';
import { Popup } from "semantic-ui-react"
import config from '../../Config';
import { Link } from 'react-router-dom';
import Pagedivider from '../Pagedivider';
import { Tb3DRotate, TbActivity, TbGauge, TbCalendar, TbReportMoney } from "react-icons/tb"
import { MdSettings } from "react-icons/md"
import privileges from '../../Constants/Privileges';

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
        <div className={`${iconOnly ? `${hideMobile ? 'w-[0px] ' : 'w-[50px] '}` : 'w-[250px] overflow-x-hidden overflow-y-auto'} relative flex flex-col z-40 justify-start items-start mt-[58.61px]  h-[calc(100vh-58.61px)] bg-white dark:bg-Contentfg  transition-all ease-in-out duration-500 border-r-[1px] border-gray-200`}>
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

    const defaultpages = [
        {
            id: 1,
            title: t('Sidebar.Menu.Organisation'),
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Overview.Page.Header'), url: "/Overview", permission: checkAuth(privileges.overviewview) },
                { id: 2, subtitle: t('Pages.Patientsrollcall.Page.Header'), url: "/Patientsrollcall", permission: checkAuth(privileges.patientsrollcallview) },
                { id: 3, subtitle: t('Pages.Overviewcard.Page.Header'), url: "/Overviewcard", permission: checkAuth(privileges.overviewcardview) },
                { id: 4, subtitle: t('Pages.Overviewhealthcarecard.Page.Header'), url: "/Overviewhealthcarecard", permission: checkAuth(privileges.overviewhealthcarecardview) },
                { id: 4, subtitle: t('Pages.Companyfiles.Page.Header'), url: "/Companyfiles", permission: checkAuth(privileges.companyfileview) },
                { id: 5, subtitle: t('Pages.Patienteventmovements.Page.Header'), url: "/Patienteventmovements", permission: checkAuth(privileges.patienteventmovementview) },
                { id: 6, subtitle: t('Pages.Userincidents.Page.Header'), url: "/Userincidents", permission: checkAuth(privileges.userincidentview) },
                { id: 7, subtitle: t('Pages.Approve.Page.Header'), url: "/Approve", permission: checkAuth(privileges.approveview) },
                { id: 8, subtitle: t('Pages.Trainings.Page.Header'), url: "/Trainings", permission: checkAuth(privileges.trainingview) },
                { id: 9, subtitle: t('Pages.Surveys.Page.Header'), url: "/Surveys", permission: checkAuth(privileges.surveyview) },
                { id: 10, subtitle: t('Pages.Breakdowns.Page.Header'), url: "/Breakdowns", permission: checkAuth(privileges.breakdownview) },
                { id: 11, subtitle: t('Pages.Mainteancies.Page.Header'), url: "/Mainteancies", permission: checkAuth(privileges.mainteanceview) },
                { id: 12, subtitle: t('Pages.Mainteanceplans.Page.Header'), url: "/Mainteanceplans", permission: checkAuth(privileges.mainteanceplanview) },
            ]
        },
        {
            id: 2,
            title: t('Sidebar.Menu.Patients'),
            isOpened: false,
            icon: <Tb3DRotate className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Preregistrations.Page.Header'), url: "/Preregistrations", permission: checkAuth(privileges.preregistrationview) },
                { id: 2, subtitle: t('Pages.Patients.Page.Header'), url: "/Patients", permission: checkAuth(privileges.patientview) },
                { id: 3, subtitle: t('Pages.Patientdefines.Page.Header'), url: "/Patientdefines", permission: checkAuth(privileges.patientdefineview) },
                { id: 4, subtitle: t('Pages.Placeviews.Page.Header'), url: "/Placeviews", permission: checkAuth(privileges.placeviewview) },
                { id: 5, subtitle: t('Pages.Careplans.Page.Header'), url: "/Careplans", permission: checkAuth(privileges.careplanview) },
                { id: 6, subtitle: t('Pages.Patientfollowup.Page.Header'), url: "/Patientfollowup", permission: checkAuth(privileges.patientfollowupview) },
                { id: 7, subtitle: t('Pages.Patientvisits.Page.Header'), url: "/Patientvisits", permission: checkAuth(privileges.patientvisitview) },
                { id: 8, subtitle: t('Pages.Patientactivities.Page.Header'), url: "/Patientactivities", permission: checkAuth(privileges.patientactivityview) },
                { id: 9, subtitle: t('Pages.Patienthealthcases.Page.Header'), url: "/Patienthealthcases", permission: checkAuth(privileges.patienthealthcaseview) },
            ]
        },
        {
            id: 3,
            title: t('Sidebar.Menu.Claimpayments'),
            isOpened: false,
            icon: <TbReportMoney className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Claimpayments.Page.Header'), url: "/Claimpayments", permission: checkAuth(privileges.claimpaymentview) },
                { id: 2, subtitle: t('Pages.Companycashmovements.Page.Header'), url: "/Companycashmovements", permission: checkAuth(privileges.companycashmovementview) },
                { id: 3, subtitle: t('Pages.Patientcashmovements.Page.Header'), url: "/Patientcashmovements", permission: checkAuth(privileges.patientcashmovementview) },
            ]
        },
        {
            id: 4,
            title: t('Sidebar.Menu.Shifts'),
            isOpened: false,
            icon: <TbCalendar className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Users.Page.Header'), url: "/Users", permission: checkAuth(privileges.userview) },
                { id: 2, subtitle: t('Pages.Personelshifts.Page.Header'), url: "/Personelshifts", permission: checkAuth(privileges.personelshiftview) },
                { id: 3, subtitle: t('Pages.Personelpresettings.Page.Header'), url: "/Personelpresettings", permission: checkAuth(privileges.personelpresettingview) },
                { id: 4, subtitle: t('Pages.Professionpresettings.Page.Header'), url: "/Professionpresettings", permission: checkAuth(privileges.professionpresettingview) },
            ]
        },
        {
            id: 5,
            title: t('Sidebar.Menu.Warehouse'),
            isOpened: false,
            icon: <TbActivity className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Purchaseorder.Page.Header'), url: "/Purchaseorders", permission: checkAuth(privileges.purchaseorderview) },
                { id: 2, subtitle: t('Pages.Warehouses.Page.Header'), url: "/Warehouses", permission: checkAuth(privileges.warehouseview) },
                { id: 3, subtitle: t('Pages.Stocks.Page.Header'), url: "/Stocks", permission: checkAuth(privileges.stockview) },
                { id: 4, subtitle: t('Pages.Stockmovements.Page.Header'), url: "/Stockmovements", permission: checkAuth(privileges.stockmovementview) },
                { id: 5, subtitle: t('Pages.Equipmentgroups.Page.Header'), url: "/Equipmentgroups", permission: checkAuth(privileges.equipmentgroupview) },
                { id: 6, subtitle: t('Pages.Equipments.Page.Header'), url: "/Equipments", permission: checkAuth(privileges.equipmentview) },

            ]
        },
        {
            id: 6,
            title: t('Sidebar.Menu.System'),
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Files.Page.Header'), url: "/Files", permission: checkAuth(privileges.fileview) },
                { id: 2, subtitle: t('Pages.Rules.Page.Header'), url: "/Rules", permission: checkAuth(privileges.ruleview) },
                { id: 3, subtitle: t('Pages.Mailsettings.Page.Header'), url: "/Mailsettings", permission: checkAuth(privileges.mailsettingview) },
                { id: 4, subtitle: t('Pages.Printtemplates.Page.Header'), url: "/Printtemplates", permission: checkAuth(privileges.printtemplateview) },
                { id: 5, subtitle: t('Pages.Appreports.Page.Header'), url: "/Appreports", permission: checkAuth(privileges.admin) },
                { id: 6, subtitle: t('Pages.Log.Page.Header'), url: "/Logs", permission: checkAuth(privileges.admin) },
            ]
        },
        {
            id: 7,
            title: t('Sidebar.Menu.Setting'),
            isOpened: false,
            icon: <MdSettings className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: t('Pages.Roles.Page.Header'), url: "/Roles", permission: checkAuth(privileges.roleview) },
                { id: 2, subtitle: t('Pages.Shiftdefines.Page.Header'), url: "/Shiftdefines", permission: checkAuth(privileges.shiftdefineview) },
                { id: 3, subtitle: t('Pages.Departments.Page.Header'), url: "/Departments", permission: checkAuth(privileges.departmentview) },
                { id: 4, subtitle: t('Pages.Claimpaymentparameters.Page.Header'), url: "/Claimpaymentparameters", permission: checkAuth(privileges.claimpaymentparameterview) },
                { id: 5, subtitle: t('Pages.Cases.Page.Header'), url: "/Cases", permission: checkAuth(privileges.caseview) },
                { id: 6, subtitle: t('Pages.Patienteventdefines.Page.Header'), url: "/Patienteventdefines", permission: checkAuth(privileges.patienteventdefineview) },
                { id: 7, subtitle: t('Pages.Patienthealthcasedefines.Page.Header'), url: "/Patienthealthcasedefines", permission: checkAuth(privileges.patienthealthcasedefineview) },
                { id: 8, subtitle: t('Pages.Units.Page.Header'), url: "/Units", permission: checkAuth(privileges.unitview) },
                { id: 9, subtitle: t('Pages.Stocktypes.Page.Header'), url: "/Stocktypes", permission: checkAuth(privileges.stocktypeview) },
                { id: 10, subtitle: t('Pages.Stocktypegroups.Page.Header'), url: "/Stocktypegroups", permission: checkAuth(privileges.stocktypegroupview) },
                { id: 11, subtitle: t('Pages.Stockdefines.Page.Header'), url: "/Stockdefines", permission: checkAuth(privileges.stockdefineview) },
                { id: 12, subtitle: t('Pages.Floors.Page.Header'), url: "/Floors", permission: checkAuth(privileges.floorview) },
                { id: 13, subtitle: t('Pages.Rooms.Page.Header'), url: "/Rooms", permission: checkAuth(privileges.roomview) },
                { id: 14, subtitle: t('Pages.Beds.Page.Header'), url: "/Beds", permission: checkAuth(privileges.bedview) },
                { id: 15, subtitle: t('Pages.Patientcashregisters.Page.Header'), url: "/Patientcashregisters", permission: checkAuth(privileges.patientcashregisterview) },
                { id: 16, subtitle: t('Pages.Patienttypes.Page.Header'), url: "/Patienttypes", permission: checkAuth(privileges.patienttypeview) },
                { id: 17, subtitle: t('Pages.Costumertypes.Page.Header'), url: "/Costumertypes", permission: checkAuth(privileges.costumertypeview) },
                { id: 18, subtitle: t('Pages.Periods.Page.Header'), url: "/Periods", permission: checkAuth(privileges.periodview) },
                { id: 19, subtitle: t('Pages.Tododefines.Page.Header'), url: "/Tododefines", permission: checkAuth(privileges.tododefineview) },
                { id: 20, subtitle: t('Pages.Todogroupdefines.Page.Header'), url: "/Todogroupdefines", permission: checkAuth(privileges.todogroupdefineview) },
                { id: 21, subtitle: t('Pages.Usagetypes.Page.Header'), url: "/Usagetypes", permission: checkAuth(privileges.usagetypeview) },
                { id: 22, subtitle: t('Pages.Professions.Page.Header'), url: "/Professions", permission: checkAuth(privileges.professionview) },
                { id: 23, subtitle: t('Pages.Supportplans.Page.Header'), url: "/Supportplans", permission: checkAuth(privileges.supportplanview) },
                { id: 24, subtitle: t('Pages.Supportplanlists.Page.Header'), url: "/Supportplanlists", permission: checkAuth(privileges.supportplanlistview) },
                { id: 25, subtitle: t('Pages.Careplanparameters.Page.Header'), url: "/Careplanparameters", permission: checkAuth(privileges.careplanparameterview) },
            ]
        },
    ]
    return defaultpages
}

export default withRouter(Sidebar)
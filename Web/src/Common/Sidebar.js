import React, { useEffect, useState } from 'react'
import { TbGauge, Tb3DRotate, TbAccessPoint, TbActivity } from "react-icons/tb";
import { IoIosArrowDown } from "react-icons/io";
import { MdSettings } from "react-icons/md";
import { Collapse } from 'react-collapse';
import { withRouter } from 'react-router-dom';


export function Sidebar(props) {

    const { iconOnly, isMobile } = props
    const [Pages, setPages] = useState([
        {
            id: 1,
            title: "Kurum Yönetimi",
            url: "/Dashboard",
            icon: <TbGauge className=' text-blue-700' />
        },
        {
            id: 2,
            title: "Hastalar",
            isOpened: false,
            icon: <Tb3DRotate className='text-red-700' />,
            items: [
                { id: 1, subtitle: "Ön Kayıtlar", url: "/Preregistrations" },
                { id: 2, subtitle: "Kurumdaki Hastalar", url: "/Patients" },
                { id: 3, subtitle: "Hasta Hareketleri", url: "/Patientmovements" },
                { id: 4, subtitle: "Hasta Tanımları", url: "/Patientdefines" },
                { id: 5, subtitle: "Hasta Stokları", url: "/Patientstocks" },
                { id: 6, subtitle: "Hasta Stok Hareketleri", url: "/Patientstockmovements" },
                { id: 6, subtitle: "Yapılacaklar", url: "/Todos" },
            ]
        },
        {
            id: 3,
            title: "Siparişler",
            isOpened: false,
            icon: <TbAccessPoint className='text-orange-300' />,
            items: [
                { id: 1, subtitle: "Siparişler", url: "/Purchaseorders" },
                { id: 2, subtitle: "Sipariş Stokları", url: "/Purchaseorderstocks" },
                { id: 3, subtitle: "Sipariş Stok Hareketleri", url: "/Purchaseorderstockmovements" },
            ]
        },
        {
            id: 4,
            title: "Ambar Yönetimi",
            isOpened: false,
            icon: <TbActivity className='text-green-400' />,
            items: [
                { id: 1, subtitle: "Ambarlar", url: "/Warehouses" },
                { id: 2, subtitle: "Ürünler", url: "/Stocks" },
                { id: 3, subtitle: "Ürün Hareketleri", url: "/Stockmovements" },
                { id: 4, subtitle: "Ürün Hareketi İncele", url: "/Stockmovement" },
            ]
        },
        {
            id: 5,
            title: "Ayarlar",
            isOpened: false,
            icon: <MdSettings className='text-green-800' />,
            items: [
                { id: 1, subtitle: "Roller", url: "/Roles" },
                { id: 2, subtitle: "Departmanlar", url: "/Departments" },
                { id: 3, subtitle: "İstasyonlar", url: "/Stations" },
                { id: 4, subtitle: "Kullanıcılar", url: "/Users" },
                { id: 5, subtitle: "Durumlar", url: "/Cases" },
                { id: 6, subtitle: "Birimler", url: "/Units" },
                { id: 7, subtitle: "Stok Tanımları", url: "/Stockdefines" },
                { id: 8, subtitle: "Kullanııclar", url: "/Users" },
                { id: 9, subtitle: "Dosyalar", url: "/Files" },
                { id: 10, subtitle: "Hasta Türleri", url: "/Patienttypes" },
                { id: 11, subtitle: "Müşteri Türleri", url: "/Costumertypes" },
                { id: 12, subtitle: "Yapılacaklar Tanımları", url: "/Tododefines" },
                { id: 13, subtitle: "Yapılacaklar Grup Tanımları", url: "/Todogroupdefines" },
                { id: 14, subtitle: "Kontrol Grupları", url: "/Checkperiods" },
                { id: 15, subtitle: "Kontrol Periyodları", url: "/Periods" },
                { id: 16, subtitle: "Mail Ayarları", url: "/Mailsettings" },
                { id: 17, subtitle: "Yazdırma Taslakları", url: "/Printtemplates" },
            ]
        },
    ])
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


    return (
        <div className={`${iconOnly ? 'w-[50px]' : 'w-[250px]'} flex flex-col justify-start items-start mt-[58.61px] bg-white dark:bg-Contentfg min-h-[calc(100vh_-_58.61px)] transition-all ease-in-out duration-500`}>
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
                                <Collapse isOpened={item.isOpened}>
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
                                        <Collapse className='overflow-auto' isOpened={settedPage === item.id ? true : item.isOpened}>
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
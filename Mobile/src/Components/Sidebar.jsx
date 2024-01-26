import React, { useEffect, useRef, useState } from 'react'
import { Text, Animated, View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import Collapsible from 'react-native-collapsible';
import styled from 'styled-components/native'
import MenuDrawer from 'react-native-side-drawer'
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProvider } from '../Provider/NavigationProvider';

export default function Sidebar() {
    const sidebarOpen = useSelector((state) => state.Page.sidebarOpen);
    const [openedMenu, setOpenedmenu] = useState(-1)

    const Organization = {
        name: "Organization",
        text: "Kurum Yönetimi",
        icon: "circle-o-notch",
        Items: [
            { key: 1, name: "UnapprovedMovements", text: "Onay Bekleyen Hareketler" },
            { key: 2, name: "UnapprovedStocks", text: "Onay Bekleyen Stoklar" },
            { key: 3, name: "UnapprovedTodos", text: "Onay Bekleyen Rutinler" },
            { key: 4, name: "Personels", text: "Personeller" },
            { key: 5, name: "Breakdowns", text: "Arıza Bildirimleri" },
            { key: 6, name: "Mainteancies", text: "Bakım Bildirimleri" },
            { key: 7, name: "Personelshifts", text: "Personel Vardiyaları" },
            { key: 8, name: "Placeviews", text: "Hasta Yerleşimleri" },
            { key: 9, name: "Companycashmovements", text: "Kurum Cüzdanı" },
        ]
    }

    const Patients = {
        name: "Patients",
        text: "Hastalar",
        icon: "group",
        Items: [
            { key: 1, name: "Preregistrations", text: "Ön Kayıtlar" },
            { key: 2, name: "Patients", text: "Hastalar" },
            { key: 3, name: "Patientmovements", text: "Hasta Hareketleri" },
            { key: 4, name: "Patientdefines", text: "Hasta Tanımları" },
            { key: 5, name: "Patientstocks", text: "Hasta Stokları" },
            { key: 6, name: "Patientmedicines", text: "Hasta İlaçları" },
            { key: 7, name: "Patientsupplies", text: "Hasta Sarf Malzemeleri" },
            { key: 8, name: "Patientstockmovements", text: "Hasta Stok Hareketleri" },
            { key: 9, name: "Patientcashmovements", text: "Hasta Cüzdanları" },
            { key: 10, name: "Todos", text: "Yapılacaklar" },
        ]
    }


    const Purchaseorders = {
        name: "Purchaseorders",
        text: "Siparişler",
        icon: "file-o",
        Items: [
            { key: 1, name: "Purchaseorders", text: "Satın Alma Siparişleri" },
            { key: 2, name: "Purchaseorderstocks", text: "Satın Alma Stokları" },
            { key: 3, name: "Purchaseordermedicines", text: "Satın Alma İlaçları" },
            { key: 4, name: "Purchaseordersupplies", text: "Satın Alma Sarf Malzemeleri" },
            { key: 5, name: "Purchaseorderstockmovements", text: "Satın Alma Stok Hareketleri" },
        ]
    }

    const Warehouses = {
        name: "Warehouses",
        text: "Ambar Yönetimi",
        icon: "briefcase",
        Items: [
            { key: 1, name: "Warehouses", text: "Ambarlar" },
            { key: 2, name: "Medicines", text: "İlaçlar" },
            { key: 3, name: "Stocks", text: "Stoklar" },
            { key: 4, name: "Supplies", text: "Sarf Malzemeleri" },
            { key: 5, name: "Stockmovements", text: "Stok Hareketleri" },
            { key: 6, name: "Equipmentgroups", text: "Ekipman Grupları" },
            { key: 7, name: "Equipments", text: "Ekipmanlar" },
        ]
    }

    const Systems = {
        name: "Systems",
        text: "Sistem Yönetimi",
        icon: "wrench",
        Items: [
            { key: 1, name: "Rules", text: "Kurallar" },
            { key: 2, name: "Mailsettings", text: "Mail Ayarları" },
            { key: 3, name: "Printtemplates", text: "Yazdırma Taslakları" },
            { key: 4, name: "Appreports", text: "Uygulama Raporu" },
        ]
    }

    const Setting = {
        name: "Setting",
        text: "Ayarlar",
        icon: "gear",
        Items: [
            { key: 1, name: "Roles", text: "Roller" },
            { key: 2, name: "Departments", text: "Departmanlar" },
            { key: 3, name: "Stations", text: "İstasyonlar" },
            { key: 4, name: "Shifts", text: "Vardiyalar" },
            { key: 5, name: "Users", text: "Kullanıcılar" },
            { key: 6, name: "Cases", text: "Durumlar", url: 'Cases' },
            { key: 7, name: "Units", text: "Birimler", url: 'Units' },
            { key: 8, name: "Stockdefines", text: "Stok Tanımları" },
            { key: 9, name: "Files", text: "Dosyalar" },
            { key: 10, name: "Floors", text: "Katlar" },
            { key: 11, name: "Rooms", text: "Odalar" },
            { key: 12, name: "Beds", text: "Yataklar" },
            { key: 13, name: "Patientcashregisters", text: "Hasta Para Türleri" },
            { key: 14, name: "Patienttypes", text: "Hasta Türleri" },
            { key: 15, name: "Costumertypes", text: "Müşteri Türleri" },
            { key: 16, name: "Periods", text: "Periyotlar" },
            { key: 17, name: "Tododefines", text: "Rutin Tanımları" },
            { key: 18, name: "Todogroupdefines", text: "Rutin Grup Tanımları" },
        ]
    }

    let Menu = []
    Menu.push(Organization)
    Menu.push(Patients)
    Menu.push(Purchaseorders)
    Menu.push(Warehouses)
    Menu.push(Systems)
    Menu.push(Setting)


    const drawerContent = () => {
        return (
            <Container style={{ height: '100%' }}>
                {Menu.map((menu, index) => {
                    return <View key={index}>
                        <TouchableOpacity onPress={() => { setOpenedmenu(openedMenu === index ? -1 : index) }}>
                            <Menucontainer>
                                <Menuitemwrapper>
                                    <Icon name={menu.icon} size={15} color="#2355a0" />
                                    <MenuHeaderText>{menu.text}</MenuHeaderText>
                                </Menuitemwrapper>
                                {(openedMenu === index)
                                    ? <Icon name='chevron-up' size={15} color="#2355a0" />
                                    : <Icon name='chevron-down' size={15} color="#2355a0" />
                                }
                            </Menucontainer>
                        </TouchableOpacity>
                        <Collapsible collapsed={!(openedMenu === index)}>
                            {menu.Items.map(submenu => {
                                return <TouchableOpacity onPress={() => { NavigationProvider.GoTo(submenu.url) }} key={`${index}${submenu.key}`}>
                                    <Subcontainer>
                                        <SubHeaderText >{submenu.text}</SubHeaderText>
                                    </Subcontainer>
                                </TouchableOpacity>
                            })}
                        </Collapsible>
                    </View>
                })}
            </Container>
        );
    };


    return (
        <MenuDrawer

            open={sidebarOpen}
            position={'left'}
            drawerContent={drawerContent()}
            drawerPercentage={90}
            animationTime={250}
            overlay={true}
            opacity={0.4}
        />
    )
}

const Container = styled.ScrollView({
    width: '200px',
    backgroundColor: 'white'

})

const Menucontainer = styled.View({
    width: '100%',
    padding: '10px 2px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    alignItems: 'center',
})

const Menuitemwrapper = styled.View({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 2,
    flexWrap: 'nowrap',
    alignItems: 'center',
})

const MenuHeaderText = styled.Text({
    color: '#6c7293',
    fontWeight: 'bold'
})

const Subcontainer = styled.View({
    width: '100%',
    padding: '4px',
    paddingLeft: '25px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const SubHeaderText = styled.Text({
    color: '#6c7293',
    fontWeight: 'bold',
    fontSize: 12
})
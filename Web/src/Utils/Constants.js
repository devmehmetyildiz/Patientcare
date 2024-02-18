import { Tb3DRotate, TbAccessPoint, TbActivity, TbGauge } from "react-icons/tb"
import Literals from "./Literalregistrar"
import { MdSettings } from "react-icons/md"

export const ROUTES = {
    DATATABLE: 'Datatable',

    AUTH: 'Auth',
    ROLE: 'Roles',
    USER: 'Users',
    USERNOTIFICATION: 'Usernotifications',

    ACTIVEPATIENT: 'Activepatient',
    PATIENT: 'Patients',
    TODO: 'Todos',

    PATIENTTYPE: 'Patienttypes',
    PATIENTREPORT: 'Patientreport',
    PATIENTDEFINE: 'Patientdefines',
    PERSONEL: 'Personels',
    COMPANYCASHMOVEMENT: 'Companycashmovements',
    PATIENTCASHMOVEMENT: 'Patientcashmovements',
    PATIENTCASHREGISTER: 'Patientcashregisters',
    CAREPLAN: 'Careplans',

    COSTUMERTYPE: 'Costumertypes',
    CASE: 'Cases',
    DEPARTMENT: 'Departments',
    FILE: 'Files',
    STATION: 'Stations',
    STOCKDEFINE: 'Stockdefines',
    UNIT: 'Units',
    ROOM: 'Rooms',
    BED: 'Beds',
    USAGETYPE: 'Usagetypes',
    FLOOR: 'Floors',
    SHIFT: 'Shifts',
    HELPSTATU: 'Helpstatus',
    MAKINGTYPE: 'Makingtypes',
    RATING: 'Ratings',
    REQUIREDPERIOD: 'Requiredperiods',

    PURCHASEORDER: 'Purchaseorders',
    PURCHASEORDERSTOCK: 'Purchaseorderstocks',
    PURCHASEORDERSTOCKMOVEMENT: 'Purchaseorderstockmovements',
    DEACTIVESTOCK: 'Deactivestock',
    STOCK: 'Stocks',
    STOCKMOVEMENT: 'Stockmovements',
    WAREHOUSE: 'Warehouses',
    PATIENTSTOCK: 'Patientstocks',
    PATIENTSTOCKMOVEMENT: 'Patientstockmovements',
    EQUIPMENTGROUP: 'Equipmentgroups',
    EQUIPMENT: 'Equipments',
    BREAKDOWN: 'Breakdowns',
    MAINTEANCE: 'Mainteancies',

    TODODEFINE: 'Tododefines',
    TODOGROUPDEFINE: 'Todogroupdefines',
    PATIENTMOVEMENT: 'Patientmovements',
    CHECKPERIOD: 'Checkperiods',
    PERIOD: 'Periods',
    SUPPORTPLAN: 'Supportplans',
    SUPPORTPLANLIST: 'Supportplanlists',

    MAILSETTING: 'Mailsettings',
    PRINTTEMPLATE: 'Printtemplates',
    RULE: 'Rules',
    LOG: 'Logs',

}

export const MOVEMENTTYPES = [
    { Name: "Stokdan düşme", value: -1, color: 'gray' },
    { Name: "Transfer", value: 0, color: 'green' },
    { Name: "Stok Ekleme", value: 1, color: 'orange' },
]

export const CASHYPES = [
    { Name: "Cüzdandan Çıkartma", value: -1, color: 'gray' },
    { Name: "Pasif", value: 0, color: 'green' },
    { Name: "Cüzdana Ekleme", value: 1, color: 'orange' },
]

export const PATIENTMOVEMENTTYPE = [
    { Name: "İşlem Yok", value: 0 },
    { Name: "Kurumda", value: 1 },
    { Name: "İlk Kayıtta", value: 2 },
    { Name: "Hastanede", value: 3 },
    { Name: "Ölüm", value: 4 },
    { Name: "Kontrol", value: 5 },
    { Name: "Ayrılmış", value: 6 },
    { Name: "Yer değişikliği", value: 7 },
]

export const getInitialconfig = (Profile, metaKey) => {
    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
        hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
            return item.key
        }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
        columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
            return item.key
        }) : [],
        groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
            return item.key
        }) : [],
    };
    return initialConfig
}

export const getSidebarroutes = (Profile) => {

    const { roles } = Profile

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
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Unapproveds.Page.Movement.Pageheader[Profile.Language], url: "/UnapprovedMovements", permission: checkAuth('stockmovementscreen') },
                { id: 2, subtitle: Literals.Unapproveds.Page.Stock.Pageheader[Profile.Language], url: "/UnapprovedStocks", permission: checkAuth('stockscreen') },
                { id: 2, subtitle: Literals.Unapproveds.Page.PageTodoheader[Profile.Language], url: "/UnapprovedTodos", permission: checkAuth('todoscreen') },
                { id: 3, subtitle: Literals.Personels.Page.Pageheader[Profile.Language], url: "/Personels", permission: checkAuth('personelscreen') },
                { id: 4, subtitle: Literals.Breakdowns.Page.Pageheader[Profile.Language], url: "/Breakdowns", permission: checkAuth('breakdownscreen') },
                { id: 5, subtitle: Literals.Mainteancies.Page.Pageheader[Profile.Language], url: "/Mainteancies", permission: checkAuth('mainteancescreen') },
                { id: 6, subtitle: Literals.Personelshifts.Page.Pageheader[Profile.Language], url: "/Personelshifts", permission: checkAuth('shiftscreen') },
                { id: 7, subtitle: Literals.Placeviews.Page.Pageheader[Profile.Language], url: "/Placeviews", permission: checkAuth('patientscreen') },
                { id: 8, subtitle: Literals.Companycashmovements.Page.Pageheader[Profile.Language], url: "/Companycashmovements", permission: checkAuth('companycashmovementscreen') },
            ]
        },
        {
            id: 2,
            title: Sidebarliterals.Patients[Profile.Language],
            isOpened: false,
            icon: <Tb3DRotate className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Preregistrations.Page.Pageheader[Profile.Language], url: "/Preregistrations", permission: checkAuth('patientscreen') },
                { id: 2, subtitle: Literals.Patients.Page.Pageheader[Profile.Language], url: "/Patients", permission: checkAuth('patientscreen') },
                { id: 3, subtitle: Literals.Patientmovements.Page.Pageheader[Profile.Language], url: "/Patientmovements", permission: checkAuth('patientmovementscreen') },
                { id: 4, subtitle: Literals.Patientdefines.Page.Pageheader[Profile.Language], url: "/Patientdefines", permission: checkAuth('patientdefinescreen') },
                { id: 5, subtitle: Literals.Patientstocks.Page.Pageheader[Profile.Language], url: "/Patientstocks", permission: checkAuth('patientstockscreen') },
                { id: 6, subtitle: Literals.Patientmedicines.Page.Pageheader[Profile.Language], url: "/Patientmedicines", permission: checkAuth('patientstockscreen') },
                { id: 7, subtitle: Literals.Patientsupplies.Page.Pageheader[Profile.Language], url: "/Patientsupplies", permission: checkAuth('patientstockscreen') },
                { id: 8, subtitle: Literals.Patientstockmovements.Page.Pageheader[Profile.Language], url: "/Patientstockmovements", permission: checkAuth('patientstockmovementscreen') },
                { id: 9, subtitle: Literals.Patientcashmovements.Page.Pageheader[Profile.Language], url: "/Patientcashmovements", permission: checkAuth('patientcashmovementscreen') },
                { id: 10, subtitle: Literals.Patientusestocks.Page.Pageheader[Profile.Language], url: "/Patientusestocks", permission: checkAuth('patientscreen') },
                { id: 11, subtitle: Literals.Patientusemedicines.Page.Pageheader[Profile.Language], url: "/Patientusemedicines", permission: checkAuth('patientscreen') },
                { id: 12, subtitle: Literals.Patientusesupplies.Page.Pageheader[Profile.Language], url: "/Patientusesupplies", permission: checkAuth('patientscreen') },
                { id: 13, subtitle: Literals.Careplans.Page.Pageheader[Profile.Language], url: "/Careplans", permission: checkAuth('careplanscreen') },
            ]
        },
        {
            id: 3,
            title: Sidebarliterals.Orders[Profile.Language],
            isOpened: false,
            icon: <TbAccessPoint className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Purchaseorders.Page.Pageheader[Profile.Language], url: "/Purchaseorders", permission: checkAuth('purchaseorderscreen') },
                { id: 2, subtitle: Literals.Purchaseorderstocks.Page.Pageheader[Profile.Language], url: "/Purchaseorderstocks", permission: checkAuth('purchaseorderstockscreen') },
                { id: 3, subtitle: Literals.Purchaseordermedicines.Page.Pageheader[Profile.Language], url: "/Purchaseordermedicines", permission: checkAuth('purchaseorderstockscreen') },
                { id: 4, subtitle: Literals.Purchaseordersupplies.Page.Pageheader[Profile.Language], url: "/Purchaseordersupplies", permission: checkAuth('purchaseorderstockscreen') },
                { id: 5, subtitle: Literals.Purchaseorderstockmovements.Page.Pageheader[Profile.Language], url: "/Purchaseorderstockmovements", permission: checkAuth('purchaseorderstockmovementscreen') },
            ]
        },
        {
            id: 4,
            title: Sidebarliterals.Warehouse[Profile.Language],
            isOpened: false,
            icon: <TbActivity className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Warehouses.Page.Pageheader[Profile.Language], url: "/Warehouses", permission: checkAuth('warehousescreen') },
                { id: 2, subtitle: Literals.Medicines.Page.Pageheader[Profile.Language], url: "/Medicines", permission: checkAuth('stockscreen') },
                { id: 3, subtitle: Literals.Stocks.Page.Pageheader[Profile.Language], url: "/Stocks", permission: checkAuth('stockscreen') },
                { id: 4, subtitle: Literals.Supplies.Page.Pageheader[Profile.Language], url: "/Supplies", permission: checkAuth('stockscreen') },
                { id: 5, subtitle: Literals.Stockmovements.Page.Pageheader[Profile.Language], url: "/Stockmovements", permission: checkAuth('stockmovementscreen') },
                { id: 6, subtitle: Literals.Equipmentgroups.Page.Pageheader[Profile.Language], url: "/Equipmentgroups", permission: checkAuth('equipmentgroupscreen') },
                { id: 7, subtitle: Literals.Equipments.Page.Pageheader[Profile.Language], url: "/Equipments", permission: checkAuth('equipmentscreen') },
            ]
        },
        {
            id: 5,
            title: Sidebarliterals.System[Profile.Language],
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Rules.Page.Pageheader[Profile.Language], url: "/Rules", permission: checkAuth('rulescreen') },
                { id: 2, subtitle: Literals.Mailsettings.Page.Pageheader[Profile.Language], url: "/Mailsettings", permission: checkAuth('mailsettingscreen') },
                { id: 3, subtitle: Literals.Printtemplates.Page.Pageheader[Profile.Language], url: "/Printtemplates", permission: checkAuth('printtemplatescreen') },
                { id: 4, subtitle: Literals.Appreports.Page.Pageheader[Profile.Language], url: "/Appreports", permission: checkAuth('appreportscreen') },
            ]
        },
        {
            id: 6,
            title: Sidebarliterals.Setting[Profile.Language],
            isOpened: false,
            icon: <MdSettings className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Roles.Page.Pageheader[Profile.Language], url: "/Roles", permission: checkAuth('rulescreen') },
                { id: 2, subtitle: Literals.Departments.Page.Pageheader[Profile.Language], url: "/Departments", permission: checkAuth('departmentscreen') },
                { id: 4, subtitle: Literals.Shifts.Page.Pageheader[Profile.Language], url: "/Shifts", permission: checkAuth('shiftscreen') },
                { id: 5, subtitle: Literals.Users.Page.Pageheader[Profile.Language], url: "/Users", permission: checkAuth('userscreen') },
                { id: 6, subtitle: Literals.Cases.Page.Pageheader[Profile.Language], url: "/Cases", permission: checkAuth('casescreen') },
                { id: 7, subtitle: Literals.Units.Page.Pageheader[Profile.Language], url: "/Units", permission: checkAuth('unitscreen') },
                { id: 8, subtitle: Literals.Stockdefines.Page.Pageheader[Profile.Language], url: "/Stockdefines", permission: checkAuth('stockdefinescreen') },
                { id: 9, subtitle: Literals.Files.Page.Pageheader[Profile.Language], url: "/Files", permission: checkAuth('filescreen') },
                { id: 10, subtitle: Literals.Floors.Page.Pageheader[Profile.Language], url: "/Floors", permission: checkAuth('floorscreen') },
                { id: 11, subtitle: Literals.Rooms.Page.Pageheader[Profile.Language], url: "/Rooms", permission: checkAuth('roomscreen') },
                { id: 12, subtitle: Literals.Beds.Page.Pageheader[Profile.Language], url: "/Beds", permission: checkAuth('bedscreen') },
                { id: 13, subtitle: Literals.Patientcashregisters.Page.Pageheader[Profile.Language], url: "/Patientcashregisters", permission: checkAuth('patientcashregisterscreen') },
                { id: 14, subtitle: Literals.Patienttypes.Page.Pageheader[Profile.Language], url: "/Patienttypes", permission: checkAuth('patienttypescreen') },
                { id: 15, subtitle: Literals.Costumertypes.Page.Pageheader[Profile.Language], url: "/Costumertypes", permission: checkAuth('costumertypescreen') },
                { id: 16, subtitle: Literals.Periods.Page.Pageheader[Profile.Language], url: "/Periods", permission: checkAuth('periodscreen') },
                { id: 17, subtitle: Literals.Tododefines.Page.Pageheader[Profile.Language], url: "/Tododefines", permission: checkAuth('tododefinescreen') },
                { id: 18, subtitle: Literals.Todogroupdefines.Page.Pageheader[Profile.Language], url: "/Todogroupdefines", permission: checkAuth('todogroupdefinescreen') },
                { id: 19, subtitle: Literals.Usagetypes.Page.Pageheader[Profile.Language], url: "/Usagetypes", permission: checkAuth('usagetypescreen') },
                { id: 20, subtitle: Literals.Supportplans.Page.Pageheader[Profile.Language], url: "/Supportplans", permission: checkAuth('supportplanscreen') },
                { id: 21, subtitle: Literals.Supportplanlists.Page.Pageheader[Profile.Language], url: "/Supportplanlists", permission: checkAuth('supportplanlistscreen') },
                { id: 22, subtitle: Literals.Helpstatus.Page.Pageheader[Profile.Language], url: "/Helpstatus", permission: checkAuth('helpstatuscreen') },
                { id: 23, subtitle: Literals.Makingtypes.Page.Pageheader[Profile.Language], url: "/Makingtypes", permission: checkAuth('makingtypescreen') },
                { id: 24, subtitle: Literals.Ratings.Page.Pageheader[Profile.Language], url: "/Ratings", permission: checkAuth('ratingscreen') },
                { id: 25, subtitle: Literals.Requiredperiods.Page.Pageheader[Profile.Language], url: "/Requiredperiods", permission: checkAuth('requiredperiodscreen') },
            ]
        },
    ]
    return defaultpages
}
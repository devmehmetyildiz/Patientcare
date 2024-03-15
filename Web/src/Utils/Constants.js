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
    PROFESSION: 'Professions',

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
        sortBy: [...(tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible && u.sorting && u.sorting !== 'None').map(u => {
            return u?.sorting === 'Asc' ? { id: u.key, desc: false } : { id: u.key, desc: true }
        }) : [])]
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
                { id: 1, subtitle: Literals.Unapproveds.Page.Movement.Pageheader[Profile.Language], url: "/UnapprovedMovements", permission: checkAuth('unapprovedmovementview') },
                { id: 2, subtitle: Literals.Unapproveds.Page.Stock.Pageheader[Profile.Language], url: "/UnapprovedStocks", permission: checkAuth('unapprovedstockview') },
                { id: 3, subtitle: Literals.Unapproveds.Page.PageTodoheader[Profile.Language], url: "/UnapprovedTodos", permission: checkAuth('unapprovedtodoview') },
                { id: 4, subtitle: Literals.Breakdowns.Page.Pageheader[Profile.Language], url: "/Breakdowns", permission: checkAuth('breakdownview') },
                { id: 5, subtitle: Literals.Mainteancies.Page.Pageheader[Profile.Language], url: "/Mainteancies", permission: checkAuth('mainteanceview') },
                { id: 6, subtitle: Literals.Personelshifts.Page.Pageheader[Profile.Language], url: "/Personelshifts", permission: checkAuth('shiftview') },
                { id: 7, subtitle: Literals.Placeviews.Page.Pageheader[Profile.Language], url: "/Placeviews", permission: checkAuth('placeviewview') },
                { id: 8, subtitle: Literals.Companycashmovements.Page.Pageheader[Profile.Language], url: "/Companycashmovements", permission: checkAuth('companycashmovementview') },
                { id: 9, subtitle: Literals.Patientscases.Page.Pageheader[Profile.Language], url: "/Patientscases", permission: checkAuth('patientview') },
                { id: 10, subtitle: Literals.Patientfollowup.Page.Pageheader[Profile.Language], url: "/Patientfollowup", permission: checkAuth('patientview') },
            ]
        },
        {
            id: 2,
            title: Sidebarliterals.Patients[Profile.Language],
            isOpened: false,
            icon: <Tb3DRotate className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Preregistrations.Page.Pageheader[Profile.Language], url: "/Preregistrations", permission: checkAuth('preregistrationview') },
                { id: 2, subtitle: Literals.Patients.Page.Pageheader[Profile.Language], url: "/Patients", permission: checkAuth('patientview') },
                { id: 3, subtitle: Literals.Patientmovements.Page.Pageheader[Profile.Language], url: "/Patientmovements", permission: checkAuth('patientmovementview') },
                { id: 4, subtitle: Literals.Patientdefines.Page.Pageheader[Profile.Language], url: "/Patientdefines", permission: checkAuth('patientdefineview') },
                { id: 5, subtitle: Literals.Patientstocks.Page.Pageheader[Profile.Language], url: "/Patientstocks", permission: checkAuth('patientstockview') },
                { id: 6, subtitle: Literals.Patientmedicines.Page.Pageheader[Profile.Language], url: "/Patientmedicines", permission: checkAuth('patientmedicineview') },
                { id: 7, subtitle: Literals.Patientsupplies.Page.Pageheader[Profile.Language], url: "/Patientsupplies", permission: checkAuth('patientsupplyview') },
                { id: 8, subtitle: Literals.Patientstockmovements.Page.Pageheader[Profile.Language], url: "/Patientstockmovements", permission: checkAuth('patientstockmovementview') },
                { id: 9, subtitle: Literals.Patientcashmovements.Page.Pageheader[Profile.Language], url: "/Patientcashmovements", permission: checkAuth('patientcashmovementview') },
                { id: 10, subtitle: Literals.Patientusestocks.Page.Pageheader[Profile.Language], url: "/Patientusestocks", permission: checkAuth('patientview') },
                { id: 11, subtitle: Literals.Patientusemedicines.Page.Pageheader[Profile.Language], url: "/Patientusemedicines", permission: checkAuth('patientview') },
                { id: 12, subtitle: Literals.Patientusesupplies.Page.Pageheader[Profile.Language], url: "/Patientusesupplies", permission: checkAuth('patientview') },
                { id: 13, subtitle: Literals.Careplans.Page.Pageheader[Profile.Language], url: "/Careplans", permission: checkAuth('careplanview') },
            ]
        },
        {
            id: 3,
            title: Sidebarliterals.Orders[Profile.Language],
            isOpened: false,
            icon: <TbAccessPoint className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Purchaseorders.Page.Pageheader[Profile.Language], url: "/Purchaseorders", permission: checkAuth('purchaseorderview') },
                { id: 2, subtitle: Literals.Purchaseorderstocks.Page.Pageheader[Profile.Language], url: "/Purchaseorderstocks", permission: checkAuth('purchaseorderstockview') },
                { id: 3, subtitle: Literals.Purchaseordermedicines.Page.Pageheader[Profile.Language], url: "/Purchaseordermedicines", permission: checkAuth('purchaseordermedicineview') },
                { id: 4, subtitle: Literals.Purchaseordersupplies.Page.Pageheader[Profile.Language], url: "/Purchaseordersupplies", permission: checkAuth('purchaseordersupplyview') },
                { id: 5, subtitle: Literals.Purchaseorderstockmovements.Page.Pageheader[Profile.Language], url: "/Purchaseorderstockmovements", permission: checkAuth('purchaseorderstockmovementview') },
            ]
        },
        {
            id: 4,
            title: Sidebarliterals.Warehouse[Profile.Language],
            isOpened: false,
            icon: <TbActivity className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Warehouses.Page.Pageheader[Profile.Language], url: "/Warehouses", permission: checkAuth('warehouseview') },
                { id: 2, subtitle: Literals.Medicines.Page.Pageheader[Profile.Language], url: "/Medicines", permission: checkAuth('patientmedicineview') },
                { id: 3, subtitle: Literals.Stocks.Page.Pageheader[Profile.Language], url: "/Stocks", permission: checkAuth('stockview') },
                { id: 4, subtitle: Literals.Supplies.Page.Pageheader[Profile.Language], url: "/Supplies", permission: checkAuth('supplyview') },
                { id: 5, subtitle: Literals.Stockmovements.Page.Pageheader[Profile.Language], url: "/Stockmovements", permission: checkAuth('stockmovementview') },
                { id: 6, subtitle: Literals.Equipmentgroups.Page.Pageheader[Profile.Language], url: "/Equipmentgroups", permission: checkAuth('equipmentgroupview') },
                { id: 7, subtitle: Literals.Equipments.Page.Pageheader[Profile.Language], url: "/Equipments", permission: checkAuth('equipmentview') },
            ]
        },
        {
            id: 5,
            title: Sidebarliterals.System[Profile.Language],
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Rules.Page.Pageheader[Profile.Language], url: "/Rules", permission: checkAuth('ruleview') },
                { id: 2, subtitle: Literals.Mailsettings.Page.Pageheader[Profile.Language], url: "/Mailsettings", permission: checkAuth('mailsettingview') },
                { id: 3, subtitle: Literals.Printtemplates.Page.Pageheader[Profile.Language], url: "/Printtemplates", permission: checkAuth('printtemplateview') },
                { id: 4, subtitle: Literals.Appreports.Page.Pageheader[Profile.Language], url: "/Appreports", permission: checkAuth('admin') },
            ]
        },
        {
            id: 6,
            title: Sidebarliterals.Setting[Profile.Language],
            isOpened: false,
            icon: <MdSettings className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Roles.Page.Pageheader[Profile.Language], url: "/Roles", permission: checkAuth('roleview') },
                { id: 2, subtitle: Literals.Departments.Page.Pageheader[Profile.Language], url: "/Departments", permission: checkAuth('departmentview') },
                { id: 3, subtitle: Literals.Shifts.Page.Pageheader[Profile.Language], url: "/Shifts", permission: checkAuth('shiftview') },
                { id: 4, subtitle: Literals.Users.Page.Pageheader[Profile.Language], url: "/Users", permission: checkAuth('userview') },
                { id: 5, subtitle: Literals.Cases.Page.Pageheader[Profile.Language], url: "/Cases", permission: checkAuth('caseview') },
                { id: 6, subtitle: Literals.Units.Page.Pageheader[Profile.Language], url: "/Units", permission: checkAuth('unitview') },
                { id: 7, subtitle: Literals.Stockdefines.Page.Pageheader[Profile.Language], url: "/Stockdefines", permission: checkAuth('stockdefineview') },
                { id: 8, subtitle: Literals.Files.Page.Pageheader[Profile.Language], url: "/Files", permission: checkAuth('fileview') },
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
                { id: 19, subtitle: Literals.Supportplans.Page.Pageheader[Profile.Language], url: "/Supportplans", permission: checkAuth('supportplanview') },
                { id: 20, subtitle: Literals.Supportplanlists.Page.Pageheader[Profile.Language], url: "/Supportplanlists", permission: checkAuth('supportplanlistview') },
                { id: 21, subtitle: Literals.Helpstatus.Page.Pageheader[Profile.Language], url: "/Helpstatus", permission: checkAuth('helpstatuview') },
                { id: 22, subtitle: Literals.Makingtypes.Page.Pageheader[Profile.Language], url: "/Makingtypes", permission: checkAuth('makingtypeview') },
                { id: 23, subtitle: Literals.Ratings.Page.Pageheader[Profile.Language], url: "/Ratings", permission: checkAuth('ratingview') },
                { id: 24, subtitle: Literals.Requiredperiods.Page.Pageheader[Profile.Language], url: "/Requiredperiods", permission: checkAuth('requiredperiodview') },
                { id: 25, subtitle: Literals.Professions.Page.Pageheader[Profile.Language], url: "/Professions", permission: checkAuth('professionview') },
            ]
        },
    ]
    return defaultpages
}
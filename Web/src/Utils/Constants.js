import { Tb3DRotate, TbActivity, TbGauge, TbCalendar } from "react-icons/tb"
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
    PERSONELPRESETTING: 'Personelpresettings',
    PROFESSIONPRESETTING: 'Professionpresettings',
    PERSONELSHIFT: 'Personelshifts',
    PERSONELSHIFTDETAIL: 'Personelshiftdetails',

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
    SHIFTDEFINE: 'Shiftdefines',
    HELPSTATU: 'Helpstatus',
    MAKINGTYPE: 'Makingtypes',
    RATING: 'Ratings',
    REQUIREDPERIOD: 'Requiredperiods',

    PURCHASEORDER: 'Purchaseorders',
    STOCK: 'Stocks',
    STOCKMOVEMENT: 'Stockmovements',
    STOCKTYPE: 'Stocktypes',
    STOCKTYPEGROUP: 'Stocktypegroups',
    WAREHOUSE: 'Warehouses',
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

export const PURCHASEORDER_MOVEMENTTYPES_CREATE = 'create'
export const PURCHASEORDER_MOVEMENTTYPES_UPDATE = 'update'
export const PURCHASEORDER_MOVEMENTTYPES_DELETE = 'delete'
export const PURCHASEORDER_MOVEMENTTYPES_CHECK = 'check'
export const PURCHASEORDER_MOVEMENTTYPES_APPROVE = 'approve'
export const PURCHASEORDER_MOVEMENTTYPES_COMPLETE = 'complete'
export const PURCHASEORDER_MOVEMENTTYPES_CANCELCHECK = 'cancelcheck'
export const PURCHASEORDER_MOVEMENTTYPES_CANCELAPPROVE = 'cancelapprove'

export const PATIENTS_MOVEMENTTYPES_CREATE = 'patientcreate'
export const PATIENTS_MOVEMENTTYPES_UPDATE = 'patientupdate'
export const PATIENTS_MOVEMENTTYPES_DELETE = 'patientdelete'
export const PATIENTS_MOVEMENTTYPES_CHECK = 'patientcheck'
export const PATIENTS_MOVEMENTTYPES_APPROVE = 'patientapprove'
export const PATIENTS_MOVEMENTTYPES_COMPLETE = 'patientcomplete'
export const PATIENTS_MOVEMENTTYPES_CANCELCHECK = 'patientcancelcheck'
export const PATIENTS_MOVEMENTTYPES_CANCELAPPROVE = 'patientcancelapprove'



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

export const ANNUALTYPES = [
    { Name: "Çalışıyor", value: 0, color: 'green' },
    { Name: "İzinli", value: 1, color: 'red' },
]

export const DELIVERY_TYPE_PATIENT = 0
export const DELIVERY_TYPE_WAREHOUSE = 1
export const DELIVERY_TYPES = [
    { Name: { tr: 'Hastaya', en: 'To Patient' }, value: DELIVERY_TYPE_PATIENT, key: DELIVERY_TYPE_PATIENT },
    { Name: { tr: 'Ambara', en: 'To Warehouse' }, value: DELIVERY_TYPE_WAREHOUSE, key: DELIVERY_TYPE_WAREHOUSE },
]

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
                { id: 4, subtitle: Literals.Breakdowns.Page.Pageheader[Profile.Language], url: "/Breakdowns", permission: checkAuth('breakdownview') },
                { id: 5, subtitle: Literals.Mainteancies.Page.Pageheader[Profile.Language], url: "/Mainteancies", permission: checkAuth('mainteanceview') },
                { id: 6, subtitle: Literals.Placeviews.Page.Pageheader[Profile.Language], url: "/Placeviews", permission: checkAuth('placeviewview') },
                { id: 7, subtitle: Literals.Companycashmovements.Page.Pageheader[Profile.Language], url: "/Companycashmovements", permission: checkAuth('companycashmovementview') },
                { id: 8, subtitle: Literals.Patientscases.Page.Pageheader[Profile.Language], url: "/Patientscases", permission: checkAuth('patientview') },
                { id: 9, subtitle: Literals.Patientfollowup.Page.Pageheader[Profile.Language], url: "/Patientfollowup", permission: checkAuth('patientview') },
            ]
        },
        {
            id: 2,
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
            id: 3,
            title: Sidebarliterals.Patients[Profile.Language],
            isOpened: false,
            icon: <Tb3DRotate className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Preregistrations.Page.Pageheader[Profile.Language], url: "/Preregistrations", permission: checkAuth('preregistrationview') },
                { id: 3, subtitle: Literals.Patients.Page.Pageheader[Profile.Language], url: "/Patients", permission: checkAuth('patientview') },
                { id: 4, subtitle: Literals.Patientdefines.Page.Pageheader[Profile.Language], url: "/Patientdefines", permission: checkAuth('patientdefineview') },
                { id: 5, subtitle: Literals.Patientcashmovements.Page.Pageheader[Profile.Language], url: "/Patientcashmovements", permission: checkAuth('patientcashmovementview') },
                { id: 6, subtitle: Literals.Careplans.Page.Pageheader[Profile.Language], url: "/Careplans", permission: checkAuth('careplanview') },
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
            ]
        },
        {
            id: 6,
            title: Sidebarliterals.System[Profile.Language],
            isOpened: false,
            icon: <TbGauge className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Rules.Page.Pageheader[Profile.Language], url: "/Rules", permission: checkAuth('ruleview') },
                { id: 2, subtitle: Literals.Mailsettings.Page.Pageheader[Profile.Language], url: "/Mailsettings", permission: checkAuth('mailsettingview') },
                { id: 3, subtitle: Literals.Printtemplates.Page.Pageheader[Profile.Language], url: "/Printtemplates", permission: checkAuth('printtemplateview') },
                { id: 4, subtitle: Literals.Appreports.Page.Pageheader[Profile.Language], url: "/Appreports", permission: checkAuth('admin') },
                { id: 5, subtitle: t('Pages.Log.Page.Header'), url: "/Logs", permission: checkAuth('admin') },
            ]
        },
        {
            id: 7,
            title: Sidebarliterals.Setting[Profile.Language],
            isOpened: false,
            icon: <MdSettings className=' text-[#2355a0]' />,
            items: [
                { id: 1, subtitle: Literals.Roles.Page.Pageheader[Profile.Language], url: "/Roles", permission: checkAuth('roleview') },
                { id: 2, subtitle: Literals.Departments.Page.Pageheader[Profile.Language], url: "/Departments", permission: checkAuth('departmentview') },
                { id: 3, subtitle: Literals.Users.Page.Pageheader[Profile.Language], url: "/Users", permission: checkAuth('userview') },
                { id: 4, subtitle: Literals.Cases.Page.Pageheader[Profile.Language], url: "/Cases", permission: checkAuth('caseview') },
                { id: 5, subtitle: Literals.Units.Page.Pageheader[Profile.Language], url: "/Units", permission: checkAuth('unitview') },
                { id: 5, subtitle: Literals.Stocktypes.Page.Pageheader[Profile.Language], url: "/Stocktypes", permission: checkAuth('stocktypeview') },
                { id: 5, subtitle: Literals.Stocktypegroups.Page.Pageheader[Profile.Language], url: "/Stocktypegroups", permission: checkAuth('stocktypegroupview') },
                { id: 6, subtitle: Literals.Stockdefines.Page.Pageheader[Profile.Language], url: "/Stockdefines", permission: checkAuth('stockdefineview') },
                { id: 7, subtitle: Literals.Files.Page.Pageheader[Profile.Language], url: "/Files", permission: checkAuth('fileview') },
                { id: 8, subtitle: Literals.Floors.Page.Pageheader[Profile.Language], url: "/Floors", permission: checkAuth('floorview') },
                { id: 9, subtitle: Literals.Rooms.Page.Pageheader[Profile.Language], url: "/Rooms", permission: checkAuth('roomview') },
                { id: 10, subtitle: Literals.Beds.Page.Pageheader[Profile.Language], url: "/Beds", permission: checkAuth('bedview') },
                { id: 11, subtitle: Literals.Patientcashregisters.Page.Pageheader[Profile.Language], url: "/Patientcashregisters", permission: checkAuth('patientcashregisterview') },
                { id: 12, subtitle: Literals.Patienttypes.Page.Pageheader[Profile.Language], url: "/Patienttypes", permission: checkAuth('patienttypeview') },
                { id: 13, subtitle: Literals.Costumertypes.Page.Pageheader[Profile.Language], url: "/Costumertypes", permission: checkAuth('costumertypeview') },
                { id: 14, subtitle: Literals.Periods.Page.Pageheader[Profile.Language], url: "/Periods", permission: checkAuth('periodview') },
                { id: 15, subtitle: Literals.Tododefines.Page.Pageheader[Profile.Language], url: "/Tododefines", permission: checkAuth('tododefineview') },
                { id: 16, subtitle: Literals.Todogroupdefines.Page.Pageheader[Profile.Language], url: "/Todogroupdefines", permission: checkAuth('todogroupdefineview') },
                { id: 17, subtitle: Literals.Usagetypes.Page.Pageheader[Profile.Language], url: "/Usagetypes", permission: checkAuth('usagetypeview') },
                { id: 18, subtitle: Literals.Professions.Page.Pageheader[Profile.Language], url: "/Professions", permission: checkAuth('professionview') },
                { id: 19, subtitle: Literals.Supportplans.Page.Pageheader[Profile.Language], url: "/Supportplans", permission: checkAuth('supportplanview') },
                { id: 20, subtitle: Literals.Supportplanlists.Page.Pageheader[Profile.Language], url: "/Supportplanlists", permission: checkAuth('supportplanlistview') },
                { id: 21, subtitle: Literals.Helpstatus.Page.Pageheader[Profile.Language], url: "/Helpstatus", permission: checkAuth('helpstatuview') },
                { id: 22, subtitle: Literals.Makingtypes.Page.Pageheader[Profile.Language], url: "/Makingtypes", permission: checkAuth('makingtypeview') },
                { id: 23, subtitle: Literals.Ratings.Page.Pageheader[Profile.Language], url: "/Ratings", permission: checkAuth('ratingview') },
                { id: 24, subtitle: Literals.Requiredperiods.Page.Pageheader[Profile.Language], url: "/Requiredperiods", permission: checkAuth('requiredperiodview') },
            ]
        },
    ]
    return defaultpages
}

export const LIVE_OPTION_LIVING = false
export const LIVE_OPTION_NOT_LIVING = true
export const LIVE_OPTION = [
    { key: 0, text: { en: "No, Not Living", tr: 'Hayır, Yaşamıyor' }, value: LIVE_OPTION_NOT_LIVING },
    { key: 1, text: { en: "Yes, Living", tr: 'Evet, Yaşıyor' }, value: LIVE_OPTION_LIVING },
]


export const GENDER_OPTION_MEN = "0"
export const GENDER_OPTION_WOMEN = "1"
export const GENDER_OPTION = [
    { key: 0, text: { en: "MEN", tr: 'ERKEK' }, value: GENDER_OPTION_MEN },
    { key: 1, text: { en: "WOMEN", tr: 'KADIN' }, value: GENDER_OPTION_WOMEN },
]

export const AFFINITY_OPTION_OWN = "0"
export const AFFINITY_OPTION_STEP = "1"
export const AFFINITY_OPTION = [
    { key: 0, text: { en: "Own", tr: 'Öz' }, value: AFFINITY_OPTION_OWN },
    { key: 1, text: { en: "Step", tr: 'Üvey' }, value: AFFINITY_OPTION_STEP },
]

export const MEDICALBOARDREPORT_OPTION_SPIRITUAL = "Ruhsal"
export const MEDICALBOARDREPORT_OPTION_PHYSICAL = "Bedensel"
export const MEDICALBOARDREPORT_OPTION_MENTAL = "Zihinsel"
export const MEDICALBOARDREPORT_OPTION = [
    { key: 0, text: { tr: "Ruhsal", en: 'Spiritual' }, value: AFFINITY_OPTION_OWN },
    { key: 1, text: { tr: "Bedensel", en: 'Physical' }, value: AFFINITY_OPTION_STEP },
    { key: 2, text: { tr: "Zihinsel", en: 'Mental' }, value: AFFINITY_OPTION_STEP },
]

export const CASE_STATUS_DEACTIVE = -1
export const CASE_STATUS_PASSIVE = 0
export const CASE_STATUS_COMPLETE = 1
export const CASE_STATUS_START = 2

export const CASE_PATIENT_STATUS_PASSIVE = 0
export const CASE_PATIENT_STATUS_ONORGANIZATION = 1
export const CASE_PATIENT_STATUS_FIRST_REGISTER = 2
export const CASE_PATIENT_STATUS_ONHOSPITAL = 3
export const CASE_PATIENT_STATUS_DEATH = 4
export const CASE_PATIENT_STATUS_CHECK = 5
export const CASE_PATIENT_STATUS_LEFT = 6
export const CASE_PATIENT_STATUS_PLACE_CHANGE = 7
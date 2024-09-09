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

export const STOCK_TYPE_WAREHOUSE = 0
export const STOCK_TYPE_PURCHASEORDER = 1
export const STOCK_TYPE_PATIENT = 2
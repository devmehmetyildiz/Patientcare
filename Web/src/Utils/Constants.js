export const ROUTES = {
    DATATABLE: 'Datatable',

    AUTH: 'Auth',
    ROLE: 'Roles',
    USER: 'Users',

    ACTIVEPATIENT: 'Activepatient',
    PATIENT: 'Patients',
    TODO: 'Todo',

    PATIENTTYPE: 'Patienttypes',
    PATIENTREPORT: 'Patientreport',
    PATIENTDEFINE: 'Patientdefines',

    COSTUMERTYPE: 'Costumertypes',
    CASE: 'Cases',
    DEPARTMENT: 'Departments',
    FILE: 'Files',
    STATION: 'Stations',
    STOCKDEFINE: 'Stockdefines',
    UNIT: 'Units',
    ROOM: 'Rooms',
    BED: 'Beds',
    FLOOR: 'Floors',

    PURCHASEORDER: 'Purchaseorders',
    PURCHASEORDERSTOCK: 'Purchaseorderstocks',
    PURCHASEORDERSTOCKMOVEMENT: 'Purchaseorderstockmovements',
    DEACTIVESTOCK: 'Deactivestock',
    STOCK: 'Stocks',
    STOCKMOVEMENT: 'Stockmovements',
    WAREHOUSE: 'Warehouses',
    PATIENTSTOCK: 'Patientstocks',
    PATIENTSTOCKMOVEMENT: 'Patientstockmovements',

    TODODEFINE: 'Tododefines',
    TODOGROUPDEFINE: 'Todogroupdefines',
    PATIENTMOVEMENT: 'Patientmovements',
    CHECKPERIOD: 'Checkperiods',
    PERIOD: 'Periods',

    MAILSETTING: 'Mailsettings',
    PRINTTEMPLATE: 'Printtemplates',
    RULE: 'Rules'

}


export const MOVEMENTTYPES = [
    { Name: "Stokdan düşme", value: -1, color: 'gray' },
    { Name: "Transfer", value: 0, color: 'green' },
    { Name: "Stok Ekleme", value: 1, color: 'orange' },
]

export const PATIENTMOVEMENTTYPE = [
    { Name: "İşlem Yok", value: 0 },
    { Name: "Kuruma Giriş", value: 1 },
    { Name: "İlk Kayıt", value: 2 },
    { Name: "Hastane Çıkış", value: 3 },
    { Name: "Hastane Giris", value: 4 },
    { Name: "Ölüm", value: 5 },
    { Name: "Kontrol", value: 6 },
    { Name: "Kurumdan Cıkıs", value: 7 },
]
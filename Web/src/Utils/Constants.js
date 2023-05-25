export const ROUTES = {
    DATATABLE: 'Datatable',

    AUTH: 'Auth',
    ROLE: 'Roles',
    USER: 'Users',

    ACTIVEPATIENT: 'Activepatient',
    PATIENT: 'Patient',
    TODO: 'Todo',

    PATIENTTYPE: 'Patienttype',
    PATIENTREPORT: 'Patientreport',
    PATIENTDEFINE: 'Patientdefine',

    COSTUMERTYPE: 'Costumertype',
    CASE: 'Case',
    DEPARTMENT: 'Department',
    FILE: 'File',
    STATION: 'Stations',
    STOCKDEFINE: 'Stockdefine',
    UNIT: 'Unit',

    PURCHASEORDER: 'Purchaseorder',
    PURCHASEORDERSTOCK: 'Purchaseorderstock',
    PURCHASEORDERSTOCKMOVEMENT: 'Purchaseorderstockmovement',
    DEACTIVESTOCK: 'Deactivestock',
    STOCK: 'Stock',
    STOCKMOVEMENT: 'Stockmovement',
    WAREHOUSE: 'Warehouse',
    PATIENTSTOCK: 'Patientstock',
    PATIENTSTOCKMOVEMENT: 'Patientstockmovement',
    TODODEFINE: 'Tododefine',
    TODOGROUPDEFINE: 'Todogroupdefine',
    PATIENTMOVEMENT: 'Patientmovement',
    CHECKPERIOD: 'Checkperiod',
    PERIOD: 'Period',
    MAILSETTING: 'Mailsetting',
    PRINTTEMPLATE: 'Printtemplate',

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
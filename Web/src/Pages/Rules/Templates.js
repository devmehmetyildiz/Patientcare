const breakdownmainteanciesrule = `
const axios = require('axios')
const interval = 1000
const secret = process.env.APP_SESSION_SECRET
const userroleurl = process.env.USERROLE_URL
const warehouseurl = process.env.WAREHOUSE_URL

const notificationProcess = async () => {
    try {
        console.log("/////// JOB BAŞLADI ///////")
        const users = await getUsers()
        const roles = await getRoles()
        const breakdowns = await getBreakdowns()
        const mainteancies = await getMainteancies()

        let notifications = []
        users.forEach(user => {
            const isValid = checkRolesfornotification(user.Roleuuids, roles)
            if (isValid) {
                if (breakdowns.length > 0) {
                    notifications.push({
                        UserID: user?.Uuid,
                        Notificationtype: 'Information',
                        Notificationtime: Date.now.toString(),
                        Subject: 'Aktuel Arızalar',
                        Message: 'Aktif' + breakdowns.length +' arıza var !',
                        Isshowed: false,
                        Isreaded: false,
                        Pushurl: '/Breakdowns'
                    })
                }
                if (mainteancies.length > 0) {
                    notifications.push({
                        UserID: user?.Uuid,
                        Notificationtype: 'Information',
                        Notificationtime: Date.now.toString(),
                        Subject: 'Aktuel Bakım Talepleri',
                        Message: 'Aktif' + mainteancies.length +' bakım var !',
                        Isshowed: false,
                        Isreaded: false,
                        Pushurl: '/Mainteancies'
                    })
                }
            }
        })
        if (notifications.length > 0) {
            notifications.forEach(async (notification) => {
                await axios({
                    method: 'POST',
                    url: userroleurl + 'Usernotifications',
                    headers: {
                        session_key: secret
                    },
                    data: notification
                })
            })
            console.log('notifications.length adet bildirim gönderildi')
        }
    }
    catch (error) {
        console.log("error", error)
    }
}

const checkRolesfornotification = (roleUuids, roles) => {
    let valid = false
    roleUuids.forEach(roleUuid => {
        const role = (roles || []).find(u => u.Uuid === roleUuid?.RoleID)
        const privileges = (role?.Privileges || []).map(u => { return u.code })
        if (privileges.includes('admin')) {
            valid = true
        }
    })
    return valid
}

const getBreakdowns = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: warehouseurl + 'Breakdowns',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => !u.Iscompleted)
    }
    catch (error) {
        throw error
    }
}

const getMainteancies = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: warehouseurl + 'Mainteancies',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => !u.Iscompleted)
    }
    catch (error) {
        throw error
    }
}

const getUsers = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: userroleurl + 'Users',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}

const getRoles = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: userroleurl + 'Roles',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}


setTimeout(() => {
    notificationProcess()
}, interval)
`
const patienttodoccreaterule = `
const axios = require('axios')
const interval = 1000 * 60
const secret = process.env.APP_SESSION_SECRET
const settingurl = process.env.SETTING_URL
const businessurl = process.env.BUSINESS_URL

const patienttodoProcess = async () => {
    try {
        console.log("/////// JOB BAŞLADI ///////")
        const caseresponse = getCases()
        const tododefineresponse = getTododefines()
        const periodresponse = getPeriods()
        const patientresponse = getPatients()
        const todosresponse = getTodos()

        const responses = await Promise.all([
            caseresponse,
            tododefineresponse,
            periodresponse,
            patientresponse,
            todosresponse
        ])

        let cases = []
        let tododefines = []
        let periods = []
        let patients = []
        let todos = []

        cases = responses[0]?.data
        tododefines = responses[1]?.data
        periods = responses[2]?.data
        patients = responses[3]?.data
        todos = responses[4]?.data

        const Datetime = new Date()
        console.log("Checkpatientstarted at", Datetime);
        (patients || []).filter(u => u.CaseID && !u.Iswaitingactivation).forEach(patient => {
            checkPatientroutine(patient, cases, tododefines, periods, todos, Datetime)
        })
    }
    catch (error) {
        console.log("error", error)
    }
}

const checkPatientroutine = async (patient, cases, tododefines, periods, todos, Datetime) => {

    const now = Datetime;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = hours + ':' + minutes;
    let todosthatwillcreate = []
    console.log("patient check started -> ", patient.Uuid)
    const patientcase = (cases || []).find(u => u.Uuid === patient.CaseID)

    if (patientcase && patientcase.Isroutinework) {
        const patienttodos = patient.Tododefineuuids.map(uuid => {
            return (tododefines || []).filter(u => u.Isactive).find(u => u.Uuid === uuid.TododefineID)
        }).filter(u => u);

        for (const todo of patienttodos) {

            const todoperiods = todo.Perioduuids.map(uuid => {
                return (periods || []).filter(u => u.Isactive).find(u => u.Uuid === uuid.PeriodID)
            }).filter(u => u)

            if ((todoperiods || []).find(u => u.Occuredtime === currentTime)) {

                let willcreateroutine = false;
                const foundedlasttodo = ((todos || []).sort((a, b) => b.Id - a.Id).find(u =>
                    u.PatientID === patient?.Uuid &&
                    u.TododefineID === todo?.Uuid
                ))

                if (!foundedlasttodo) {
                    willcreateroutine = true
                } else {
                    if (isAllowedDate(foundedlasttodo.Createtime, todo?.Dayperiod)) {
                        willcreateroutine = true
                    }
                }

                if (willcreateroutine) {


                    const foundedperiod = todoperiods.find(u => u.Occuredtime === currentTime)
                    if (foundedperiod) {
                        todosthatwillcreate.push({
                            TododefineID: todo.Uuid,
                            Checktime: foundedperiod.Checktime,
                            Willapprove: todo.IsNeedactivation || false,
                            Isapproved: false,
                            IsCompleted: !todo.IsRequired || true,
                            Occuredtime: currentTime
                        })
                    }
                }
            }
        }
    }
    console.log("patient check ended -> ", patient.Uuid)
    console.log("Patient routine founded->", todosthatwillcreate.length)
    if (todosthatwillcreate.length > 0) {
        const reqdata = todosthatwillcreate.map((u, index) => {
            return { ...u, Order: index + 1 }
        })

        try {
            await axios({
                url: businessurl + "Todos/AddPatienttodolist",
                method: "POST",
                headers: {
                    session_key: secret
                },
                data: {
                    PatientID: patient.Uuid,
                    Todos: reqdata
                }
            })
        } catch (error) {
            throw error
        }
    }
}

const getCases = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: settingurl + 'Cases',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => u.Isactive)
    }
    catch (error) {
        throw error
    }
}
const getTododefines = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: settingurl + 'Tododefines',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => u.Isactive)
    }
    catch (error) {
        throw error
    }
}
const getPeriods = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: settingurl + 'Periods',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => u.Isactive)
    }
    catch (error) {
        throw error
    }
}

const getPatients = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: businessurl + 'Patients',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => u.Isactive)
    }
    catch (error) {
        throw error
    }
}

const getTodos = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: businessurl + 'Todos',
            headers: {
                session_key: secret
            },
        })
        return response?.data.filter(u => u.Isactive)
    }
    catch (error) {
        throw error
    }
}

setInterval(() => {
    patienttodoProcess()
}, interval)
`
const personelshifteditorrule = `
const axios = require('axios')
const interval = 1000
const secret = process.env.APP_SESSION_SECRET
const businesseurl = process.env.BUSINESS_URL

const editorProcess = async () => {
    try {
        console.log("/////// JOB BAŞLADI ///////")
        const currentdate = new Date()
        const currentday = currentdate.getDay().toString()
        const shiftrequests = await getShiftrequests()
        const shifts = await getShifts()
        const currentShiftrequest = getCurrentshiftrequest((shiftrequests || []))
        const currentShift = getCurrentshift((shifts || []))
        if (!currentShiftrequest) {
            console.log("Shift request bulunamadı")
            return
        }
        const personelShiftsandshiftrequest = await getPersonelshifts(currentShiftrequest?.Uuid)
        const personelShifts = personelShiftsandshiftrequest?.personelshifts
        if (!personelShifts) {
            console.log("Personel shift requests bulunamadı")
            return
        }
        const personels = await getPersonels()
        for (const personel of (personels || [])) {
            const personelshift = (personelShifts || []).find(u => u.PersonelID === personel?.Uuid && u.ShiftID === currentShift?.Uuid && u.Occuredday === currentday)
            if (!personelshift) {
                //personelin bu vardiyada işi yok
                console.log("personelin bu vardiyada işi yok")
                if (personel?.ShiftID || personel?.FloorID || personel?.Iswildcard) {
                    const newpersonel = {
                        ...personel,
                        ShiftID: null,
                        FloorID: null,
                        Iswildcard: false
                    }
                    await editPersonels(newpersonel)
                    console.log("personel cleared with uuid" , personel?.Uuid)
                }
            } else {
                if ((personel?.FloorID !== personelshift?.FloorID) || ((personel?.ShiftID !== personelshift?.ShiftID))) {
                    const newpersonel = {
                        ...personel,
                        ShiftID: personelshift?.ShiftID,
                        FloorID: personelshift?.FloorID,
                        Iswildcard: false
                    }
                    await editPersonels(newpersonel)
                    console.log("personel filled with uuid" , personel?.Uuid)
                }
            }
        }

    }
    catch (error) {
        console.log("error", error)
    }
}

const getCurrentshiftrequest = (shiftRequests) => {
    const now = new Date();
    for (const shiftRequest of shiftRequests) {
        const startDate = new Date(shiftRequest.Startdate);
        const endDate = new Date(shiftRequest.Enddate);
        if (startDate <= now && endDate >= now) {
            return shiftRequest;
        }
    }
    return null;
}

getCurrentshift = (shifts) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    for (const shift of (shifts || [])) {
        const [startHour, startMinutes] = (shift?.Starttime || '').split(':').map(Number);
        const [endHour, endMinutes] = (shift?.Endtime || '').split(':').map(Number);

        const currentTimeInMinutes = currentHour * 60 + currentMinutes;
        const startTimeInMinutes = startHour * 60 + startMinutes;
        const endTimeInMinutes = endHour * 60 + endMinutes;

        if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
            return shift;
        }
    }
    return null;
}

const getShiftrequests = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: businesseurl + 'Shifts/GetShiftrequests',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}

const getPersonels = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: businesseurl + 'Personels',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}

const getShifts = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: businesseurl + 'Shifts',
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}

const editPersonels = async (data) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: businesseurl + 'Personels',
            headers: {
                session_key: secret
            },
            data
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}

const getPersonelshifts = async (shiftRequestid) => {
    try {
        const response = await axios({
            method: 'GET',
            url: businesseurl + 'Shifts/GetPersonelshifts/' + shiftRequestid,
            headers: {
                session_key: secret
            },
        })
        return response?.data
    }
    catch (error) {
        throw error
    }
}


setInterval(() => {
    editorProcess()
}, interval)
`


export { breakdownmainteanciesrule, patienttodoccreaterule,personelshifteditorrule }
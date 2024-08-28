const Formatdate = (date, trFormat) => {
    if (!date) {
        return ''
    }
    const currentDate = date ? new Date(date || '') : new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = trFormat ? `${day}-${month}-${year}` : `${year}-${month}-${day}`;
    return formattedDate
}

const Formatfulldate = (date) => {
    const currentDate = date ? new Date(date || '') : null;
    if (!currentDate) {
        return ''
    }
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const min = String(currentDate.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hour}:${min}`;
    return formattedDate
}

const Getshiftstartdate = (inputdate) => {
    const lastdaydate = new Date(inputdate)
    lastdaydate.setMonth(lastdaydate.getMonth() + 1)
    lastdaydate.setDate(0)
    const lastday = lastdaydate.getDate()
    switch (lastday) {
        case 28:
            return 15
        case 29:
            return 16
        case 30:
            return 16
        case 31:
            return 17
        default:
            return 16
    }
}

const Getshiftlastdate = (inputdate) => {
    const startDay = new Date(inputdate).getDate()
    let lastDay = Getshiftstartdate(inputdate)
    if (lastDay === startDay) {
        const start = new Date(inputdate)
        start.setMonth(start.getMonth() + 1)
        start.setDate(0)
        lastDay = start.getDate()
    } else {
        lastDay--;
    }
    return lastDay
}

const Getdateoptions = (limit = 4) => {

    function getMonthName(monthIndex) {
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        return monthNames[monthIndex];
    }

    const options = []

    for (let index = -limit; index < limit; index++) {
        const firstShift = new Date()
        firstShift.setMonth(firstShift.getMonth() + index)
        const lastday = Getshiftstartdate(firstShift)

        const isCurrentmonth = index === 0
        const isStart = lastday > firstShift.getDate()

        firstShift.setDate(1)
        options.push({
            key: Math.random(),
            text: `${getMonthName(firstShift.getMonth())} ${firstShift.getFullYear()}- 1 ${(isCurrentmonth && isStart) ? '(Aktif)' : ''}`,
            value: firstShift.toDateString()
        })

        const secondShift = new Date(firstShift)
        secondShift.setDate(lastday)
        options.push({
            key: Math.random(),
            text: `${getMonthName(secondShift.getMonth())} ${secondShift.getFullYear()}- 2 ${(isCurrentmonth && !isStart) ? '(Aktif)' : ''}`,
            value: secondShift.toDateString()
        })
    }
    return options
}


export { Formatdate, Formatfulldate, Getdateoptions, Getshiftstartdate, Getshiftlastdate }
export default Formatdate
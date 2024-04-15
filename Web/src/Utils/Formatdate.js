const Formatdate = (date) => {
    if (!date) {
        return ''
    }
    const currentDate = date ? new Date(date || '') : new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
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

const Getdateoptions = () => {

    function getMonthName(monthIndex) {
        const monthNames = ["Ocak", "Şubat", "Mart", "Mayıs", "Nisan", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        return monthNames[monthIndex];
    }

    const options = []
    for (let index = -2; index < 2; index++) {
        const currentDate = new Date();
        let currentDay = currentDate.getDate()
        const currentMonth = currentDate.getMonth()

        if (currentDay > 16) {
            currentDay = 16
        } else {
            currentDay = 1
        }

        const todayfirst = new Date();
        const todaysecond = new Date();
        todayfirst.setMonth(todayfirst.getMonth() + index)
        todayfirst.setDate(1)
        todaysecond.setMonth(todaysecond.getMonth() + index)
        todaysecond.setDate(16)
        const isTodayfirst = todayfirst.getDate() === currentDay && todayfirst.getMonth() === currentMonth
        const isTodaysecond = todaysecond.getDate() === currentDay && todaysecond.getMonth() === currentMonth
        options.push({ key: Math.random(), text: `${getMonthName(todayfirst.getMonth())} - 1 ${isTodayfirst ? '(Aktif)' : ''}`, value: todayfirst.toDateString() })
        options.push({ key: Math.random(), text: `${getMonthName(todaysecond.getMonth())} - 2 ${isTodaysecond ? '(Aktif)' : ''}`, value: todaysecond.toDateString() })
    }
    return options
}


export { Formatdate, Formatfulldate, Getdateoptions }
export default Formatdate
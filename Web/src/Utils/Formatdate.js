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

export { Formatdate, Formatfulldate }
export default Formatdate
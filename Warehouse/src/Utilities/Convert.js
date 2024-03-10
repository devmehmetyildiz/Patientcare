const formatDate = (date) => {
    const currentDate = typeof date === 'string' ? new Date(date || '') : date ? date : new Date()
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

module.exports = {
    formatDate
}
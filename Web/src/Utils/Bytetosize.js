const Bytetosize = (bytes) => {
    const MB = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

    if (bytes === 0) {
        return '0'
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(MB)).toString(), 10)

    if (i === 0) {
        return `${bytes} ${sizes[i]}`
    }

    return `${(bytes / MB ** i).toFixed(1)} ${sizes[i]}`
}

export default Bytetosize
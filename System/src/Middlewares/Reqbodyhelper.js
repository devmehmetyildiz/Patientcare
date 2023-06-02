const methodsthatwillcheck = [
    'POST',
    'PUT',
    'DELETE'
]

module.exports = (req, res, next) => {
    let isHavebody = req && req.body
    if (isHavebody) {
        if (Array.isArray(req.body)) {
            let bodyarray = req.body
            let newarray = []
            bodyarray.forEach(data => {
                if (data.Id !== undefined && methodsthatwillcheck.includes(req.method)) {
                    delete data.Id;
                }
                if (data.Createduser !== undefined) {
                    delete data.Createduser;
                }
                if (data.Createtime !== undefined) {
                    delete data.Createtime;
                }
                if (data.Updateduser !== undefined) {
                    delete data.Updateduser;
                }
                if (data.Updatetime !== undefined) {
                    delete data.Updatetime;
                }
                if (data.Deleteduser !== undefined) {
                    delete data.Deleteduser;
                }
                if (data.Deletetime !== undefined) {
                    delete data.Deletetime;
                }
                newarray.push({ ...data })
            });
            req.body = newarray
        } else if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
            let data = { ...req.body }
            if (data.Id !== undefined && methodsthatwillcheck.includes(req.method)) {
                delete data.Id;
            }
            if (data.Createduser !== undefined) {
                delete data.Createduser;
            }
            if (data.Createtime !== undefined) {
                delete data.Createtime;
            }
            if (data.Updateduser !== undefined) {
                delete data.Updateduser;
            }
            if (data.Updatetime !== undefined) {
                delete data.Updatetime;
            }
            if (data.Deleteduser !== undefined) {
                delete data.Deleteduser;
            }
            if (data.Deletetime !== undefined) {
                delete data.Deletetime;
            }
            req.body = { ...data }
        }
    }
    next()
}
module.exports = (req, res, next) => {
    let isHavebody = req && req.body
    if (isHavebody) {
        let body = req.body
        const {
            Createduser,
            Createtime,
            Updateduser,
            Updatetime,
            Deleteduser,
            Deletetime
        } = body
        Createduser !== undefined && delete body.Createduser
        Createtime !== undefined && delete body.Createtime
        Updateduser !== undefined && delete body.Updateduser
        Updatetime !== undefined && delete body.Updatetime
        Deleteduser !== undefined && delete body.Deleteduser
        Deletetime !== undefined && delete body.Deletetime
        req.body = { ...body }
    }
    next()
}
const GetInitialconfig = (Profile, metaKey, options) => {

    const additionalHiddenColumns = options?.hiddenColumns || null
    const additionalColumnOrder = options?.columnOrder || null
    const additionalGroupBy = options?.groupBy || null

    let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
    const initialConfig = {
        hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
            return item.key
        }) : additionalHiddenColumns || ["Id", "Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
        columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
            return item.key
        }) : additionalColumnOrder || [],
        groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
            return item.key
        }) : additionalGroupBy || [],
        sortBy: [...(tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible && u.sorting && u.sorting !== 'None').map(u => {
            return u?.sorting === 'Asc' ? { id: u.key, desc: false } : { id: u.key, desc: true }
        }) : [])]
    };
    return initialConfig
}


export default GetInitialconfig
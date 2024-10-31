
import React, { useState } from "react"

export const DataContext = React.createContext()

const DataProvider = ({ children }) => {

    const [values, setValues] = useState([])

    const setForm = (pageName, form) => {
        let newform = []
        Object.keys(form).map(u => {
            newform.push({ key: pageName + '/' + u, value: form[u] })
        })
        setValues([...newform])
    }

    const getForm = (pageName) => {
        let body = {}
        values.forEach(datavalue => {
            const { key } = datavalue
            let obj = key.split('/')
            if (obj && Array.isArray(obj) && obj.length > 1 && obj[0] === pageName) {
                body[obj[1]] = values.find(u => u.key === key)?.value
            }
        })
        return body
    }

    return (
        <DataContext.Provider value={{ values, setValues, setForm, getForm }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataProvider
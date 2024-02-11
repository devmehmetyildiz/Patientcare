
import React, { useEffect, useState } from "react"

export const FormContext = React.createContext()

const FormProvider = ({ children }) => {

    const [formstates, setFormstates] = useState({})
    const [buffer, setBuffer] = useState([])

    useEffect(() => {
        if (buffer.length > 0) {
            setFormstates(prevstate=>({ ...prevstate, [buffer[0]?.key]: buffer[0]?.value }))
            setBuffer(buffer.slice(1))
        }
    }, [buffer])

    const setForm = (pageName, form) => {
        let newform = {}
        Object.keys(form).map(u => {
            newform[pageName + '/' + u] = form[u]
        })
        setFormstates(prevstate => ({ ...prevstate, ...newform }))
    }

    const clearForm = (pageName) => {
        const filteredObject = Object.keys(formstates).reduce((acc, key) => {
            if (!key.startsWith(pageName)) {
                acc[key] = formstates[key];
            }
            return acc;
        }, {});
        setFormstates(filteredObject)
    }

    const getForm = (pageName) => {
        let body = {}
        Object.keys(formstates).forEach(key => {
            let obj = key.split('/')
            if (obj && Array.isArray(obj) && obj.length > 1 && obj[0] === pageName) {
                body[obj[1]] = formstates[key]
            }
        })
        return body
    }

    return (
        <FormContext.Provider value={{ formstates, setFormstates, setForm, clearForm, getForm, setBuffer }}>
            {children}
        </FormContext.Provider>
    )
}
export default FormProvider
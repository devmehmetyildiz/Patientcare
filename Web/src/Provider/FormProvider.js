
import React, { useState } from "react"

export const FormContext = React.createContext()

const FormProvider = ({ children }) => {
    const [formstates, setFormstates] = useState({})
    console.log('formstates: ', formstates);

    const setForm = (pageName, form) => {
        let newform = {}
        Object.keys(form).map(u => {
            newform[pageName + '/' + u] = form[u]
        })
        setFormstates({ ...formstates, ...newform })
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

    return (
        <FormContext.Provider value={{ formstates, setFormstates, setForm, clearForm }}>
            {children}
        </FormContext.Provider>
    )
}
export default FormProvider
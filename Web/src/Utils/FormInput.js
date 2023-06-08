import React, { useEffect, useState } from 'react'
import { Form } from 'semantic-ui-react'
import { FormContext } from '../Provider/FormProvider';
export default function FormInput(props) {

    const { name } = props

    const context = React.useContext(FormContext)
    const getStartvalue = () => {
        switch (props.type ? props.type : 'default') {
            case 'number':
                return 0
            case 'date':
                return new Date()
            case 'default':
                return ""
            default:
                return ""
        }
    }

    useEffect(() => {
        !context.formstates[name] && context.setFormstates({ ...context.formstates, [name]: getStartvalue() })
    }, [])
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };
    
    console.log('context.formstates: ', context.formstates);
    return (
        <Form.Input {...props} defaultValue={context.formstates[name]} onChange={(e) => { context.setFormstates({ ...context.formstates, [name]: e.target.value }) }} onKeyPress={(e) => { handleKeyPress(e) }} fluid />
    )
}

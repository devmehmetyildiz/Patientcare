import React, { useEffect, useState } from 'react'
import { Checkbox, Dropdown, Form, Icon, Label, Popup } from 'semantic-ui-react'
import { FormContext } from '../../Provider/FormProvider';
import store from '../..';
import validator from '../../Utils/Validator';
import { AddModal } from '../../Components'
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const Attention = {
    en: "This Area Required",
    tr: "Bu alan zorunludur"
}

const getDefaultvalue = ({ formtype, type, multiple }) => {

    if (formtype === 'checkbox') {
        return false
    }
    if (formtype === 'dropdown' && multiple) {
        return []
    }
    if (type === 'number') {
        return 0
    }
    if (type === 'date') {
        return null
    }
    if (type === 'datetime-local') {
        return null
    }
    if (type === 'time') {
        return null
    }
    return ''
}

const getPropertyprop = (props) => {
    const propertyProp = { ...props }

    propertyProp.isFormvisible && delete propertyProp.isFormvisible
    propertyProp.effect && delete propertyProp.effect
    propertyProp.validationfunc && delete propertyProp.validationfunc
    return propertyProp
}

export default function FormArea(props) {

    const {
        validationfunc,
        validationmessage,
        display,
        additionalicon,
        page,
        isFormvisible,
        disableOnchange,
        effect,
        formtype,
        type,
        multiple,
        search
    } = props

    const state = store.getState()
    const language = state?.Profile?.Language || 'tr'
    const context = React.useContext(FormContext)
    const propertyName = `${page}/${props.name}`
    const propertyBasevalue = context.formstates[propertyName]

    const [property, setProperty] = useState(propertyBasevalue)
    const [captured, setCaptured] = useState(false)
    const [isvalidate, setIsvalidate] = useState(false)

    const propertyProp = getPropertyprop(props)

    const handleKeyPress = (e) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const onKeyUpinput = (e) => {
        e.stopPropagation()
    }

    const getFormtime = React.useCallback(() => {

        const formType = formtype
        switch (formType) {
            case 'dropdown':
                return <Dropdown
                    value={property || getDefaultvalue({ formtype, type, multiple })}
                    clearable
                    search={search || true}
                    fluid
                    selection
                    onChange={(e, data) => {
                        setProperty(data.value)
                        effect && effect()
                    }}
                    {...propertyProp}
                />
            case 'checkbox':
                return <Checkbox toggle className='m-2'
                    checked={property || getDefaultvalue({ formtype, type, multiple })}
                    onClick={(e) => {
                        setProperty(prev => !prev)
                        effect && effect()
                    }}
                />
            default:
                const inputType = props.type
                switch (inputType) {
                    case 'time':
                        return <Form.Input
                            {...propertyProp}
                            icon={display ? true : false}
                            defaultValue={property || getDefaultvalue({ formtype, type, multiple })}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setIsvalidate(res)
                                }
                                setProperty(props.type === 'number' ? parseFloat(e.target.value) : e.target.value)
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                    case 'date':
                        return <Form.Input
                            {...propertyProp}
                            icon={display ? true : false}
                            defaultValue={property || getDefaultvalue({ formtype, type, multiple })}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setIsvalidate(res)
                                }
                                setProperty(e.target.value)
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                    case 'datetime-local':
                        return <Form.Input
                            {...propertyProp}
                            icon={display ? true : false}
                            defaultValue={property || getDefaultvalue({ formtype, type, multiple })}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setIsvalidate(res)
                                }
                                setProperty(e.target.value)
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                    default:
                        return <Form.Input
                            {...propertyProp}
                            icon={display ? true : false}
                            value={property || getDefaultvalue({ formtype, type, multiple })}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setIsvalidate(res)
                                }
                                setProperty(props.type === 'number' ? parseFloat(e.target.value) : e.target.value)
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                }
        }
    }, [])

    useEffect(() => {
        if (propertyBasevalue && !captured) {
            setProperty(propertyBasevalue)
            setCaptured(true)
        }
    }, [propertyBasevalue])

    /*   useEffect(() => {
          if (property && property !== propertyBasevalue) {
              context.setFormstates(prev => ({ ...prev, [propertyName]: property }))
          }
      }, [property]) */


    return (validator.isBoolean(isFormvisible) ? isFormvisible : true) &&
        <Form.Field>
            <div className='flex flex-row m-2'>
                {!props.dontshowlabel && <label className='text-[#000000de]'>{props.placeholder}{props.modal ? <AddModal Content={props.modal} /> : null}</label>}
                {display && <Icon name={display} />}
                {props.required && <Popup
                    trigger={<Icon className='cursor-pointer' name='attention' />}
                    content={<Label color='red' ribbon>{Attention[language]}</Label>}
                    on='click'
                    hideOnScroll
                    position='left center'
                />}
                {props.attention && <Popup
                    trigger={<Icon link name='question circle' />}
                    content={<Label color='blue' ribbon>{props.attention}</Label>}
                    position='left center'
                    on='click'
                />}
                {additionalicon && additionalicon}
                {validationmessage && (!isvalidate && <Popup
                    trigger={<Icon link color='red' name='bell' />}
                    content={<Label color='red' ribbon>{validationmessage}</Label>}
                    position='left center'
                    on='click'
                />)}
            </div>
            {getFormtime()}
        </Form.Field>
}



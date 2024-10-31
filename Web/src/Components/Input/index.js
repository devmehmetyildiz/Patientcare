import React, { useEffect, useState } from 'react'
import { Checkbox, Dropdown, Form, Icon, Label, Popup } from 'semantic-ui-react'
import validator from '../../Utils/Validator';
import { AddModal } from '../../Components'
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { DataContext } from '../../Provider/DataProvider';
import { useSelector } from 'react-redux';

export default function Input(props) {
    const context = React.useContext(DataContext)
    const Profile = useSelector((state) => state.Profile)

    const language = Profile?.Language || 'tr'
    const Attention = {
        en: "This Area Required",
        tr: "Bu alan zorunludur"
    }

    const {
        validationfunc,
        validationmessage,
        display,
        additionalicon,
        page,
        isFormvisible,
        disableOnchange,
        effect,
        name,
        formtype,
        multiple,
        search,
        type,
        dontshowlabel,
        placeholder,
        modal,
        required,
        attention,
        min,
        max
    } = props


    const contextProp = { ...props }

    contextProp.isFormvisible && delete contextProp.isFormvisible
    contextProp.effect && delete contextProp.effect
    contextProp.validationfunc && delete contextProp.validationfunc


    const valueKey = `${page}/${name}`
    const { values, setValues } = context
    const contextValue = values.find((contextval) => contextval.key === valueKey)?.value


    const [value, setValue] = useState(contextValue)
    const [valid, setValid] = useState(false)


    useEffect(() => {
        if (contextValue !== value) {
            setValue(contextValue)
        }
    }, [contextValue])

    const handleKeyPress = (e) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const onKeyUpinput = (e) => {
        e.stopPropagation()
    }

    const setFormvalue = (targetValue) => {
        setValue(targetValue)
        setValues(prev => [...prev.filter(u => u.key !== valueKey), { key: valueKey, value: targetValue }])
    }


    const getFormtime = React.useCallback(() => {
        switch (formtype) {
            case 'dropdown':
                return <Dropdown
                    value={validator.isNotNullorEmpty(value) ? value : (multiple ? [] : null)}
                    clearable
                    search={search ? search : true}
                    fluid
                    selection
                    onChange={(e, data) => {
                        if (validator.isNotNullorEmpty(data.value)) {
                            setFormvalue(data.value)
                        }
                        effect && effect()
                    }}
                    {...contextProp}
                />
            case 'checkbox':
                return <Checkbox
                    toggle
                    className='m-2'
                    checked={value ? true : false}
                    onClick={() => {
                        setFormvalue(value ? !value : true)
                        effect && effect()
                    }}
                />
            default:
                switch (type) {
                    case 'time':
                        return <Form.Input
                            {...contextProp}
                            icon={display ? true : false}
                            defaultValue={value}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setValid(res)
                                }
                                if (e.target.value) {
                                    setFormvalue(e.target.value)
                                }
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                    case 'date':
                        return <Form.Input
                            {...contextProp}
                            icon={display ? true : false}
                            defaultValue={value}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setValid(res)
                                }
                                if (e.target.value) {
                                    setFormvalue(e.target.value)
                                }
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                    case 'datetime-local':
                        return <Form.Input
                            {...contextProp}
                            icon={display ? true : false}
                            defaultValue={value}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setValid(res)
                                }
                                if (e.target.value) {
                                    setFormvalue(e.target.value)
                                }
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid />
                    case 'number':
                        return <Form.Input
                            {...contextProp}
                            icon={display ? true : false}
                            value={value}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setValid(res)
                                }
                                if (/^-?\d*$/.test(e.target.value)) {
                                    const number = parseFloat(e.target.value, 10);

                                    if (e.target.value === "" || (number >= parseFloat(min) && number <= parseFloat(max))) {
                                        setFormvalue(parseFloat(e.target.value))
                                    } else {
                                        setFormvalue(parseFloat(e.target.value))
                                    }
                                } else {
                                    setFormvalue(e.target.value)
                                }
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid
                        />

                    default:
                        return <Form.Input
                            {...contextProp}
                            icon={display ? true : false}
                            value={value || ''}
                            onChange={(e) => {
                                e.preventDefault()
                                if (disableOnchange) {
                                    return
                                }
                                if (validationfunc) {
                                    const res = validationfunc(e.target.value)
                                    setValid(res)
                                }
                                setFormvalue(e.target.value)
                                effect && effect()
                            }}
                            onKeyPress={(e) => { handleKeyPress(e) }}
                            onKeyUp={onKeyUpinput}
                            fluid
                        />
                }
        }
    })

    return (
        (validator.isBoolean(isFormvisible) ? isFormvisible : true) &&
        <Form.Field>
            <div className='flex flex-row m-2'>
                {!dontshowlabel && <label className='text-[#000000de]'>{placeholder}{modal ? <AddModal Content={modal} /> : null}</label>}
                {display && <Icon name={display} />}
                {required && <Popup
                    trigger={<Icon className='cursor-pointer' name='attention' />}
                    content={<Label color='red' ribbon>{Attention[language]}</Label>}
                    on='click'
                    hideOnScroll
                    position='left center'
                />}
                {attention && <Popup
                    trigger={<Icon link name='question circle' />}
                    content={<Label color='blue' ribbon>{attention}</Label>}
                    position='left center'
                    on='click'
                />}
                {additionalicon && additionalicon}
                {validationmessage && (!valid && <Popup
                    trigger={<Icon link color='red' name='bell' />}
                    content={<Label color='red' ribbon>{validationmessage}</Label>}
                    position='left center'
                    on='click'
                />)}
            </div>
            {getFormtime()}
        </Form.Field>
    )
}
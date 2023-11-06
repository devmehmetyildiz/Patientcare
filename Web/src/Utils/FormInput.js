import React, { useEffect, useReducer, useRef, useState } from 'react'
import { Checkbox, Dropdown, Form, Icon, Label, Popup } from 'semantic-ui-react'
import { FormContext } from '../Provider/FormProvider';
import store from '..';
import validator from './Validator';
import AddModal from './AddModal';
export default function FormInput(props) {

    const { validationfunc, validationmessage, display, additionalicon, page, isFormvisible, disableOnchange } = props
    const name = `${page}/${props.name}`
    const context = React.useContext(FormContext)
    const [formdata, setFormdata] = useState(context.formstates)
    const [isvalidate, setIsvalidate] = useState(false)
    const reduxstore = store.getState()
    const language = reduxstore?.Profile?.Language || 'en'
    const Attention = {
        en: "This Area Required",
        tr: "Bu alan zorunludur"
    }

    useEffect(() => {

        if (!validator.isString(Object.keys(formdata).find(u => u === name))) {
            let defaultvalue = null
            if (props.formtype === 'checkbox') {
                defaultvalue = false
            }
            if (props.formtype === 'dropdown') {
                defaultvalue = []
            }
            context.setBuffer((prevArray) => [...prevArray, { key: name, value: defaultvalue }])
        }

        setFormdata({ ...formdata, ...context.formstates })
    }, [context.formstates])


    const handleKeyPress = (e) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const onKeyUpinput = (e) => {
        e.stopPropagation()
    }

    const contextProp = { ...props }
    contextProp.isFormvisible && delete contextProp.isFormvisible
    return (
        (validator.isBoolean(isFormvisible) ? isFormvisible : true) ?
            <React.Fragment>
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
                    {!props.formtype ?
                        <Form.Input icon={display ? true : false} {...contextProp} value={formdata[name] ? formdata[name] : ''} onChange={(e) => {
                            e.preventDefault()
                            if (disableOnchange) {
                                return
                            }
                            if (validationfunc) {
                                const res = validationfunc(e.target.value)
                                setIsvalidate(res)
                            }
                            context.setFormstates({ ...formdata, [name]: e.target.value })
                        }} onKeyPress={(e) => { handleKeyPress(e) }} onKeyUp={onKeyUpinput} fluid >
                        </Form.Input>
                        :
                        <>
                            <>
                                {props.formtype === 'dropdown' ?
                                    <Dropdown value={formdata[name] !== undefined ? formdata[name] : (props.multiple ? [] : '')} {...contextProp} clearable search={props.search ? props.search : true} fluid selection
                                        onChange={(e, data) => {
                                            context.setFormstates({ ...formdata, [name]: data.value })

                                        }} />
                                    : null}
                            </>
                            <>
                                {props.formtype === 'checkbox' ?
                                    <Checkbox toggle className='m-2'
                                        checked={formdata[name] ? (formdata[name] === 1 ? true : (formdata[name] === 0 ? false : formdata[name])) : false}
                                        onClick={(e) => {
                                            context.setFormstates({ ...formdata, [name]: formdata[name] ? !formdata[name] : true })
                                        }}
                                    />
                                    : null}
                            </>
                        </>
                    }
                </Form.Field>

            </React.Fragment>
            : null
    )
}



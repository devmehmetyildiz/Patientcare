import React, { useEffect, useReducer, useState } from 'react'
import { Dropdown, Form, Icon, Label, Popup } from 'semantic-ui-react'
import { FormContext } from '../Provider/FormProvider';
import store from '..';
export default function FormInput(props) {

    const { name } = props

    const context = React.useContext(FormContext)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };
    const reduxstore = store.getState()
    const language = reduxstore?.Profile?.Language || 'en'
    const Attention = {
        en: "This Area Required",
        tr: "Bu alan zorunludur"
    }
    return (
        <Form.Field>
            <div className='flex flex-row m-2'>
                {!props.dontshowlabel && <label className='text-[#000000de]'>{props.placeholder}</label>}
                {props.required && <Popup
                    trigger={<Icon className='cursor-pointer' name='attention' />}
                    content={<Label color='red' ribbon>{Attention[language]}</Label>}
                    on='click'
                    hideOnScroll
                    position='right center'
                />}
                {props.attention && <Popup
                    trigger={<Icon link name='question circle' />}
                    content={<Label color='blue' ribbon>{props.attention}</Label>}
                    position='right center'
                    on='click'
                />}
            </div>
            {!props.formtype ?
                <Form.Input {...props} defaultValue={context.formstates[name]} onChange={(e) => { context.setFormstates({ ...context.formstates, [name]: e.target.value }) }} onKeyPress={(e) => { handleKeyPress(e) }} fluid />
                :
                <Dropdown {...props} fluid selection />
            }

        </Form.Field>
    )
}



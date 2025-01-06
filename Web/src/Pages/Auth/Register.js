import React from 'react'
import img from "../../Assets/img"
import { Button, Form, Grid, Header, Divider } from 'semantic-ui-react'
import formToObject from 'form-to-object'

export default function Register(props) {
    const { history, register, Profile, fillnotification } = props

    const t = Profile?.i18n?.t

    const RegisterHandler = (event) => {
        event.preventDefault()

        if (Profile.isLogging) {
            return false
        }

        const data = formToObject(event.target)
        let errors = []
        if (!data.Username || data.Username === '') {
            errors.push({ type: 'Error', code: t('Appname'), description: t('Pages.Register.Column.UsernameRequired') })
        }
        if (!data.Password || data.Password === '') {
            errors.push({ type: 'Error', code: t('Appname'), description: t('Pages.Register.Column.PasswordReqired') })
        }
        if (!data.Email || data.Email === '') {
            errors.push({ type: 'Error', code: t('Appname'), description: t('Pages.Register.Column.EmailRequired') })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillnotification(error)
            })
        } else {
            register({ data, history })
        }
    }

    return (
        <div style={{ backgroundImage: `url(${img.loginbg})` }} className=' font-Common w-full h-[100vh] justify-center items-center flex bg-gray-100' >
            <div className='bg-white rounded-lg w-4/5 md:w-[40vmin] lg:w-[40vmin]  shadow-sm shadow-white'>
                <div className=' bg-[#2355a0] w-[20%] pb-[20%]   rounded-tl-lg rounded-br-[100%] ' />
                <Grid textAlign='center' verticalAlign='middle'>
                    <Grid.Column verticalAlign='middle'>
                        <div className='w-full flex justify-center items-center'>
                            <img className='w-1/3' src={img.patient} alt="" />
                        </div>
                        <Header as='h3' textAlign='center'>
                            <br />
                            <p className='text-[#2355a0]' >{t('Appname')}</p>
                        </Header>
                        <Form size='large' className='p-4' onSubmit={RegisterHandler}>
                            <Form.Input transparent placeholder={t('Pages.Register.Column.Username')} name="Username" fluid icon='user' iconPosition='left' />
                            <Form.Input type='email' transparent placeholder={t('Pages.Register.Column.Email')} name="Email" fluid icon='mail' iconPosition='left' />
                            <Divider />
                            <Form.Input type='password' transparent placeholder={t('Pages.Register.Column.Password')} name="Password" fluid icon='lock' iconPosition='left' />
                            <Divider />
                            <div className='mt-4 w-full flex justify-end items-center'>
                                <div className='w-1/3 '>
                                    {Profile.isLogging ? <Button loading className='mt-8 !bg-[#2355a0]' color='blue' fluid size='medium' type='submit' >{t('Pages.Register.Column.Register')}</Button>
                                        : <Button className='mt-8 !bg-[#2355a0]' color='blue' fluid size='medium' type='submit' >{t('Pages.Register.Column.Register')}</Button>}
                                </div>
                            </div>
                            <div className='mt-4 flex flex-col justify-center items-center'>
                                <p className='text-[#777] text-sm '>
                                    <span>Terms of Use</span><br />
                                    <span>{`ARMSTeknoloji ${new Date().getFullYear()}`}</span></p>
                            </div>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        </div>
    )
}
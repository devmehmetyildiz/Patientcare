
import React from 'react'
import img from "../../Assets/img"
import { Button, Form, Grid, Header, Divider, Icon } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import { Link } from 'react-router-dom'
import config from '../../Config'

export default function Login(props) {

    const { history, location, logIn, Profile, fillnotification  } = props

    const t = Profile?.i18n?.t

    const version = `V${config.version}`

    const LoginHandler = (event) => {
        event.preventDefault()

        const params = new URLSearchParams(location.search);
        const redirecturl = params.get('redirecturl') && params.get('redirecturl') !== "/" ? params.get('redirecturl') : null;

        if (Profile.isLogging) {
            return false
        }
        const data = formToObject(event.target)
        if (data.Username && data.Password) {
            data.grant_type = "password"
            let requrest = {
                data, history
            }
            redirecturl && (requrest.redirectUrl = redirecturl)
            logIn(requrest)
        } else {
            fillnotification({ type: 'Error', code: t('Appname'), description: t('Pages.Login.Messages.EmailOrPasswordRequired') })
        }
    }

    return (
        <div style={{ backgroundImage: `url(${img.loginbg})`, backgroundPosition: 'center', backgroundSize: 'cover' }} className=' font-Common w-full h-[100vh] justify-center items-center flex bg-gray-100' >
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
                        <Form size='large' className='p-4' onSubmit={LoginHandler}>
                            <Form.Input transparent placeholder={t('Pages.Login.Column.Username')} name="Username" fluid icon='user' iconPosition='left' />
                            <Divider />
                            <Form.Input type='password' transparent placeholder={t('Pages.Login.Column.Password')} name="Password" fluid icon='lock' iconPosition='left' />
                            <Divider />
                            <div className='mt-4 w-full flex flex-col justify-end items-end'>
                                <Link to='/Forgetpassword' className='text-[#3d3d3d] text-sm whitespace-nowrap'><Icon className='text-[#2355a0]' name='key' /> {t('Pages.Login.Column.Passwordforget')}</Link>
                                <div className='w-1/2 lg:w-1/3 mt-2'>
                                    <Button loading={Profile.isLogging} className='mt-8 !bg-[#2355a0] !text-white whitespace-nowrap' fluid size='medium' >{t('Pages.Login.Column.Login')}</Button>
                                </div>
                            </div>
                            <div className='mt-4 flex flex-col justify-center items-center'>
                                <p className='text-[#777] text-sm '>
                                    <span>{version}</span><br />
                                    <span>{`ARMSTeknoloji ${new Date().getFullYear()}`}</span>
                                </p>
                            </div>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        </div>
    )
}
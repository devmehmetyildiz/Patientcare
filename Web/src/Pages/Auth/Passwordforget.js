import React, { Component } from 'react'
import img from "../../Assets/img"
import { Button, Form, Grid, Header, Divider } from 'semantic-ui-react'
import formToObject from 'form-to-object'

export default class Passwordforget extends Component {

  render() {
    const { Profile } = this.props

    return (
      <div style={{ backgroundImage: `url(${img.loginbg})` }} className=' font-Common w-full h-[100vh] justify-center items-center flex bg-gray-100' >
        <div className='bg-white rounded-lg w-4/5 md:w-[40vmin] lg:w-[40vmin]  shadow-sm shadow-white'>
          <div className=' bg-[#2355a0] w-[20%] pb-[20%]   rounded-tl-lg rounded-br-[100%] ' />
          <Grid textAlign='center' verticalAlign='middle'>
            <Grid.Column verticalAlign='middle'>
              <div className='w-full flex justify-center items-center'>
                <img className='w-1/3' src={img.translatoricon} alt="" />
              </div>
              <Header as='h3' textAlign='center'>
                <br />
                <p className='text-[#2355a0]' >Elder Camp Hasta Bakım Uygulaması</p>
              </Header>
              <Header as='h4' color='blue' textAlign='center'>
                <p className='text-[#2355a0]' >Parolamı Unuttum</p>
              </Header>
              <Form size='large' className='p-4' onSubmit={this.RegisterHandler}>
                <Form.Input type='email' transparent placeholder="E-Posta" name="Email" fluid icon='mail' iconPosition='left' />
                <Divider />
                <div className='mt-4 w-full flex justify-end items-center'>
                  <div className='w-1/3 '>
                    {Profile.isLogging ? <Button loading className='mt-4 !bg-[#2355a0] !text-white' fluid size='medium' >Gönder</Button>
                      : <Button className='mt-4 !bg-[#2355a0] !text-white' fluid size='medium' type='submit' >Gönder</Button>}
                  </div>
                </div>
                <div className='mt-4 flex flex-col justify-center items-center'>
                  <p className='text-[#777] text-sm '>
                    <span>Terms of Use</span><br />
                    <span>ARMSTeknoloji 2022</span></p>
                </div>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    )
  }
  RegisterHandler = (event) => {
    event.preventDefault()
    const { Createpasswordforget, Profile, fillnotification } = this.props

    if (Profile.isLogging) {
      return false
    }

    const data = formToObject(event.target)
    let errors = []
    if (!data.Email || data.Email === '') {
      errors.push({ type: 'Error', code: 'Kayıt İşlemi', description: 'lütfen mail adresi giriniz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillnotification(error)
      })
    } else {
      Createpasswordforget({ email: data.Email })
    }
  }
}

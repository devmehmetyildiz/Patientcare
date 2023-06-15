import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'

export default class PatienttypesEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }

  componentDidMount() {
    const { GetPatienttype, match, history } = this.props
    if (match.params.PatienttypeID) {
      GetPatienttype(match.params.PatienttypeID)
    } else {
      history.push("/Patienttypes")
    }
  }

  componentDidUpdate() {
    const { Patienttypes, removePatienttypenotification } = this.props
    Notification(Patienttypes.notifications, removePatienttypenotification)
  }

  render() {

    const { Patienttypes } = this.props
    const { selected_record, isLoading, isDispatching } = Patienttypes

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]' >
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Patienttypes"}>
                  <Breadcrumb.Section >Hasta Türleri</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Field>
                <label className='text-[#000000de]'>Hasta Tür Adı</label>
                <Form.Input placeholder="Hasta Tür Adı" name="Name" fluid defaultValue={selected_record.Name} />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Patienttypes">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Güncelle</Button>
              </div>
            </Form>
          </div>
        </div>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPatienttypes, history, fillPatienttypenotification, Patienttypes } = this.props
    const data = formToObject(e.target)
    let errors = []
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Patienttypes', description: 'İsim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatienttypenotification(error)
      })
    } else {
      EditPatienttypes({ data: { ...Patienttypes.selected_record, ...data }, history })
    }

  }
}

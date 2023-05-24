import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Header } from 'semantic-ui-react'
import Popup from '../../Utils/Popup'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'

export default class StationsEdit extends Component {
  constructor(props) {
    super(props)
    const isDatafetched = false
    this.state = {
      isDatafetched
    }
  }

  componentDidMount() {
    const { GetStation, match, history } = this.props
    if (match.params.StationID) {
      GetStation(match.params.StationID)
    } else {
      history.push("/Stations")
    }
  }


  render() {

    const { Stations, removeStationnotification } = this.props
    const { notifications, selected_record, isLoading, isDispatching } = Stations
    if (notifications && notifications.length > 0) {
      let msg = notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeStationnotification()
    }

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]' >
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Stations"}>
                  <Breadcrumb.Section>İstasyonlar</Breadcrumb.Section>
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
                <label className='text-[#000000de]'>İstasyon Adı</label>
                <Form.Input placeholder="İstasyon Adı" name="name" fluid defaultValue={selected_record.name} />
              </Form.Field>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Stations">
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

    const { EditStations, history, fillStationnotification, Stations } = this.props
    const data = formToObject(e.target)
    let errors = []
    if (!data.name || data.name === '') {
      errors.push({ type: 'Error', code: 'Stations', description: 'İsim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStationnotification(error)
      })
    } else {
      EditStations({...Stations.selected_record,...data}, history)
    }

  }
}

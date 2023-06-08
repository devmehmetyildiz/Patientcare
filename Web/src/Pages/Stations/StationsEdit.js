import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Form, Header } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import FormInput from '../../Utils/FormInput'

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

  componentDidUpdate() {
    const { Stations, removeStationnotification } = this.props
    const { selected_record, isLoading } = Stations
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
    }
    Notification(Stations, removeStationnotification)
  }

  render() {

    const { Stations } = this.props
    const { isLoading, isDispatching } = Stations


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
                <Breadcrumb.Section>Güncelle</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form onkeypress={() => { alert("hop") }} className='' onSubmit={this.handleSubmit}>
              <Form.Field>
                <label className='text-[#000000de]'>İstasyon Adı</label>
                <FormInput placeholder="İstasyon Adı" name="Name" />
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
    if (!data.Name || data.Name === '') {
      errors.push({ type: 'Error', code: 'Stations', description: 'İsim Boş Olamaz' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillStationnotification(error)
      })
    } else {
      EditStations({ ...Stations.selected_record, ...data }, history)
    }

  }


}

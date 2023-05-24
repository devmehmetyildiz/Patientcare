import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import Notification from '../../Utils/Notification'
import LoadingPage from '../../Utils/LoadingPage'

export default class PatientstockmovementsCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedstock: "",
      selectedmovement: "",
    }
  }

  componentDidMount() {
    const { GetPatientstocks } = this.props
    GetPatientstocks()
  }

  componentDidUpdate() {
    const { Patientstockmovements, Patientstocks, removePatientstocknotification, removePatientstockmovementnotification } = this.props
    Notification(Patientstockmovements.notifications, removePatientstockmovementnotification)
    Notification(Patientstocks.notifications, removePatientstocknotification)
  }

  render() {
    const { Patientstockmovements, Patientstocks } = this.props

    const Patientstockoptions = Patientstocks.list.map(stock => {
      return { key: stock.concurrencyStamp, text: `${stock.stockdefine.name} - ${stock.barcodeno}`, value: stock.concurrencyStamp }
    })

    const Movementoptions = [
      { key: -1, text: "STOKDAN DÜŞME", value: -1 },
      { key: 1, text: "STOĞA EKLEME", value: 1 },
    ]

    return (
      Patientstocks.isLoading || Patientstocks.isDispatching || Patientstockmovements.isLoading || Patientstockmovements.isDispatching ? <LoadingPage /> :
        <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
          <div className='w-full mx-auto align-middle'>
            <Header style={{ backgroundColor: 'transparent', border: 'none', color: '#3d3d3d' }} as='h1' attached='top' >
              <Breadcrumb size='big'>
                <Link to={"/Patientstockmovements"}>
                  <Breadcrumb.Section >Ürünler</Breadcrumb.Section>
                </Link>
                <Breadcrumb.Divider icon='right chevron' />
                <Breadcrumb.Section>Oluştur</Breadcrumb.Section>
              </Breadcrumb>
            </Header>
          </div>
          <Divider className='w-full  h-[1px]' />
          <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
            <Form className='' onSubmit={this.handleSubmit}>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label className='text-[#000000de]'>Ürün</label>
                  <Dropdown placeholder='Ürün' fluid selection options={Patientstockoptions} onChange={this.handleChangeStock} />
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Input label="Miktar" placeholder="Miktar" name="amount" fluid />
                <Form.Field>
                  <label className='text-[#000000de]'>Hareket Türü</label>
                  <Dropdown placeholder='Hareket Türü' fluid selection options={Movementoptions} onChange={this.handleChangeMovement} />
                </Form.Field>
              </Form.Group>
              <div className='flex flex-row w-full justify-between py-4  items-center'>
                <Link to="/Patientstockmovements">
                  <Button floated="left" color='grey'>Geri Dön</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>Oluştur</Button>
              </div>
            </Form>
          </div>

        </div>
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatientstockmovements, history, fillPatientstockmovementnotification } = this.props
    const data = formToObject(e.target)
    data.movementdate = null
    data.newvalue = 0
    data.prevvalue = 0
    data.movementtype = this.state.selectedmovement
    data.stockID = this.state.selectedstock
    data.movementtypename = ""
    data.stock = null
    data.status = 0
    data.id = 0
    data.concurrencyStamp = null
    data.createdUser = null
    data.updatedUser = null
    data.deleteUser = null
    data.createTime = null
    data.updateTime = null
    data.deleteTime = null
    data.isActive = true

    let errors = []
    if (!data.movementtype || data.movementtype === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Hareket Seçili Değil' })
    }
    if (!data.stockID || data.stockID === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Ürün Seçili Değil' })
    }
    if (data.amount === '') {
      errors.push({ type: 'Error', code: 'Ürünler', description: 'Miktar girilmedi' })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientstockmovementnotification(error)
      })
    } else {
      AddPatientstockmovements(data, history)
    }
  }


  handleChangeStock = (e, { value }) => {
    this.setState({ selectedstock: value })
  }
  handleChangeMovement = (e, { value }) => {
    this.setState({ selectedmovement: value })
  }


  getLocalDate = () => {
    var curr = new Date();
    curr.setDate(curr.getDate() + 3);
    var date = curr.toISOString().substring(0, 10);
    return date
  }
}
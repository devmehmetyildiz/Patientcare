import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Dropdown, Form,  Label } from 'semantic-ui-react'
import { Breadcrumb,  Grid, GridColumn, Header } from 'semantic-ui-react'
import { MOVEMENTTYPES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import Popup from '../../Utils/Popup'

export default class Stockmovementsdetail extends Component {

  constructor(props) {
    super(props)
    this.state = { selectedStock:null }
  }

  componentDidMount() {
    const { GetStocks, GetStockmovements } = this.props
    GetStocks()
    GetStockmovements()

  }

  componentDidUpdate() {
    const { Stocks, Stockmovements, match } = this.props
    if (match.params.StockmovementID && Stocks && Stocks.list.length > 0 && !Stocks.isLoading && Stockmovements.list.length > 0 && !Stockmovements.isLoading && !this.state.selectedStock) {
      console.log("update oldum")
      this.setState({ selectedStock: match.params.StockmovementID })
    } else {
      if (this.state.selectedStock && !match.params.StockmovementID && Stocks.list.length > 0 && !Stocks.isLoading && Stockmovements.list.length > 0 && !Stockmovements.isLoading) {
        this.setState({ selectedStock: null })
      }
    }
  }

  render() {

    const { Stocks, Stockmovements, removeStockmovementnotification, removeStocknotification } = this.props
    if (Stockmovements.notifications && Stockmovements.notifications.length > 0) {
      let msg = Stockmovements.notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeStockmovementnotification()
    }
    if (Stocks.notifications && Stocks.notifications.length > 0) {
      let msg = Stocks.notifications[0]
      Popup(msg.type, msg.code, msg.description)
      removeStocknotification()
    }

    const Stockoptions = Stocks.list.map(stock => {
      return {
        key: stock.concurrencyStamp, text: `${stock.stockdefine.name} ( ${stock.barcodeno} )`, value: stock.concurrencyStamp
      }
    })

    const list = Stockmovements.list.filter(u => u.stock.concurrencyStamp === this.state.selectedStock)

    return (
      Stockmovements.isLoading || Stockmovements.isDispatching || Stocks.isLoading || Stocks.isDispatching ? <LoadingPage /> :
        <React.Fragment>
          <div className='w-full h-[calc(100vh-59px-2rem)] mx-auto flex flex-col  justify-start items-center pb-[2rem] px-[2rem]'>
            <div className='w-full mx-auto align-middle'>
              <Header style={{ backgroundColor: 'transparent', border: 'none' }} as='h1' attached='top' >
                <Grid columns='2' >
                  <GridColumn width={8} className="">
                    <Breadcrumb size='big'>
                      <Link to={"/Stockmovement"}>
                        <Breadcrumb.Section>Stok Hareketi</Breadcrumb.Section>
                      </Link>
                    </Breadcrumb>
                  </GridColumn>
                </Grid>
              </Header>
            </div>
            <Divider className='w-full  h-[1px]' />
            <div className='w-full bg-white p-4 rounded-lg shadow-md outline outline-[1px] outline-gray-200 '>
              <Form>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label className='text-[#000000de]'>Ürün</label>
                    <Dropdown placeholder='Ürün' fluid selection clearable options={Stockoptions} onChange={this.handleChangeOption} value={this.state.selectedStock} />
                  </Form.Field>
                </Form.Group>
              </Form>
              <Divider className='w-full  h-[1px]' />
              <div className='w-full relative h-[calc(70vh-59px-2rem)] overflow-y-auto  overflow-x-hidden'>
                {list.length > 0 ?
                  <div className="timeline rounded-t-full">
                    {list.map((item, index) => {
                      if (index % 2 === 0) {
                        return <div className='mt-8 w-full relative block'>
                          <div className='p-2 absolute top-[50%] left-[50%] bg-[#810202] rounded-full' style={{ transform: 'translate(-50%,-50%)' }} />
                          <div className='w-[6px] h-[140%]  absolute top-[50%] left-[50%] bg-[#810202] ' style={{ transform: 'translate(-50%,-50%)' }} />
                          <Label basic color={MOVEMENTTYPES.find(u => u.value === item.movementtype).color} pointing='left' className='absolute top-0 left-[51%]'>
                            <div className='max-w-[18vw]'>
                              <p>{MOVEMENTTYPES.find(u => u.value === item.movementtype).Name}</p>
                              <p>Tarih:{item.movementdate.replace('T', ' ')}</p>
                              <p>Hareket değeri:{item.amount + item.stock.stockdefine.unit.name}</p>
                              <p>Önceki değer:{item.prevvalue + item.stock.stockdefine.unit.name}</p>
                              <p>Yeni değer:{item.newvalue + item.stock.stockdefine.unit.name}</p>
                              <p>Hareket Yapan:{item.username}</p>
                            </div>
                          </Label>
                        </div >
                      } else {
                        return <div className='mt-8 w-full relative block rotate-180'>
                          <div className='p-2 absolute top-[50%] left-[50%] bg-[#810202] rounded-full' style={{ transform: 'translate(-50%,-50%)' }} />
                          <div className='w-[6px] h-[140%]  absolute top-[50%] left-[50%] bg-[#810202] ' style={{ transform: 'translate(-50%,-50%)' }} />
                          <Label basic color={MOVEMENTTYPES.find(u => u.value === item.movementtype).color} pointing='right' className='absolute top-0 left-[52%] rotate-180 '>
                            <div className='max-w-[18vw]'>
                              <p>{MOVEMENTTYPES.find(u => u.value === item.movementtype).Name}</p>
                              <p>Tarih:{item.movementdate.replace('T', ' ')}</p>
                              <p>Hareket değeri:{item.amount + item.stock.stockdefine.unit.name}</p>
                              <p>Önceki değer:{item.prevvalue + item.stock.stockdefine.unit.name}</p>
                              <p>Yeni değer:{item.newvalue + item.stock.stockdefine.unit.name}</p>
                              <p>Hareket Yapan:{item.username}</p>
                            </div>
                          </Label>
                        </div>
                      }
                    })}
                  </div>
                  : null}
              </div>
            </div>
          </div>
        </React.Fragment >
    )
  }


  handleChangeOption = (e, { value }) => {
    this.setState({ selectedStock: value }, () => {
      value ? this.props.history.push("/Stockmovement/" + value) : this.props.history.push("/Stockmovement")
    })

  }
}



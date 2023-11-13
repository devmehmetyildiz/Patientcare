import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Divider, Dropdown, Form, Header, Icon, Modal, Tab, Table } from 'semantic-ui-react'
import { ROUTES } from '../../Utils/Constants'
import LoadingPage from '../../Utils/LoadingPage'
import StockdefinesCreate from "../../Containers/Stockdefines/StockdefinesCreate"
import config from '../../Config'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'
import Submitbutton from '../../Common/Submitbutton'
import Gobackbutton from '../../Common/Gobackbutton'
import AddModal from '../../Utils/AddModal'
export default class PreregistrationsEditstock extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
      selectedStocks: [],
      open: false,
      modelOpened: false
    }
  }

  componentDidMount() {
    const { GetPatient, match, history,
      GetStockdefines,
      GetDepartments,
      GetFiles,
      GetPatientdefines,
      GetPatientstocks,
      GetPatientstockmovements
    } = this.props
    if (match.params.PatientID) {
      GetPatient(match.params.PatientID)
      GetStockdefines()
      GetDepartments()
      GetFiles()
      GetPatientdefines()
      GetPatientstocks()
      GetPatientstockmovements()
    } else {
      history.push("/Preregistrations")
    }
  }

  componentDidUpdate() {
    const { Patients, Departments, Stockdefines,
      Files, Patientdefines, Patientstocks, Patientstockmovements, } = this.props
    const { selected_record, isLoading } = Patients
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading
      && !Departments.isLoading &&
      !Stockdefines.isLoading &&
      !Patientdefines.isLoading &&
      !Patientstocks.isLoading &&
      !Patientstockmovements.isLoading &&
      !Files.isLoading &&
      !this.state.isDatafetched) {
      var response = (Patientstocks.list || []).filter(u => u.PatientID === selected_record?.Uuid && u.Isactive).map(u => { return { ...u, key: Math.random() } })
      this.setState({
        selectedStocks: response, isDatafetched: true
      })
    }
  }

  render() {
    const { Patients, Stockdefines, Departments, Files, Patientdefines, Profile, history } = this.props
    const { selected_record, isLoading, isDispatching } = Patients

    const Stockdefinesoption = (Stockdefines.list || []).filter(u => !u.Ismedicine && u.Isactive).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Medicinedefinesoption = (Stockdefines.list || []).filter(u => u.Ismedicine && u.Isactive).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Patientdepartmentsoption = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Departmentsoption = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const patientDefine = (Patientdefines.list || []).find(u => u.Uuid === selected_record?.PatientdefineID)
    const patientPP = (Files.list || []).find(u => u.ParentID === selected_record?.Uuid && u.Usagetype === 'PP' && u.Isactive)

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Preregistrations"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditstockheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Header as='h2' icon textAlign='center'>
              {patientPP
                ? <img alt='pp' src={`${config.services.File}${ROUTES.FILE}/Downloadfile/${patientPP?.Uuid}`} className="rounded-full" style={{ width: '100px', height: '100px' }} />
                : <Icon name='users' circular />}
              <Header.Content>{`${patientDefine?.Firstname} ${patientDefine?.Lastname} - ${patientDefine?.CountryID}`}</Header.Content>
            </Header>
            <Form>
              <Tab
                panes={[
                  {
                    menuItem: Literals.Columns.Medicines[Profile.Language],
                    pane: {
                      key: 'medicines',
                      content: <Table celled className='overflow-x-auto' key='medicineTable' >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsStockdefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsDepartment[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsBarcode[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsSkt[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{Literals.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {this.state.selectedStocks.filter(u => u.Ismedicine && !u.Issupply).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                            return <Table.Row key={stock.key}>
                              <Table.Cell>
                                <Button.Group basic size='small'>
                                  <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                  <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                                </Button.Group>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.StockdefineID} placeholder={Literals.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Medicinedefinesoption
                                  } onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.DepartmentID} placeholder={Literals.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Patientdepartmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Barcodeno} placeholder={Literals.Options.TableColumnsBarcode[Profile.Language]} name="Barcodeno" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Skt && stock.Skt.split('T')[0]} placeholder={Literals.Options.TableColumnsSkt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input disabled={stock.Uuid ? true : false} value={stock.Amount} placeholder={Literals.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Info} placeholder={Literals.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell className='table-last-section'>
                                {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                  onClick={() => { this.removeProduct(stock.key, stock.Order) }} />}
                              </Table.Cell>
                            </Table.Row>
                          })}
                        </Table.Body>
                        <Table.Footer>
                          <Table.Row>
                            <Table.HeaderCell colSpan='8'>
                              <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(true, false) }}>{Literals.Button.AddnewMedicine[Profile.Language]}</Button>
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Supplies[Profile.Language],
                    pane: {
                      key: 'supplies',
                      content: <Table celled className='overflow-x-auto' key='supplyTable' >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsStockdefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsDepartment[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsBarcode[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsSkt[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{Literals.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {this.state.selectedStocks.filter(u => !u.Ismedicine && u.Issupply).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                            return <Table.Row key={stock.key}>
                              <Table.Cell>
                                <Button.Group basic size='small'>
                                  <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                  <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                                </Button.Group>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.StockdefineID} placeholder={Literals.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Stockdefinesoption
                                  } onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.DepartmentID} placeholder={Literals.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Barcodeno} placeholder={Literals.Options.TableColumnsBarcode[Profile.Language]} name="Barcodeno" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Skt && stock.Skt.split('T')[0]} placeholder={Literals.Options.TableColumnsSkt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input disabled={stock.Uuid ? true : false} value={stock.Amount} placeholder={Literals.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Info} placeholder={Literals.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell className='table-last-section'>
                                {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                  onClick={() => { this.removeProduct(stock.key, stock.Order) }} />}
                              </Table.Cell>
                            </Table.Row>
                          })}
                        </Table.Body>
                        <Table.Footer>
                          <Table.Row>
                            <Table.Cell colSpan='8'>
                              <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(false, true) }}>{Literals.Button.AddnewSupplies[Profile.Language]}</Button>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Stocks[Profile.Language],
                    pane: {
                      key: 'stocks',
                      content: <Table celled className='overflow-x-auto' key='stockTable' >
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsOrder[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsStockdefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsDepartment[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                            <Table.HeaderCell width={2}>{Literals.Options.TableColumnsAmount[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={6}>{Literals.Options.TableColumnsInfo[Profile.Language]}</Table.HeaderCell>
                            <Table.HeaderCell width={1}>{Literals.Options.TableColumnsDelete[Profile.Language]}</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {this.state.selectedStocks.filter(u => !u.Ismedicine && !u.Issupply).sort((a, b) => a.Order - b.Order).map((stock, index) => {
                            return <Table.Row key={stock.key}>
                              <Table.Cell>
                                <Button.Group basic size='small'>
                                  <Button type='button' disabled={index === 0} icon='angle up' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order - 1) }} />
                                  <Button type='button' disabled={index + 1 === this.state.selectedStocks.length} icon='angle down' onClick={() => { this.selectedProductChangeHandler(stock.key, 'Order', stock.Order + 1) }} />
                                </Button.Group>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.StockdefineID} placeholder={Literals.Options.TableColumnsStockdefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Stockdefinesoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Field>
                                  <Dropdown value={stock.DepartmentID} placeholder={Literals.Options.TableColumnsDepartment[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentsoption} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                </Form.Field>
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input disabled={stock.Uuid ? true : false} value={stock.Amount} placeholder={Literals.Options.TableColumnsAmount[Profile.Language]} name="Amount" type="number" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell>
                                <Form.Input value={stock.Info} placeholder={Literals.Options.TableColumnsInfo[Profile.Language]} name="Info" fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                              </Table.Cell>
                              <Table.Cell className='table-last-section'>
                                {!stock.Uuid && <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                  onClick={() => { this.removeProduct(stock.key, stock.Order) }} />}
                              </Table.Cell>
                            </Table.Row>
                          })}
                        </Table.Body>
                        <Table.Footer>
                          <Table.Row>
                            <Table.Cell colSpan='6'>
                              <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(false, false) }}>{Literals.Button.AddnewStock[Profile.Language]}</Button>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Footer>
                      </Table>
                    }
                  }
                ]}
                renderActiveOnly={false} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Preregistrations"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.open) {
      return
    }
    const { EditPatientstocks, history, fillPatientnotification, Profile } = this.props
    const stocks = Array.from(this.state.selectedStocks)

    let errors = []
    stocks.forEach(data => {
      data.Skt === '' && (data.Skt = null)
      data.Amount && (data.Amount = parseFloat(data.Amount))
      if (!validator.isUUID(data.StockdefineID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stockdefinedefinerequired[Profile.Language] })
      }
      if (!validator.isUUID(data.DepartmentID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentrequired[Profile.Language] })
      }
      if (data.Ismedicine && !validator.isISODate(data.Skt)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Sktdefinerequired[Profile.Language] })
      }
      if (data.Ismedicine && !validator.isString(data.Barcodeno)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Barcodenorequired[Profile.Language] })
      }
      if (!validator.isUUID(data?.Uuid) && !validator.isNumber(data.Amount)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Amountrequired[Profile.Language] })
      }
    });

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientnotification(error)
      })
    } else {
      EditPatientstocks({ data: stocks, history, redirectUrl: "/Preregistrations" })
    }
  }

  AddNewProduct = (Ismedicine, Issupply) => {
    const { Patients } = this.props
    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        Patient: {},
        PatientID: Patients.selected_record.Uuid,
        StockdefineID: '',
        Stockdefine: {},
        DepartmentID: '',
        Department: {},
        Skt: '',
        Barcodeno: '',
        Amount: 0,
        Info: '',
        Status: 0,
        Isredprescription: false,
        Ismedicine: Ismedicine,
        Issupply: Issupply,
        Isapproved: false,
        key: Math.random(),
        Order: this.state.selectedStocks.filter(u => u.Issupply === Issupply && u.Ismedicine === Ismedicine).length,
      }]
    }, () => {
    })
  }

  removeProduct = (key, order) => {
    let stocks = this.state.selectedStocks.filter(productionRoute => productionRoute.key !== key)
    stocks.filter(stock => stock.Order > order).forEach(stock => stock.Order--)
    this.setState({ selectedStocks: stocks })
  }

  selectedProductChangeHandler = (key, property, value) => {

    const { Stockdefines } = this.props
    let selectedProduct = this.state.selectedStocks.find(u => u.key === key);
    let productionRoutes = this.state.selectedStocks
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'Order') {
      productionRoutes.filter(item => item.Order === value && item.Issupply === selectedProduct?.Issupply && item.Ismedicine === selectedProduct?.Ismedicine)
        .forEach((item) => item.Order = productionRoutes[index].Order > value ? item.Order + 1 : item.Order - 1)
    }
    productionRoutes[index][property] = value
    productionRoutes[index].Isredprescription = (Stockdefines.list || []).find(u => u.Uuid === productionRoutes[index].StockefineID)?.Isredprescription || false
    this.setState({ selectedStocks: productionRoutes })
  }
}

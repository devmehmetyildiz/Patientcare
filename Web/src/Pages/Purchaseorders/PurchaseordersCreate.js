import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, Form, Icon, Tab, Table, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from "../../Utils/Validator"
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, AddModal, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import StockdefinesCreate from '../../Containers/Stockdefines/StockdefinesCreate'
import CasesCreate from '../../Containers/Cases/CasesCreate'
import WarehousesCreate from '../../Containers/Warehouses/WarehousesCreate'
import DepartmentsCreate from '../../Containers/Departments/DepartmentsCreate'

export default class PurchaseordersCreate extends Component {

  PAGE_NAME = "PurchaseordersCreate"

  constructor(props) {
    super(props)
    this.state = {
      selectedStocks: [],
    }
  }

  componentDidMount() {
    const { GetUsers, GetStockdefines, GetCases, GetDepartments, GetWarehouses } = this.props
    GetStockdefines()
    GetCases()
    GetDepartments()
    GetWarehouses()
    GetUsers()
    if (this.context.formstates[`${this.PAGE_NAME}/Stocks`]) {
      this.setState({
        selectedStocks: this.context.formstates[`${this.PAGE_NAME}/Stocks`]
      })
    }
  }

  render() {

    const { Warehouses, Cases, Departments, Stockdefines, Profile, Users,
      Purchaseorders, history, closeModal } = this.props
    const { isLoading } = Purchaseorders

    const Stockdefinesoption = (Stockdefines.list || []).filter(u => u.Isactive && !u.Ismedicine && !u.Issupply).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Medicinedefinesoption = (Stockdefines.list || []).filter(u => u.Isactive && u.Ismedicine && !u.Issupply).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Supplydefineoption = (Stockdefines.list || []).filter(u => u.Isactive && !u.Ismedicine && u.Issupply).map(stockdefine => {
      return { key: stockdefine.Uuid, text: stockdefine.Name, value: stockdefine.Uuid }
    })

    const Departmentsoption = (Departments.list || []).filter(u => u.Isactive).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Medicinedepartmentsoption = (Departments.list || []).filter(u => u.Isactive && u.Ishavepatients).map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    const Usersoption = (Users.list || []).filter(u => u.Isactive).map(user => {
      const userdata = (Users.list || []).find(u => u.Uuid === user.Uuid)
      return { key: user.Uuid, text: `${userdata?.Name} ${userdata?.Surname} (${userdata?.Username})`, value: user.Uuid }
    })

    const Casesoption = (Cases.list || []).filter(u => u.Isactive).filter(u => u.CaseStatus === 0).map(cases => {
      let departments = (cases.Departmentuuids || [])
        .map(u => {
          const department = (Departments.list || []).find(department => department.Uuid === u.DepartmentID)
          if (department) {
            return department
          } else {
            return null
          }
        })
        .filter(u => u !== null);
      let ishavepatients = false;
      (departments || []).forEach(department => {
        if (department?.Ishavepatients) {
          ishavepatients = true
        }
      });

      if (ishavepatients) {
        return null
      } else {
        return { key: cases.Uuid, text: cases.Name, value: cases.Uuid }
      }
    }).filter(u => u !== null);

    const Warehousesoption = (Warehouses.list || []).filter(u => u.Isactive).map(warehouse => {
      return { key: warehouse.Uuid, text: warehouse.Name, value: warehouse.Uuid }
    })

    return (
      isLoading  ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Purchaseorders"}>
                <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem: Literals.Columns.Purchaseorders[Profile.Language],
                    pane: {
                      key: 'save',
                      content: <React.Fragment>
                        <div className='h-[calc(59vh-20px)] '>
                          <Form.Group widths={'equal'}>
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Warehouse[Profile.Language]} name="WarehouseID" options={Warehousesoption} formtype='dropdown' modal={WarehousesCreate} />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Company[Profile.Language]} name="Company" />
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Purchaseprice[Profile.Language]} name="Purchaseprice" type='number' />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Companypersonelname[Profile.Language]} name="Companypersonelname" />
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Purchasenumber[Profile.Language]} name="Purchasenumber" />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.CaseName[Profile.Language]} name="CaseID" options={Casesoption} formtype='dropdown' modal={CasesCreate} />
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.RecievedUserID[Profile.Language]} name="RecievedUserID" options={Usersoption} formtype='dropdown' />
                          </Form.Group>
                          <Form.Group widths={'equal'}>
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Purchasedate[Profile.Language]} name="Purchasedate" type='date' />
                            <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
                          </Form.Group>
                        </div>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Medicinescreen[Profile.Language],
                    pane: {
                      key: 'medicines',
                      content: <React.Fragment>
                        <div className='h-[calc(59vh-20px)] overflow-y-auto'>
                          <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell width={1}>{Literals.Columns.Order[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.StockDefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Department[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Barcodeno[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Skt[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Amount[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={6}>{Literals.Columns.Info[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={1}>{Literals.Columns.Delete[Profile.Language]}</Table.HeaderCell>
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
                                      <Dropdown placeholder={Literals.Columns.StockDefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Medicinedefinesoption} value={stock.StockdefineID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Field>
                                      <Dropdown placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Medicinedepartmentsoption} value={stock.DepartmentID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" fluid value={stock.Barcodeno} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type="number" fluid value={stock.Amount} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Info[Profile.Language]} name="Info" fluid value={stock.Info} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell className='table-last-section'>
                                    <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                      onClick={() => { this.removeProduct(stock.key, stock.Order) }} />
                                  </Table.Cell>
                                </Table.Row>
                              })}
                            </Table.Body>
                            <Table.Footer>
                              <Table.Row>
                                <Table.HeaderCell colSpan='8'>
                                  <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(true, false) }}>{Literals.Button.Addproduct[Profile.Language]}</Button>
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Footer>
                          </Table>
                        </div>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Supplyscreen[Profile.Language],
                    pane: {
                      key: 'supplies',
                      content: <React.Fragment>
                        <div className='h-[calc(59vh-20px)] overflow-y-auto'>
                          <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell width={1}>{Literals.Columns.Order[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.StockDefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Department[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Barcodeno[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Skt[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Amount[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={6}>{Literals.Columns.Info[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={1}>{Literals.Columns.Delete[Profile.Language]}</Table.HeaderCell>
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
                                      <Dropdown placeholder={Literals.Columns.StockDefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Supplydefineoption} value={stock.StockdefineID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Field>
                                      <Dropdown placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentsoption} value={stock.DepartmentID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Barcodeno[Profile.Language]} name="Barcodeno" fluid value={stock.Barcodeno} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Barcodeno', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Skt[Profile.Language]} name="Skt" type='date' fluid onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Skt', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type="number" fluid value={stock.Amount} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Info[Profile.Language]} name="Info" fluid value={stock.Info} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell className='table-last-section'>
                                    <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                      onClick={() => { this.removeProduct(stock.key, stock.Order) }} />
                                  </Table.Cell>
                                </Table.Row>
                              })}
                            </Table.Body>
                            <Table.Footer>
                              <Table.Row>
                                <Table.HeaderCell colSpan='8'>
                                  <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(false, true) }}>{Literals.Button.Addproduct[Profile.Language]}</Button>
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Footer>
                          </Table>
                        </div>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Stocksscreen[Profile.Language],
                    pane: {
                      key: 'stocks',
                      content: <React.Fragment>
                        <div className='h-[calc(59vh-20px)] overflow-y-auto'>
                          <Table celled className='list-table ' key='product-create-type-conversion-table ' >
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell width={1}>{Literals.Columns.Order[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.StockDefine[Profile.Language]}{<AddModal Content={StockdefinesCreate} />}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Department[Profile.Language]}{<AddModal Content={DepartmentsCreate} />}</Table.HeaderCell>
                                <Table.HeaderCell width={2}>{Literals.Columns.Amount[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={6}>{Literals.Columns.Info[Profile.Language]}</Table.HeaderCell>
                                <Table.HeaderCell width={1}>{Literals.Columns.Delete[Profile.Language]}</Table.HeaderCell>
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
                                      <Dropdown placeholder={Literals.Columns.StockDefine[Profile.Language]} name="StockdefineID" clearable search fluid selection options={Stockdefinesoption} value={stock.StockdefineID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'StockdefineID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Field>
                                      <Dropdown placeholder={Literals.Columns.Department[Profile.Language]} name="DepartmentID" clearable search fluid selection options={Departmentsoption} value={stock.DepartmentID} onChange={(e, data) => { this.selectedProductChangeHandler(stock.key, 'DepartmentID', data.value) }} />
                                    </Form.Field>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" type="number" fluid value={stock.Amount} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Amount', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <Form.Input placeholder={Literals.Columns.Info[Profile.Language]} name="Info" fluid value={stock.Info} onChange={(e) => { this.selectedProductChangeHandler(stock.key, 'Info', e.target.value) }} />
                                  </Table.Cell>
                                  <Table.Cell className='table-last-section'>
                                    <Icon className='type-conversion-remove-icon' link color='red' name='minus circle'
                                      onClick={() => { this.removeProduct(stock.key, stock.Order) }} />
                                  </Table.Cell>
                                </Table.Row>
                              })}
                            </Table.Body>
                            <Table.Footer>
                              <Table.Row>
                                <Table.HeaderCell colSpan='6'>
                                  <Button type="button" color='green' className='addMoreButton' size='mini' onClick={() => { this.AddNewProduct(false, false) }}>{Literals.Button.Addproduct[Profile.Language]}</Button>
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Footer>
                          </Table>
                        </div>
                      </React.Fragment>
                    }
                  },
                ]}
                renderActiveOnly={false} />
              <Pagedivider />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Purchaseorders"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const { AddPurchaseorders, history, fillPurchaseordernotification, Profile, closeModal } = this.props
    const stocks = this.state.selectedStocks
    const formData = this.context.getForm(this.PAGE_NAME)

    stocks.forEach(data => {
      data.Amount = parseFloat(data.Amount)
      delete data.key
    });

    const responseData = {
      Info: Array.isArray(formData.Info) ? formData.Info[0] : formData.Info,
      Company: formData.Company,
      Username: 'test',
      Purchaseprice: parseFloat(formData.Purchaseprice),
      Purchasenumber: formData.Purchasenumber,
      Companypersonelname: formData.Companypersonelname,
      RecievedUserID: formData.RecievedUserID,
      Purchasedate: formData.Purchasedate,
      CaseID: this.context.formstates[`${this.PAGE_NAME}/CaseID`],
      WarehouseID: this.context.formstates[`${this.PAGE_NAME}/WarehouseID`],
      Stocks: stocks
    }

    let errors = []
    responseData.Stocks.forEach(data => {
      if (!validator.isUUID(data.StockdefineID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Stockdefinerequired[Profile.Language] })
      }
      if (!validator.isUUID(data.DepartmentID)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentrequired[Profile.Language] })
      }
      if ((data.Issupply || data.Ismedicine) && !validator.isISODate(data.Skt)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Sktrequired[Profile.Language] })
      }
      if ((data.Issupply || data.Ismedicine) && !validator.isString(data.Barcodeno)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Barcodenorequired[Profile.Language] })
      }
      if (!validator.isNumber(data.Amount)) {
        errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Amountrequired[Profile.Language] })
      }
    });

    if (!validator.isString(responseData.Company)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Companyrequired[Profile.Language] })
    }
    if (!validator.isNumber(responseData.Purchaseprice)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Purchasepricerequired[Profile.Language] })
    }
    if (!validator.isString(responseData.Companypersonelname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Companypersonelnamerequired[Profile.Language] })
    }
    if (!validator.isString(responseData.Purchasenumber)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Purchasenumberrequired[Profile.Language] })
    }
    if (!validator.isUUID(responseData.RecievedUserID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Personelnamerequired[Profile.Language] })
    }
    if (!validator.isUUID(responseData.CaseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Caserequired[Profile.Language] })
    }
    if (!validator.isUUID(responseData.WarehouseID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Warehouserequired[Profile.Language] })
    }
    if (!validator.isISODate(responseData.Purchasedate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Purchasedaterequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPurchaseordernotification(error)
      })
    } else {
      AddPurchaseorders({ data: responseData, history, closeModal })
    }
  }

  AddNewProduct = (Ismedicine, Issupply) => {

    this.setState({
      selectedStocks: [...this.state.selectedStocks,
      {
        Id: 0,
        PurchaseorderID: '',
        Purchaseorder: {},
        StockdefineID: '',
        Stockdefine: {},
        DepartmentID: '',
        Department: {},
        Skt: null,
        Barcodeno: '',
        Amount: 0,
        Info: '',
        Ismedicine: Ismedicine,
        Issupply: Issupply,
        Isredprescription: false,
        Willdelete: false,
        key: Math.random(),
        Order: (this.state.selectedStocks || []).filter(u => u.Ismedicine === Ismedicine && u.Issupply === Issupply).length,
      }]
    })
  }

  removeProduct = (key, order) => {
    let stocks = this.state.selectedStocks.filter(productionRoute => productionRoute.key !== key)
    stocks.filter(stock => stock.Order > order).forEach(stock => stock.Order--)
    this.setState({ selectedStocks: stocks })
  }

  selectedProductChangeHandler = (key, property, value) => {

    let productionRoutes = this.state.selectedStocks
    const index = productionRoutes.findIndex(productionRoute => productionRoute.key === key)
    if (property === 'order') {
      let selectedroute = this.state.selectedStocks.find(u => u.key === key);
      productionRoutes.filter(u => u.Issupply === selectedroute?.Issupply && u.Ismedicine === selectedroute?.Ismedicine)
        .filter(productionRoute => productionRoute.Order === value)
        .forEach((productionRoute) => productionRoute.Order = productionRoutes[index].Order > value ? productionRoute.Order + 1 : productionRoute.Order - 1)
    }
    if (property === 'StockdefineID') {
      const { Stockdefines } = this.props

      productionRoutes[index].Isredprescription = (Stockdefines.list || []).find(u => u.Uuid === value)?.Isredprescription || false
    }
    productionRoutes[index][property] = value
    if (property === 'Skt') {
      const currentDate = new Date(value || '');
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      productionRoutes[index][property] = formattedDate
    }
    this.setState({ selectedStocks: productionRoutes })
  }
}
PurchaseordersCreate.contextType = FormContext


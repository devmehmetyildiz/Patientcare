import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PatientstockmovementsCreate extends Component {

  PAGE_NAME = "PatientstockmovementsCreate"

  componentDidMount() {
    const { GetPatientstocks, GetStockdefines } = this.props
    GetPatientstocks()
    GetStockdefines()
  }


  componentDidUpdate() {

    const { location, Patientstocks } = this.props

    if (!validator.isUUID(this.context.formstates[`${this.PAGE_NAME}/StockID`])) {
      const search = new URLSearchParams(location.search)
      const StockID = search.get('StockID') ? search.get('StockID') : ''
      if (validator.isUUID(StockID) && (Patientstocks.list || []).find(u => u.Uuid === StockID)) {
        this.context.setFormstates({
          ...this.context.formstates,
          [`${this.PAGE_NAME}/StockID`]: StockID ? StockID : '',
        })
      }
    }
  }

  render() {
    const { Patientstockmovements, Patientstocks, Profile, history, closeModal, Stockdefines } = this.props

    const Patientstockoptions = (Patientstocks.list || []).filter(u => u.Isactive).map(stock => {
      if (stock.Barcodeno) {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name} - ${stock.Barcodeno}`, value: stock.Uuid }
      }
      else {
        return { key: stock.Uuid, text: `${(Stockdefines.list || []).find(define => define.Uuid === stock.StockdefineID)?.Name}`, value: stock.Uuid }
      }
    })

    const Movementoptions = [
      { key: -1, text: Literals.Options.Movementoptions.value0[Profile.Language], value: -1 },
      { key: 1, text: Literals.Options.Movementoptions.value1[Profile.Language], value: 1 },
    ]

    return (
      Patientstockmovements.isLoading  ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Patientstockmovements"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Stockdefine[Profile.Language]} name="StockID" options={Patientstockoptions} formtype="dropdown" />
              <Form.Group widths='equal'>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Amount[Profile.Language]} name="Amount" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Movementtype[Profile.Language]} name="Movementtype" options={Movementoptions} formtype="dropdown" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Patientstockmovements"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Patientstockmovements.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()
    const { AddPatientstockmovements, history, fillPatientstockmovementnotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Movementdate = new Date()
    data.Newvalue = 0
    data.Prevvalue = 0
    data.Status = 0
    data.Movementtype && (data.Movementdate = parseInt(data.Movementtype))
    data.Amount && (data.Amount = parseFloat(data.Amount))
    let errors = []
    if (!validator.isNumber(data.Movementtype)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.MovementRequired[Profile.Language] })
    }
    if (!validator.isUUID(data.StockID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StockRequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Amount)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.AmountRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPatientstockmovementnotification(error)
      })
    } else {
      AddPatientstockmovements({ data, history, closeModal })
    }
  }
}
PatientstockmovementsCreate.contextType = FormContext
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'


export default class PersonelshiftsCreate extends Component {

  PAGE_NAME = "PersonelshiftsCreate"

  render() {

    const { Personelshifts, Profile, history, closeModal } = this.props
    const { isLoading } = Personelshifts


    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Personelshifts"}>
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
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Startdate[Profile.Language]} type='date' name="Startdate" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Period[Profile.Language]} type='number' name="Period" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Personelshifts"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Personelshifts.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPersonelshifts, history, fillPersonelshiftnotification, Profile, closeModal } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isISODate(data.Startdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Startdaterequired[Profile.Language] })
    }
    if (!validator.isNumber(data.Period)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Periodrequired[Profile.Language] })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPersonelshiftnotification(error)
      })
    } else {
      AddPersonelshifts({ data, history, closeModal })
    }
  }
}
PersonelshiftsCreate.contextType = FormContext
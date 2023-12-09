import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class PersonelsCreate extends Component {

  PAGE_NAME = "PersonelsCreate"

  render() {

    const { Personels, Profile, history, closeModal } = this.props
    const { isLoading, isDispatching } = Personels

    const Genderoptions = [
      { key: 0, text: Literals.Options.Genderoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Genderoptions.value1[Profile.Language], value: "1" }
    ]

    const Professionoptions = [
      { key: 0, text: Literals.Options.Professionoptions.value0[Profile.Language], value: "0" },
      { key: 1, text: Literals.Options.Professionoptions.value1[Profile.Language], value: "1" },
      { key: 2, text: Literals.Options.Professionoptions.value2[Profile.Language], value: "2" },
      { key: 3, text: Literals.Options.Professionoptions.value3[Profile.Language], value: "3" },
      { key: 4, text: Literals.Options.Professionoptions.value4[Profile.Language], value: "4" },
    ]


    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Personels"}>
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
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Surname[Profile.Language]} name="Surname" />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.CountryID[Profile.Language]} name="CountryID" maxLength={11} validationfunc={this.validateTcNumber} validationmessage={"Geçerli Bir Tc Giriniz!"} />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Professions[Profile.Language]} name="Professions" formtype='dropdown' options={Professionoptions} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Workstarttime[Profile.Language]} name="Workstarttime" type='date' />
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Gender[Profile.Language]} name="Gender" options={Genderoptions} formtype='dropdown' />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Personels"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Personels.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPersonels, history, fillPersonelnotification, Profile, closeModal } = this.props

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.Surname)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Surnamerequired[Profile.Language] })
    }
    if (!validator.isString(data.CountryID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Countryidrequired[Profile.Language] })
    }
    if (!validator.isString(data.Professions)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Professionsrequired[Profile.Language] })
    }
    if (!validator.isISODate(data.Workstarttime)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Workstarttimerequired[Profile.Language] })
    }
    if (!validator.isString(data.Gender)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Genderrequired[Profile.Language] })
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        fillPersonelnotification(error)
      })
    } else {
      AddPersonels({ data, history, closeModal })
    }
  }

  validateTcNumber = (tcNumber) => {
    if (/^[1-9][0-9]{10}$/.test(tcNumber)) {
      const numberArray = tcNumber.split('').map(Number);
      const lastDigit = numberArray.pop();
      const sum = numberArray.reduce((acc, current, index) => acc + current, 0);
      const tenthDigit = sum % 10;

      if ((tenthDigit === lastDigit && numberArray[0] !== 0) || (sum % 10 === 0 && lastDigit === 0)) {
        return true;
      }
    }
    return false;
  };
}
PersonelsCreate.contextType = FormContext
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Label, Transition } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { Getdateoptions } from '../../Utils/Formatdate'
import { FormContext } from '../../Provider/FormProvider'
import { Contentwrapper, Footerwrapper, FormInput, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Notfoundpage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import PersonelshiftsProfessionpresettings from '../../Containers/Personelshifts/PersonelshiftsProfessionpresettings'
import PersonelshiftsPersonelpresettings from '../../Containers/Personelshifts/PersonelshiftsPersonelpresettings'
import PersonelshiftsPrepare from '../../Containers/Personelshifts/PersonelshiftsPrepare'
export default class PersonelshiftsCreate extends Component {

  PAGE_NAME = "PersonelshiftsCreate"

  constructor(props) {
    super(props)
    this.state = {
      personelshifts: []
    }
  }

  componentDidMount() {
    const { GetProfessions, GetProfessionpresettings, GetPersonelpresettings, GetFloors, GetShiftdefines, GetUsers, GetUsagetypes } = this.props
    GetProfessions()
    GetProfessionpresettings()
    GetPersonelpresettings()
    GetFloors()
    GetShiftdefines()
    GetUsers()
    GetUsagetypes()
  }

  render() {
    const { Personelshifts, Professions, Professionpresettings, Personelpresettings, Profile, history, closeModal } = this.props

    const dateOptions = Getdateoptions()

    const Professionsoptions = (Professions.list || []).filter(u => u.Isactive).map(propfession => {
      return { key: propfession.Uuid, text: propfession.Name, value: propfession.Uuid }
    });

    const selectedProfession = this.context.formstates[`${this.PAGE_NAME}/ProfessionID`];
    const selectedStartdate = this.context.formstates[`${this.PAGE_NAME}/Startdate`];

    const isProfessionselected = validator.isUUID(selectedProfession);
    const isStartdateselected = validator.isISODate(selectedStartdate);

    const foundedProfessionpresetting = (Professionpresettings.list || []).filter(u => u.Isactive && (u.Startdate === selectedStartdate || u.Isinfinite) && u.ProfessionID === selectedProfession)
    const foundedPersonelpresetting = (Personelpresettings.list || []).filter(u => u.Isactive && (u.Startdate === selectedStartdate || u.Isinfinite))

    const personelshifts = this.state.personelshifts

    return (
      Personelshifts.isLoading ? <LoadingPage /> :
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
                <Transition animation='slide down' visible={(isProfessionselected && isStartdateselected)}>
                  <div className='w-full'>
                    {(foundedPersonelpresetting.length <= 0 && foundedProfessionpresetting.length <= 0) ?
                      <React.Fragment>
                        <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { }} >
                          {Literals.Messages.Nopresettingfound[Profile.Language]}
                        </Button>
                      </React.Fragment>
                      : <React.Fragment>
                        <PersonelshiftsProfessionpresettings selectedProfessionpresettings={foundedProfessionpresetting} />
                        <PersonelshiftsPersonelpresettings selectedPersonelpresettings={foundedPersonelpresetting} />
                      </React.Fragment>
                    }
                    <Button className='!bg-[#2355a0] !text-white' floated='right' onClick={() => { }} >{Literals.Button.Autofill[Profile.Language]}</Button>
                  </div>
                </Transition>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Startdate[Profile.Language]} name="Startdate" formtype="dropdown" options={dateOptions} effect={this.handleChange} />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Profession[Profile.Language]} name="ProfessionID" formtype="dropdown" options={Professionsoptions} effect={this.handleChange} />
              </Form.Group>
              {(!isProfessionselected || !isStartdateselected)
                ? <Notfoundpage
                  text='Meslek veya Tarih Seçilmedi'
                  autoHeight
                />
                : <React.Fragment>
                  <PersonelshiftsPrepare
                    selectedProfessionID={selectedProfession}
                    selectedStartdate={selectedStartdate}
                    personelshifts={personelshifts}
                    setPersonelshifts={this.setPersonelshifts}
                  />
                </React.Fragment>
              }
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


  setPersonelshifts = (personelshiftprev) => {
    this.setState({ personelshifts: [...personelshiftprev] })
  }

  handleChange = () => {
    this.setState({ personelshifts: [] })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { Profile, AddPersonelshifts, history, closeModal, fillPersonelshiftnotification } = this.props

    const shiftData = this.context.getForm(this.PAGE_NAME)

    const data = {
      Startdate: shiftData?.Startdate,
      ProfessionID: shiftData?.ProfessionID,
      Isworking: true,
      Isdeactive: false,
      Iscompleted: false,
      Isapproved: false,
      Personelshiftdetails: this.state.personelshifts
    }

    let errors = []

    if (!validator.isISODate(data.Startdate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Shiftrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.ProfessionID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Professionrequired[Profile.Language] })
    }
    if (!validator.isArray(data.Personelshiftdetails) && data.Personelshiftdetails.length <= 0) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Personelshiftsrequired[Profile.Language] })
    } else {

      for (const personelshift of data.Personelshiftdetails) {

        const { Annualtype, Day, PersonelID, ShiftID } = personelshift

        if (!validator.isNumber(Annualtype)) {
          errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Annualtyperequired[Profile.Language] })
        }
        if (!validator.isNumber(Day)) {
          errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Dayrequired[Profile.Language] })
        }
        if (!validator.isUUID(PersonelID)) {
          errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Personelrequired[Profile.Language] })
        }
        if (!validator.isUUID(ShiftID)) {
          errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Shiftrequired[Profile.Language] })
        }

      }
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


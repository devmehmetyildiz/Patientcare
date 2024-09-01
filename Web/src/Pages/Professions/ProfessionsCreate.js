import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class ProfessionsCreate extends Component {

  PAGE_NAME = "ProfessionsCreate"

  componentDidMount() {
    const { GetFloors } = this.props
    GetFloors()
  }

  render() {
    const { Professions, Floors, history, Profile, closeModal } = this.props

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
      return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })


    return (
      Professions.isLoading || Floors.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Professions"}>
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
              <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
              <FormInput page={this.PAGE_NAME}  placeholder={Literals.Columns.Floors[Profile.Language]} name="Floors" formtype='dropdown' multiple options={Floorsoptions} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Professions"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Professions.isLoading}
              buttonText={Literals.Button.Create[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddProfessions, history, fillProfessionnotification, Profile, closeModal } = this.props
    const data = this.context.getForm(this.PAGE_NAME)
    data.Floors = (data.Floors || []).join(',')
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillProfessionnotification(error)
      })
    } else {
      AddProfessions({ data, history, closeModal })
    }
  }
}
ProfessionsCreate.contextType = FormContext
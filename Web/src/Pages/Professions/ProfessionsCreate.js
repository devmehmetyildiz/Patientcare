import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb, Button } from 'semantic-ui-react'
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

    const t = Profile?.i18n?.t

    const Floorsoptions = (Floors.list || []).filter(u => u.Isactive).map(Floor => {
      return { key: Floor.Uuid, text: Floor.Name, value: Floor.Uuid }
    })

    return (
      Professions.isLoading || Floors.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Professions"}>
                <Breadcrumb.Section >{t('Pages.Professions.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Professions.Page.CreateHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
            {closeModal && <Button className='absolute right-5 top-5' color='red' onClick={() => { closeModal() }}>Kapat</Button>}
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Professions.Column.Name')} name="Name" />
              <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Professions.Column.Floors')} name="Floors" formtype='dropdown' multiple options={Floorsoptions} />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Professions"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Professions.isLoading}
              buttonText={t('Common.Button.Create')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { AddProfessions, history, fillProfessionnotification, Profile, closeModal } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    data.Floors = (data.Floors || []).join(',')
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Professions.Page.Header'), description: t('Pages.Professions.Messages.NameRequired') })
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
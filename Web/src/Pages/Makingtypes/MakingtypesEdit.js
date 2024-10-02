import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'

export default class MakingtypesEdit extends Component {

  PAGE_NAME = "MakingtypesEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false
    }
  }


  componentDidMount() {
    const { GetMakingtype, match, history, MakingtypeID } = this.props
    let Id = MakingtypeID || match.params.MakingtypeID
    if (validator.isUUID(Id)) {
      GetMakingtype(Id)
    } else {
      history.push("/Makingtypes")
    }
  }

  componentDidUpdate() {
    const { Makingtypes, } = this.props
    const { selected_record, isLoading } = Makingtypes
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Makingtypes, Profile, history } = this.props

    const t = Profile?.i18n?.t

    return (
      Makingtypes.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Makingtypes"}>
                <Breadcrumb.Section >{t('Pages.Makingtypes.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Makingtypes.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Makingtypes.Column.Name')} name="Name" />
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Makingtypes"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Makingtypes.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditMakingtypes, history, fillMakingtypenotification, Makingtypes, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)
    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Makingtypes.Page.Header'), description: t('Pages.Makingtypes.Messages.NameRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillMakingtypenotification(error)
      })
    } else {
      EditMakingtypes({ data: { ...Makingtypes.selected_record, ...data }, history })
    }
  }
}
MakingtypesEdit.contextType = FormContext
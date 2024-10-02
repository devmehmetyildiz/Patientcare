import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import { SUPPORTPLAN_TYPE_CAREPLAN, SUPPORTPLAN_TYPE_PSYCHOSOCIAL, SUPPORTPLAN_TYPE_RATING } from '../../Utils/Constants'

export default class SupportplansEdit extends Component {

  PAGE_NAME = "SupportplansEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { SupportplanID, GetSupportplan, match, history } = this.props
    let Id = SupportplanID || match?.params?.SupportplanID
    if (validator.isUUID(Id)) {
      GetSupportplan(Id)
    } else {
      history.push("/Supportplans")
    }
  }

  componentDidUpdate() {
    const { Supportplans } = this.props
    const { selected_record, isLoading } = Supportplans
    if (selected_record && Object.keys(selected_record).length > 0 && !isLoading && selected_record.Id !== 0 && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }

  render() {

    const { Supportplans, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Supportplans

    const Supportplantypeoptions = [
      { key: 1, text: t('Common.Supportplan.Types.Careplan'), value: SUPPORTPLAN_TYPE_CAREPLAN },
      { key: 2, text: t('Common.Supportplan.Types.Psychosocial'), value: SUPPORTPLAN_TYPE_PSYCHOSOCIAL },
      { key: 3, text: t('Common.Supportplan.Types.Rating'), value: SUPPORTPLAN_TYPE_RATING },
    ]

    return (
      isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Supportplans"}>
                <Breadcrumb.Section >{t('Pages.Supportplans.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Supportplans.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Supportplans.Column.Type')} options={Supportplantypeoptions} name="Type" formtype='dropdown' />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Supportplans.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Supportplans.Column.Shortname')} name="Shortname" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Supportplans.Column.Info')} name="Info" />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Supportplans"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Supportplans.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditSupportplans, history, fillSupportplannotification, Supportplans, Profile } = this.props

    const t = Profile?.i18n?.t

    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Supportplans.Page.Header'), description: t('Pages.Supportplans.Messages.NameRequired') })
    }
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Supportplans.Page.Header'), description: t('Pages.Supportplans.Messages.TypeRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillSupportplannotification(error)
      })
    } else {
      EditSupportplans({ data: { ...Supportplans.selected_record, ...data }, history })
    }


  }
}
SupportplansEdit.contextType = FormContext
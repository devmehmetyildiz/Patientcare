import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import SupportplansCreate from '../../Containers/Supportplans/SupportplansCreate'
import { SUPPORTPLAN_TYPE_CAREPLAN, SUPPORTPLAN_TYPE_PSYCHOSOCIAL, SUPPORTPLAN_TYPE_RATING } from '../../Utils/Constants'
export default class SupportplanlistsEdit extends Component {

  PAGE_NAME = "SupportplanlistsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { SupportplanlistID, GetSupportplanlist, match, history, GetSupportplans } = this.props
    let Id = SupportplanlistID || match?.params?.SupportplanlistID
    if (validator.isUUID(Id)) {
      GetSupportplanlist(Id)
      GetSupportplans()
    } else {
      history.push("/GetSupportplanlists")
    }
  }

  componentDidUpdate() {
    const { Supportplanlists, Supportplans, Departments } = this.props
    const { selected_record, isLoading } = Supportplanlists
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !Departments.isLoading > 0 && !Supportplans.isLoading && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true,
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Supportplans: selected_record.Supportplanuuids.map(u => { return u.PlanID }) })
    }
  }

  render() {

    const { Supportplanlists, Supportplans, Profile, history } = this.props

    const t = Profile?.i18n?.t

    const Supportplanoptions = (Supportplans.list || []).filter(u => u.Isactive).map(plan => {
      return { key: plan.Uuid, text: plan.Name, value: plan.Uuid }
    })

    const Supportplantypeoptions = [
      { key: 1, text: t('Common.Supportplan.Types.Careplan'), value: SUPPORTPLAN_TYPE_CAREPLAN },
      { key: 2, text: t('Common.Supportplan.Types.Psychosocial'), value: SUPPORTPLAN_TYPE_PSYCHOSOCIAL },
      { key: 3, text: t('Common.Supportplan.Types.Rating'), value: SUPPORTPLAN_TYPE_RATING },
    ]

    return (
      Supportplanlists.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Supportplanlists"}>
                <Breadcrumb.Section >{t('Pages.Supportplanlists.Page.Header')}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{t('Pages.Supportplanlists.Page.EditHeader')}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Supportplanlists.Column.Type')} name="Type" formtype='dropdown' options={Supportplantypeoptions} />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Supportplanlists.Column.Name')} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={t('Pages.Supportplanlists.Column.Info')} name="Info" />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Supportplanlists.Column.Supportplans')} name="Supportplans" multiple options={Supportplanoptions} formtype='dropdown' modal={SupportplansCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Supportplanlists"}
              buttonText={t('Common.Button.Goback')}
            />
            <Submitbutton
              isLoading={Supportplanlists.isLoading}
              buttonText={t('Common.Button.Update')}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditSupportplanlists, history, fillSupportplanlistnotification, Supportplanlists, Profile, Supportplans } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    const t = Profile?.i18n?.t

    data.Supportplans = data.Supportplans.map(id => {
      return (Supportplans.list || []).find(u => u.Uuid === id)
    })

    let errors = []
    if (!validator.isNumber(data.Type)) {
      errors.push({ type: 'Error', code: t('Pages.Supportplanlists.Page.Header'), description: t('Pages.Supportplanlists.Messages.TypeRequired') })
    }
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: t('Pages.Supportplanlists.Page.Header'), description: t('Pages.Supportplanlists.Messages.NameRequired') })
    }
    if (!validator.isArray(data.Supportplans)) {
      errors.push({ type: 'Error', code: t('Pages.Supportplanlists.Page.Header'), description: t('Pages.Supportplanlists.Messages.SupportplansRequired') })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillSupportplanlistnotification(error)
      })
    } else {
      EditSupportplanlists({ data: { ...Supportplanlists.selected_record, ...data }, history })
    }
  }

}
SupportplanlistsEdit.contextType = FormContext

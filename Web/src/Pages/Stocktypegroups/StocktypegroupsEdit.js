import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Breadcrumb } from 'semantic-ui-react'
import Literals from './Literals'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
import StocktypesCreate from '../../Containers/Stocktypes/StocktypesCreate'

export default class StocktypegroupsEdit extends Component {

  PAGE_NAME = "StocktypegroupsEdit"

  constructor(props) {
    super(props)
    this.state = {
      isDatafetched: false,
    }
  }

  componentDidMount() {
    const { GetStocktypegroup, match, history, GetStocktypes, StocktypegroupID } = this.props
    let Id = StocktypegroupID || match.params.StocktypegroupID
    if (validator.isUUID(Id)) {
      GetStocktypegroup(Id)
      GetStocktypes()
    } else {
      history.push("/Stocktypegroups")
    }
  }

  componentDidUpdate() {
    const { Stocktypegroups, Stocktypes } = this.props
    const { selected_record, isLoading } = Stocktypegroups
    if (selected_record &&
      Object.keys(selected_record).length > 0 &&
      selected_record.Id !== 0 &&
      Stocktypes.list.length > 0 &&
      !Stocktypes.isLoading &&
      !isLoading &&
      !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true
      })
      this.context.setForm(this.PAGE_NAME, { ...selected_record, Stocktypes: (selected_record?.Stocktypes || '').split(',') })
    }
  }

  render() {

    const { Stocktypes, Stocktypegroups, Profile, history } = this.props

    const Stocktypesoption = (Stocktypes.list || []).filter(u => u.Isactive).map(type => {
      return { key: type.Uuid, text: type.Name, value: type.Uuid }
    })

    return (
      Stocktypegroups.isLoading ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Stocktypegroups"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                <FormInput page={this.PAGE_NAME} placeholder={Literals.Columns.Info[Profile.Language]} name="Info" />
              </Form.Group>
              <Form.Group widths={"equal"}>
                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Stocktypes[Profile.Language]} options={Stocktypesoption} name="Stocktypes" formtype='dropdown' multiple modal={StocktypesCreate} />
              </Form.Group>
            </Form>
          </Contentwrapper>
          <Footerwrapper>
            <Gobackbutton
              history={history}
              redirectUrl={"/Stocktypegroups"}
              buttonText={Literals.Button.Goback[Profile.Language]}
            />
            <Submitbutton
              isLoading={Stocktypegroups.isLoading}
              buttonText={Literals.Button.Update[Profile.Language]}
              submitFunction={this.handleSubmit}
            />
          </Footerwrapper>
        </Pagewrapper >
    )
  }


  handleSubmit = (e) => {
    e.preventDefault()

    const { EditStocktypegroups, history, fillStocktypegroupnotification, Stocktypegroups, Profile } = this.props
    const data = this.context.getForm(this.PAGE_NAME)

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
    }
    if (!validator.isArray(data.Stocktypes)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.StocktypesRequired[Profile.Language] })
    }

    data.Stocktypes = (data.Stocktypes || []).join(',')

    if (errors.length > 0) {
      errors.forEach(error => {
        fillStocktypegroupnotification(error)
      })
    } else {
      EditStocktypegroups({ data: { ...Stocktypegroups.selected_record, ...data }, history })
    }
  }
}
StocktypegroupsEdit.contextType = FormContext
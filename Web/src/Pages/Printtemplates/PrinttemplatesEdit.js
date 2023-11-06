import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Form, Grid, GridColumn, Tab } from 'semantic-ui-react'
import { Breadcrumb, Button } from 'semantic-ui-react'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Notification from '../../Utils/Notification'
import Editor from "@monaco-editor/react";
import InnerHTML from '../../Utils/DangerouslySetHtmlContent'
import Literals from './Literals'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import { FormContext } from '../../Provider/FormProvider'
import Gobackbutton from '../../Common/Gobackbutton'
import Submitbutton from '../../Common/Submitbutton'
export default class PrinttemplatesEdit extends Component {

  PAGE_NAME = 'PrinttemplatesEdit'

  constructor(props) {
    super(props)
    this.state = {
      template: '',
      isDatafetched: false
    }
    this.templateEditorRef = React.createRef()
  }
  componentDidMount() {
    const { GetPrinttemplate, match, history, PrinttemplateID } = this.props
    let Id = PrinttemplateID || match.params.PrinttemplateID
    if (validator.isUUID(Id)) {
      GetPrinttemplate(Id)
    } else {
      history.push("/Printtemplates")
    }
  }

  componentDidUpdate() {
    const { Printtemplates } = this.props
    const { selected_record, isLoading } = Printtemplates
    if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
      this.setState({
        isDatafetched: true, template: selected_record.Printtemplate
      })
      this.context.setForm(this.PAGE_NAME, selected_record)
    }
  }


  render() {

    const { Printtemplates, Profile, history } = this.props
    const { isLoading, isDispatching } = Printtemplates


    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Printtemplates"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
          <Form>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem: Literals.Columns.Savescreen[Profile.Language],
                    pane: {
                      key: 'save',
                      content: <React.Fragment>
                        <Form.Group widths={"equal"}>
                          <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                        </Form.Group>
                      </React.Fragment>
                    }
                  },
                  {
                    menuItem: Literals.Columns.Editorscreen[Profile.Language],
                    pane: {
                      key: 'design',
                      content: <div className='max-h-[calc(66vh-10px)] overflow-y-auto overflow-x-hidden'>
                        <Grid columns={2}>
                          <Grid.Row>
                            <GridColumn>
                              <div className='p-2 shadow-lg shadow-gray-300'>
                                <Editor
                                  height="60vh"
                                  language="html"
                                  value={this.state.template}
                                  onMount={this.handleTemplateEditorDidMount}
                                />
                              </div>
                            </GridColumn>
                            <GridColumn>
                              <div className='p-2 shadow-lg shadow-gray-300'>
                                <InnerHTML html={true ?
                                  this.state.template ? this.state.template : '<div class="print-design-preview-message">No code to show.</div>' :
                                  '<div class="print-design-preview-message">Preview only available in html design</div>'} />
                              </div>
                            </GridColumn>
                          </Grid.Row>
                        </Grid>
                      </div>
                    }
                  }
                ]}
                renderActiveOnly={false} />
              <Footerwrapper>
                <Form.Group widths={'equal'}>
                  <Gobackbutton
                    history={history}
                    redirectUrl={"/Printtemplates"}
                    buttonText={Literals.Button.Goback[Profile.Language]}
                  />
                  <Button floated="right" type="button" color='grey' onClick={(e) => { this.context.clearForm(this.PAGE_NAME) }}>{Literals.Button.Clear[Profile.Language]}</Button>
                </Form.Group>
                <Submitbutton
                  isLoading={isLoading}
                  buttonText={Literals.Button.Update[Profile.Language]}
                  submitFunction={this.handleSubmit}
                />
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { EditPrinttemplates, history, fillPrinttemplatenotification, Printtemplates, Profile } = this.props

    const data = formToObject(e.target)
    data.Printtemplate = this.state.template

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Namerequired[Profile.Language] })
    }
    if (!validator.isString(data.Printtemplate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Printtemplaterequired[Profile.Language] })
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPrinttemplatenotification(error)
      })
    } else {
      EditPrinttemplates({ data: { ...Printtemplates.selected_record, ...data }, history })
    }
  }


  handleTemplateEditorChange = () => {
    this.setState({ template: this.templateEditorRef.current.getValue() })
  }

  handleTemplateEditorDidMount = (editor, monaco) => {
    this.templateEditorRef.current = editor
    this.templateEditorRef.current.onDidChangeModelContent(this.handleTemplateEditorChange)
  }
}
PrinttemplatesEdit.contextType = FormContext


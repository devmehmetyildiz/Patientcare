import React, { Component } from 'react'
import { Link, } from 'react-router-dom'
import { Divider, Dropdown, Form, Grid, GridColumn, Tab } from 'semantic-ui-react'
import { Breadcrumb, Button, Header } from 'semantic-ui-react'
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
export default class PrinttemplatesCreate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedDepartment: "",
      template: ''
    }
    this.templateEditorRef = React.createRef()
  }
  componentDidMount() {
    const { GetDepartments } = this.props
    GetDepartments()
  }

  componentDidUpdate() {
    const { Departments, Printtemplates, removeDepartmentnotification, removePrinttemplatenotification } = this.props
    Notification(Printtemplates.notifications, removePrinttemplatenotification)
    Notification(Departments.notifications, removeDepartmentnotification)
  }


  render() {

    const { Printtemplates, Departments,Profile } = this.props
    const { isLoading, isDispatching } = Printtemplates

    const Departmentoptions = Departments.list.map(department => {
      return { key: department.Uuid, text: department.Name, value: department.Uuid }
    })

    return (
      isLoading || isDispatching ? <LoadingPage /> :
        <Pagewrapper>
          <Headerwrapper>
            <Headerbredcrump>
              <Link to={"/Printtemplates"}>
                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
              </Link>
              <Breadcrumb.Divider icon='right chevron' />
              <Breadcrumb.Section>{Literals.Page.Pagecreateheader[Profile.Language]}</Breadcrumb.Section>
            </Headerbredcrump>
          </Headerwrapper>
          <Pagedivider />
          <Contentwrapper>
            <Form className='' onSubmit={this.handleSubmit}>
              <Tab className='station-tab'
                panes={[
                  {
                    menuItem:Literals.Columns.Savescreen[Profile.Language],
                    pane: {
                      key: 'save',
                      content: <React.Fragment>
                        <Form.Group widths={"equal"}>
                          <FormInput required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                          <FormInput required placeholder={Literals.Columns.Valuekey[Profile.Language]} name="Valuekey" />
                        </Form.Group>
                        <FormInput required placeholder={Literals.Columns.Department[Profile.Language]} value={this.state.selectedDepartment} clearable search options={Departmentoptions} onChange={(e, { value }) => { this.setState({ selectedDepartment: value }) }} formtype="dropdown" />
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
                <Link to="/Printtemplates">
                  <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                </Link>
                <Button floated="right" type='submit' color='blue'>{Literals.Button.Create[Profile.Language]}</Button>
              </Footerwrapper>
            </Form>
          </Contentwrapper>
        </Pagewrapper >
    )
  }

  handleSubmit = (e) => {
    e.preventDefault()

    const { AddPrinttemplates, history, fillPrinttemplatenotification, Profile } = this.props

    const data = formToObject(e.target)
    data.DepartmentID = this.state.selectedDepartment
    data.Printtemplate = this.state.template

    let errors = []
    if (!validator.isString(data.Name)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description:Literals.Messages.Namerequired[Profile.Language]  })
    }
    if (!validator.isString(data.Valuekey)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Valuekeyrequired[Profile.Language] })
    }
    if (!validator.isUUID(data.DepartmentID)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Departmentrequired[Profile.Language] })
    }
    if (!validator.isString(data.Printtemplate)) {
      errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.Printtemplaterequired[Profile.Language]})
    }
    if (errors.length > 0) {
      errors.forEach(error => {
        fillPrinttemplatenotification(error)
      })
    } else {
      AddPrinttemplates({ data, history })
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



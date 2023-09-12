import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Button, Form, Tab } from 'semantic-ui-react'
import Notification from '../../Utils/Notification'
import formToObject from 'form-to-object'
import LoadingPage from '../../Utils/LoadingPage'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import Headerbredcrump from '../../Common/Wrappers/Headerbredcrump'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Contentwrapper from '../../Common/Wrappers/Contentwrapper'
import FormInput from '../../Utils/FormInput'
import Footerwrapper from '../../Common/Wrappers/Footerwrapper'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import Editor from '@monaco-editor/react'

export default class RulesEdit extends Component {

    PAGE_NAME = 'RulesEdit'

    constructor(props) {
        super(props)
        this.state = {
            template: '',
            isDatafetched: false
        }
        this.templateEditorRef = React.createRef()
    }

    componentDidMount() {
        const { GetRule, match, history, RuleID } = this.props
        let Id = RuleID || match.params.RuleID
        if (validator.isUUID(Id)) {
            GetRule(Id)
        } else {
            history && history.push("/Rules")
        }
    }

    componentDidUpdate() {
        const { Rules, removeRulenotification } = this.props
        const { selected_record, isLoading } = Rules
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && !isLoading && !this.state.isDatafetched) {
            this.setState({ template: selected_record.Rule, isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
        Notification(Rules.notifications, removeRulenotification, this.context.clearForm)
    }

    render() {

        const { Rules, Profile, history } = this.props
        const { isLoading, isDispatching } = Rules

        return (
            isLoading || isDispatching ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Rules"}>
                                <Breadcrumb.Section >{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{Literals.Page.Pageeditheader[Profile.Language]}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form onSubmit={this.handleSubmit}>
                            <Tab className='station-tab'
                                panes={[
                                    {
                                        menuItem: Literals.Columns.Savescreen[Profile.Language],
                                        pane: {
                                            key: 'save',
                                            content: <div className='max-h-[calc(66vh-10px)] overflow-y-auto overflow-x-hidden'>
                                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Name[Profile.Language]} name="Name" />
                                                <FormInput page={this.PAGE_NAME} required placeholder={Literals.Columns.Status[Profile.Language]} name="Status" formtype={'checkbox'} />
                                            </div>
                                        }
                                    },
                                    {
                                        menuItem: Literals.Columns.Editorscreen[Profile.Language],
                                        pane: {
                                            key: 'design',
                                            content: <div className='max-h-[calc(66vh-10px)] overflow-y-auto overflow-x-hidden'>
                                                <div className='p-2 shadow-lg shadow-gray-300'>
                                                    <Editor
                                                        height="60vh"
                                                        language="javascript"
                                                        value={this.state.template}
                                                        onMount={this.handleTemplateEditorDidMount}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    }
                                ]}
                                renderActiveOnly={false} />
                            <Footerwrapper>
                                <Form.Group widths={'equal'}>
                                    {history && <Link to="/Rules">
                                        <Button floated="left" color='grey'>{Literals.Button.Goback[Profile.Language]}</Button>
                                    </Link>}
                                    <Button floated="right" type="button" color='grey' onClick={(e) => { this.context.setForm(this.PAGE_NAME, Rules.selected_record) }}>{Literals.Button.Clear[Profile.Language]}</Button>
                                </Form.Group>
                                <Button floated="right" type='submit' color='blue'>{Literals.Button.Update[Profile.Language]}</Button>
                            </Footerwrapper>
                        </Form>
                    </Contentwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { EditRules, history, fillRulenotification, Rules, Profile } = this.props
        const data = formToObject(e.target)
        data.Rule = this.state.template
        data.Status = this.context.formstates[`${this.PAGE_NAME}/Status`]
        let errors = []
        if (!validator.isString(data.Name)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.NameRequired[Profile.Language] })
        }
        if (!validator.isString(data.Rule)) {
            errors.push({ type: 'Error', code: Literals.Page.Pageheader[Profile.Language], description: Literals.Messages.RuleRequired[Profile.Language] })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillRulenotification(error)
            })
        } else {
            EditRules({ data: { ...Rules.selected_record, ...data }, history })
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
RulesEdit.contextType = FormContext
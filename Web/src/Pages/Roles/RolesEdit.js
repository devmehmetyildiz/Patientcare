import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox, Divider, Form, Search, Breadcrumb, Button } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import { FormContext } from '../../Provider/FormProvider'
import { FormInput, Contentwrapper, Footerwrapper, Gobackbutton, Headerbredcrump, Headerwrapper, LoadingPage, Pagedivider, Pagewrapper, Submitbutton } from '../../Components'
export default class RolesEdit extends Component {

    PAGE_NAME = 'RolesEdit'

    constructor(props) {
        super(props)
        this.state = {
            selectedPrivileges: [],
            isDatafetched: false,
            searchParam: ''
        }
    }

    componentDidMount() {
        const { GetRole, GetPrivileges, GetPrivilegegroups, match, history, RoleID } = this.props
        let Id = RoleID || match.params.RoleID
        if (validator.isUUID(Id)) {
            GetRole(Id)
            GetPrivileges()
            GetPrivilegegroups()
        } else {
            history && history.push("/Roles")
        }
    }

    componentDidUpdate() {
        const { Roles } = this.props
        const { privileges, selected_record, privilegegroups, isLoading } = Roles
        if (selected_record && Object.keys(selected_record).length > 0 && selected_record.Id !== 0 && privileges.length > 0 && privilegegroups.length > 0 && !isLoading && !this.state.isDatafetched) {
            this.setState({ selectedPrivileges: selected_record.Privileges, isDatafetched: true })
            this.context.setForm(this.PAGE_NAME, selected_record)
        }
    }

    render() {

        const { Roles, Profile, history } = this.props

        const t = Profile?.i18n?.t

        const { privileges, privilegegroups, isLoading } = Roles

        const decoratedgroups = (privilegegroups || []).map(group => {
            const foundedPrivileges = (privileges || []).filter(u => u.group[Profile.Language] === group[Profile.Language] && (u.text[Profile.Language].toLowerCase()).includes(this.state.searchParam.toLowerCase()))
            return foundedPrivileges.length > 0 ? { name: group[Profile.Language], privileges: foundedPrivileges } : null
        }).filter(u => u)

        return (
            isLoading ? <LoadingPage /> :
                <Pagewrapper>
                    <Headerwrapper>
                        <Headerbredcrump>
                            <Link to={"/Roles"}>
                                <Breadcrumb.Section >{t('Pages.Roles.Page.Header')}</Breadcrumb.Section>
                            </Link>
                            <Breadcrumb.Divider icon='right chevron' />
                            <Breadcrumb.Section>{t('Pages.Roles.Page.EditHeader')}</Breadcrumb.Section>
                        </Headerbredcrump>
                    </Headerwrapper>
                    <Pagedivider />
                    <Contentwrapper>
                        <Form>
                            <div className='w-full'>
                                <Button className='!bg-[#2355a0] !text-white !cursor-pointer' floated='right' onClick={this.handleAddall} >{t('Pages.Roles.Column.AddAll')}</Button>
                            </div>
                            <FormInput page={this.PAGE_NAME} required placeholder={t('Pages.Roles.Column.Name')} name="Name" />
                            <div className='w-full py-2'>
                                <Search
                                    placeholder='Search...'
                                    onSearchChange={(e) => { this.setState({ searchParam: e.target.value }) }}
                                    showNoResults={false}
                                />
                            </div>
                            <div className={`mb-4 outline outline-[1px] rounded-md outline-gray-200 p-4 overflow-y-auto max-h-[calc(100vh-${Profile.Ismobile ? '27' : '30'}.2rem)]`}>
                                {(decoratedgroups || []).map(privilegegroup => {
                                    return <div key={privilegegroup?.name} className="mb-8">
                                        <div className='flex flex-row justify-start items-center'>
                                            <label className='text-[#000000de] font-bold'>{privilegegroup?.name}</label>
                                            <Checkbox toggle className='ml-4'
                                                onClick={(e) => { this.handleAddgroup(e) }}
                                                id={privilegegroup?.name}
                                                checked={this.Checkprivilegesgroup(privilegegroup?.name) ? true : false}
                                            />
                                        </div>
                                        <Divider className='w-full  h-[1px]' />
                                        <div className={`grid ${Profile.Ismobile ? 'grid-cols-1' : ' lg:grid-cols-3 md:grid-cols-2'} gap-2`}>
                                            {(privilegegroup?.privileges || []).map((privilege, index) => {
                                                return <Checkbox toggle className='m-2'
                                                    checked={(this.state.selectedPrivileges.length > 0 ? this.state.selectedPrivileges : []).find(u => u.code === privilege.code) ? true : false}
                                                    onClick={(e) => { this.handleClickprivilege(e) }}
                                                    id={privilege.code}
                                                    key={index}
                                                    label={privilege.text[Profile.Language]} />
                                            })}
                                        </div>
                                    </div>
                                })}
                            </div>
                        </Form>
                    </Contentwrapper>
                    <Footerwrapper>
                        <Form.Group widths={'equal'}>
                            <Gobackbutton
                                history={history}
                                redirectUrl={"/Roles"}
                                buttonText={t('Common.Button.Goback')}
                            />
                            <Button floated="right" type="button" color='grey' onClick={(e) => {
                                this.setState({ selectedPrivileges: [] })
                            }}>{t('Common.Button.Clear')}</Button>
                        </Form.Group>
                        <Submitbutton
                            isLoading={isLoading}
                            buttonText={t('Common.Button.Update')}
                            submitFunction={this.handleSubmit}
                        />
                    </Footerwrapper>
                </Pagewrapper >
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { EditRoles, history, fillRolenotification, Roles, Profile } = this.props

        const t = Profile?.i18n?.t

        const data = this.context.getForm(this.PAGE_NAME)
        data.Privileges = this.state.selectedPrivileges.map(u => { return u.code })
        let errors = []
        if (!validator.isString(data.Name)) {
            errors.push({ type: 'Error', code: t('Pages.Roles.Page.Header'), description: t('Pages.Roles.Messages.NameRequired') })
        }
        if (!validator.isArray(data.Privileges)) {
            errors.push({ type: 'Error', code: t('Pages.Roles.Page.Header'), description: t('Pages.Roles.Messages.PrivilegesRequired') })
        }
        if (errors.length > 0) {
            errors.forEach(error => {
                fillRolenotification(error)
            })
        } else {
            EditRoles({ data: { ...Roles.selected_record, ...data }, history })
        }

    }

    Checkprivilegesgroup = (group) => {
        const { Profile } = this.props
        const selectedlist = (this.state.selectedPrivileges || []).filter(u => u.group[Profile.Language] === group)
        const list = (this.props.Roles.privileges || []).filter(u => u.group[Profile.Language] === group)
        if ((list.length === selectedlist.length) && list.length !== 0 && selectedlist.length !== 0) {
            return true
        } else {
            return false
        }
    }

    handleAddgroup = (e) => {
        const { Profile } = this.props
        e.target.checked
            ? this.setState({ selectedPrivileges: this.state.selectedPrivileges.filter(function (el) { return (el.group[Profile.Language] !== e.target.id) }).concat(this.props.Roles.privileges.filter(u => u.group[Profile.Language] === e.target.id) || []) })
            : this.setState({ selectedPrivileges: this.state.selectedPrivileges.filter(function (el) { return (el.group[Profile.Language] !== e.target.id) }) })
    }

    handleClickprivilege = (e) => {
        e.target.checked
            ? this.setState({ selectedPrivileges: [...this.state.selectedPrivileges, this.props.Roles.privileges.find(u => u.code === e.target.id)] })
            : this.setState({ selectedPrivileges: this.state.selectedPrivileges.filter(function (el) { return el.code !== e.target.id; }) })
    }

    handleAddall = (e) => {
        e.preventDefault()
        this.setState({ selectedPrivileges: this.props.Roles.privileges })
    }
}
RolesEdit.contextType = FormContext
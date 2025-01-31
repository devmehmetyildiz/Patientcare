import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import TodogroupdefinesDelete from '../../Containers/Todogroupdefines/TodogroupdefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import privileges from '../../Constants/Privileges'
export default class Todogroupdefines extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tododefineStatus: []
        }
    }

    componentDidMount() {
        const { GetTodogroupdefines, GetTododefines, GetDepartments } = this.props
        GetTodogroupdefines()
        GetTododefines()
        GetDepartments()
    }

    render() {
        const { Todogroupdefines, Profile, handleDeletemodal, handleSelectedTodogroupdefine } = this.props

        const t = Profile?.i18n?.t

        const { isLoading } = Todogroupdefines

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: t('Common.Column.Id'), accessor: 'Id' },
            { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
            { Header: t('Pages.Todogroupdefines.Column.Name'), accessor: 'Name', Title: true },
            { Header: t('Pages.Todogroupdefines.Column.Tododefines'), accessor: (row, freeze) => this.tododefineCellhandler(row, freeze) },
            { Header: t('Pages.Todogroupdefines.Column.Department'), accessor: row => this.departmentCellhandler(row?.DepartmentID), Subtitle: true, Withtext: true },
            { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
            { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
            { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
            { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
            { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.todogroupdefineupdate },
            { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.todogroupdefinedelete }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "todogroupdefine"
        let initialConfig = GetInitialconfig(Profile, metaKey)

        const list = (Todogroupdefines.list || []).filter(u => u.Isactive).map(item => {
            return {
                ...item,
                edit: <Link to={`/Todogroupdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedTodogroupdefine(item)
                    handleDeletemodal(true)
                }} />
            }
        })

        return (
            isLoading ? <LoadingPage /> :
                <React.Fragment>
                    <Pagewrapper>
                        <Headerwrapper>
                            <Grid columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Todogroupdefines"}>
                                            <Breadcrumb.Section>{t('Pages.Todogroupdefines.Page.Header')}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                                <Settings
                                    Profile={Profile}
                                    Pagecreateheader={t('Pages.Todogroupdefines.Page.CreateHeader')}
                                    Pagecreatelink={"/Todogroupdefines/Create"}
                                    Columns={Columns}
                                    list={list}
                                    initialConfig={initialConfig}
                                    metaKey={metaKey}
                                    Showcreatebutton
                                    Showcolumnchooser
                                    Showexcelexport
                                    CreateRole={privileges.todogroupdefineadd}
                                    ReportRole={privileges.todogroupdefinegetreport}
                                    ViewRole={privileges.todogroupdefinemanageview}
                                />
                            </Grid>
                        </Headerwrapper>
                        <Pagedivider />
                        {list.length > 0 ?
                            <div className='w-full mx-auto '>
                                {Profile.Ismobile ?
                                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                            </div> : <NoDataScreen message={t('Common.NoDataFound')} />
                        }
                    </Pagewrapper>
                    <TodogroupdefinesDelete />
                </React.Fragment>
        )
    }

    expandTodos = (rowid) => {
        const prevData = this.state.tododefineStatus
        prevData.push(rowid)
        this.setState({ tododefineStatus: [...prevData] })
    }

    shrinkTodos = (rowid) => {
        const index = this.state.tododefineStatus.indexOf(rowid)
        const prevData = this.state.tododefineStatus
        if (index > -1) {
            prevData.splice(index, 1)
            this.setState({ tododefineStatus: [...prevData] })
        }
    }

    tododefineCellhandler = (row, freeze) => {
        const { Tododefines } = this.props
        const itemId = row?.Id
        const itemTodos = (row?.Tododefineuuids || []).map(u => { return (Tododefines.list || []).find(tododefine => tododefine.Uuid === u.TodoID) })
        const itemTodostxt = itemTodos.map(u => u?.Name).join(',')
        if (freeze === true) {
            return itemTodostxt
        }
        return itemTodostxt.length - 35 > 20 ?
            (
                !this.state.tododefineStatus.includes(itemId) ?
                    [itemTodostxt.slice(0, 35) + ' ...(' + itemTodos.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandTodos(itemId)}> ...Daha Fazla Göster</Link>] :
                    [itemTodostxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkTodos(itemId)}> ...Daha Az Göster</Link>]
            ) : itemTodostxt
    }

    departmentCellhandler = (value) => {
        const { Departments } = this.props
        if (Departments.isLoading) {
            return <Loader size='small' active inline='centered' ></Loader>
        } else {
            return (Departments.list || []).find(u => u.Uuid === value)?.Name
        }
    }
}
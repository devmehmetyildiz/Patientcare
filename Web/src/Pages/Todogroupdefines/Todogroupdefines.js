import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Loader } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import TodogroupdefinesDelete from '../../Containers/Todogroupdefines/TodogroupdefinesDelete'
import { getInitialconfig } from '../../Utils/Constants'
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
        const { isLoading} = Todogroupdefines

        const colProps = {
            sortable: true,
            canGroupBy: true,
            canFilter: true
        }

        const Columns = [
            { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
            { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
            { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Title: true },
            { Header: Literals.Columns.Tododefines[Profile.Language], accessor: (row, freeze) => this.tododefineCellhandler(row, freeze) },
            { Header: Literals.Columns.Department[Profile.Language], accessor: row => this.departmentCellhandler(row?.DepartmentID), Subtitle: true, Withtext: true },
            { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
            { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
            { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
            { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
            { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
            { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
        ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

        const metaKey = "todogroupdefine"
        let initialConfig = getInitialconfig(Profile, metaKey)

        const list = (Todogroupdefines.list || []).map(item => {
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
            isLoading  ? <LoadingPage /> :
                <React.Fragment>
                    <Pagewrapper>
                        <Headerwrapper>
                            <Grid columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Todogroupdefines"}>
                                            <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                                <Settings
                                    Profile={Profile}
                                    Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                                    Pagecreatelink={"/Todogroupdefines/Create"}
                                    Columns={Columns}
                                    list={list}
                                    initialConfig={initialConfig}
                                    metaKey={metaKey}
                                    Showcreatebutton
                                    Showcolumnchooser
                                    Showexcelexport
                                />
                            </Grid>
                        </Headerwrapper>
                        <Pagedivider />
                        {list.length > 0 ?
                            <div className='w-full mx-auto '>
                                {Profile.Ismobile ?
                                    <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                                    <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
                            </div> : <NoDataScreen message={Literals.Messages.Nodatafind[Profile.Language]} />
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
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Icon, Grid, GridColumn } from 'semantic-ui-react'
import DataTable from '../../Utils/DataTable'
import LoadingPage from '../../Utils/LoadingPage'
import NoDataScreen from '../../Utils/NoDataScreen'
import Literals from './Literals'
import Pagedivider from '../../Common/Styled/Pagedivider'
import Pagewrapper from '../../Common/Wrappers/Pagewrapper'
import Headerwrapper from '../../Common/Wrappers/Headerwrapper'
import TodogroupdefinesDelete from '../../Containers/Todogroupdefines/TodogroupdefinesDelete'
import MobileTable from '../../Utils/MobileTable'
import Settings from '../../Common/Settings'
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
        const { Todogroupdefines, Departments, Tododefines, Profile, handleDeletemodal, handleSelectedTodogroupdefine } = this.props
        const { isLoading, isDispatching } = Todogroupdefines

        const Columns = [
            { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', sortable: true, canGroupBy: true, canFilter: true, },
            { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', sortable: true, canGroupBy: true, canFilter: true, },
            { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', sortable: true, canGroupBy: true, canFilter: true, Firstheader: true },
            { Header: Literals.Columns.Tododefines[Profile.Language], accessor: 'Tododefinestxt', sortable: true, canGroupBy: true, Subheader: true, canFilter: true, isOpen: false, Cell: col => this.tododefineCellhandler(col) },
            { Header: Literals.Columns.Department[Profile.Language], accessor: 'Department', sortable: true, canGroupBy: true, canFilter: true, Finalheader: true },
            { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', sortable: true, canGroupBy: true, canFilter: true, },
            { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', sortable: true, canGroupBy: true, canFilter: true, },
            { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', sortable: true, canGroupBy: true, canFilter: true, },
            { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', sortable: true, canGroupBy: true, canFilter: true, },
            { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' },
            { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', canGroupBy: false, canFilter: false, disableFilters: true, sortable: false, className: 'text-center action-column' }]

        const metaKey = "Todogroupdefines"
        let tableMeta = (Profile.tablemeta || []).find(u => u.Meta === metaKey)
        const initialConfig = {
            hiddenColumns: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isVisible === false).map(item => {
                return item.key
            }) : ["Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
            columnOrder: tableMeta ? JSON.parse(tableMeta.Config).sort((a, b) => a.order - b.order).map(item => {
                return item.key
            }) : [],
            groupBy: tableMeta ? JSON.parse(tableMeta.Config).filter(u => u.isGroup === true).map(item => {
                return item.key
            }) : [],
        };

        const list = (Todogroupdefines.list || []).map(item => {
            var text = (item.Tododefineuuids || []).map(u => {
                return (Tododefines.list || []).find(tododefine => tododefine.Uuid === u.TodoID)?.Name
            }).join(", ")
            return {
                ...item,
                Tododefinestxt: text,
                Department: (Departments.list || []).find(u => u.Uuid === item.DepartmentID)?.Name,
                edit: <Link to={`/Todogroupdefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
                delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
                    handleSelectedTodogroupdefine(item)
                    handleDeletemodal(true)
                }} />
            }
        })

        return (
            isLoading || isDispatching ? <LoadingPage /> :
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

    tododefineCellhandler = (col) => {
        const { Tododefines, Profile } = this.props
        if (col.value) {
            if (!col.cell?.isGrouped && !Profile.Ismobile) {
                const itemId = col?.row?.original?.Id
                const itemTodos = (col.row.original.Tododefineuuids || []).map(u => { return (Tododefines.list || []).find(tododefine => tododefine.Uuid === u.TodoID) })
                return col.value.length - 35 > 20 ?
                    (
                        !this.state.tododefineStatus.includes(itemId) ?
                            [col.value.slice(0, 35) + ' ...(' + itemTodos.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandTodos(itemId)}> ...Daha Fazla Göster</Link>] :
                            [col.value, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkTodos(itemId)}> ...Daha Az Göster</Link>]
                    ) : col.value
            }
            return col.value
        }
        return null
    }

}
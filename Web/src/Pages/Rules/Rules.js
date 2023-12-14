import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import Literals from './Literals'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import RulesDelete from '../../Containers/Rules/RulesDelete'
import RulesLog from '../../Containers/Rules/RulesLog'
import { getInitialconfig } from '../../Utils/Constants'
export class Rules extends Component {

  componentDidMount() {
    const { GetRules } = this.props
    GetRules()
  }

  render() {
    const { Rules, Profile, handleDeletemodal, handleSelectedRule, handleLogmodal, GetRulelogs, StopRules } = this.props
    const { isLoading, isDispatching } = Rules

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: Literals.Columns.Id[Profile.Language], accessor: 'Id', },
      { Header: Literals.Columns.Uuid[Profile.Language], accessor: 'Uuid', },
      { Header: Literals.Columns.Name[Profile.Language], accessor: 'Name', Firstheader: true },
      { Header: Literals.Columns.Info[Profile.Language], accessor: 'Info' },
      { Header: Literals.Columns.Status[Profile.Language], accessor: 'Status', disableProps: true, Subheader: true, Cell: col => this.statusCellhandler(col) },
      { Header: Literals.Columns.Createduser[Profile.Language], accessor: 'Createduser', },
      { Header: Literals.Columns.Updateduser[Profile.Language], accessor: 'Updateduser', },
      { Header: Literals.Columns.Createtime[Profile.Language], accessor: 'Createtime', },
      { Header: Literals.Columns.Updatetime[Profile.Language], accessor: 'Updatetime', },
      { Header: Literals.Columns.Stop[Profile.Language], accessor: 'Stop', disableProps: true },
      { Header: Literals.Columns.log[Profile.Language], accessor: 'log', disableProps: true },
      { Header: Literals.Columns.edit[Profile.Language], accessor: 'edit', disableProps: true },
      { Header: Literals.Columns.delete[Profile.Language], accessor: 'delete', disableProps: true }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "Rules"
    let initialConfig = getInitialconfig(Profile, metaKey)

    const list = (Rules.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        Stop: item.Status === 1 ? <Icon link size='large' color='red' name='hand paper' onClick={() => {
          StopRules(item.Uuid)
        }} /> : <Icon link size='large' color='red' name='close' />,
        log: <Icon link size='large' color='grey' name='clipboard' onClick={() => {
          handleSelectedRule(item)
          GetRulelogs(item.Uuid)
          handleLogmodal(true)
        }} />,
        edit: <Link to={`/Rules/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedRule(item)
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
                    <Link to={"/Rules"}>
                      <Breadcrumb.Section>{Literals.Page.Pageheader[Profile.Language]}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={Literals.Page.Pagecreateheader[Profile.Language]}
                  Pagecreatelink={"/Rules/Create"}
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
          <RulesDelete />
          <RulesLog />
        </React.Fragment>
    )
  }
  statusCellhandler = (col) => {
    return <Icon style={{ color: col.value === 1 ? 'green' : 'red' }} className="ml-2" name='circle' />
  }
}
export default Rules
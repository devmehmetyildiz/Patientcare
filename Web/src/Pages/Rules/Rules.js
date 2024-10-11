import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import RulesDelete from '../../Containers/Rules/RulesDelete'
import RulesLog from '../../Containers/Rules/RulesLog'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export class Rules extends Component {

  componentDidMount() {
    const { GetRules } = this.props
    GetRules()
  }

  render() {
    const { Rules, Profile, handleDeletemodal, handleSelectedRule, handleLogmodal, GetRulelogs, StopRules } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Rules

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Rules.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Rules.Column.Info'), accessor: 'Info' },
      { Header: t('Pages.Rules.Column.Status'), accessor: row => this.statusCellhandler(row?.Status), disableProps: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Pages.Rules.Column.Stop'), accessor: 'Stop', disableProps: true },
      { Header: t('Pages.Rules.Column.Log'), accessor: 'log', disableProps: true },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "rule"
    let initialConfig = GetInitialconfig(Profile, metaKey)

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
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Rules"}>
                      <Breadcrumb.Section>{t('Pages.Rules.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Rules.Page.CreateHeader')}
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
              </div> : <NoDataScreen message={t('Common.NoDataFound')} />
            }
          </Pagewrapper>
          <RulesDelete />
          <RulesLog />
        </React.Fragment>
    )
  }
  statusCellhandler = (value) => {
    return <Icon style={{ color: value === 1 ? 'green' : 'red' }} className="ml-2" name='circle' />
  }
}
export default Rules
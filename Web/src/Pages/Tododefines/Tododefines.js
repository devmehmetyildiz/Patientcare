import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import TododefinesDelete from '../../Containers/Tododefines/TododefinesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export default class Tododefines extends Component {

  constructor(props) {
    super(props)
    this.state = {
      periodStatus: []
    }
  }

  componentDidMount() {
    const { GetTododefines, GetPeriods } = this.props
    GetTododefines()
    GetPeriods()
  }

  render() {
    const { Tododefines, Profile, handleDeletemodal, handleSelectedTododefine } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Tododefines

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Tododefines.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Tododefines.Column.IsRequired'), accessor: row => this.boolCellhandler(row?.IsRequired), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Tododefines.Column.IsNeedactivation'), accessor: row => this.boolCellhandler(row?.IsNeedactivation), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Tododefines.Column.Dayperiod'), accessor: 'Dayperiod' },
      { Header: t('Pages.Tododefines.Column.Info'), accessor: 'Info' },
      { Header: t('Pages.Tododefines.Column.Periods'), accessor: (row, freeze) => this.periodCellhandler(row, freeze) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "tododefine"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Tododefines.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Tododefines/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedTododefine(item)
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
                    <Link to={"/Tododefines"}>
                      <Breadcrumb.Section>{t('Pages.Tododefines.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Tododefines.Page.CreateHeader')}
                  Pagecreatelink={"/Tododefines/Create"}
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
          <TododefinesDelete />
        </React.Fragment>
    )
  }

  handleChangeModal = (value) => {
    this.setState({ modal: value })
  }

  expandPeriods = (rowid) => {
    const prevData = this.state.periodStatus
    prevData.push(rowid)
    this.setState({ periodStatus: [...prevData] })
  }

  shrinkPeriods = (rowid) => {
    const index = this.state.periodStatus.indexOf(rowid)
    const prevData = this.state.periodStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ periodStatus: [...prevData] })
    }
  }

  periodCellhandler = (row, freeze) => {
    const { Periods } = this.props
    const itemId = row?.Id
    const itemPeriods = (row?.Perioduuids || []).map(u => { return (Periods.list || []).find(period => period.Uuid === u.PeriodID) })
    const itemPeriodstxt = itemPeriods.map(u => u?.Name).join(',')
    if (freeze) {
      return itemPeriodstxt
    }
    return itemPeriodstxt.length - 35 > 20 ?
      (
        !this.state.periodStatus.includes(itemId) ?
          [itemPeriodstxt.slice(0, 35) + ' ...(' + itemPeriods.length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandPeriods(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemPeriodstxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkPeriods(itemId)}> ...Daha Az Göster</Link>]
      ) : itemPeriodstxt
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}



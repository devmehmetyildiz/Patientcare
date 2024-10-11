import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import RolesDelete from '../../Containers/Roles/RolesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export class Roles extends Component {

  constructor(props) {
    super(props)
    this.state = {
      privilegesStatus: []
    }
  }

  componentDidMount() {
    const { GetRoles } = this.props
    GetRoles()
  }


  render() {
    const { Roles, Profile, handleDeletemodal, handleSelectedRole } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Roles

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Roles.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Roles.Column.Privileges'), accessor: (row, freeze) => this.authoryCellhandler(row, freeze) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "role"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Roles.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Roles/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedRole(item)
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
                    <Link to={"/Roles"}>
                      <Breadcrumb.Section>{t('Pages.Roles.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Roles.Page.CreateHeader')}
                  Pagecreatelink={"/Roles/Create"}
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
          <RolesDelete />
        </React.Fragment>
    )
  }

  expandAuthory = (rowid) => {
    const prevData = this.state.privilegesStatus
    prevData.push(rowid)
    this.setState({ privilegesStatus: [...prevData] })
  }

  shrinkAuthory = (rowid) => {
    const index = this.state.privilegesStatus.indexOf(rowid)
    const prevData = this.state.privilegesStatus
    if (index > -1) {
      prevData.splice(index, 1)
      this.setState({ privilegesStatus: [...prevData] })
    }
  }

  authoryCellhandler = (row, freeze) => {
    const { Profile } = this.props
    const itemId = row?.Id
    const itemPrivileges = (row?.Privileges || []).map(u => u?.text[Profile.Language])
    const itemPrivilegestxt = itemPrivileges.join(',')
    if (freeze === true) {
      return itemPrivilegestxt
    }
    return itemPrivilegestxt.length - 35 > 20 ?
      (
        !this.state.privilegesStatus.includes(itemId) ?
          [itemPrivilegestxt.slice(0, 35) + ' ...(' + (itemPrivileges || []).length + ')', <Link to='#' className='showMoreOrLess' onClick={() => this.expandAuthory(itemId)}> ...Daha Fazla Göster</Link>] :
          [itemPrivilegestxt, <Link to='#' className='showMoreOrLess' onClick={() => this.shrinkAuthory(itemId)}> ...Daha Az Göster</Link>]
      ) : itemPrivilegestxt
  }
}
export default Roles
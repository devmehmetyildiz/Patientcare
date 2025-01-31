import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import PrinttemplatesDelete from '../../Containers/Printtemplates/PrinttemplatesDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import privileges from '../../Constants/Privileges'
export default class Printtemplates extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  componentDidMount() {
    const { GetPrinttemplates } = this.props
    GetPrinttemplates()
  }

  render() {
    const { Printtemplates, Profile, handleDeletemodal, handleSelectedPrinttemplate } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Printtemplates

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Printtemplates.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.printtemplateupdate },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.printtemplatedelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "printtemplate"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Printtemplates.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Printtemplates/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleDeletemodal(true)
          handleSelectedPrinttemplate(item)
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
                    <Link to={"/Printtemplates"}>
                      <Breadcrumb.Section>{t('Pages.Printtemplates.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Printtemplates.Page.CreateHeader')}
                  Pagecreatelink={"/Printtemplates/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  CreateRole={privileges.printtemplateadd}
                  ReportRole={privileges.printtemplategetreport}
                  ViewRole={privileges.printtemplatemanageview}
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
          <PrinttemplatesDelete />
        </React.Fragment>
    )
  }
}

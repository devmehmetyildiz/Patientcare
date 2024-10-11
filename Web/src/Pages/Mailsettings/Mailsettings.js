import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import MailsettingsDelete from "../../Containers/Mailsettings/MailsettingsDelete"
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'
export default class Mailsettings extends Component {

  componentDidMount() {
    const { GetMailsettings } = this.props
    GetMailsettings()
  }

  render() {

    const { Mailsettings, Profile, handleSelectedMailsetting, handleDeletemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Mailsettings

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Mailsettings.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Mailsettings.Column.User'), accessor: 'User' },
      { Header: t('Pages.Mailsettings.Column.Smtphost'), accessor: 'Smtphost' },
      { Header: t('Pages.Mailsettings.Column.Smtpport'), accessor: 'Smtpport' },
      { Header: t('Pages.Mailsettings.Column.Mailaddress'), accessor: 'Mailaddress', Subtitle: true },
      { Header: t('Pages.Mailsettings.Column.Isbodyhtml'), accessor: row => this.boolCellhandler(row?.Isbodyhtml) },
      { Header: t('Pages.Mailsettings.Column.Issettingactive'), accessor: row => this.boolCellhandler(row.Issettingactive) },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "mailsetting"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Mailsettings.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Mailsettings/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedMailsetting(item)
          handleDeletemodal(true)
        }} />,
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
                    <Link to={"/Mailsettings"}>
                      <Breadcrumb.Section>{t('Pages.Mailsettings.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Mailsettings.Page.CreateHeader')}
                  Pagecreatelink={"/Mailsettings/Create"}
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
          <MailsettingsDelete />
        </React.Fragment>
    )
  }

  boolCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    return value !== null && (value ? t('Common.Yes') : t('Common.No'))
  }
}

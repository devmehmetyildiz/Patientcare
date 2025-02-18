import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn, Button } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import PeriodsDelete from '../../Containers/Periods/PeriodsDelete'
import PeriodsFastcreate from '../../Containers/Periods/PeriodsFastcreate'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import privileges from '../../Constants/Privileges'
import validator from '../../Utils/Validator'
export default class Periods extends Component {


  componentDidMount() {
    const { GetPeriods } = this.props
    GetPeriods()
  }

  render() {

    const { Periods, Profile, handleDeletemodal, handleSelectedPeriod, handleFastcreatemodal } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Periods

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Periods.Column.Name'), accessor: 'Name', Title: true },
      { Header: t('Pages.Periods.Column.Occuredtime'), accessor: 'Occuredtime', Subtitle: true, Withtext: true },
      { Header: t('Pages.Periods.Column.Checktime'), accessor: 'Checktime', Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true, role: privileges.periodupdate },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, role: privileges.perioddelete }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "period"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Periods.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Periods/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedPeriod(item)
          handleDeletemodal(true)
        }} />
      }
    })

    let buttons = []

    if (validator.isHavePermission(privileges.periodadd, Profile.roles)) {
      buttons.push(<Button key={1} onClick={() => handleFastcreatemodal(true)} className='!bg-[#2355a0] !text-white' floated='right'  >{t('Pages.Periods.Column.Fastcreate')}</Button>)
    }

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Periods"}>
                      <Breadcrumb.Section>{t('Pages.Periods.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Periods.Page.CreateHeader')}
                  Pagecreatelink={"/Periods/Create"}
                  Columns={Columns}
                  list={list}
                  initialConfig={initialConfig}
                  metaKey={metaKey}
                  Showcreatebutton
                  Showcolumnchooser
                  Showexcelexport
                  ExtendedButtons={buttons}
                  CreateRole={privileges.periodadd}
                  ReportRole={privileges.periodgetreport}
                  ViewRole={privileges.periodmanageview}
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
          <PeriodsDelete />
          <PeriodsFastcreate />
        </React.Fragment>
    )
  }

}

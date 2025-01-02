import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Loader, Breadcrumb, Grid, GridColumn, Label } from 'semantic-ui-react'
import CompanycashmovementsDelete from '../../Containers/Companycashmovements/CompanycashmovementsDelete'
import { CASH_TYPE_INCOME, CASH_TYPE_OUTCOME } from '../../Utils/Constants'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import GetInitialconfig from '../../Utils/GetInitialconfig'

export default class Companycashmovements extends Component {

  componentDidMount() {
    const { GetCompanycashmovements } = this.props
    GetCompanycashmovements()
  }


  render() {
    const { Companycashmovements, Profile, handleDeletemodal, handleSelectedCompanycashmovement } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Companycashmovements

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Companycashmovements.Column.Movementtype'), accessor: row => this.typeCellhandler(row?.Movementtype), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Companycashmovements.Column.Movementvalue'), accessor: row => this.cashCellhandler(row?.Movementvalue), Lowtitle: true, Withtext: true },
      { Header: t('Pages.Companycashmovements.Column.Report'), accessor: 'ReportID', Lowtitle: true, Withtext: true },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "companycashmovement"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Companycashmovements.list || []).filter(u => u.Isactive).map(item => {
      return {
        ...item,
        edit: <Link to={`/Companycashmovements/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedCompanycashmovement(item)
          handleDeletemodal(true)
        }} />
      }
    })

    let companyCash = 0.0;
    (Companycashmovements.list || []).filter(u => u.Isactive).forEach(cash => {
      companyCash += cash.Movementtype * cash.Movementvalue
    })
    const [integerPart, decimalPart] = companyCash.toFixed(2).split('.')

    return (
      isLoading ? <LoadingPage /> :
        <React.Fragment>
          <Pagewrapper>
            <Headerwrapper>
              <Grid columns='2' >
                <GridColumn width={8}>
                  <Breadcrumb size='big'>
                    <Link to={"/Companycashmovements"}>
                      <Breadcrumb.Section>{t('Pages.Companycashmovements.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Companycashmovements.Page.CreateHeader')}
                  Pagecreatelink={"/Companycashmovements/Create"}
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
            <div className='w-full flex justify-start items-center'>
              <Label className='!bg-[#2355a0] !text-white' size='big'>Cüzdan : {integerPart}.{decimalPart}₺</Label>
            </div>
            <Pagedivider />
            {list.length > 0 ?
              <div className='w-full mx-auto '>
                {Profile.Ismobile ?
                  <MobileTable Columns={Columns} Data={list} Config={initialConfig} Profile={Profile} /> :
                  <DataTable Columns={Columns} Data={list} Config={initialConfig} />}
              </div> : <NoDataScreen message={t('Common.NoDataFound')} />
            }
          </Pagewrapper>
          <CompanycashmovementsDelete />
        </React.Fragment>
    )
  }

  typeCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    const CASH_OPTION = [
      { key: 1, text: t('Option.Cashtypes.Outcome'), value: CASH_TYPE_OUTCOME },
      { key: 2, text: t('Option.Cashtypes.Income'), value: CASH_TYPE_INCOME }
    ]

    return CASH_OPTION.find(u => u.value === value)?.text || t('Common.NoDataFound')
  }

  cashCellhandler = (value) => {
    return value + ' TL'
  }

}
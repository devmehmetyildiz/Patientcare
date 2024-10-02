import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Headerwrapper, LoadingPage, MobileTable, NoDataScreen, Pagedivider, Pagewrapper, Settings, DataTable } from '../../Components'
import CareplanparametersDelete from '../../Containers/Careplanparameters/CareplanparametersDelete'
import GetInitialconfig from '../../Utils/GetInitialconfig'
import { CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_HELPSTATU, CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG, CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE, CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD, CAREPLANPARAMETER_TYPE_PURPOSETARGET, CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS, CAREPLANPARAMETER_TYPE_RATING } from '../../Utils/Constants'

export default class Careplanparameters extends Component {

  componentDidMount() {
    const { GetCareplanparameters } = this.props
    GetCareplanparameters()
  }

  render() {
    const { Careplanparameters, Profile, handleDeletemodal, handleSelectedCareplanparameter } = this.props

    const t = Profile?.i18n?.t

    const { isLoading } = Careplanparameters

    const colProps = {
      sortable: true,
      canGroupBy: true,
      canFilter: true
    }

    const Columns = [
      { Header: t('Common.Column.Id'), accessor: 'Id' },
      { Header: t('Common.Column.Uuid'), accessor: 'Uuid' },
      { Header: t('Pages.Careplanparameters.Column.Type'), accessor: row => this.typeCellhandler(row?.Type), },
      { Header: t('Pages.Careplanparameters.Column.Name'), accessor: 'Name', },
      { Header: t('Common.Column.Createduser'), accessor: 'Createduser' },
      { Header: t('Common.Column.Updateduser'), accessor: 'Updateduser' },
      { Header: t('Common.Column.Createtime'), accessor: 'Createtime' },
      { Header: t('Common.Column.Updatetime'), accessor: 'Updatetime' },
      { Header: t('Common.Column.edit'), accessor: 'edit', disableProps: true },
      { Header: t('Common.Column.delete'), accessor: 'delete', disableProps: true, }
    ].map(u => { return u.disableProps ? u : { ...u, ...colProps } })

    const metaKey = "careplanparameter"
    let initialConfig = GetInitialconfig(Profile, metaKey)

    const list = (Careplanparameters.list || []).map(item => {
      return {
        ...item,
        edit: <Link to={`/Careplanparameters/${item.Uuid}/edit`} ><Icon size='large' className='row-edit' name='edit' /></Link>,
        delete: <Icon link size='large' color='red' name='alternate trash' onClick={() => {
          handleSelectedCareplanparameter(item)
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
                    <Link to={"/Careplanparameters"}>
                      <Breadcrumb.Section>{t('Pages.Careplanparameters.Page.Header')}</Breadcrumb.Section>
                    </Link>
                  </Breadcrumb>
                </GridColumn>
                <Settings
                  Profile={Profile}
                  Pagecreateheader={t('Pages.Careplanparameters.Page.CreateHeader')}
                  Pagecreatelink={"/Careplanparameters/Create"}
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
          <CareplanparametersDelete />
        </React.Fragment>
    )
  }

  typeCellhandler = (value) => {
    const { Profile } = this.props
    const t = Profile?.i18n?.t
    const Parametertypes = [
      { key: 1, text: t('Common.Careplanparameters.Type.Helpstatus'), value: CAREPLANPARAMETER_TYPE_HELPSTATU },
      { key: 2, text: t('Common.Careplanparameters.Type.Presentationperiod'), value: CAREPLANPARAMETER_TYPE_PRESENTATIONPERIOD },
      { key: 3, text: t('Common.Careplanparameters.Type.Presentationmakingtype'), value: CAREPLANPARAMETER_TYPE_PRESENTATIONMAKINGTYPE },
      { key: 4, text: t('Common.Careplanparameters.Type.Rating'), value: CAREPLANPARAMETER_TYPE_RATING },
      { key: 5, text: t('Common.Careplanparameters.Type.Currentsituationrati̇ng'), value: CAREPLANPARAMETER_TYPE_CURRENTSITUATIONRATİNG },
      { key: 6, text: t('Common.Careplanparameters.Type.Plannedsituationrati̇ng'), value: CAREPLANPARAMETER_TYPE_PLANNEDSITUATIONRATİNG },
      { key: 7, text: t('Common.Careplanparameters.Type.Purposetarget'), value: CAREPLANPARAMETER_TYPE_PURPOSETARGET },
      { key: 8, text: t('Common.Careplanparameters.Type.Purposetargetworks'), value: CAREPLANPARAMETER_TYPE_PURPOSETARGETWORKS },
    ]

    return Parametertypes.find(u => u.value === value)?.text || t('Common.NoDataFound')
  }
}
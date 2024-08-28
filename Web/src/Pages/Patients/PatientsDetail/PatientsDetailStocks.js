import React from 'react'
import { Icon, Tab, Table } from 'semantic-ui-react'
import Formatdate from '../../../Utils/Formatdate'

export default function PatientsDetailStocks(props) {

    const { Stocks, Stockdefines, Units, Stockmovements, Stocktypegroups, Stocktypes, patient, Profile } = props

    const t = Profile?.i18n?.t

    const PatientStocks = (Stocks.list || []).filter(u => u.WarehouseID === patient?.Uuid)

    const List = (PatientStocks || []).map(item => {

        const stocktype = (Stocktypes.list || []).find(u => u.Uuid === item?.StocktypeID)
        const stocktypegroup = (Stocktypegroups.list || []).find(u => u.Uuid === item?.StockgrouptypeID)
        const stockdefine = (Stockdefines.list || []).find(u => u.Uuid === item?.StockdefineID)
        const unit = (Units.list || []).find(u => u.Uuid === stockdefine?.UnitID)

        return {
            stockdefine: stockdefine,
            stocktype: stocktype,
            stocktypegroup: stocktypegroup,
            amount: item?.Amount || 0,
            skt: item?.Skt || null,
            unit: unit
        }
    })

    const stocktypegroups = [...new Set(List.map(u => u.stocktypegroup?.Uuid))].map(typegroup => {
        return (Stocktypegroups.list || []).find(u => u.Uuid === typegroup)
    })

    return (
        <div className='w-full px-4 mt-4'>
            <div className='py-4 px-4 bg-white shadow-lg w-full font-poppins rounded-lg flex flex-col gap-4 justify-center items-center   min-w-[250px]'>
                <div className='w-full flex justify-start items-start'>
                    <div className='font-bold text-xl font-poppins'> {t('Pages.Patients.PatientsDetail.PatientDetailStocks.Header')}</div>
                </div>
                <div className='w-full flex justify-cente items-center flex-col'>
                    {(List || []).length > 0
                        ? <div className='w-full'>
                            <Tab
                                className="w-full !bg-transparent"
                                panes={
                                    stocktypegroups.map((typegroup, index) => {
                                        const filteredList = (List.filter(item => item?.stocktypegroup?.Uuid === typegroup?.Uuid) || [])
                                        let isHaveskt = false
                                        filteredList.forEach(item => {
                                            if (!isHaveskt && item?.stocktype?.Issktneed === true || 1) {
                                                isHaveskt = true
                                            }
                                        });
                                        console.log('isHaveskt: ', isHaveskt);

                                        return {
                                            menuItem: `${typegroup?.Name} (${filteredList.length})`,
                                            pane: {
                                                key: index,
                                                content: <Table key={index}>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Name')}</Table.HeaderCell>
                                                            {isHaveskt ? <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Skt')}</Table.HeaderCell> : null}
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Stocktype')}</Table.HeaderCell>
                                                            <Table.HeaderCell>{t('Pages.Patients.PatientsDetail.PatientDetailStocks.Label.Amount')}</Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>
                                                    <Table.Body>
                                                        {(filteredList || []).length > 0
                                                            ? filteredList.map((stock, i) => {
                                                                const { stockdefine, stocktype, unit } = stock
                                                                const name = stockdefine?.Name || t('Common.NoDataFound')
                                                                return <Table.Row key={i}>
                                                                    <Table.Cell>
                                                                        {`${name}${stocktype?.Isbarcodeneed ? ` (${stockdefine?.Barcode})` : ''}`}
                                                                    </Table.Cell>
                                                                    {isHaveskt
                                                                        ? <Table.Cell>
                                                                            {stock?.skt ? Formatdate(stock?.skt, true) : '-'}
                                                                        </Table.Cell>
                                                                        : null}
                                                                    <Table.Cell>
                                                                        {stocktype?.Name || t('Common.NoDataFound')}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {`${stock?.amount} ${unit?.Name || t('Common.NoDataFound')}`}
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            })
                                                            : <Table.Row>
                                                                <Table.Cell>
                                                                    <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>
                                                                </Table.Cell>
                                                            </Table.Row>}
                                                    </Table.Body>
                                                </Table>
                                            }
                                        }
                                    })

                                    /*    [
                                       {
                                           menuItem: `${t('Pages.Preregistrations.Page.Tab.CreateHeader')} (${(createList || []).length})`,
                                           pane: {
                                               key: 'created',
                                               content: <Preregistrationscreated
                                                   Profile={Profile}
                                                   list={createList}
                                                   Columns={Columns.filter(u => u.key === 'created' || !u.key)}
                                               />
                                           }
                                       },
                                   ] */
                                }
                                renderActiveOnly={false}
                            />
                        </div>
                        : <div className='font-bold font-poppins'>{t('Common.NoDataFound')}</div>}
                </div>
            </div>
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Dimmer, Grid, GridColumn, Icon, Step, Transition } from 'semantic-ui-react'
import { Contentwrapper, Headerwrapper, LoadingPage } from '../../Components'
import { Link } from 'react-router-dom'
import validator from '../../Utils/Validator'
import Stockmanage from '../../Components/Stockmanage'

export default function PurchaseorderPrepareStepTwo(props) {

    const { setCompletedSteps, goNext, stepKey, PAGE_NAME, Profile,
        selectedStocks, setselectedStocks,
        Purchaseorders, Stocktypes, Stocktypegroups, Stockdefines, Units, Stockmovements, Stocks,
        GetStocktypes, GetStocktypegroups, GetUnits, GetStockdefines, GetStocks, GetStockmovements
    } = props

    const t = Profile?.i18n?.t
    const [active, setActive] = useState(null)

    useEffect(() => {
        GetStockdefines()
        GetStocktypes()
        GetStocktypegroups()
        GetUnits()
        GetStockmovements()
        GetStocks()
    }, [])



    const isLoadingstatus =
        Purchaseorders.isLoading ||
        Stocktypes.isLoading ||
        Stocktypegroups.isLoading ||
        Stockdefines.isLoading ||
        Units.isLoading ||
        Stockmovements.isLoading ||
        Stocks.isLoading

    const Stocktypegroupoption = (Stocktypegroups.list || []).filter(u => u.Isactive).map(group => {
        const stocktypes = (group.Stocktypes || '').split(',').filter(u => validator.isUUID(u)).map(u => (Stocktypes.list || []).find(type => type.Uuid === u)?.Name).join(',')
        return {
            key: group?.Uuid,
            title: group?.Name,
            description: stocktypes
        }
    })

    return (
        <>
            <Dimmer inverted active={isLoadingstatus}>
                <LoadingPage />
            </Dimmer>
            <Transition transitionOnMount animation='fade right' duration={500}>
                <div className='w-full'>
                    <Contentwrapper>
                        <Headerwrapper>
                            <Grid columns='2' >
                                <GridColumn width={8}>
                                    <Breadcrumb size='big'>
                                        <Link to={"/Purchaseorders"}>
                                            <Breadcrumb.Section>{t('Pages.Purchaseorder.Page.ProductHeader')}</Breadcrumb.Section>
                                        </Link>
                                    </Breadcrumb>
                                </GridColumn>
                            </Grid>
                        </Headerwrapper>
                        <Step.Group widths={1} vertical>
                            {Stocktypegroupoption.map(group => {
                                const groupstocks = selectedStocks.filter(u => u.StockgrouptypeID === group?.key)
                                return <div key={group.key} className='w-full p-2 shadow-2 shadow-[#c9c9c9dd]'>
                                    <Step onClick={() => setActive(active === group.key ? null : group.key)} active={active === group.key} link >
                                        <Icon name='sitemap' />
                                        <Step.Content>
                                            <Step.Title>{`${group.title} ${(groupstocks || []).length > 0 ? `(${groupstocks.length})` : ''}`}</Step.Title>
                                            <Step.Description >{group.description}</Step.Description>
                                        </Step.Content>
                                    </Step>
                                    {active === group.key ?
                                        <Transition transitionOnMount
                                            animation='fade down' duration={500}>
                                            <div className='w-full p-4'>
                                                <Stockmanage
                                                    selectedStocks={selectedStocks}
                                                    setselectedStocks={setselectedStocks}
                                                    Profile={Profile}
                                                    Type={1}
                                                    WarehouseID={""}
                                                    Stocktypes={Stocktypes}
                                                    Stocks={Stocks}
                                                    Stockdefines={Stockdefines}
                                                    Units={Units}
                                                    Stocktypegroups={Stocktypegroups}
                                                    StockgrouptypeID={group.key}
                                                />

                                            </div>
                                        </Transition> : null}
                                </div>
                            })}
                        </Step.Group>
                        <div className='w-full flex justify-center items-center'>
                            <Button
                                className='mt-8 !bg-[#2355a0] !text-white whitespace-nowrap'
                                size='medium'
                                onClick={(e) => {
                                    e.preventDefault()
                                    setCompletedSteps(prev => [...prev, stepKey])
                                    goNext()
                                }}
                            >
                                {t('Common.Button.GoNext')}
                                <Icon name='right arrow' />
                            </Button>
                        </div>
                    </Contentwrapper>
                </div>
            </Transition>
        </>
    )
}

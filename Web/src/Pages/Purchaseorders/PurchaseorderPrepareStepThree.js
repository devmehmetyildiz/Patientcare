import React, { useEffect } from 'react'
import { Breadcrumb, Button, Grid, GridColumn, Icon, Step, Transition } from 'semantic-ui-react'
import { Contentwrapper, Headerwrapper } from '../../Components'
import { Link } from 'react-router-dom'
import Fileupload from '../../Components/Fileupload'

export default function PurchaseorderPrepareStepThree(props) {

    const { goNext, setCompletedSteps, selectedFiles, setselectedFiles,
        PAGE_NAME, GetUsagetypes, Usagetypes, fillPurchaseordernotification, Profile, stepKey } = props

    const t = Profile?.i18n?.t

    useEffect(() => {
        GetUsagetypes()
    }, [])

    return (
        <Transition transitionOnMount animation='fade right' duration={500}>
            <div className='w-full'>
                <Contentwrapper>
                    <Headerwrapper>
                        <Grid columns='2' >
                            <GridColumn width={8}>
                                <Breadcrumb size='big'>
                                    <Link to={"/Purchaseorders"}>
                                        <Breadcrumb.Section>{t('Pages.Purchaseorder.Page.FileHeader')}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Step.Group widths={1} vertical>
                        <Fileupload
                            fillnotification={fillPurchaseordernotification}
                            Usagetypes={Usagetypes}
                            selectedFiles={selectedFiles}
                            setselectedFiles={setselectedFiles}
                            Profile={Profile}
                        />
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
    )
}

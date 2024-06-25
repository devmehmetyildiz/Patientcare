import React, { useEffect } from 'react'
import { Breadcrumb, Grid, GridColumn, Transition } from 'semantic-ui-react'
import { Contentwrapper, Headerwrapper } from '../../Components'
import { Link } from 'react-router-dom'
import Literals from './Literals'
import Fileupload from '../../Components/Fileupload'

export default function PurchaseorderPrepareStepThree({ setCompletedSteps, selectedFiles, setselectedFiles, PAGE_NAME, GetUsagetypes, Usagetypes, fillPurchaseordernotification, Profile }) {

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
                                        <Breadcrumb.Section>{Literals.Page.Pagefileheader[Profile.Language]}</Breadcrumb.Section>
                                    </Link>
                                </Breadcrumb>
                            </GridColumn>
                        </Grid>
                    </Headerwrapper>
                    <Fileupload
                        fillnotification={fillPurchaseordernotification}
                        Usagetypes={Usagetypes}
                        selectedFiles={selectedFiles}
                        setselectedFiles={setselectedFiles}
                        Literals={Literals}
                        Profile={Profile}
                    />
                </Contentwrapper>
            </div>
        </Transition>
    )
}

import React from 'react'
import { Headerwrapper, Pagedivider, Pagewrapper } from '../../Components'
import { Breadcrumb, Grid, GridColumn } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Overviewcard(props) {
    const { Profile } = props

    const t = Profile?.i18n?.t
    
    return (
        <Pagewrapper>
            <Headerwrapper>
                <Grid columns='2' >
                    <GridColumn width={8}>
                        <Breadcrumb size='big'>
                            <Link to={"/Overviewcard"}>
                                <Breadcrumb.Section>{t('Pages.Overviewcard.Page.Header')}</Breadcrumb.Section>
                            </Link>
                        </Breadcrumb>
                    </GridColumn>
                </Grid>
            </Headerwrapper>
            <Pagedivider />

        </Pagewrapper>
    )
}

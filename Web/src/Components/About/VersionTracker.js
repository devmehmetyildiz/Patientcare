import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { STORAGE_KEY_PATIENTCARE_SHOWEDVERSION } from '../../Utils/Constants'
import config from '../../Config'
import Changelogs from './Changelogs'
import AboutDetail from './AboutDetail'
import NoDataScreen from '../NoDataScreen'
export default function VersionTracker({ Profile }) {

    const t = Profile?.i18n?.t
    const appverion = `V${config.version}`
    const item = Changelogs.find(u => u.version == config.version)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            const showedVersion = localStorage.getItem(STORAGE_KEY_PATIENTCARE_SHOWEDVERSION);
            if (appverion !== showedVersion) {
                setOpen(true);
            }
        }, 5000);
    }, []);

    return (
        <Modal
            onClose={() => {
                setOpen(false)
                localStorage.setItem(STORAGE_KEY_PATIENTCARE_SHOWEDVERSION, appverion);
            }}
            onOpen={() => {
                setOpen(true)
            }}
            open={open}
        >
            <Modal.Header>{`${t('Appname')} - ${appverion}`}</Modal.Header>
            <Modal.Content>
                {item
                    ? <Modal.Description>
                        <AboutDetail
                            opened
                            tag={item?.version + 'feature'}
                            type={'feature'}
                            title={`Yenilikler`}
                            items={(item?.features || [])}
                        />
                        <AboutDetail
                            opened
                            tag={item?.version + 'change'}
                            type={'change'}
                            title={`Değişiklikler`}
                            items={(item?.changes || [])}
                        />
                        <AboutDetail
                            opened
                            tag={item?.version + 'bug'}
                            type={'bug'}
                            title={`Hata Çözümleri`}
                            items={(item?.bugs || [])}
                        />
                        <AboutDetail
                            opened
                            tag={item?.version + 'no-issue'}
                            type={'no-issue'}
                            title={`Genel`}
                            items={(item?.withoutIssues || [])}
                        />
                    </Modal.Description>
                    : <NoDataScreen />
                }

            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    localStorage.setItem(STORAGE_KEY_PATIENTCARE_SHOWEDVERSION, appverion);
                }}>
                    {t('Common.Button.Giveup')}
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

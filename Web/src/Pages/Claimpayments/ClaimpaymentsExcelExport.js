import React, { useEffect, useState } from 'react'
import { Button, Dimmer, DimmerDimmable, Icon, Label, LabelDetail, Loader, Modal, Progress } from 'semantic-ui-react'
import axios from 'axios'
import { ROUTES, STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, STORAGE_KEY_PATIENTCARE_LANGUAGE } from '../../Utils/Constants'
import config from '../../Config'
import AxiosErrorHelper from '../../Utils/AxiosErrorHelper'
import validator from '../../Utils/Validator'
import Bytetosize from '../../Utils/Bytetosize'

export default function ClaimpaymentsExcelExport(props) {

    const { open, setOpen, ClaimpaymentID, fillClaimpaymentnotification, Claimpayments, Profile } = props

    const t = Profile?.i18n?.t

    const [onDownloading, setOnDownloading] = useState(false)
    const [downloadProgress, setDownloadProgress] = useState(0)
    const [totalSize, setTotalSize] = useState(0)
    const [file, setFile] = useState(null)


    const getExcelReport = (paymentId) => {
        setOnDownloading(true)
        setDownloadProgress(0)
        setTotalSize(0)
        const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
        axios.get(`${config.services.Business}${ROUTES.CLAIMPAYMENT}/DetailReport/${paymentId}`, {
            responseType: 'blob',
            headers: {
                Authorization: "Bearer " + token,
                Language: language
            },
            onDownloadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setDownloadProgress(percentCompleted);
                setTotalSize(progressEvent.total);
            },
        }).then((res) => {
            setOnDownloading(false)
            setDownloadProgress(0);
            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            const file = new File([blob], "ClaimPaymentReport.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
            console.log('file: ', file);
            setFile(file)

        }).catch((err) => {
            setOnDownloading(false)
            setDownloadProgress(0);
            setTotalSize(0);
            if (err.response && err.response.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    fillClaimpaymentnotification(AxiosErrorHelper(
                        {
                            ...err,
                            response: {
                                ...err.response,
                                data: JSON.parse(reader.result)
                            }

                        }))
                };
                reader.readAsText(err.response.data);
            }
        });
    }

    const downloadFile = () => {
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ClaimPaymentReport.xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    useEffect(() => {
        if (open) {
            getExcelReport(ClaimpaymentID)
        }
    }, [open])


    return (
        <Modal
            onClose={() => {
                setOpen(false)
                setTotalSize(0)
            }}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{t('Pages.Claimpayments.Page.ExcelExportHeader')}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    {onDownloading ? <div className='w-full flex flex-col justify-center items-center gap-4 '>
                        <div className='mt-4 mb-12'>
                            <DimmerDimmable>
                                <Dimmer active inverted>
                                    <Loader className='!text-black !border-red blackLoader whitespace-nowrap' inverted inline='centered' >
                                        {`${t('Common.Loading')} ${validator.isNumber(totalSize) && totalSize > 0 ? `  (${Bytetosize(totalSize)}) ` : ''}`}
                                    </Loader>
                                </Dimmer>
                            </DimmerDimmable>
                        </div>
                        <div className='w-full'>
                            <Progress color='blue' percent={downloadProgress} indicating />
                        </div>
                    </div> :
                        <div className='cursor-pointer' onClick={() => downloadFile()}>
                            <Label color='blue' size='large' >
                                {` Hakediş Dosyası ${validator.isNumber(totalSize) && totalSize > 0 ? `  (${Bytetosize(totalSize)}) ` : ''}`}
                                <Label.Detail>
                                    <Icon name='download' />
                                </Label.Detail>
                            </Label>
                        </div>
                    }
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    setOpen(false)
                    setFile(null)
                    setTotalSize(0)
                }}>
                    {t('Common.Button.Close')}
                </Button>
                {onDownloading}
            </Modal.Actions>
        </Modal>
    )
}

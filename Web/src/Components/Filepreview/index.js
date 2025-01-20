import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { useReactToPrint } from "react-to-print";
import config from '../../Config'
import { ROUTES, STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, STORAGE_KEY_PATIENTCARE_LANGUAGE } from '../../Utils/Constants'
import { Button, Dimmer, DimmerDimmable, Loader, Modal, Progress } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import NoDataScreen from '../NoDataScreen'
import Bytetosize from '../../Utils/Bytetosize'
import AxiosErrorHelper from '../../Utils/AxiosErrorHelper';

export default function Filepreview(props) {

  const TYPE_PDF = "application/pdf"
  const TYPE_JPG = "image/jpg"
  const TYPE_PNG = "image/png"
  const TYPE_JPEG = "image/jpeg"

  const { fileurl, setFileurl, Profile, fillnotification } = props

  const t = Profile?.i18n?.t
  const [open, setOpen] = useState(false)

  const [file, setFile] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [filemeta, setFilemeta] = useState(null)
  const [fileDownloading, setfileDownloading] = useState(false)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const iframeRef = useRef(null)
  const imageRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef: imageRef });

  const iframeSrc = useMemo(() => {
    return validator.isFile(file) ? window.URL.createObjectURL(file) : ''
  }, [file, validator])


  useEffect(() => {
    if (validator.isUUID(fileurl) && !open) {
      setOpen(true)
      fetchFile(fileurl)
    }
  }, [fileurl])

  useEffect(() => {
    const getHeight = () => {
      setScreenHeight(window.innerHeight)
    }
    window.addEventListener('resize', getHeight)
  }, [])

  const fileType = filemeta?.Filetype
  const canFilePrintable = (fileType === TYPE_JPEG || fileType === TYPE_PDF || fileType === TYPE_JPG || fileType === TYPE_PNG)

  const fetchFile = (fileID) => {
    setfileDownloading(true)
    setDownloadProgress(0)
    setTotalSize(0)
    const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
    const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
    axios.get(`${config.services.File}${ROUTES.FILE}/${fileID}`, {
      headers: {
        Authorization: "Bearer " + token,
        Language: language
      }
    }).then((resmeta) => {
      setFilemeta(resmeta.data)
      axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
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
        setfileDownloading(false)
        setDownloadProgress(0);
        setTotalSize(0);
        const blob = new Blob([res.data], {
          type: resmeta.data?.Filetype
        });
        const file = new File([blob], resmeta.data?.Filename, { type: resmeta.data?.Filetype })
        setFile(file)
      }).catch((err) => {
        setfileDownloading(false)
        setDownloadProgress(0);
        setTotalSize(0);
        if (err.response && err.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            fillnotification(AxiosErrorHelper(
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
    }).catch((errres) => {
      setfileDownloading(false)
      setDownloadProgress(0);
      setTotalSize(0);
      fillnotification(AxiosErrorHelper(errres?.response))
    });
  }

  const downloadFile = () => {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filemeta?.Filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const handlePrint = () => {
    switch (filemeta?.Filetype) {
      case TYPE_PDF:
        printPdf()
        break;
      case TYPE_JPG:
        printImage()
        break;
      case TYPE_JPEG:
        printImage()
        break;
      case TYPE_PNG:
        printImage()
        break;
      default:
        break;
    }
  }

  const printPdf = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  const printImage = () => {
    if (imageRef.current) {
      reactToPrintFn()
    }
  };

  const renderView = () => {
    if (filemeta && validator.isString(fileurl) && validator.isFile(file)) {
      if (filemeta?.Filetype === TYPE_PDF) {
        return <div>
          <iframe
            ref={iframeRef}
            onClick={(e) => e.preventDefault()}
            height={`${screenHeight - 300}px`}
            src={`${iframeSrc}#toolbar=0&navpanes=0`}
            width={'100%'}
            title={filemeta?.Filename || ''}
          />
        </div>
      } else {
        const url = window.URL.createObjectURL(file)
        return <div className='object-contain w-full h-full'>
          <img
            ref={imageRef}
            className=''
            src={url}
          />
        </div>
      }
    } else {
      return <NoDataScreen style={{ heigth: 'auto' }} message={t('Common.NoDataFound')} />
    }
  }

  return (
    <React.Fragment>
      <Modal
        onClose={() => {
          setOpen(false)
          setFileurl(null)
          setFile(null)
          setFilemeta(null)
        }}
        onOpen={() => setOpen(true)}
        open={open}
        size='large'
      >
        <Modal.Header>{`${t('Components.Filepreview.Page.Header')} - ${filemeta?.Filename}`}</Modal.Header>
        <Modal.Content>
          {fileDownloading ? (
            <div className='w-full flex flex-col justify-center items-center gap-4 '>
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
            </div>
          ) : (
            <div>
              {renderView()}
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          {validator.isString(fileurl) && validator.isFile(file) && !fileDownloading ?
            <Button
              floated='left'
              color='black'
              onClick={() => {
                setOpen(false)
                setFileurl(null)
                setFile(null)
                setFilemeta(null)
              }}>
              {t('Common.Button.Goback')}
            </Button>
            : <Button
              color='black'
              onClick={() => {
                setOpen(false)
                setFileurl(null)
                setFile(null)
                setFilemeta(null)
              }}>
              {t('Common.Button.Goback')}
            </Button>}
          {validator.isString(fileurl) && validator.isFile(file) && !fileDownloading ?
            <Button
              className='!bg-[#2355a0] !text-white'
              onClick={() => {
                downloadFile(fileurl, filemeta?.Filename)
              }}>
              {validator.isNumber(file?.size)
                ? `${t('Common.Button.Download')} (${Bytetosize(file?.size)})`
                : t('Common.Button.Download')
              }
            </Button>
            : null}
          {validator.isString(fileurl) && validator.isFile(file) && !fileDownloading ?
            <Button
              disabled={!canFilePrintable}
              className='!bg-[#2355a0] !text-white'
              onClick={() => {
                handlePrint()
              }}>
              {t('Common.Button.Print')}
            </Button>
            : null}
        </Modal.Actions>
      </Modal>
    </React.Fragment >
  )
}

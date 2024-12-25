import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from '../../Config'
import { ROUTES, STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, STORAGE_KEY_PATIENTCARE_LANGUAGE } from '../../Utils/Constants'
import { Button, Dimmer, Loader, Modal } from 'semantic-ui-react'
import validator from '../../Utils/Validator'
import NoDataScreen from '../NoDataScreen'
import Bytetosize from '../../Utils/Bytetosize'

export default function Filepreview(props) {

  const TYPE_PDF = "application/pdf"

  const { fileurl, setFileurl, Profile, fillnotification } = props

  const t = Profile?.i18n?.t
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [filemeta, setFilemeta] = useState(null)
  const [fileDownloading, setfileDownloading] = useState(false)

  useEffect(() => {
    if (validator.isUUID(fileurl) && !open) {
      setOpen(true)
      fetchFile(fileurl)
    }
  }, [fileurl])

  const fetchFile = (fileID) => {
    setfileDownloading(true)
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
        }
      }).then((res) => {
        setfileDownloading(false)
        const blob = new Blob([res.data], {
          type: resmeta.data?.Filetype
        });
        const file = new File([blob], resmeta.data?.Filename, { type: resmeta.data?.Filetype })
        setFile(file)
      }).catch((err) => {
        setfileDownloading(false)
        fillnotification([{ type: 'Error', code: t('Components.Filepreview.Page.Header'), description: err.message }])
      });
    }).catch((errres) => {
      setfileDownloading(false)
      fillnotification([{ type: 'Error', code: t('Components.Filepreview.Page.Header'), description: errres.message }])
    });
  }

  const downloadFile = (fileID, fileName) => {
    setfileDownloading(true)
    const token = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
    const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE)
    axios.get(`${config.services.File}${ROUTES.FILE}/Downloadfile/${fileID}`, {
      responseType: 'blob',
      headers: {
        Authorization: "Bearer " + token,
        Language: language
      }
    }).then((res) => {
      setfileDownloading(false)
      const fileType = res.headers['content-type']
      const blob = new Blob([res.data], {
        type: fileType
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((err) => {
      setfileDownloading(false)
      fillnotification([{ type: 'Error', code: t('Components.Filepreview.Page.Header'), description: err.message }])
    });
  }

  const renderView = () => {
    if (filemeta && validator.isString(fileurl) && validator.isFile(file)) {
      const url = window.URL.createObjectURL(file)
      if (filemeta?.Filetype === TYPE_PDF) {
        return <iframe
          height={"500px"}
          src={`${url}#toolbar=0&navpanes=0`}
          width={'100%'}
          title={filemeta?.Filename || ''}
        />
      } else {
        return <div className='object-contain w-full h-full'>
          <img
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
      >
        <Modal.Header>{t('Components.Filepreview.Page.Header')}</Modal.Header>
        <Modal.Content>
          {fileDownloading ? <Loader /> :
            renderView()
          }
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => {
            setOpen(false)
            setFileurl(null)
            setFile(null)
            setFilemeta(null)
          }}>
            {t('Common.Button.Goback')}
          </Button>
          {validator.isString(fileurl) && validator.isFile(file) ?
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
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  )
}

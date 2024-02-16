const messages = {
    ERROR: {
        CAREPLAN_NOT_FOUND: {
            code: 'CAREPLAN_NOT_FOUND', description: {
                en: 'care plan not found',
                tr: 'Bakım Planı Bulunamadı',
            }
        },
        CAREPLAN_NOT_ACTIVE: {
            code: 'CAREPLAN_NOT_ACTIVE', description: {
                en: 'care plan is not active',
                tr: 'Bakım planı aktif değil',
            }
        },

    },
    VALIDATION_ERROR: {
        CAREPLANID_REQUIRED: {
            code: 'CAREPLANID_REQUIRED', description: {
                en: 'care plan id required',
                tr: 'Bakım plan numarası gerekli',
            }
        },
        UNSUPPORTED_CAREPLANID: {
            code: 'UNSUPPORTED_CAREPLANID', description: {
                en: 'care plan id unsupported',
                tr: 'Bakım plan numarası geçersiz',
            }
        },
        CAREPLANSERVICEID_REQUIRED: {
            code: 'CAREPLANSERVICEID_REQUIRED', description: {
                en: 'care plan service id required',
                tr: 'Bakım plan hizmet numarası gerekli',
            }
        },
        UNSUPPORTED_CAREPLANSERVICEID: {
            code: 'UNSUPPORTED_CAREPLANSERVICEID', description: {
                en: 'care plan service id unsupported',
                tr: 'Bakım plan hizmet numarası geçersiz',
            }
        },
        STARTDATE_REQUIRED: {
            code: 'STARTDATE_REQUIRED', description: {
                en: 'Startdate required',
                tr: 'Bailangıç tarihi gerekli',
            }
        },
        ENDDATE_REQUIRED: {
            code: 'ENDDATE_REQUIRED', description: {
                en: 'Enddate required',
                tr: 'Bitiş tarihi gerekli',
            }
        },
        PATIENTID_REQUIRED: {
            code: 'PATIENTID_REQUIRED', description: {
                en: 'Patient Id required',
                tr: 'Hasta Numarası gerekli',
            }
        },
        CREATEDATE_REQUIRED: {
            code: 'CREATEDATE_REQUIRED', description: {
                en: 'Create date required',
                tr: 'Oluşturma Tarihi gerekli',
            }
        },
        CAREPLANSERVICES_REQUIRED: {
            code: 'CAREPLANSERVICES_REQUIRED', description: {
                en: 'Care plan services required',
                tr: 'Bakım plan hizmetleri gerekli',
            }
        },
        SUPPORTPLANID_REQUIRED: {
            code: 'SUPPORTPLANID_REQUIRED', description: {
                en: 'Support plan id required',
                tr: 'Desktek plan numarası gerekli',
            }
        },
        HELPSTATUS_REQUIRED: {
            code: 'HELPSTATUS_REQUIRED', description: {
                en: 'Help status required',
                tr: 'Yardım durumu gerekli',
            }
        },
        REQUIREDPERIOD_REQUIRED: {
            code: 'REQUIREDPERIOD_REQUIRED', description: {
                en: 'Required period required',
                tr: 'Asgari Sunulma Sıklığı gerekli',
            }
        },
        MAKINGTYPE_REQUIRED: {
            code: 'MAKINGTYPE_REQUIRED', description: {
                en: 'Making type required',
                tr: 'Hizmet verilme şekli gerekli',
            }
        },
        RATING_REQUIRED: {
            code: 'RATING_REQUIRED', description: {
                en: 'Rating required',
                tr: 'Değerlendirme gerekli',
            }
        },




    }
}
module.exports = messages

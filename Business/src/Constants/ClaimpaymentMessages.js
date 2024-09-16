const messages = {
    ERROR: {
        NO_PATIENT_FOUND: {
            code: 'NO_PATIENT_FOUND', description: {
                en: 'No patient founded for this claim payment type',
                tr: 'Bu hakediş türü için tanımlı hasta bulunamadı',
            }
        },
        PARAMETERCOSTUMERTYPE_NOT_FOUND: {
            code: 'PARAMETERCOSTUMERTYPE_NOT_FOUND', description: {
                en: 'costumertype for claim payment parameter not found',
                tr: 'hakediş parametrelerine ait müşteri türü bulunamadı',
            }
        },
        CLAIMPAYMENTPARAMETER_NOT_FOUND: {
            code: 'CLAIMPAYMENTPARAMETER_NOT_FOUND', description: {
                en: 'claim payment parameter not found',
                tr: 'hakediş parametreleri bulunamadı',
            }
        },
        CLAIMPAYMENT_NOT_FOUND: {
            code: 'CLAIMPAYMENT_NOT_FOUND', description: {
                en: 'claim payment not found',
                tr: 'hakediş bulunamadı',
            }
        },
        CLAIMPAYMENT_NOT_ACTIVE: {
            code: 'CLAIMPAYMENT_NOT_ACTIVE', description: {
                en: 'claim payment not active',
                tr: 'hakediş bulunamadı',
            }
        },
        CLAIMPAYMENT_ALREADY_APPROVED: {
            code: 'CLAIMPAYMENT_ALREADY_APPROVED', description: {
                en: 'claim payment already approve',
                tr: 'hakediş zaten onaylı',
            }
        },
    },
    VALIDATION_ERROR: {
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'The claim payment type required',
                tr: 'Bu işlem için hakediş türü gerekli',
            }
        },
        UNSUPPORTED_TYPE: {
            code: 'UNSUPPORTED_TYPE', description: {
                en: 'The claim payment type is unsupported',
                tr: 'hakediş türü desteklenmiyor',
            }
        },
        STARTTIME_REQUIRED: {
            code: 'STARTTIME_REQUIRED', description: {
                en: 'The start time required',
                tr: 'Bu işlem için başlangıç tarihi gerekli',
            }
        },
        ENDTIME_REQUIRED: {
            code: 'ENDTIME_REQUIRED', description: {
                en: 'The end time required',
                tr: 'Bu işlem için bitiş tarihi gerekli',
            }
        },
        CLAIMPAYMENTID_REQUIRED: {
            code: 'CLAIMPAYMENTID_REQUIRED', description: {
                en: 'The claim payment id required',
                tr: 'Bu işlem için hakediş numarası gerekli',
            }
        },
        UNSUPPORTED_CLAIMPAYMENTID: {
            code: 'UNSUPPORTED_CLAIMPAYMENTID', description: {
                en: 'The claim payment id unsupported',
                tr: 'hakediş numarası geçersiz',
            }
        },

    }
}
module.exports = messages

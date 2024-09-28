const messages = {
    ERROR: {
        TRAINING_NOT_FOUND: {
            code: 'TRAINING_NOT_FOUND', description: {
                en: 'training not found',
                tr: 'Eğitim Bulunamadı',
            }
        },
        TRAINING_NOT_ACTIVE: {
            code: 'TRAINING_NOT_ACTIVE', description: {
                en: 'training is not active',
                tr: 'Eğitim aktif değil',
            }
        },

    },
    VALIDATION_ERROR: {
        TRAININGID_REQUIRED: {
            code: 'TRAININGID_REQUIRED', description: {
                en: 'training id required',
                tr: 'Eğitim numarası gerekli',
            }
        },
        UNSUPPORTED_TRAININGID: {
            code: 'UNSUPPORTED_TRAININGID', description: {
                en: 'Traning id unsupported',
                tr: 'Eğitim numarası geçersiz',
            }
        },
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'type required',
                tr: 'Eğitim türü gerekli',
            }
        },
        USERID_REQUIRED: {
            code: 'USERID_REQUIRED', description: {
                en: 'user id required',
                tr: 'Kullanıcı numarası gerekli',
            }
        },
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'Name required',
                tr: 'Eğitim Adı gerekli',
            }
        },
        PLACE_REQUIRED: {
            code: 'PLACE_REQUIRED', description: {
                en: 'Place required',
                tr: 'Eğitim Konumu Gerekli',
            }
        },
        DURATION_REQUIRED: {
            code: 'DURATION_REQUIRED', description: {
                en: 'Duration required',
                tr: 'Eğitim Süresi Gerekli',
            }
        },
        EDUCATOR_REQUIRED: {
            code: 'EDUCATOR_REQUIRED', description: {
                en: 'Educator required',
                tr: 'Eğitmen Gerekli',
            }
        },
        COMPANYNAME_REQUIRED: {
            code: 'COMPANYNAME_REQUIRED', description: {
                en: 'Company name required',
                tr: 'Firma Adı Gerekli',
            }
        },
        EDUCATORUSERID_REQUIRED: {
            code: 'EDUCATORUSERID_REQUIRED', description: {
                en: 'Educator user Id required',
                tr: 'Eğitmen Kullanıcı Gerekli',
            }
        },
        TRAININGDATE_REQUIRED: {
            code: 'TRAININGDATE_REQUIRED', description: {
                en: 'Training date required',
                tr: ' Eğitim Tarihi Gerekli',
            }
        },
        TRAININGUSERS_REQUIRED: {
            code: 'TRAININGUSERS_REQUIRED', description: {
                en: 'Training users required',
                tr: 'Eğitime Girecek Kullanıcılar Gerekli',
            }
        },
    }
}
module.exports = messages

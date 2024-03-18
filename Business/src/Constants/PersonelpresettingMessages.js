const messages = {
    ERROR: {
        PERSONELPRESETTING_NOT_FOUND: {
            code: 'PERSONELPRESETTING_NOT_FOUND', description: {
                en: 'Personel pre setting not found',
                tr: 'Personel Ön Ayarı Bulunamadı',
            }
        },
        PERSONELPRESETTING_NOT_ACTIVE: {
            code: 'PERSONELPRESETTING_NOT_ACTIVE', description: {
                en: 'Personel pre setting is not active',
                tr: 'Personel Ön Ayarı aktif değil',
            }
        },
    },
    VALIDATION_ERROR: {
        PERSONELPRESETTINGID_REQUIRED: {
            code: 'PERSONELPRESETTINGID_REQUIRED', description: {
                en: 'Personel pre setting id required',
                tr: 'Personel Ön ayarı gerekli',
            }
        },
        UNSUPPORTED_PERSONELPRESETTINGID: {
            code: 'UNSUPPORTED_PERSONELPRESETTINGID', description: {
                en: 'Personel pre setting id unsupported',
                tr: 'Personel Ön ayarı geçersiz',
            }
        },
        PERSONELID_REQUIRED: {
            code: 'PERSONELID_REQUIRED', description: {
                en: 'Personel required',
                tr: 'Personel gerekli',
            }
        },
        STARTDATE_REQUIRED: {
            code: 'STARTDATE_REQUIRED', description: {
                en: 'Start date required',
                tr: 'Başlangıç tarihi gerekli',
            }
        },
        ENDDATE_REQUIRED: {
            code: 'ENDDATE_REQUIRED', description: {
                en: 'End date required',
                tr: 'Bitiş tarihi gerekli',
            }
        },
        ISINFITINE_REQUIRED: {
            code: 'ISINFITINE_REQUIRED', description: {
                en: 'Is infinite required',
                tr: 'Sınırsız mı? gerekli',
            }
        },
        ISAPPROVED_REQUIRED: {
            code: 'ISAPPROVED_REQUIRED', description: {
                en: 'Is approved required',
                tr: 'Onaylandı mı? gerekli',
            }
        },
        ISCOMPLETED_REQUIRED: {
            code: 'ISCOMPLETED_REQUIRED', description: {
                en: 'Is completed required',
                tr: 'Tamamlandı mı? gerekli',
            }
        },
        ISDEACTIVE_REQUIRED: {
            code: 'ISDEACTIVE_REQUIRED', description: {
                en: 'Is deactive required',
                tr: 'Deaktive mi? gerekli',
            }
        },
    }
}
module.exports = messages

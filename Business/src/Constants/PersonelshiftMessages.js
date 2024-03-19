const messages = {
    ERROR: {
        PERSONELSHIIFT_NOT_FOUND: {
            code: 'PERSONELSHIIFT_NOT_FOUND', description: {
                en: 'Personel shift not found',
                tr: 'Personel vardiya Bulunamadı',
            }
        },
        PERSONELSHIIFT_NOT_ACTIVE: {
            code: 'PERSONELSHIIFT_NOT_ACTIVE', description: {
                en: 'Personel shift is not active',
                tr: 'Personel vardiya aktif değil',
            }
        },
    },
    VALIDATION_ERROR: {
        PERSONELSHIIFTID_REQUIRED: {
            code: 'PERSONELSHIIFTID_REQUIRED', description: {
                en: 'Personel shift id required',
                tr: 'Personel vardiya id gerekli',
            }
        },
        UNSUPPORTED_PERSONELSHIIFTID: {
            code: 'UNSUPPORTED_PERSONELSHIIFTID', description: {
                en: 'Personel shift id unsupported',
                tr: 'Personel vardiya id geçersiz',
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
        PROFESSIONID_REQUIRED: {
            code: 'PROFESSIONID_REQUIRED', description: {
                en: 'Profession id required',
                tr: 'Meslek id gerekli',
            }
        },
        ISWORKING_REQUIRED: {
            code: 'ISWORKING_REQUIRED', description: {
                en: 'Is working? required',
                tr: 'Çalışıyor mu? gerekli',
            }
        },
        ISDEACTIVE_REQUIRED: {
            code: 'ISDEACTIVE_REQUIRED', description: {
                en: 'Is deactive? required',
                tr: 'Aktif değil? gerekli',
            }
        },
        ISCOMPLETED_REQUIRED: {
            code: 'ISCOMPLETED_REQUIRED', description: {
                en: 'Is completed? required',
                tr: 'Tamamlandı mı? gerekli',
            }
        },
        ISAPPROVED_REQUIRED: {
            code: 'ISAPPROVED_REQUIRED', description: {
                en: 'Is approved? required',
                tr: 'Onaylandı mı? gerekli',
            }
        },
        PERSONELSHIFTDETAILS_REQUIRED: {
            code: 'PERSONELSHIFTDETAILS_REQUIRED', description: {
                en: 'Personel shift details required',
                tr: 'Personel vardiya detayları gerekli',
            }
        },
    }
}
module.exports = messages

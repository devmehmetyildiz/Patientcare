const messages = {
    ERROR: {
        STOCKTYPE_NOT_FOUND: {
            code: 'STOCKTYPE_NOT_FOUND', description: {
                en: 'Stock type not found',
                tr: 'Stok Türü bulunamadı',
            }
        },
        STOCKTYPE_NOT_ACTIVE: {
            code: 'STOCKTYPE_NOT_ACTIVE', description: {
                en: 'Stock type not active',
                tr: 'Stok türü aktif değil',
            }
        },


    },
    VALIDATION_ERROR: {
        NAME_REQUIRED: {
            code: 'NAME_REQUIRED', description: {
                en: 'The name required',
                tr: 'Bu işlem için isim gerekli',
            }
        },
        STOCKTYPEID_REQUIRED: {
            code: 'STOCKTYPEID_REQUIRED', description: {
                en: 'The stocktypeid required',
                tr: 'Bu işlem için stok tür id gerekli',
            }
        },
        UNSUPPORTED_STOCKTYPEID: {
            code: 'UNSUPPORTED_STOCKTYPEID', description: {
                en: 'The stock type id is unsupported',
                tr: 'geçersiz stok tür id si',
            }
        },
    }

}
module.exports = messages

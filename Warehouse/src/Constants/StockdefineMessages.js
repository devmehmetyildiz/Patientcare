const messages = {
    ERROR: {
        STOCKDEFINE_NOT_FOUND: {
            code: 'STOCKDEFINE_NOT_FOUND', description: {
                en: 'Stock define not found',
                tr: 'Stok tanımı bulunamadı',
            }
        },
        STOCKDEFINE_NOT_ACTIVE: {
            code: 'STOCKDEFINE_NOT_ACTIVE', description: {
                en: 'Stock define not active',
                tr: 'Stok tanımı aktif değil',
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
        BARCODE_REQUIRED: {
            code: 'BARCODE_REQUIRED', description: {
                en: 'The barcode required',
                tr: 'Bu işlem için barkod gerekli',
            }
        },
        UNITID_REQUIRED: {
            code: 'UNITID_REQUIRED', description: {
                en: 'The unit required',
                tr: 'Bu işlem için birim gerekli',
            }
        },
        STOCKDEFINEID_REQUIRED: {
            code: 'STOCKDEFINEID_REQUIRED', description: {
                en: 'The stockdefineid required',
                tr: 'Bu işlem için stok tanımı id gerekli',
            }
        },
        UNSUPPORTED_STOCKDEFINEID: {
            code: 'UNSUPPORTED_STOCKDEFINEID', description: {
                en: 'The stock define id is unsupported',
                tr: 'geçersiz stok tanım id si',
            }
        },
    }

}
module.exports = messages

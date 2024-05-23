const messages = {
    ERROR: {
        STOCKTYPEGROUP_NOT_FOUND: {
            code: 'STOCKTYPEGROUP_NOT_FOUND', description: {
                en: 'Stock type group not found',
                tr: 'Stok Tür Grubu bulunamadı',
            }
        },
        STOCKTYPEGROUP_NOT_ACTIVE: {
            code: 'STOCKTYPEGROUP_NOT_ACTIVE', description: {
                en: 'Stock type group not active',
                tr: 'Stok Tür Grubu aktif değil',
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
        STOCKTYPEGROUPID_REQUIRED: {
            code: 'STOCKTYPEGROUPID_REQUIRED', description: {
                en: 'The stocktypegroupid required',
                tr: 'Bu işlem için stok tür grup id gerekli',
            }
        },
        UNSUPPORTED_STOCKTYPEGROUPID: {
            code: 'UNSUPPORTED_STOCKTYPEGROUPID', description: {
                en: 'The stock type group id is unsupported',
                tr: 'geçersiz stok tür grup id si',
            }
        },
    }

}
module.exports = messages

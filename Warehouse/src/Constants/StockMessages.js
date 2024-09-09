const messages = {
    ERROR: {
        STOCK_NOT_FOUND: {
            code: 'STOCK_NOT_FOUND', description: {
                en: 'Stock not found',
                tr: 'Stok bulunamadı',
            }
        },
        STOCK_NOT_ACTIVE: {
            code: 'STOCK_NOT_ACTIVE', description: {
                en: 'Stock not active',
                tr: 'Stok aktif değil',
            }
        },
    },
    VALIDATION_ERROR: {
        AMOUNT_LIMIT_ERROR: {
            code: 'AMOUNT_LIMIT_ERROR', description: {
                en: 'The amount is too low',
                tr: 'Bu işlem yeterli ürün yok',
            }
        },
        STOCKS_REQUIRED: {
            code: 'STOCKS_REQUIRED', description: {
                en: 'The stocks required',
                tr: 'Bu işlem için ürünler gerekli',
            }
        },
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'The type required',
                tr: 'Bu işlem için tür gerekli',
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
        SKT_REQUIRED: {
            code: 'SKT_REQUIRED', description: {
                en: 'The skt required',
                tr: 'Bu işlem için skt gerekli',
            }
        },
        WAREHOUSEID_REQUIRED: {
            code: 'WAREHOUSEID_REQUIRED', description: {
                en: 'The warehouseid required',
                tr: 'Bu işlem için ambar id gerekli',
            }
        },
        PARENTID_REQUIRED: {
            code: 'PARENTID_REQUIRED', description: {
                en: 'The parent id required',
                tr: 'Bu işlem için bağlı id gerekli',
            }
        },
        STOCKID_REQUIRED: {
            code: 'STOCKID_REQUIRED', description: {
                en: 'The stockid required',
                tr: 'Bu işlem için stok id gerekli',
            }
        },
        UNSUPPORTED_STOCKID: {
            code: 'UNSUPPORTED_STOCKID', description: {
                en: 'The stock id is unsupported',
                tr: 'geçersiz stok id si',
            }
        },
        UNSUPPORTED_WAREHOUSEID: {
            code: 'UNSUPPORTED_WAREHOUSEID', description: {
                en: 'The warehouse id is unsupported',
                tr: 'geçersiz warehouse id si',
            }
        },
    }

}
module.exports = messages

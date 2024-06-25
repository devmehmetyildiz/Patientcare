const messages = {
    ERROR: {
        PURCHASEORDER_NOT_FOUND: {
            code: 'PURCHASEORDER_NOT_FOUND', description: {
                en: 'Purchase order not found',
                tr: 'Satın alma bulunamadı',
            }
        },
        PURCHASEORDER_NOT_ACTIVE: {
            code: 'PURCHASEORDER_NOT_ACTIVE', description: {
                en: 'Purchase order not active',
                tr: 'Satın alma aktif değil',
            }
        },
        PURCHASEORDER_NOT_CHECKED: {
            code: 'PURCHASEORDER_NOT_CHECKED', description: {
                en: 'Purchase order not checked',
                tr: 'Satın alma aktif kontrol edilmemiş',
            }
        },
        PURCHASEORDER_NOT_APPROVED: {
            code: 'PURCHASEORDER_NOT_APPROVED', description: {
                en: 'Purchase order not approved',
                tr: 'Satın alma aktif onaylanmamış',
            }
        },
        PURCHASEORDER_IS_COMPLETED: {
            code: 'PURCHASEORDER_IS_COMPLETED', description: {
                en: 'Purchase order is completed',
                tr: 'Satın alma tamamlanmış',
            }
        },
        PURCHASEORDER_IS_APPROVED: {
            code: 'PURCHASEORDER_IS_APPROVED', description: {
                en: 'Purchase order is approved',
                tr: 'Satın alma onaylanmış',
            }
        },
        PURCHASEORDER_IS_CHECKED: {
            code: 'PURCHASEORDER_IS_CHECKED', description: {
                en: 'Purchase order is checked',
                tr: 'Satın alma kontrol edilmiş',
            }
        },
    },
    VALIDATION_ERROR: {
        DELIVERYWAREHOUSEID_REQUIRED: {
            code: 'DELIVERYWAREHOUSEID_REQUIRED', description: {
                en: 'The Delivery warehouse ID required',
                tr: 'Bu işlem için Teslim Edilecek Ambar gerekli',
            }
        },
        DELIVERYPATIENTID_REQUIRED: {
            code: 'DELIVERYPATIENTID_REQUIRED', description: {
                en: 'The Delivery patient ID required',
                tr: 'Bu işlem için Teslim Edilecek Hasta gerekli',
            }
        },
        DELIVERERUSER_REQUIRED: {
            code: 'DELIVERERUSER_REQUIRED', description: {
                en: 'The Deliverer user required',
                tr: 'Bu işlem için Teslim Eden Personel gerekli',
            }
        },
        DELIVERYTYPE_REQUIRED: {
            code: 'DELIVERYTYPE_REQUIRED', description: {
                en: 'The Delivery type required',
                tr: 'Bu işlem için Teslim Türü gerekli',
            }
        },
        RECEIVERUSERID_REQUIRED: {
            code: 'RECEIVERUSERID_REQUIRED', description: {
                en: 'The Receiver user ID required',
                tr: 'Bu işlem için Teslim Alan Personel gerekli',
            }
        },
        COMPANY_REQUIRED: {
            code: 'COMPANY_REQUIRED', description: {
                en: 'The company required',
                tr: 'Bu işlem için firma gerekli',
            }
        },
        AMOUNT_REQUIRED: {
            code: 'AMOUNT_REQUIRED', description: {
                en: 'The amount required',
                tr: 'Bu işlem için miktar gerekli',
            }
        },
        PRICE_REQUIRED: {
            code: 'PRICE_REQUIRED', description: {
                en: 'The price required',
                tr: 'Bu işlem için ücret gerekli',
            }
        },
        CASEID_REQUIRED: {
            code: 'CASEID_REQUIRED', description: {
                en: 'The case id required',
                tr: 'Bu işlem için durum gerekli',
            }
        },
        STOCKDEFINEID_REQUIRED: {
            code: 'STOCKDEFINEID_REQUIRED', description: {
                en: 'The stock define id required',
                tr: 'Bu işlem için stok tanımı gerekli',
            }
        },
        SKT_REQUIRED: {
            code: 'SKT_REQUIRED', description: {
                en: 'The skt required',
                tr: 'Bu işlem için skt gerekli',
            }
        },
        TYPE_REQUIRED: {
            code: 'TYPE_REQUIRED', description: {
                en: 'The type required',
                tr: 'Bu işlem için stok türü gerekli',
            }
        },
        PURCHASEORDERID_REQUIRED: {
            code: 'PURCHASEORDERID_REQUIRED', description: {
                en: 'The purchaseorderid required',
                tr: 'Bu işlem için satın alma id gerekli',
            }
        },
        UNSUPPORTED_PURCHASEORDERID: {
            code: 'UNSUPPORTED_PURCHASEORDERID', description: {
                en: 'The purchaseorderid is unsupported',
                tr: 'geçersiz satın alma id si',
            }
        },
    }

}
module.exports = messages

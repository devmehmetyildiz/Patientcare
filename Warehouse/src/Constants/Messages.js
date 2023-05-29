const messages = {
  ERROR: {
    STOCKDEFINE_NOT_FOUND: {
      code: 'STOCKDEFINE_NOT_FOUND', description: {
        en: 'Stockdefine not found',
        tr: 'Stok tanımı bulunamadı',
      }
    },
    STOCKDEFINE_NOT_ACTIVE: {
      code: 'STOCKDEFINE_NOT_ACTIVE', description: {
        en: 'Stockdefine not active',
        tr: 'Stok tanımı bulunamadı',
      }
    },

    STOCKMOVEMENT_NOT_FOUND: {
      code: 'STOCKMOVEMENT_NOT_FOUND', description: {
        en: 'Stockmovement not found',
        tr: 'Stok hareketi bulunamadı',
      }
    },
    STOCKMOVEMENT_NOT_ACTIVE: {
      code: 'STOCKMOVEMENT_NOT_ACTIVE', description: {
        en: 'Stockmovement not active',
        tr: 'Stok hareketi aktif değil',
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
    DESCIRIPTION_REQUIRED: {
      code: 'DESCIRIPTION_REQUIRED', description: {
        en: 'The description required',
        tr: 'Bu işlem için açıklama gerekli',
      }
    },
    MOVEMENTTYPE_REQUIRED: {
      code: 'MOVEMENTTYPE_REQUIRED', description: {
        en: 'The movement type required',
        tr: 'Bu işlem için hareket tipi gerekli',
      }
    },
    AMOUNT_REQUIRED: {
      code: 'AMOUNT_REQUIRED', description: {
        en: 'The amount required',
        tr: 'Bu işlem için miktar gerekli',
      }
    },
    PREVVALUE_REQUIRED: {
      code: 'PREVVALUE_REQUIRED', description: {
        en: 'The previous value required',
        tr: 'Bu işlem için önceki değer gerekli',
      }
    },
    NEWVALUE_REQUIRED: {
      code: 'NEWVALUE_REQUIRED', description: {
        en: 'The new value required',
        tr: 'Bu işlem için yeni değer gerekli',
      }
    },
    MOVEMENTDATE_REQUIRED: {
      code: 'MOVEMENTDATE_REQUIRED', description: {
        en: 'The movement date required',
        tr: 'Bu işlem için hareket tarihi gerekli',
      }
    },
    STATUS_REQUIRED: {
      code: 'STATUS_REQUIRED', description: {
        en: 'The movement status required',
        tr: 'Bu işlem için hareket durumu gerekli',
      }
    },

    STOCKDEFINEID_REQUIRED: {
      code: 'STOCKDEFINEID_REQUIRED', description: {
        en: 'The stockdefineid required',
        tr: 'Bu işlem için stockdefineid gerekli',
      }
    },
    STOCKID_REQUIRED: {
      code: 'STOCKID_REQUIRED', description: {
        en: 'The stockid required',
        tr: 'Bu işlem için stockid gerekli',
      }
    },
    STOCKMOVEMENTID_REQUIRED: {
      code: 'STOCKMOVEMENTID_REQUIRED', description: {
        en: 'The stockmovementid required',
        tr: 'Bu işlem için stockmovementid gerekli',
      }
    },
    DEPARTMENTID_REQUIRED: {
      code: 'DEPARTMENTID_REQUIRED', description: {
        en: 'The departmentid required',
        tr: 'Bu işlem için departmentid gerekli',
      }
    },
    UNITID_REQUIRED: {
      code: 'UNITID_REQUIRED', description: {
        en: 'The unitid required',
        tr: 'Bu işlem için unitid gerekli',
      }
    },

    UNSUPPORTED_STOCKDEFINEID: {
      code: 'UNSUPPORTED_STOCKDEFINEID', description: {
        en: 'The stockdefineid is unsupported',
        tr: 'Geçersiz stockdefineid',
      }
    },
    UNSUPPORTED_STOCKMOVEMENTID: {
      code: 'UNSUPPORTED_STOCKMOVEMENTID', description: {
        en: 'The stockmovementid is unsupported',
        tr: 'Geçersiz stockmovementid',
      }
    },
  }

}
module.exports = messages

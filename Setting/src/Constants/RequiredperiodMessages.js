const RequiredperiodMessages = {
  ERROR: {
    REQUIREDPERIOD_NOT_FOUND: {
      code: 'REQUIREDPERIOD_NOT_FOUND', description: {
        en: 'Required period not found',
        tr: 'Hizmet sunulma sıklığı bulunamadı',
      }
    },
    REQUIREDPERIOD_NOT_ACTIVE: {
      code: 'REQUIREDPERIOD_NOT_ACTIVE', description: {
        en: 'Required period not active',
        tr: 'Hizmet sunulma sıklığı aktif değil',
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
    REQUIREDPERIODID_REQUIRED: {
      code: 'REQUIREDPERIODID_REQUIRED', description: {
        en: 'The Required period id required',
        tr: 'Bu için Hizmet sunulma sıklığı numarası Gerekli',
      }
    },
    UNSUPPORTED_REQUIREDPERIODID: {
      code: 'UNSUPPORTED_REQUIREDPERIODID', description: {
        en: 'Required period id is unsupported',
        tr: 'Hizmet sunulma sıklığı numarası geçersiz',
      }
    },
  }

}
module.exports = RequiredperiodMessages

const RatingMessages = {
  ERROR: {
    RATING_NOT_FOUND: {
      code: 'RATING_NOT_FOUND', description: {
        en: 'Rating not found',
        tr: 'Değerlendirme bulunamadı',
      }
    },
    RATING_NOT_ACTIVE: {
      code: 'RATING_NOT_ACTIVE', description: {
        en: 'Rating not active',
        tr: 'Değerlendirme aktif değil',
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
    RATINGID_REQUIRED: {
      code: 'RATINGID_REQUIRED', description: {
        en: 'The Rating id required',
        tr: 'Bu için Değerlendirme numarası Gerekli',
      }
    },
    UNSUPPORTED_RATINGID: {
      code: 'UNSUPPORTED_RATINGID', description: {
        en: 'Rating id is unsupported',
        tr: 'Değerlendirme numarası geçersiz',
      }
    },
  }

}
module.exports = RatingMessages

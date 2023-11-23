const messages = {
  ERROR: {
    PATIENT_NOT_FOUND: {
      code: 'PATIENT_NOT_FOUND', description: {
        en: 'patient not found',
        tr: 'hasta bulunamadı',
      }
    },
    PATIENT_NOT_ACTIVE: {
      code: 'PATIENT_NOT_ACTIVE', description: {
        en: 'patient not active',
        tr: 'hasta bulunamadı',
      }
    },
    PERSONEL_NOT_FOUND: {
      code: 'PERSONEL_NOT_FOUND', description: {
        en: 'personel not found',
        tr: 'çalışan bulunamadı',
      }
    },
    PERSONEL_NOT_ACTIVE: {
      code: 'PERSONEL_NOT_ACTIVE', description: {
        en: 'personel not active',
        tr: 'çalışan bulunamadı',
      }
    },
    FLOOR_NOT_FOUND: {
      code: 'FLOOR_NOT_FOUND', description: {
        en: 'floor not found',
        tr: 'Kat bulunamadı',
      }
    },
    FLOOR_NOT_ACTIVE: {
      code: 'FLOOR_NOT_ACTIVE', description: {
        en: 'floor not active',
        tr: 'kat bulunamadı',
      }
    },
    ROOM_NOT_FOUND: {
      code: 'ROOM_NOT_FOUND', description: {
        en: 'room not found',
        tr: 'Oda bulunamadı',
      }
    },
    ROOM_NOT_ACTIVE: {
      code: 'ROOM_NOT_ACTIVE', description: {
        en: 'room not active',
        tr: 'oda bulunamadı',
      }
    },
    BED_NOT_FOUND: {
      code: 'BED_NOT_FOUND', description: {
        en: 'bed not found',
        tr: 'yatak bulunamadı',
      }
    },
    BED_NOT_ACTIVE: {
      code: 'BED_NOT_ACTIVE', description: {
        en: 'bed not active',
        tr: 'yatak bulunamadı',
      }
    },
    OUTCASE_NOT_ACTIVE: {
      code: 'OUTCASE_NOT_ACTIVE', description: {
        en: 'Out Case Not Found',
        tr: 'Ayrılma durumu bulunamadı',
      }
    },
    INCASE_NOT_ACTIVE: {
      code: 'INCASE_NOT_ACTIVE', description: {
        en: 'In Case Not Found',
        tr: 'Kurumda durumu bulunamadı',
      }
    },
    PATIENTDEFINE_NOT_FOUND: {
      code: 'PATIENTDEFINE_NOT_FOUND', description: {
        en: 'patient define not found',
        tr: 'hasta tanımı bulunamadı',
      }
    },
    PATIENTDEFINE_NOT_ACTIVE: {
      code: 'PATIENTDEFINE_NOT_ACTIVE', description: {
        en: 'patient define not active',
        tr: 'hasta tanımı bulunamadı',
      }
    },

    PATIENTMOVEMENT_NOT_FOUND: {
      code: 'PATIENTMOVEMENT_NOT_FOUND', description: {
        en: 'patient movement not found',
        tr: 'hasta hareketi bulunamadı',
      }
    },
    PATIENTMOVEMENT_NOT_ACTIVE: {
      code: 'PATIENTMOVEMENT_NOT_ACTIVE', description: {
        en: 'patient movement not active',
        tr: 'hasta hareketi bulunamadı',
      }
    },
    TODO_NOT_FOUND: {
      code: 'TODO_NOT_FOUND', description: {
        en: 'todo not found',
        tr: 'Yapılacak bulunamadı',
      }
    },
    TODO_NOT_ACTIVE: {
      code: 'TODO_NOT_ACTIVE', description: {
        en: 'todo not active',
        tr: 'Yapılacak bulunamadı',
      }
    },
  },
  VALIDATION_ERROR: {
    FIRSTNAME_REQUIRED: {
      code: 'FIRSTNAME_REQUIRED', description: {
        en: 'The firstname required',
        tr: 'Bu işlem için ilk isim gerekli',
      }
    },
    NAME_REQUIRED: {
      code: 'NAME_REQUIRED', description: {
        en: 'The name required',
        tr: 'Bu işlem için isim gerekli',
      }
    },
    LASTNAME_REQUIRED: {
      code: 'LASTNAME_REQUIRED', description: {
        en: 'The lastname required',
        tr: 'Bu işlem için son isim gerekli',
      }
    },
    SURNAME_REQUIRED: {
      code: 'SURNAME_REQUIRED', description: {
        en: 'The surname required',
        tr: 'Bu işlem için soyisim gerekli',
      }
    },
    PROFESSION_REQUIRED: {
      code: 'PROFESSION_REQUIRED', description: {
        en: 'The profession required',
        tr: 'Bu işlem için meslek gerekli',
      }
    },
    WORKSTARTTIME_REQUIRED: {
      code: 'WORKSTARTTIME_REQUIRED', description: {
        en: 'The work start time required',
        tr: 'Bu işlem için meslek grubu gerekli',
      }
    },
    GENDER_REQUIRED: {
      code: 'GENDER_REQUIRED', description: {
        en: 'The gender required',
        tr: 'Bu işlem için cinsiyet gerekli',
      }
    },
    FATHERNAME_REQUIRED: {
      code: 'FATHERNAME_REQUIRED', description: {
        en: 'The fathername required',
        tr: 'Bu işlem için  baba adı gerekli',
      }
    },
    MOTHERNAME_REQUIRED: {
      code: 'MOTHERNAME_REQUIRED', description: {
        en: 'The fathername required',
        tr: 'Bu işlem için anne adı gerekli',
      }
    },
    MOTHERBIOLOGICALAFFINITY_REQUIRED: {
      code: 'MOTHERBIOLOGICALAFFINITY_REQUIRED', description: {
        en: 'The Motherbiologicalaffinity required',
        tr: 'Bu işlem için anne biyolojik yakınlık durumu gerekli',
      }
    },
    ISMOTHERALIVE_REQUIRED: {
      code: 'ISMOTHERALIVE_REQUIRED', description: {
        en: 'The Ismotheralive required',
        tr: 'Bu işlem için anne hayattamı bilgisi gerekli',
      }
    },
    FATHERBIOLOGICALAFFINITY_REQUIRED: {
      code: 'FATHERBIOLOGICALAFFINITY_REQUIRED', description: {
        en: 'The Fatherbiologicalaffinity required',
        tr: 'Bu işlem için baba biyolojik yakınlık durumu gerekli',
      }
    },
    ISFATHERALIVE_REQUIRED: {
      code: 'ISFATHERALIVE_REQUIRED', description: {
        en: 'The Isfatheralive required',
        tr: 'Bu işlem için anne hayattamı bilgisi gerekli',
      }
    },
    COUNTRYID_REQUIRED: {
      code: 'COUNTRYID_REQUIRED', description: {
        en: 'The CountryID required',
        tr: 'Bu işlem için kimlik numarası gerekli',
      }
    },
    DATEOFBIRTH_REQUIRED: {
      code: 'DATEOFBIRTH_REQUIRED', description: {
        en: 'The Date of birth required',
        tr: 'Bu işlem için doğum tarihi gerekli',
      }
    },
    PLACEOFBIRTH_REQUIRED: {
      code: 'PLACEOFBIRTH_REQUIRED', description: {
        en: 'The Place of birth required',
        tr: 'Bu işlem için doğum yeri gerekli',
      }
    },
    DATEOFDEATH_REQUIRED: {
      code: 'DATEOFDEATH_REQUIRED', description: {
        en: 'The Date of death required',
        tr: 'Bu işlem için ölüm tarihi gerekli',
      }
    },
    PLACEOFDEATH_REQUIRED: {
      code: 'PLACEOFDEATH_REQUIRED', description: {
        en: 'The Place of death required',
        tr: 'Bu işlem için ölüm yeri gerekli',
      }
    },
    DEATHINFO_REQUIRED: {
      code: 'DEATHINFO_REQUIRED', description: {
        en: 'The Death info required',
        tr: 'Bu işlem için ölüm yeri gerekli',
      }
    },
    GENDER_REQUIRED: {
      code: 'GENDER_REQUIRED', description: {
        en: 'The Gender required',
        tr: 'Bu işlem için cinsiyet gerekli',
      }
    },
    MARIALSTATUS_REQUIRED: {
      code: 'MARIALSTATUS_REQUIRED', description: {
        en: 'The Marial status required',
        tr: 'Bu işlem için marial status gerekli',
      }
    },
    CRIMINALRECORD_REQUIRED: {
      code: 'CRIMINALRECORD_REQUIRED', description: {
        en: 'The Criminal record required',
        tr: 'Bu işlem için sabıka kaydı gerekli',
      }
    },
    CHILDNUMBER_REQUIRED: {
      code: 'CHILDNUMBER_REQUIRED', description: {
        en: 'The Child number required',
        tr: 'Bu işlem için çocuk sayısı gerekli',
      }
    },
    DISABLEDCHILDNUMBER_REQUIRED: {
      code: 'DISABLEDCHILDNUMBER_REQUIRED', description: {
        en: 'The Disabled child number required',
        tr: 'Bu işlem için üvey çocuk sayısı gerekli',
      }
    },
    SIBLINGSTATUS_REQUIRED: {
      code: 'SIBLINGSTATUS_REQUIRED', description: {
        en: 'The Sibling status required',
        tr: 'Bu işlem için Sibling status gerekli',
      }
    },
    SGKSTATUS_REQUIRED: {
      code: 'SGKSTATUS_REQUIRED', description: {
        en: 'The Sgk status required',
        tr: 'Bu işlem için sgk durumu gerekli',
      }
    },
    BUDGETSTATUS_REQUIRED: {
      code: 'BUDGETSTATUS_REQUIRED', description: {
        en: 'The Budget status required',
        tr: 'Bu işlem için maaş durumu gerekli',
      }
    },
    TOWN_REQUIRED: {
      code: 'TOWN_REQUIRED', description: {
        en: 'The town required',
        tr: 'Bu işlem için ilçe gerekli',
      }
    },
    CITY_REQUIRED: {
      code: 'CITY_REQUIRED', description: {
        en: 'The city required',
        tr: 'Bu işlem için şehir gerekli',
      }
    },
    ADDRESS1_REQUIRED: {
      code: 'ADDRESS1_REQUIRED', description: {
        en: 'The address 1 required',
        tr: 'Bu işlem için adres 1 gerekli',
      }
    },
    ADDRESS2_REQUIRED: {
      code: 'ADDRESS2_REQUIRED', description: {
        en: 'The address 2 required',
        tr: 'Bu işlem için adres 2 gerekli',
      }
    },
    COUNTRY_REQUIRED: {
      code: 'COUNTRY_REQUIRED', description: {
        en: 'The Country required',
        tr: 'Bu işlem için Ülke gerekli',
      }
    },
    CONTACTNUMBER1_REQUIRED: {
      code: 'CONTACTNUMBER1_REQUIRED', description: {
        en: 'The Contact number 1 required',
        tr: 'Bu işlem için iletişim numarası 1 gerekli',
      }
    },
    CONTACTNUMBER2_REQUIRED: {
      code: 'CONTACTNUMBER2_REQUIRED', description: {
        en: 'The Contact number 2 required',
        tr: 'Bu işlem için iletişim numarası 2 gerekli',
      }
    },
    CONTACTNAME1_REQUIRED: {
      code: 'CONTACTNAME1_REQUIRED', description: {
        en: 'The Contact name 1 required',
        tr: 'Bu işlem için iletişim adı 1 gerekli',
      }
    },
    CONTACTNAME2_REQUIRED: {
      code: 'CONTACTNAME2_REQUIRED', description: {
        en: 'The Contact name 2 required',
        tr: 'Bu işlem için iletişim adı 2 gerekli',
      }
    },
    COSTUMERTYPEID_REQUIRED: {
      code: 'COSTUMERTYPEID_REQUIRED', description: {
        en: 'The CostumertypeID required',
        tr: 'Bu işlem için CostumertypeID gerekli',
      }
    },
    PATIENTTYPEID_REQUIRED: {
      code: 'PATIENTTYPEID_REQUIRED', description: {
        en: 'The PatienttypeID required',
        tr: 'Bu işlem için PatienttypeID gerekli',
      }
    },

    PATIENTDEFINEID_REQUIRED: {
      code: 'PATIENTDEFINEID_REQUIRED', description: {
        en: 'The PatientdefineID required',
        tr: 'Bu işlem için PatientdefineID gerekli',
      }
    },
    PATIENTSTATUS_REQUIRED: {
      code: 'PATIENTSTATUS_REQUIRED', description: {
        en: 'The Patient status required',
        tr: 'Bu işlem için Hasta Durumu gerekli',
      }
    },
    APPROVALDATE_REQUIRED: {
      code: 'APPROVALDATE_REQUIRED', description: {
        en: 'The Approval date required',
        tr: 'Bu işlem için kabul edilme tarihi gerekli',
      }
    },
    REGISTERDATE_REQUIRED: {
      code: 'REGISTERDATE_REQUIRED', description: {
        en: 'The Register date required',
        tr: 'Bu işlem için kayıt tarihi gerekli',
      }
    },
    RELEASEDATE_REQUIRED: {
      code: 'RELEASEDATE_REQUIRED', description: {
        en: 'The Release date required',
        tr: 'Bu işlem için Çıkış tarihi gerekli',
      }
    },
    ROOMNUMBER_REQUIRED: {
      code: 'ROOMNUMBER_REQUIRED', description: {
        en: 'The Room number required',
        tr: 'Bu işlem için Oda numarası gerekli',
      }
    },
    FLOORNUMBER_REQUIRED: {
      code: 'FLOORNUMBER_REQUIRED', description: {
        en: 'The Floor number required',
        tr: 'Bu işlem için Kat numarası gerekli',
      }
    },
    BEDNUMBER_REQUIRED: {
      code: 'BEDNUMBER_REQUIRED', description: {
        en: 'The Bed number required',
        tr: 'Bu işlem için Yatak numarası gerekli',
      }
    },
    DEPARTMENTID_REQUIRED: {
      code: 'DEPARTMENTID_REQUIRED', description: {
        en: 'The DepartmentID required',
        tr: 'Bu işlem için DepartmentID gerekli',
      }
    },
    WAREHOUSEID_REQUIRED: {
      code: 'WAREHOUSEID_REQUIRED', description: {
        en: 'The WarehouseID required',
        tr: 'Bu işlem için WarehouseID gerekli',
      }
    },
    IMAGEID_REQUIRED: {
      code: 'IMAGEID_REQUIRED', description: {
        en: 'The ImageID required',
        tr: 'Bu işlem için ImageID gerekli',
      }
    },
    CHECKPERIODID_REQUIRED: {
      code: 'CHECKPERIODID_REQUIRED', description: {
        en: 'The CheckperiodID required',
        tr: 'Bu işlem için CheckperiodID gerekli',
      }
    },
    TODOGROUPDEFINEID_REQUIRED: {
      code: 'TODOGROUPDEFINEID_REQUIRED', description: {
        en: 'The TodogroupdefineID required',
        tr: 'Bu işlem için TodogroupdefineID gerekli',
      }
    },
    CASEID_REQUIRED: {
      code: 'CASEID_REQUIRED', description: {
        en: 'The CaseID required',
        tr: 'Bu işlem için CaseID gerekli',
      }
    },

    PATIENTID_REQUIRED: {
      code: 'PATIENTID_REQUIRED', description: {
        en: 'The PatientID required',
        tr: 'Bu işlem için PatientID gerekli',
      }
    },
    PATIENTMOVEMENTTYPE_REQUIRED: {
      code: 'PATIENTMOVEMENTTYPE_REQUIRED', description: {
        en: 'The Patient movement type required',
        tr: 'Bu işlem için Hasta hareket türü gerekli',
      }
    },
    ISDEACTIVE_REQUIRED: {
      code: 'ISDEACTIVE_REQUIRED', description: {
        en: 'The Is Deactive required',
        tr: 'Bu işlem için deaktif mi bilgisi gerekli',
      }
    },
    OLDPATIENTMOVEMENTTYPE_REQUIRED: {
      code: 'OLDPATIENTMOVEMENTTYPE_REQUIRED', description: {
        en: 'The Old Patient movement type required',
        tr: 'Bu işlem için Eski hasta hareket türü gerekli',
      }
    },
    NEWPATIENTMOVEMENTTYPE_REQUIRED: {
      code: 'NEWPATIENTMOVEMENTTYPE_REQUIRED', description: {
        en: 'The New Patient movement type required',
        tr: 'Bu işlem için Yeni hasta hareket türü gerekli',
      }
    },
    ISTODONEED_REQUIRED: {
      code: 'ISTODONEED_REQUIRED', description: {
        en: 'The Is Todo need required',
        tr: 'Bu işlem için Yapılacaklar gerekli mi bilgisi gerekli',
      }
    },
    ISTODOCOMPLETED_REQUIRED: {
      code: 'ISTODOCOMPLETED_REQUIRED', description: {
        en: 'The Is Todo completed required',
        tr: 'Bu işlem için Yapılacaklar tamamlandı mı bilgisi gerekli',
      }
    },
    ISCOMPLATED_REQUIRED: {
      code: 'ISCOMPLATED_REQUIRED', description: {
        en: 'The Is Complated required',
        tr: 'Bu işlem için Tamamlandı mı bilgisi gerekli',
      }
    },
    ISWAITINGACTIVATION_REQUIRED: {
      code: 'ISWAITINGACTIVATION_REQUIRED', description: {
        en: 'The Is waiting activation required',
        tr: 'Bu işlem için aktivasyon bekliyor mu bilgisi gerekli',
      }
    },
    MOVEMENTDATE_REQUIRED: {
      code: 'MOVEMENTDATE_REQUIRED', description: {
        en: 'The Movement date required',
        tr: 'Bu işlem için hareket tarihi gerekli',
      }
    },
    UNSUPPORTED_PATIENTDEFINEID: {
      code: 'UNSUPPORTEDPATIENTDEFINEID_REQUIRED', description: {
        en: 'The patientdefineid is unsupported',
        tr: 'Tanımsız patientdefineid',
      }
    },
    PATIENTMOVEMENTID_REQUIRED: {
      code: 'PATIENTMOVEMENTID_REQUIRED', description: {
        en: 'The patientmovementid required',
        tr: 'Bu işlem için patientmovementid gerekli',
      }
    },
    PERSONELID_REQUIRED: {
      code: 'PERSONELID_REQUIRED', description: {
        en: 'The personelid required',
        tr: 'Bu işlem için personelid gerekli',
      }
    },
    UNSUPPORTED_PATIENTMOVEMENTID: {
      code: 'UNSUPPORTED_PATIENTMOVEMENTID', description: {
        en: 'The patientmovementid is unsupported',
        tr: 'Tanımsız patientmovementid',
      }
    },
    UNSUPPORTED_PERSONELID: {
      code: 'UNSUPPORTED_PERSONELID', description: {
        en: 'The personelid is unsupported',
        tr: 'Tanımsız personelid',
      }
    },
    UNSUPPORTED_PATIENTID: {
      code: 'UNSUPPORTED_PATIENTID', description: {
        en: 'The patientid is unsupported',
        tr: 'Tanımsız patientid',
      }
    },
    TODOID_REQUIRED: {
      code: 'TODOID_REQUIRED', description: {
        en: 'The todoid required',
        tr: 'Bu işlem için todoid gerekli',
      }
    },
    UNSUPPORTED_TODOID: {
      code: 'UNSUPPORTED_TODOID', description: {
        en: 'The todoid is unsupported',
        tr: 'Tanımsız todoid',
      }
    },
    MOVEMENTID_REQUIRED: {
      code: 'MOVEMENTID_REQUIRED', description: {
        en: 'The movementid required',
        tr: 'Bu işlem için movementid gerekli',
      }
    },
    TODODEFINEID_REQUIRED: {
      code: 'TODODEFINEID_REQUIRED', description: {
        en: 'The tododefineid required',
        tr: 'Bu işlem için tododefineid gerekli',
      }
    },
    CHECKTIME_REQUIRED: {
      code: 'CHECKTIME_REQUIRED', description: {
        en: 'The checktime required',
        tr: 'Bu işlem için kontrol zamano gerekli',
      }
    },

  }

}
module.exports = messages

const messages = {
  ERROR: {
    AMOUNT_NOT_FOUND: {
      code: 'AMOUNT_NOT_FOUND', description: {
        en: 'Amount not found',
        tr: 'Miktar bulunamadı',
      }
    },
    STOCKDEFINE_NOT_FOUND: {
      code: 'STOCKDEFINE_NOT_FOUND', description: {
        en: 'Stockdefine not found',
        tr: 'Stok tanımı bulunamadı',
      }
    },
    BREAKDOWN_NOT_FOUND: {
      code: 'BREAKDOWN_NOT_FOUND', description: {
        en: 'breakdown not found',
        tr: 'Arıza talebi bulunamadı',
      }
    },
    BREAKDOWN_NOT_ACTIVE: {
      code: 'BREAKDOWN_NOT_ACTIVE', description: {
        en: 'breakdown not active',
        tr: 'Arıza talebi aktif değil',
      }
    },
    MAINTEANCE_NOT_FOUND: {
      code: 'MAINTEANCE_NOT_FOUND', description: {
        en: 'maintance not found',
        tr: 'Bakım talebi bulunamadı',
      }
    },
    MAINTEANCE_NOT_ACTIVE: {
      code: 'MAINTEANCE_NOT_ACTIVE', description: {
        en: 'maintance not active',
        tr: 'Bakım talebi aktif değil',
      }
    },
    STOCKDEFINE_NOT_ACTIVE: {
      code: 'STOCKDEFINE_NOT_ACTIVE', description: {
        en: 'Stockdefine not active',
        tr: 'Stok tanımı bulunamadı',
      }
    },
    EQUIPMENTGROUP_NOT_FOUND: {
      code: 'EQUIPMENTGROUP_NOT_FOUND', description: {
        en: 'Equipment Group not found',
        tr: 'Envarter Grubu bulunamadı',
      }
    },
    EQUIPMENT_NOT_FOUND: {
      code: 'EQUIPMENT_NOT_FOUND', description: {
        en: 'Equipment not found',
        tr: 'Envarter bulunamadı',
      }
    },
    EQUIPMENTGROUP_NOT_ACTIVE: {
      code: 'EQUIPMENTGROUP_NOT_ACTIVE', description: {
        en: 'Equipment Group not active',
        tr: 'Envarter Grubu bulunamadı',
      }
    },
    EQUIPMENT_NOT_ACTIVE: {
      code: 'EQUIPMENT_NOT_ACTIVE', description: {
        en: 'Equipment not active',
        tr: 'Envarter bulunamadı',
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

    STOCK_NOT_FOUND: {
      code: 'STOCK_NOT_FOUND', description: {
        en: 'Stock not found',
        tr: 'Stok  bulunamadı',
      }
    },
    STOCK_NOT_ACTIVE: {
      code: 'STOCK_NOT_ACTIVE', description: {
        en: 'Stock not active',
        tr: 'Stok  aktif değil',
      }
    },

    WAREHOUSE_NOT_FOUND: {
      code: 'WAREHOUSE_NOT_FOUND', description: {
        en: 'Warehouse not found',
        tr: 'Ambar bulunamadı',
      }
    },
    WAREHOUSE_NOT_ACTIVE: {
      code: 'WAREHOUSE_NOT_ACTIVE', description: {
        en: 'Warehouse not active',
        tr: 'Ambar aktif değil',
      }
    },
    PURCHASEORDER_NOT_FOUND: {
      code: 'PURCHASEORDER_NOT_FOUND', description: {
        en: 'Purchaseorder not found',
        tr: 'Satın alma bulunamadı',
      }
    },
    PURCHASEORDER_NOT_ACTIVE: {
      code: 'PURCHASEORDER_NOT_ACTIVE', description: {
        en: 'Purchaseorder not active',
        tr: 'Satın alma aktif değil',
      }
    },


  },
  VALIDATION_ERROR: {
    STARTTIME_REQUIRED: {
      code: 'STARTTIME_REQUIRED', description: {
        en: 'The start time required',
        tr: 'Bu işlem için başlangıç zamanı gerekli',
      }
    },
    STOCKMOVEMENTS_REQUIRED: {
      code: 'STOCKMOVEMENTS_REQUIRED', description: {
        en: 'The stock movements required',
        tr: 'Bu işlem için stok hareketleri gerekli',
      }
    },
    NAME_REQUIRED: {
      code: 'NAME_REQUIRED', description: {
        en: 'The name required',
        tr: 'Bu işlem için isim gerekli',
      }
    },
    BREAKDOWNID_REQUIRED: {
      code: 'BREAKDOWNID_REQUIRED', description: {
        en: 'The breakdownid required',
        tr: 'Bu işlem için breakdownid gerekli',
      }
    },
    UNSUPPORTED_BREAKDOWNID: {
      code: 'UNSUPPORTED_BREAKDOWNID', description: {
        en: 'The breakdownid is unsupported',
        tr: 'geçersiz breakdownid',
      }
    },
    MAINTEANCEID_REQUIRED: {
      code: 'MAINTEANCEID_REQUIRED', description: {
        en: 'The mainteanceid required',
        tr: 'Bu işlem için mainteanceid gerekli',
      }
    },
    UNSUPPORTED_MAINTEANCEID: {
      code: 'UNSUPPORTED_BREAKDOWNID', description: {
        en: 'The mainteanceid is unsupported',
        tr: 'geçersiz mainteanceid',
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
    AMOUNT_LIMIT_ERROR: {
      code: 'AMOUNT_LIMIT_ERROR', description: {
          en: 'The amount is too low',
          tr: 'Bu işlem yeterli ürün yok',
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
    STOCKDEFINEID_REQUIRED: {
      code: 'STOCKDEFINEID_REQUIRED', description: {
        en: 'The stockdefineid required',
        tr: 'Bu işlem için stockdefineid gerekli',
      }
    },
    EQUIPMENTGROUPID_REQUIRED: {
      code: 'EQUIPMENTGROUPID_REQUIRED', description: {
        en: 'The equipment group id required',
        tr: 'Bu işlem için equipment group id gerekli',
      }
    },
    EQUIPMENTID_REQUIRED: {
      code: 'EQUIPMENTID_REQUIRED', description: {
        en: 'The equipment id required',
        tr: 'Bu işlem için equipment id gerekli',
      }
    },
    STOCKID_REQUIRED: {
      code: 'STOCKID_REQUIRED', description: {
        en: 'The stockid required',
        tr: 'Bu işlem için stockid gerekli',
      }
    },
    USERID_REQUIRED: {
      code: 'USERID_REQUIRED', description: {
        en: 'The userid required',
        tr: 'Bu işlem için userid gerekli',
      }
    },
    ISONUSAGE_REQUIRED: {
      code: 'ISONUSAGE_REQUIRED', description: {
        en: 'The isonusage required',
        tr: 'Bu işlem için kullanımdamı bilgisi gerekli',
      }
    },
    STOCKMOVEMENTID_REQUIRED: {
      code: 'STOCKMOVEMENTID_REQUIRED', description: {
        en: 'The stockmovementid required',
        tr: 'Bu işlem için stockmovementid gerekli',
      }
    },
    SOURCE_REQUIRED: {
      code: 'SOURCE_REQUIRED', description: {
        en: 'The source required',
        tr: 'Bu işlem için kaynak gerekli',
      }
    },
    SKT_REQUIRED: {
      code: 'SKT_REQUIRED', description: {
        en: 'The skt required',
        tr: 'Bu işlem için skt gerekli',
      }
    },
    INFO_REQUIRED: {
      code: 'INFO_REQUIRED', description: {
        en: 'The info required',
        tr: 'Bu işlem için açıklama gerekli',
      }
    },
    STATUS_REQUIRED: {
      code: 'STATUS_REQUIRED', description: {
        en: 'The status required',
        tr: 'Bu işlem için durum gerekli',
      }
    },
    ORDER_REQUIRED: {
      code: 'ORDER_REQUIRED', description: {
        en: 'The order required',
        tr: 'Bu işlem için sıra bilgisi gerekli',
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
    PURCHASEORDERID_REQUIRED: {
      code: 'PURCHASEORDERID_REQUIRED', description: {
        en: 'The purchaseorderid required',
        tr: 'Bu işlem için purchaseorderid gerekli',
      }
    },
    WAREHOUSEID_REQUIRED: {
      code: 'WAREHOUSEID_REQUIRED', description: {
        en: 'The warehouseid required',
        tr: 'Bu işlem için warehouseid gerekli',
      }
    },
    CASEID_REQUIRED: {
      code: 'CASEID_REQUIRED', description: {
        en: 'The caseid required',
        tr: 'Bu işlem için caseid gerekli',
      }
    },
    STOCKS_REQUIRED: {
      code: 'STOCKS_REQUIRED', description: {
        en: 'The Stocks required',
        tr: 'Bu işlem için stoklar gerekli',
      }
    },
    COMPANY_REQUIRED: {
      code: 'COMPANY_REQUIRED', description: {
        en: 'The Company required',
        tr: 'Bu işlem için firma gerekli',
      }
    },
    USERNAME_REQUIRED: {
      code: 'USERNAME_REQUIRED', description: {
        en: 'The Username required',
        tr: 'Bu işlem için Kullanıcı adı gerekli',
      }
    },
    PURHCASEPRICE_REQUIRED: {
      code: 'PURHCASEPRICE_REQUIRED', description: {
        en: 'The purchase price required',
        tr: 'Bu işlem için satın alma miktarı gerekli',
      }
    },
    PURHCASENUMBER_REQUIRED: {
      code: 'PURHCASENUMBER_REQUIRED', description: {
        en: 'The purchase number required',
        tr: 'Bu işlem için satın alma numarası gerekli',
      }
    },
    COMPANYPERSONELNAME_REQUIRED: {
      code: 'COMPANYPERSONELNAME_REQUIRED', description: {
        en: 'The purchase company personel name required',
        tr: 'Bu işlem için firma satın alma görevli adı gerekli',
      }
    },
    PERSONELNAME_REQUIRED: {
      code: 'PERSONELNAME_REQUIRED', description: {
        en: 'The personel name required',
        tr: 'Bu işlem için satın alma görevli adı gerekli',
      }
    },
    PURCHASEDATE_REQUIRED: {
      code: 'PURCHASEDATE_REQUIRED', description: {
        en: 'The purchase date required',
        tr: 'Bu işlem için satın alma tarihi gerekli',
      }
    },
    PATIENTID_REQUIRED: {
      code: 'PATIENTID_REQUIRED', description: {
        en: 'The patientId required',
        tr: 'Bu işlem için patientId gerekli',
      }
    },
    UNSUPPORTED_STOCKDEFINEID: {
      code: 'UNSUPPORTED_STOCKDEFINEID', description: {
        en: 'The stockdefineid is unsupported',
        tr: 'Geçersiz stockdefineid',
      }
    },
    UNSUPPORTED_EQUIPMENTGROUPID: {
      code: 'UNSUPPORTED_EQUIPMENTGROUPID', description: {
        en: 'The equipment group id is unsupported',
        tr: 'Geçersiz equipment group id',
      }
    },
    UNSUPPORTED_EQUIPMENTID: {
      code: 'UNSUPPORTED_EQUIPMENTID', description: {
        en: 'The equipment id is unsupported',
        tr: 'Geçersiz equipment id',
      }
    },
    UNSUPPORTED_STOCKMOVEMENTID: {
      code: 'UNSUPPORTED_STOCKMOVEMENTID', description: {
        en: 'The stockmovementid is unsupported',
        tr: 'Geçersiz stockmovementid',
      }
    },
    UNSUPPORTED_STOCKID: {
      code: 'UNSUPPORTED_STOCKID', description: {
        en: 'The stockid is unsupported',
        tr: 'Geçersiz stockid',
      }
    },
    UNSUPPORTED_WAREHOUSEID: {
      code: 'UNSUPPORTED_WAREHOUSEID', description: {
        en: 'The warehouseid is unsupported',
        tr: 'Geçersiz warehouseid',
      }
    },
    UNSUPPORTED_PURCHASEORDERID: {
      code: 'UNSUPPORTED_PURCHASEORDERID', description: {
        en: 'The purchaseorderid is unsupported',
        tr: 'Geçersiz purchaseorderid',
      }
    },
  }

}
module.exports = messages

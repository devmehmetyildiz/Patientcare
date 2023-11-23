const Literals = {
    Options: {
        Liveoptions:{
            value0:{
                tr:"Hayır Yaşamıyor",
                en:"No, Not Living"
            },
            value1:{
                tr:"Evet Yaşıyor",
                en:"Yes, living"
            },
        },
        Genderoptions:{
            value0:{
                tr:"Erkek",
                en:"Men"
            },
            value1:{
                tr:"Kadın",
                en:"Women"
            },
        },
        Affinityoptions:{
            value0:{
                tr:"Öz",
                en:"Own"
            },
            value1:{
                tr:"Üvey",
                en:"Step"
            },
        }
    },
    Columns: {
        Id: {
            tr: 'Id',
            en: 'Id'
        },
        Uuid: {
            tr: 'Tekil ID',
            en: 'Unique ID'
        },
        Firstname: {
            tr: 'İlk İsim',
            en: 'First Name'
        },
        Lastname: {
            tr: 'Son İsim',
            en: 'Last Name'
        },
        Fathername: {
            tr: 'Baba Adı',
            en: 'Father Name'
        },
        Mothername: {
            tr: 'Anne Adı',
            en: 'Mother Name'
        },
        Motherbiologicalaffinity: {
            tr: 'Anne Biyolojik Yakınlık',
            en: 'Mother Biological Affinity'
        },
        Medicalboardreport: {
            tr: 'Sağlık Kurul Raporu',
            en: 'Medical Baord Report'
        },
        Ismotheralive: {
            tr: 'Anne Hayatta mı?',
            en: 'Is Mother Alive?'
        },
        Fatherbiologicalaffinity: {
            tr: 'Baba Biyolojik Yakınlık',
            en: 'Father Biological Affinity'
        },
        Isfatheralive: {
            tr: 'Baba Hayatta mı?',
            en: 'Is Father Alive?'
        },
        CountryID: {
            tr: 'TC Kimlik No',
            en: 'Country ID'
        },
        Dateofbirth: {
            tr: 'Doğum Tarihi',
            en: 'Date of Birth'
        },
        Placeofbirth: {
            tr: 'Doğum Yeri',
            en: 'Place of Birth'
        },
        Dateofdeath: {
            tr: 'Ölüm Tarihi',
            en: 'Date of Death'
        },
        Placeofdeath: {
            tr: 'Doğum Yeri',
            en: 'Place of Death'
        },
        Deathinfo: {
            tr: 'Ölüm Nedeni',
            en: 'Death Info'
        },
        Gender: {
            tr: 'Cinsiyet',
            en: 'Gender'
        },
        Marialstatus: {
            tr: 'Medeni Hal',
            en: 'Marial Status'
        },
        Criminalrecord: {
            tr: 'Sabıka Kaybı',
            en: 'Criminal Record'
        },
        Childnumber: {
            tr: 'Çocuk Sayısı',
            en: 'Child Number'
        },
        Disabledchildnumber: {
            tr: 'Engelli Çocuk Sayısı',
            en: 'Disabled Child Number'
        },
        Siblingstatus: {
            tr: 'Kardeş Sayısı',
            en: 'Sibling Number'
        },
        Sgkstatus: {
            tr: 'Sgk Durumu',
            en: 'Sgk Status'
        },
        Budgetstatus: {
            tr: 'Maaş Durumu',
            en: 'Budget Status'
        },
        City: {
            tr: 'İl',
            en: 'City'
        },
        Town: {
            tr: 'İlçe',
            en: 'Town'
        },
        Address1: {
            tr: 'Adres 1',
            en: 'Address 1'
        },
        Address2: {
            tr: 'Adres 2',
            en: 'Address 2'
        },
        Country: {
            tr: 'Ülke',
            en: 'Country'
        },
        Contactnumber1: {
            tr: 'İletişim Numarası 1',
            en: 'Contact Number 1'
        },
        Contactnumber2: {
            tr: 'İletişim Numarası 2',
            en: 'Contact Number 2'
        },
        Contactname1: {
            tr: 'İletişim Adı 1',
            en: 'Contact Name 1'
        },
        Contactname2: {
            tr: 'İletişim Adı 1',
            en: 'Contact Name 1'
        },
        CostumertypeName: {
            tr: 'Müşteri Türü',
            en: 'Costumer Type'
        },
        PatienttypeName: {
            tr: 'Hasta Türü',
            en: 'Patient Type'
        },
        Createduser: {
            tr: 'Oluşturan Kullanıcı',
            en: 'Created User'
        },
        Updateduser: {
            tr: 'Güncelleyen Kullanıcı',
            en: 'Updated User'
        },
        Createtime: {
            tr: 'Oluşturma Tarihi',
            en: 'Create Time'
        },
        Updatetime: {
            tr: 'Güncelleme Tarihi',
            en: 'Update Time'
        },
        edit: {
            tr: 'Güncelle',
            en: 'Edit'
        },
        delete: {
            tr: 'Sil',
            en: 'Delete'
        },
    },
    Page: {
        Pageheader: {
            tr: "Hasta Tanımları",
            en: "Patient Defines"
        },
        Pagecreateheader: {
            tr: "Oluştur",
            en: "Create"
        },
        Pageeditheader: {
            tr: "Güncelle",
            en: "Update"
        },
        Pagedeleteheader: {
            tr: "Hasta Tanımı Silme",
            en: "Delete Patient Define"
        }
    },
    Button: {
        Create: {
            tr: "Oluştur",
            en: "Create"
        },
        Update: {
            tr: "Güncelle",
            en: "Update"
        },
        Delete: {
            tr: "Sil",
            en: "Delete"
        },
        Giveup: {
            tr: "Vazgeç",
            en: "Give up"
        },
        Goback: {
            tr: "Geri Dön",
            en: "Go Back"
        },

    },
    Messages: {
        Nodatafind: {
            tr: "Tanımlı Hasta Türü Yok",
            en: "There is no patient define found"
        },
        Deletecheck: {
            tr: "hasta tanımını silmek istediğinize emin misiniz?",
            en: "patient define will delete, are you sure?"
        },
        Firstnamerequired: {
            tr: "İlk İsim Gerekli",
            en: "First Name Required"
        },
        Lastnamerequired: {
            tr: "Son İsim Gerekli",
            en: "Last Name Required"
        },
        CountryIDrequired: {
            tr: "TC Kimlik No Gerekli",
            en: "Country ID Required"
        },
        Costumertyperequired: {
            tr: "Müşteri Türü Gerekli",
            en: "Costumer type Required"
        },
        Patienttyperequired: {
            tr: "Hasta Türü Gerekli",
            en: "Patient type Required"
        },
        Yes: {
            tr: "EVET",
            en: "YES"
        },
        No: {
            tr: "HAYIR",
            en: "NO"
        }
    }
}

export default Literals
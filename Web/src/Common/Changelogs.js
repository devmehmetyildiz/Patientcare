
const version1_0_0_0 = {
    version: "1.0.0.0",
    bugs: [
        {
            title: "Genel Hata Düzenlemeleri", commits: [
                "Rutinler Dışındaki Akışlar Sisteme Eklendi",
                "Mobil Ekran Düzenlemeleri, Hastalar Dışında düzenleme yapıldı"
            ]
        }
    ],
}

const version1_0_0_1 = {
    version: "1.0.0.1",
    changes: [
        {
            title: "Satın Alma İşlemleri", commits: [
                "Satın Almalarda Teslim alan olarak kurum görevlileri seçilecek",
            ],
        },
        {
            title: "Hasta İşlemleri", commits: [
                "Ön Kayıtlardaki kuruma giriş tarihi, ön kayıt onaylama ekranına taşındı.",
                "Detay Ekranındaki Ürün hareket işlemlerinde ürün - barkod yerine skt çıkacak",
                "Hastalar ekranındaki eylemler seçeneceği detay olarak değişti ve popup yerine düz icon yapıldı",
                "Detay ekranındaki hareket tablosundan aktivasyon bilgisi kaldırıldı.",
                "Ön Kayıtlar tamamlama ekranında kart bilgilerindeki alt bilgiler popup yapıldı.",
                "Tanım düzenlemede müşteri türleri olarak sadece departman olarak sağlık seçilen türler gelecek"
            ],
        }
    ],
    bugs: [
        {
            title: "Ekran Hataları", commits: [
                "Departman Güncelleme ekranında verilerin gelmeme problemi düzeltildi",
                "Hasta Hareketlerinden Kurumda hareketi yanlış yazılmış düzeltildi"
            ],
        },
        {
            title: "Genel Hatalar", commits: [
                "Parola değiştir ekranının açılmama problemi düzeltildi.",
                "Parola Resetleme ekranın açılmama problemi düzeltildi"
            ],
        }
    ],
}

const version1_0_0_2 = {
    version: "1.0.0.2",
    features: [
        {
            title: "Ayarlar", commits: [
                "Periyotlara hızlı oluşturma seçeneği eklendi",
                "Katlara hızlı kat oluşturma seçeneği eklendi",
            ]
        },
        {
            title: "Hastalar", commits: [
                "Hasta Detay Ekranında Kat değiştirme seçeneği eklendi",
                "Hasta Detay Rutin düzenle ekranında şablon oluşturma şablon ekleme seçenekleri eklendi"
            ]
        },
    ],
    changes: [
        {
            title: "Ayarlar", commits: [
                "Kontrol Periyotları kaldırıldı, periyotlar yapılacaklara bağlandı",
                "Hastalar artık yapılacak grup tanımlarına değil direkt yapılacaklara bağlı",
            ],
        },
        {
            title: "System", commits: [
                "Rutin Kontrol cron jobı güncellendi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hasta detay ekranında görsel düzenleme",
                "Detay ekranındaki yapılacak tabloları onaydan tamamlandıya çekildi"
            ],
        },
    ],
    bugs: [
        {
            title: "Hastalar", commits: [
                "Movement tablolarında sktler sadece tarihli gözüküyor",
                "ilac ekleme ilaç silme tablolarında sktler sadece tarihli gözüküyor",
            ],
        },
        {
            title: "Genel", commits: [
                "multiple dropdown kullanan crud sayfalarda silinmiş ürünlerin yol açtığı hata giderildi",
            ],
        },
    ],
}

const version1_0_0_3 = {
    version: "1.0.0.3",
    features: [
        {
            title: "Ayarlar", commits: [
                "Vardiyalar Eklendi",
            ]
        },
        {
            title: "Ambar Yönetimi", commits: [
                "Ekipmanlar Eklendi",
                "Ekipman Grupları Eklendi",
            ]
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Genel Hareket Onaylama Ekranı Eklendi",
            ]
        },
        {
            title: "Hastalar", commits: [
                "Hasta Detay Ekranında Kat değiştirme seçeneği eklendi",
                "Hasta Detay Rutin düzenle ekranında şablon oluşturma şablon ekleme seçenekleri eklendi"
            ]
        },
    ],
    changes: [
        {
            title: "Servisler", commits: [
                "Warehouse Req boyd helper kaldırıldı",
                "Genel mikroservis error handler düzenlemesi",
            ],
        },

    ],
    bugs: [
        {
            title: "File", commits: [
                "File mikroserivisnde hata giderimi",
            ],
        },
        {
            title: "Parola Sıfırlama", commits: [
                "Logine yönlendirme problemi giderildi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Ön Kayıtlar onaylama ekranı, hataya düşme problemi giderildi",
            ],
        },
    ],
}

const version1_0_0_4 = {
    version: "1.0.0.4",
    features: [
        {
            title: "Ayarlar", commits: [
                "Durumlara Yeni casestatus eklendi : Başlangıç",
            ]
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Ön Kayıtlarda kayıt esnasında sadece",
                "Genel mikroservis error handler düzenlemesi",
            ],
        },

    ],
    bugs: [
        {
            title: "Servis", commits: [
                "App.js düzenlemesi",
            ],
        },
    ],
}

const version1_0_0_5 = {
    version: "1.0.0.5",
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Onaylanmayan Hareketler, tekli onaylama seçeneği eklendi",
                "Onaylanmayan Stoklar geliştiriliyor, Eklenecek",
                "Kullanıcı bildirimleri için servis geliştirmeleri yapıldı, ön yüze eklenecek",
                "Personeller Eklendi",
                "Arıza Talepleri Eklendi",
                "Bakım Talepleri Eklendi",
                "Personel vardiyaları ekranı eklendi geliştirmeler eklenecek",
            ]
        },
        {
            title: "Hastalar", commits: [
                "Dosya Kayıt İşlemlerinde çoklu dosya ekleme ve sürükle bırak özelliği eklendi",
                "Ön Kayıtlarda olur tarihi, hasta türü ve müşteri türü eklendi",
                "Aktif olarak kurumda olan hastalar için hızlı hasta ekleme sayfası eklendi",
            ]
        },
        {
            title: "Ayarlar", commits: [
                "Katlara cinsiyet bilgisi eklendi",
                "Yataklara dolumu boşmu bilgisi eklendi",
            ]
        },
    ],
    changes: [
        {
            title: "Servis", commits: [
                "File mikroservisi ftp bağlantıları düzenlendi ve güçlendirildi",
            ],
        },
        {
            title: "Ön Yüz", commits: [
                "Tablolarda 20'li görüntüleme eklendi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hasta tanım düzenleme ekranlarında öncelikli girişler ikiye ayrıldı. (Ek Bilgiler)",
            ],
        },

    ],
    bugs: [
        {
            title: "Ön Yüz", commits: [
                "Bazı sayfalarda scroll'a düşmeme durumu düzeltildi",
                "Gereksiz kütühaneler temizlendi",
                "Departmanlarda sayfa altyapısı test için değiştirildi.",
            ],
        },
    ],
}

const version1_0_0_6 = {
    version: "1.0.0.6",
    bugs: [
        {
            title: "Ayarlar", commits: [
                "Departmanlarda güncelleme ekranında veri gelmeme sorunu düzeltildi",
                "Yataklarda güncelleme ekranında veri gelmeme sorunu düzeltildi",
            ],
        },
    ],
}

const version1_0_0_7 = {
    version: "1.0.0.7",
    withoutIssues: [
        {
            title: "Önyüz", commits: [
                "Versiyon button style düzenlemesi",
            ]
        }
    ]
}

export { version1_0_0_0, version1_0_0_1, version1_0_0_2, version1_0_0_3, version1_0_0_4, version1_0_0_5, version1_0_0_6, version1_0_0_7 }

/* const version1000 = {
    version: "1.0.0.0",
    features: [
        {
            title: "testtitle", commits: [
                "test1",
                "test2"
            ]
        },
        {
            title: "testtitle1", commits: [
                "test1",
                "test2"
            ]
        },
        {
            title: "testtitle2", commits: [
                "test1",
                "test2"
            ]
        },
    ],
    changes: [
        {
            title: "testtitle", commits: [
                "test1",
                "test2"
            ]
        }
    ],
    bugs: [
        {
            title: "testtitle", commits: [
                "test1",
                "test2"
            ]
        }
    ],
    withoutIssues: [
        {
            title: "testtitle", commits: [
                "test1",
                "test2"
            ]
        }
    ]
} */


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
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Toplu stok onaylama ekranı eklendi",
                "Toplu Rutin onaylama ekranı eklendi",
                "Hasta Yerleşimleri takip ekranı eklendi",
                "Personelleri vardiyaya atama kuralı eklendi",
            ]
        },
        {
            title: "Sistem", commits: [
                "Uygulama Kullanım raporu eklendi",
                "Kurallar gelişti, 3 tane kural eklendi",
            ]
        },
        {
            title: "Hastalar", commits: [
                "Kurum Cüzdanı Eklendi",
                "Hasta Cüzdanı Eklendi",
                "Kurum Cüzdanı ile hasta cüzdanı arasında etkileşim eklendi",
            ]
        },
        {
            title: "Kullanıcı", commits: [
                "Bildirimler Eklendi",
                "Arıza ve Bakım talepleri bildirim kuralı eklendi",
            ]
        },
    ],
    bugs: [
        {
            title: "Kurum Yönetimi", commits: [
                "Vardiyalarda güncelleme",
            ]
        }
    ],
    withoutIssues: [
        {
            title: "Önyüz", commits: [
                "Sayfaların hızlanması için performans güncellemesi",
            ]
        }
    ]
}

const version1_0_0_8 = {
    version: "1.0.0.8",
    bugs: [
        {
            title: "Hastalar", commits: [
                "Ön Kayıtlar onaylama ekran acılmama hatası düzeltildi",
            ]
        }
    ],
}

const version1_0_0_9 = {
    version: "1.0.0.9",
    changes: [
        {
            title: "Hastalar", commits: [
                "Hasta Cüzdanı için hasta para türlerine kurum kasasına dahil etme seçeneği eklendi",
            ]
        }
    ],
}

const version1_0_0_10 = {
    version: "1.0.0.10",
    bugs: [
        {
            title: "Common", commits: [
                "Pagination artık kaybolmayacak"
            ]
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Kullanım Türleri ekranında oluşturulan dosya türleri, dosya ekranlarında kullanılabilecek",
                "Kullanım Türleri çoklu seçilebilecek",
                "Zorunlu seçilen türler kuruma alma ekranlarında zorunlu olacak",
                "Hasta Detay Ekran Tasarımı Geliştirildi",
                "Hasta cüzdan hareketlerinde yer alan kurum kasasından düş seçeneği ayarlayara taşındı"
            ]
        },
        {
            title: "Dosyalar", commits: [
                "Pdf dosyaları yeni sekmede açılabilecek",
            ]
        },
        {
            title: "Ayarlar", commits: [
                "Rutinler ve listelerin isimlendirmeleri değiştirildi",
            ]
        }
    ],
    features: [
        {
            title: "Hastalar", commits: [
                "Hastalar ekranında fotoğraflar gözükebilecek",
                "Hasta Sarfiyat İlaç Tüketim Ekranları Eklendi",
            ]
        },
        {
            title: "Ayarlar", commits: [
                "Dosya Türleri ekranı eklendi",
                "Cüzdanın üstüne gelindiğinde detay popup gözüküyor",
            ]
        }
    ],
}

const version1_0_0_11 = {
    version: "1.0.0.11",
    bugs: [
        {
            title: "Hastalar", commits: [
                "Hastalar ekranı mobil ekran hataya düşme sorunu giderildi"
            ]
        },
    ],
    features: [
        {
            title: "Ayarlar", commits: [
                "Destek Planları hazırlama ekranları eklendi",
            ]
        },
    ],
}

const version1_0_0_12 = {
    version: "1.0.0.11",
    changes: [
        {
            title: "Hastalar", commits: [
                "Hastalara ait ekranlarda mobil ekranlar düzenlendi",
                "Hastalara ait ekranlarda grid filterleri düzenlendi"
            ]
        },
    ],
}

const version1_0_0_13 = {
    version: "1.0.0.13",
    changes: [
        {
            title: "Common", commits: [
                "Bütün Ekranların mobil görünümleri ve filtre değerleri ayarlandı",
            ]
        },
    ],
}

export {
    version1_0_0_0,
    version1_0_0_1,
    version1_0_0_2,
    version1_0_0_3,
    version1_0_0_4,
    version1_0_0_5,
    version1_0_0_6,
    version1_0_0_7,
    version1_0_0_8,
    version1_0_0_9,
    version1_0_0_10,
    version1_0_0_11,
    version1_0_0_12,
    version1_0_0_13,
}
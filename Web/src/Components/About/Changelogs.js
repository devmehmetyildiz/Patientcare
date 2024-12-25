

const version1_1_0_1 = {
    version: "1.1.0.1",
    changes: [
        {
            title: "Güvenlik", commits: [
                "Ekran kapanmalarını önlemek için değişiklikler yapıldı",
                "Token süresi 5 dakikadan 10 dakikaya çıkartıldı",
            ],
        },
        {
            title: "Kullanıcılar", commits: [
                "Kullanıcı detay sayfası eklendi",
                "Güncelleme ve oluşturma ekranları değiştirildi",
                "Detay sayfası eklendi",
                "Departmanlara personel departmanı özelliği eklendi",
                "Durumlara personel durumları eklendi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hasta detay sayfasına hareketler çizelgesi eklendi",
                "Vefat eden veya ayrılan hastaları tekrar aktif et özelliği eklendi",
                "Hasta detay sayfasında ek parametreler eklendi",
                "Hastalara açıklama ve vasi notu eklendi",
                "Hasta tanımlarından ölüm ile alaklı bilgiler kaldırıldı",
                "Hasta tanımlarında tasarım düzenlemesi yapıldı",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Bekleyen onaylarım sayfası eklendi, fonksiyonlar daha eklenecek",
            ],
        },
    ]
}

const version1_1_0_2 = {
    version: "1.1.0.2",
    features: [
        {
            title: "Hakedişler", commits: [
                "Parametre oluşturma sayfası eklendi",
                "Hakediş oluşturma sayfası eklendi, geliştirmeler devam ediyor",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Otomatik hasta ekleme fonksiyonu geliştirildi",
            ],
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Kuruma giriş tarihi kaldırıldı, gerekli zorunluluklar kabul tarihine eklendi",
            ],
        },
    ],
}

const version1_1_0_3 = {
    version: "1.1.0.3",
    features: [
        {
            title: "Hakedişler", commits: [
                "Parameterler Sayfasında Güncellemeler Yapıldı",
                "Personel Teşviki Hariç Hakedişler Aktif Edildi",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Geçmiş Tarihli Durum Girişi Eklendi",
                "Hareketleri Düzenle Ekranı Eklendi, Hareketler Silinebilir, Güncellenebilir",
            ],
        },
        {
            title: "Kullanıcılar", commits: [
                "Kullanıcı Detay Sayfası Güncellendi, Detay Tablolar Eklendi",
                "Kullanıcılar için Durum Değiştirme, Geçmiş Tarihli Durum, Durum Düzenleme Sayfası Eklendi",
            ],
        },
    ],
    changes: [
        {
            title: "Dosya", commits: [
                "Dosya Yükleme Fonksiyonlarında Düzenlemeler Yapıldı",
                "Dosyalar Artık Önizleme Olarak Görüntülenecek, Talep Edilirse İndirilecek (Sadece PDF Ve PNG)",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Arıza ve Bakım Talepleri Sayfaları Ambarlar Ana Menusune Taşındı",
                "Hasta Durumları Sayfası Kaldırıldı, Hastalar Ekranına Çoklu İşlemler Menusunde Gerçekleştirilecek (Daha Aktif Değil)",
            ],
        },
    ],
}

const version1_1_0_5 = {
    version: "1.1.0.5",
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Hasta Yerleşimleri Ekran Tasarımı Düzenlendi",
                "Genel Kurum Takip Ekranı Eklendi",
                "Eğitimler Sayfasında Tamamlanma Durumu Eklendi, Eğitime Katılan Kullanıcılar Belirli Olacak.",
                "Eğitimler Ekleme Ve Güncelleme Ekranlarına Hızlı Personel Ekleme Fonksiyonu Eklendi.",
            ],
        },
        {
            title: "Hastalar", commits: [
                "Hastalar için Işlemlerde Vaka Gir Eklendi",
                "Hastalar için Vaka Düzenleme Ve Silme Fonksiyonları Eklendi",
            ],
        },
        {
            title: "Kullanıcılar", commits: [
                "Bildirim Süresi, Bildirim Pozisyonu Kullanıcı Ayarlarına Eklendi.",
                "Kullanıcılar Detay Ekranına Bekleyen Eğitimlerim Tablosu Eklendi, Eğitime Katıldım Onayladım Yapılabilir",
            ],
        },
    ],
    changes: [
        {
            title: "Stok Hareketleri", commits: [
                "Hastalarda Yaşanan Stok Tüketimi Işlemlerinde Onay Istenilmeyecek",
            ],
        },
    ],
    bugs: [
        {
            title: "Stoklar ve Stok Hareketleri", commits: [
                "Stok Tüketimlerindeki Negatife Düşme Sorunu Giderildi",
                "Ambarlardan Stok Girişi Yapılırken Stok Eklemede Stok Tür Grubu Eklenmeme Problemi Giderildi.",
            ],
        },
    ],
}

const version1_1_0_6 = {
    version: "1.1.0.6",
    changes: [
        {
            title: "Genel Arama", commits: [
                "Kullanıcılar aranabilir hale getirildi",
            ],
        },
        {
            title: "Bireysel Bakım Planları", commits: [
                "Destek Planlarına ve Destek Plan listelerine tür eklendi, İlgili bakım planı türüne göre plan eklenecek",
                "Hastaların Destek Planlarını güncellemede tür eklendi",
                "Bireysel Bakım Planlarına ait ekranlar yenilendi, tür eklendi",
                "Bireysel Bakım Planlarının taslak onaylama ve detay ekranları eklendi",
            ],
        },
    ],
    bugs: [
        {
            title: "Genel Arama", commits: [
                "Aynı Sayfa içerisinde yapılan hasta aramalarında ekran yenilenmeme sorunu giderildi",
            ],
        },
    ],
}

const version1_1_0_7 = {
    version: "1.1.0.7",
    bugs: [
        {
            title: "Hastalar", commits: [
                "Hasta Yerleşimleri tasarım düzenlemesi",
                "Ön Kayıtlar, tamamlanan hastalar tasarım düzenlemesi",
                "Hasta ve Kullanıcı Durum Değiştirmede Hata Düzenlemesi",
            ],
        },
        {
            title: "Sistem", commits: [
                "Arka Plan Servis Düzenlemeleri",
            ],
        },
    ],
}

const version1_1_0_8 = {
    version: "1.1.0.8",
    bugs: [
        {
            title: "Kurum Yönetimi", commits: [
                "Kurum Hasta Genel Görünümde Yer Alan Aylık Kurum Kapasite Değişim Grafiği Düzeltildi.",
                "Kurum Hasta Genel Görünümde Yer Alan Aylık Aylık Kurum Hareketleri Düzeltildi.",
            ],
        },
    ],
    changes: [
        {
            title: "Hastalar", commits: [
                "Hasta Vakaları Daha Detaylı Hale Getirildi, Vaka Türü Olaya Dahil Kişiler vb. Parametreler Eklendi.",
            ],
        },
        {
            title: "Ayarlar", commits: [
                "Kullanım Türlerine Hastalar için Zorunlumu, Personeller için Zorunlumu Durumları Eklendi.",
            ],
        },
    ],
    features: [
        {
            title: "Hastalar", commits: [
                "Hasta Vakaları Ekranı Eklendi, Vakalar Hem Hasta Detayından Hemde Bu Ekrandan Takip Edilebilecek.",
                "Hasta Etkinlikleri Ekranı Eklendi, Hastaların Yaptıkları Etkinlikler Bu Ekrandan Takip Edilecek.",
                "Hasta Ziyaretleri Ekranı Eklendi, Hasta Yakınlarının Etkinlikleri Takip Edilecek.",
                "Hasta Vefat Girme ve Hasta Ayrılma Ekranlarında Tarih Girme Özelliği Eklendi.",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Eğitimlere Eğitim Kullanıcı Türü Eklendi. Hastalara, Hasta Yakınlarına, Personellere Ayrı Ayrı Eğitim Oluşturulabilecek.",
                "Eğitimler Tamamlanırken, Herkes Katıldı Olarak Tamamla Butonu Eklendi.",
                "Personel Olayları Ekranı Eklendi. Personellere Yönelik Vakalar,İstenmeyen Olaylar Bu Ekrandan Takip Edilecek.",
                "Anketler Ekranı Eklendi. Personel, Hasta Yakını ve Hastalar İçin Anket Oluşturulabilecek.",
                "Gösterge Kartları Eklendi.",
            ],
        },
        {
            title: "Ayarlar", commits: [
                "Kullanııclar Ekranına İşten Ayrılma Butonu Eklendi.",
            ],
        },
    ],
}

const version1_1_0_9 = {
    version: "1.1.0.9",
    bugs: [
        {
            title: "Hastalar", commits: [
                "Dosya Silme Sorunu Giderildi.",
            ],
        },
        {
            title: "Kurum Yönetimi", commits: [
                "Gösterge Kartlarındaki Yüklenmeme sorunu giderildi.",
            ],
        },
    ],
    changes: [
        {
            title: "Sistem", commits: [
                "Uygulama Raporları değiştirildi.",
            ],
        },
    ],
    features: [
        {
            title: "Kurum Yönetimi", commits: [
                "Bakım Hizmetleri Gösterge Kartları Eklendi",
            ],
        },
    ],
}

const version1_1_0_10 = {
    version: "1.1.0.10",
    bugs: [
        {
            title: "Kullanıcılar", commits: [
                "Kullanıcı eklemesinde işten ayrılanlara otomatik gitme sorunu düzeltildi.",
            ],
        },
    ],
    features: [
        {
            title: "Sistem", commits: [
                "Grid Ekranlarda satıra tıklanıldığında arka plan farklı olabilecek.",
            ],
        },
    ],
}

export {
    version1_1_0_1,
    version1_1_0_2,
    version1_1_0_3,
    version1_1_0_5,
    version1_1_0_6,
    version1_1_0_7,
    version1_1_0_8,
    version1_1_0_9,
    version1_1_0_10,
}
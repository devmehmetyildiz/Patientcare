

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

export {
    version1_1_0_1,
    version1_1_0_2,
    version1_1_0_3,
    version1_1_0_5
}
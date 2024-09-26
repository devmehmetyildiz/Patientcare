

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

export {
    version1_1_0_1,
    version1_1_0_2,
    version1_1_0_3
}

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


export { version1_0_0_0, version1_0_0_1 }

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

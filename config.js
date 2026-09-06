/**
 * ==============================================================================
 * KONFIGURASI SUPABASE & APLIKASI JIMPITAN RT
 * ==============================================================================
 * Panduan Pengisian:
 * 1. Buka dashboard Supabase Anda: https://supabase.com/dashboard
 * 2. Masuk ke Project Anda -> Project Settings (ikon gerigi) -> API.
 * 3. Salin "Project URL" dan tempel di SUPABASE_URL di bawah ini.
 * 4. Salin "anon public key" dan tempel di SUPABASE_ANON_KEY di bawah ini.
 * ==============================================================================
 */

window.APP_CONFIG = {
  // Ganti dengan Project URL dari Supabase Dashboard
  SUPABASE_URL: "https://qkhyflucjbbhcflsbnjc.supabase.co",

  // Ganti dengan anon public API key dari Supabase Dashboard
  SUPABASE_ANON_KEY: "sb_publishable_EKXDxgwAc76kOk7MmfPrtQ_GRtKATsY",

  // Nama RT / Wilayah untuk ditampilkan di Header aplikasi
  RT_TITLE: "Ronda Warga RT 13",
  RT_SUBTITLE: "Pencatatan Jimpitan Mandiri Berbasis QR Code",

  // Nominal Cepat default (dalam Rupiah)
  QUICK_AMOUNTS: [0, 500, 1000, 2000, 5000],

  // Aktifkan mode simulasi (mock) jika kredensial Supabase belum diisi
  // Ini memungkinkan pengujian tampilan & alur UI secara lokal tanpa koneksi Supabase langsung
  ENABLE_MOCK_FALLBACK: true
};


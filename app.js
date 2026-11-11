
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);
};

const produkAwal = [
    {
        id: 1,
        nama: "Nasi Goreng",
        kategori: "Makanan",
        harga: 15000,
        stok: 15,
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500"
    },
    {
        id: 2,
        nama: "Mie Goreng",
        kategori: "Makanan",
        harga: 12000,
        stok: 12,
        gambar: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"
    },
    {
        id: 3,
        nama: "Ayam Geprek",
        kategori: "Makanan",
        harga: 18000,
        stok: 10,
        gambar: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"
    },
    {
        id: 4,
        nama: "Es Teh Manis",
        kategori: "Minuman",
        harga: 5000,
        stok: 20,
        gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"
    },
    {
        id: 5,
        nama: "Jus Jeruk",
        kategori: "Minuman",
        harga: 8000,
        stok: 15,
        gambar: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500"
    },
    {
        id: 6,
        nama: "Kopi Susu",
        kategori: "Minuman",
        harga: 10000,
        stok: 18,
        gambar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500"
    }
];

let produk = JSON.parse(localStorage.getItem("produkPOS")) || produkAwal;
let keranjang = [];
let transaksi = JSON.parse(localStorage.getItem("transaksiPOS")) || [];

function simpanData() {
    localStorage.setItem("produkPOS", JSON.stringify(produk));
    localStorage.setItem("transaksiPOS", JSON.stringify(transaksi));
}

function tanggalHariIni() {
    const sekarang = new Date();

    return [
        sekarang.getFullYear(),
        String(sekarang.getMonth() + 1).padStart(2, "0"),
        String(sekarang.getDate()).padStart(2, "0")
    ].join("-");
}

function tampilkanDashboard() {
    const transaksiHariIni = transaksi.filter(
        item => item.tanggalHari === tanggalHariIni()
    );

    const omzet = transaksiHariIni.reduce(
        (total, item) => total + item.total,
        0
    );

    const totalStok = produk.reduce(
        (total, item) => total + item.stok,
        0
    );

    document.getElementById("omzet").textContent = formatRupiah(omzet);
    document.getElementById("totalStok").textContent = totalStok;
    document.getElementById("jumlahTransaksi").textContent =
        transaksiHariIni.length;
}

function tampilkanProduk() {
    const daftar = document.getElementById("daftarProduk");
    const pencarian = document.getElementById("searchProduk").value.toLowerCase();
    const kategori = document.getElementById("filterKategori").value;

    const hasil = produk.filter(item => {
        const cocokNama = item.nama.toLowerCase().includes(pencarian);
        const cocokKategori =
            kategori === "Semua" || item.kategori === kategori;

        return cocokNama && cocokKategori;
    });

    daftar.innerHTML = "";

    if (hasil.length === 0) {
        daftar.innerHTML = `
            <div class="col-12 text-center py-4">
                <h6>Produk tidak ditemukan.</h6>
            </div>
        `;
        return;
    }

    hasil.forEach(item => {
        let statusStok = "";
        let warnaStok = "";

        if (item.stok === 0) {
            statusStok = "Stok Habis";
            warnaStok = "bg-danger";
        } else if (item.stok < 5) {
            statusStok = "Stok Menipis";
            warnaStok = "bg-warning text-dark";
        } else {
            statusStok = "Stok Tersedia";
            warnaStok = "bg-success";
        }

        daftar.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="product-card">
                    <img
                        src="${item.gambar}"
                        class="product-img"
                        alt="${item.nama}"
                        onerror="this.style.display='none'"
                    >

                    <div class="card-body">
                        <span class="badge bg-secondary mb-2">
                            ${item.kategori}
                        </span>

                        <h6 class="fw-bold">${item.nama}</h6>

                        <h5 class="fw-bold" style="color:#B42335">
                            ${formatRupiah(item.harga)}
                        </h5>

                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge ${warnaStok}">
                                ${statusStok}
                            </span>

                            <small>Stok: ${item.stok}</small>
                        </div>

                        <button
                            class="btn btn-primary w-100"
                            onclick="tambahKeranjang(${item.id})"
                            ${item.stok === 0 ? "disabled" : ""}
                        >
                            <i class="bi bi-cart-plus"></i>
                            Beli Produk
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function tambahProduk() {
    const nama = prompt("Masukkan nama produk:");

    if (!nama || !nama.trim()) return;

    const kategori = prompt(
        "Masukkan kategori (Makanan atau Minuman):"
    );

    if (!["Makanan", "Minuman"].includes(kategori)) {
        alert("Kategori harus Makanan atau Minuman.");
        return;
    }

    const harga = Number(prompt("Masukkan harga produk:"));
    const stok = Number(prompt("Masukkan jumlah stok:"));

    if (
        !Number.isFinite(harga) ||
        !Number.isInteger(stok) ||
        harga <= 0 ||
        stok < 0
    ) {
        alert("Harga atau stok tidak valid.");
        return;
    }

    const gambar = prompt("Masukkan URL gambar produk (opsional):") || "";

    produk.push({
        id: Date.now(),
        nama: nama.trim(),
        kategori,
        harga,
        stok,
        gambar
    });

    simpanData();
    tampilkanSemua();

    alert("Produk berhasil ditambahkan!");
}

function tambahKeranjang(id) {
    const item = produk.find(p => p.id === id);

    if (!item || item.stok <= 0) {
        alert("Stok produk habis!");
        return;
    }

    const ada = keranjang.find(p => p.id === id);

    if (ada) {
        if (ada.jumlah >= item.stok) {
            alert("Jumlah melebihi stok tersedia!");
            return;
        }

        ada.jumlah++;
    } else {
        keranjang.push({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: 1
        });
    }

    tampilkanKeranjang();
}

function ubahJumlah(id, perubahan) {
    const item = keranjang.find(p => p.id === id);
    const produkAsli = produk.find(p => p.id === id);

    if (!item || !produkAsli) return;

    const jumlahBaru = item.jumlah + perubahan;

    if (jumlahBaru > produkAsli.stok) {
        alert("Jumlah melebihi stok tersedia!");
        return;
    }

    if (jumlahBaru <= 0) {
        keranjang = keranjang.filter(p => p.id !== id);
    } else {
        item.jumlah = jumlahBaru;
    }

    tampilkanKeranjang();
}

function hitungTotal() {
    return keranjang.reduce(
        (total, item) => total + item.harga * item.jumlah,
        0
    );
}

function tampilkanKeranjang() {
    const tempat = document.getElementById("keranjang");

    tempat.innerHTML = "";

    if (keranjang.length === 0) {
        tempat.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x fs-1" style="color:#B42335"></i>
                <p class="text-muted mt-2">Keranjang masih kosong.</p>
            </div>
        `;
    }

    keranjang.forEach(item => {
        tempat.innerHTML += `
            <div class="cart-item">
                <div class="d-flex justify-content-between align-items-center gap-2">
                    <div>
                        <strong>${item.nama}</strong>
                        <div class="small text-muted">
                            ${formatRupiah(item.harga)}
                        </div>
                    </div>

                    <div class="d-flex align-items-center gap-2">
                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="ubahJumlah(${item.id}, -1)">
                            -
                        </button>

                        <strong>${item.jumlah}</strong>

                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="ubahJumlah(${item.id}, 1)">
                            +
                        </button>
                    </div>
                </div>

                <div class="text-end fw-bold mt-2">
                    ${formatRupiah(item.harga * item.jumlah)}
                </div>
            </div>
        `;
    });

    document.getElementById("totalBelanja").textContent =
        formatRupiah(hitungTotal());

    hitungKembalian();
}

function hitungKembalian() {
    const metode = document.getElementById("metode").value;
    const bagianTunai = document.getElementById("bagianTunai");
    const uangBayar = Number(document.getElementById("uangBayar").value);
    const total = hitungTotal();

    bagianTunai.style.display = metode === "Tunai" ? "block" : "none";

    const kembalian = metode === "Tunai"
        ? Math.max(0, uangBayar - total)
        : 0;

    document.getElementById("kembalian").textContent =
        formatRupiah(kembalian);

    const status = document.getElementById("statusPembayaran");

    if (metode === "Tunai" && uangBayar < total && total > 0) {
        status.textContent = "Uang pembayaran belum mencukupi.";
        status.className = "small text-danger";
    } else if (total > 0) {
        status.textContent = "Pembayaran siap diproses.";
        status.className = "small text-success";
    } else {
        status.textContent = "";
    }
}

function prosesTransaksi() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const total = hitungTotal();
    const metode = document.getElementById("metode").value;
    const uangBayar = metode === "Tunai"
        ? Number(document.getElementById("uangBayar").value)
        : total;

    if (metode === "Tunai" && uangBayar < total) {
        alert("Uang pembayaran tidak mencukupi!");
        return;
    }

    for (const item of keranjang) {
        const stokProduk = produk.find(p => p.id === item.id);

        if (!stokProduk || stokProduk.stok < item.jumlah) {
            alert(`Stok ${item.nama} tidak mencukupi!`);
            tampilkanProduk();
            return;
        }
    }

    const sekarang = new Date();

    const data = {
        nomor: "TRX-" + Date.now(),
        tanggal: sekarang.toLocaleString("id-ID"),
        tanggalHari: tanggalHariIni(),
        items: keranjang.map(item => ({ ...item })),
        total,
        metode,
        bayar: uangBayar,
        kembalian: uangBayar - total
    };

    keranjang.forEach(item => {
        const stokProduk = produk.find(p => p.id === item.id);
        stokProduk.stok -= item.jumlah;
    });

    transaksi.push(data);

    simpanData();

    keranjang = [];

    document.getElementById("uangBayar").value = "";

    tampilkanSemua();
    tampilkanKeranjang();
    buatNota(data);
}

function buatNota(data) {
    const receipt = document.getElementById("receipt");

    receipt.style.display = "block";
    receipt.style.background = "#FFF8F3";
    receipt.style.border = "2px solid #B42335";
    receipt.style.borderRadius = "15px";
    receipt.style.padding = "22px";
    receipt.style.margin = "20px 0";
    receipt.style.maxWidth = "500px";
    receipt.style.marginLeft = "auto";
    receipt.style.marginRight = "auto";

    let daftarItem = "";

    data.items.forEach(item => {
        daftarItem += `
            <tr>
                <td>${item.nama}</td>
                <td class="text-center">${item.jumlah}</td>
                <td class="text-end">
                    ${formatRupiah(item.harga * item.jumlah)}
                </td>
            </tr>
        `;
    });

    receipt.innerHTML = `
        <div class="text-center mb-3">
            <h4 class="fw-bold" style="color:#B42335">
                MINI POS
            </h4>
            <p class="small mb-1">BUKTI TRANSAKSI PEMBELIAN</p>
            <hr>
        </div>

        <div class="small mb-3">
            <div>No. Transaksi: ${data.nomor}</div>
            <div>Tanggal: ${data.tanggal}</div>
            <div>Metode: ${data.metode}</div>
        </div>

        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Produk</th>
                    <th class="text-center">Qty</th>
                    <th class="text-end">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${daftarItem}
            </tbody>
        </table>

        <hr>

        <div class="d-flex justify-content-between fw-bold">
            <span>Total Belanja</span>
            <span>${formatRupiah(data.total)}</span>
        </div>

        <div class="d-flex justify-content-between">
            <span>Uang Bayar</span>
            <span>${formatRupiah(data.bayar)}</span>
        </div>

        <div class="d-flex justify-content-between">
            <span>Kembalian</span>
            <span>${formatRupiah(data.kembalian)}</span>
        </div>

        <hr>

        <div class="text-center">
            <h6 class="fw-bold" style="color:#B42335">
                TRANSAKSI BERHASIL!
            </h6>
            <p class="small">Terima kasih telah berbelanja.</p>

            <button
                class="btn btn-primary"
                onclick="tutupNota()">
                <i class="bi bi-check-circle"></i>
                Selesai
            </button>
        </div>
    `;

    receipt.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function tutupNota() {
    const receipt = document.getElementById("receipt");
    receipt.style.display = "none";
    receipt.innerHTML = "";
}

function tampilkanRiwayat() {
    const daftar = document.getElementById("daftarRiwayat");

    daftar.innerHTML = "";

    if (transaksi.length === 0) {
        daftar.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    Belum ada transaksi.
                </td>
            </tr>
        `;
        return;
    }

    [...transaksi].reverse().forEach((item, index) => {
        daftar.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.tanggal}</td>
                <td class="fw-bold" style="color:#B42335">
                    ${formatRupiah(item.total)}
                </td>
                <td>
                    <span class="badge text-bg-danger">
                        ${item.metode}
                    </span>
                </td>
            </tr>
        `;
    });
}

function tampilkanSemua() {
    tampilkanDashboard();
    tampilkanProduk();
    tampilkanRiwayat();
}

document.addEventListener("DOMContentLoaded", function () {
    tampilkanSemua();
    tampilkanKeranjang();
});

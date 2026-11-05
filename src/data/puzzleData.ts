/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CrosswordQuestion {
  number: number;
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  length: number;
}

export const GRID_ROWS = 20;
export const GRID_COLS = 20;

export const CROSSWORD_QUESTIONS: CrosswordQuestion[] = [
  {
    "number": 1,
    "word": "SURPLUS",
    "clue": "Kondisi kelebihan penawaran di mana jumlah barang yang ditawarkan melebihi jumlah yang diminta konsumen",
    "row": 0,
    "col": 3,
    "direction": "down",
    "length": 7
  },
  {
    "number": 2,
    "word": "SHORTAGE",
    "clue": "Kondisi kelebihan permintaan di mana jumlah barang yang diminta melebihi kapasitas penawaran yang ada",
    "row": 0,
    "col": 5,
    "direction": "down",
    "length": 8
  },
  {
    "number": 3,
    "word": "SUBSTITUSI",
    "clue": "Barang pemuas kebutuhan yang dapat menggantikan fungsi barang lain jika harga barang utama naik",
    "row": 0,
    "col": 7,
    "direction": "down",
    "length": 10
  },
  {
    "number": 4,
    "word": "PASAR",
    "clue": "Mekanisme atau sarana bertemunya penjual dan pembeli untuk membentuk kesepakatan harga",
    "row": 0,
    "col": 9,
    "direction": "down",
    "length": 5
  },
  {
    "number": 5,
    "word": "PENAWARAN",
    "clue": "Jumlah barang dan jasa yang bersedia dijual oleh produsen pada berbagai tingkat harga tertentu",
    "row": 0,
    "col": 11,
    "direction": "across",
    "length": 9
  },
  {
    "number": 6,
    "word": "EKSPEKTASI",
    "clue": "Perkiraan atau ramalan pembeli dan penjual mengenai tingkat harga dan kondisi ekonomi di masa depan",
    "row": 0,
    "col": 12,
    "direction": "down",
    "length": 10
  },
  {
    "number": 7,
    "word": "SUBSIDI",
    "clue": "Bantuan dana dari pemerintah kepada produsen untuk meringankan beban biaya dan memicu penawaran",
    "row": 2,
    "col": 9,
    "direction": "across",
    "length": 7
  },
  {
    "number": 8,
    "word": "POSITIF",
    "clue": "Sifat kemiringan (slope) kurva penawaran yang bergerak naik dari kiri bawah ke kanan atas",
    "row": 3,
    "col": 17,
    "direction": "down",
    "length": 7
  },
  {
    "number": 9,
    "word": "TEKNOLOGI",
    "clue": "Penerapan mesin dan sistem modern yang meningkatkan efisiensi dan menambah kapasitas penawaran",
    "row": 4,
    "col": 11,
    "direction": "across",
    "length": 9
  },
  {
    "number": 10,
    "word": "POPULASI",
    "clue": "Banyaknya jumlah penduduk dalam suatu wilayah yang meningkatkan total kebutuhan pasar",
    "row": 5,
    "col": 0,
    "direction": "across",
    "length": 8
  },
  {
    "number": 11,
    "word": "KOMPLEMENTER",
    "clue": "Barang yang fungsinya saling melengkapi (contoh: bensin dengan kendaraan bermotor)",
    "row": 6,
    "col": 9,
    "direction": "down",
    "length": 12
  },
  {
    "number": 12,
    "word": "PERGESERAN",
    "clue": "Perubahan posisi seluruh kurva ke kanan atau ke kiri akibat faktor non-harga",
    "row": 6,
    "col": 19,
    "direction": "down",
    "length": 10
  },
  {
    "number": 13,
    "word": "PAJAK",
    "clue": "Pungutan wajib pemerintah terhadap barang yang memperbesar biaya produksi produsen",
    "row": 7,
    "col": 11,
    "direction": "across",
    "length": 5
  },
  {
    "number": 14,
    "word": "PENDAPATAN",
    "clue": "Faktor penentu daya beli konsumen yang bila meningkat umumnya akan menaikkan permintaan barang normal",
    "row": 8,
    "col": 3,
    "direction": "down",
    "length": 10
  },
  {
    "number": 15,
    "word": "CETERISPARIBUS",
    "clue": "Asumsi bahwa faktor-faktor lain di luar harga dianggap konstan atau tidak berubah",
    "row": 9,
    "col": 2,
    "direction": "across",
    "length": 14
  },
  {
    "number": 16,
    "word": "EQUILIBRIUM",
    "clue": "Kondisi titik keseimbangan pasar saat kuantitas permintaan sama persis dengan kuantitas penawaran",
    "row": 9,
    "col": 5,
    "direction": "down",
    "length": 11
  },
  {
    "number": 17,
    "word": "SELERA",
    "clue": "Kecenderungan minat, mode, atau kesukaan konsumen yang memengaruhi tren kurva permintaan",
    "row": 11,
    "col": 1,
    "direction": "down",
    "length": 6
  },
  {
    "number": 18,
    "word": "ELASTISITAS",
    "clue": "Tingkat kepekaan perubahan kuantitas permintaan atau penawaran terhadap perubahan harga",
    "row": 11,
    "col": 9,
    "direction": "across",
    "length": 11
  },
  {
    "number": 19,
    "word": "NEGATIF",
    "clue": "Sifat kemiringan (slope) kurva permintaan yang bergerak menurun dari kiri atas ke kanan bawah",
    "row": 12,
    "col": 0,
    "direction": "across",
    "length": 7
  },
  {
    "number": 20,
    "word": "PERMINTAAN",
    "clue": "Jumlah barang dan jasa yang ingin dan mampu dibeli konsumen pada berbagai tingkat harga tertentu",
    "row": 13,
    "col": 8,
    "direction": "across",
    "length": 10
  },
  {
    "number": 21,
    "word": "LABA",
    "clue": "Selisih positif antara penerimaan total penjualan dengan total biaya produksi yang dikeluarkan",
    "row": 15,
    "col": 13,
    "direction": "across",
    "length": 4
  },
  {
    "number": 22,
    "word": "BIAYA",
    "clue": "Pengeluaran untuk faktor produksi (seperti upah dan bahan mentah); jika naik, penawaran berkurang",
    "row": 15,
    "col": 15,
    "direction": "down",
    "length": 5
  },
  {
    "number": 23,
    "word": "PERGERAKAN",
    "clue": "Perpindahan titik di sepanjang kurva tunggal yang diakibatkan oleh perubahan harga barang itu sendiri",
    "row": 17,
    "col": 7,
    "direction": "across",
    "length": 10
  },
  {
    "number": 24,
    "word": "MARJINAL",
    "clue": "Konsumen atau produsen yang kemampuan daya beli atau biaya produksinya setara dengan harga pasar",
    "row": 19,
    "col": 5,
    "direction": "across",
    "length": 8
  },
  {
    "number": 25,
    "word": "HARGA",
    "clue": "Nilai tukar suatu komoditas yang disepakati dan diukur dengan satuan mata uang",
    "row": 19,
    "col": 14,
    "direction": "across",
    "length": 5
  }
];

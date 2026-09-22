/**
 * GameBackground — pola latar untuk halaman di dalam game (Lobby, Question, Result).
 *
 * Menggunakan pola geometris yang sama dengan halaman login (Background.tsx)
 * supaya seluruh aplikasi terasa konsisten.
 *
 * Ringan: cuma CSS, tidak ada file gambar. Cocok untuk Chromebook & HP
 * spek menengah (sesuai PDF Bagian 5: "Optimasi aset + lazy loading").
 */
const GameBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Diagonal crimson shape — kiri atas */}
    <div className="bg-primary/20 absolute top-[-70vmin] left-[-50vmin] min-h-[120vmin] min-w-[120vmin] rotate-20 rounded-4xl" />

    {/* Diagonal crimson shape — kanan bawah */}
    <div className="bg-primary/20 absolute right-[-10vmin] bottom-[-45vmin] min-h-[75vmin] min-w-[75vmin] rotate-20 rounded-4xl" />
  </div>
);

export default GameBackground;
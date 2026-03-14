/* ═══════════════════════════════════════════════════════
   playlist.js — Your personal music playlist 🎵🍪
   ═══════════════════════════════════════════════════════

   HOW TO USE:
   1. Drop your .mp3 / .ogg / .wav / .m4a files into the  music/  folder
   2. Add each song below — the path is always  "music/filename.mp3"
   3. The FIRST song in the list will ALWAYS play first (make it special!)
   4. All other songs shuffle randomly after that

   ═══════════════════════════════════════════════════════ */

const PLAYLIST = [

  // ── FIRST SONG — always plays first, make it your song ──
  {
    file:  "music/Abdul Hannan & Rovalio - Iraaday (Official Music Video).mp3",
    title: "Our Song 🍪",
    artist: "Add Artist Name"
  },

  // ── REST — will shuffle randomly ──
  {
    file:  "music/Thinking Of You (Official Audio)  AP Dhillon.mp3",
    title: "Song Title 2",
    artist: "Artist Name"
  },
  {
    file:  "music/With You - AP Dhillon (Official Music Video).mp3",
    title: "Song Title 3",
    artist: "Artist Name"
  },
  {
    file:  "music/song-4.mp3",
    title: "Song Title 4",
    artist: "Artist Name"
  },
  {
    file:  "music/song-5.mp3",
    title: "Song Title 5",
    artist: "Artist Name"
  },

  // Add as many as you want — just copy the block above ↑

];

/* ── Do not edit below this line ── */
if (typeof module !== 'undefined') module.exports = PLAYLIST;

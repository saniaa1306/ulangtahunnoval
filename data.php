<?php
// 1. Kumpulan pesan romantis
$loveNotes = [
    "Your smile brightens my darkest days.",
    "I love the way you laugh at my silly jokes.",
    "Every moment with you is a treasure.",
    "You make ordinary days extraordinary.",
    "Your kindness inspires me every day.",
    "I fall in love with you more each day.",
    "You are my safe place.",
    "I cherish our late-night conversations."
];

// 2. Data untuk Galeri Foto
$photos = [
    ["url" => "https://i.pinimg.com/564x/87/40/e3/8740e3a64936d89b3f309a4d0484bc5e.jpg", "caption" => "The Beginning"],
    ["url" => "https://i.pinimg.com/564x/11/49/6a/11496a7719602e1c0702d08331168f86.jpg", "caption" => "Perfect Moments"],
    ["url" => "https://i.pinimg.com/564x/93/b5/e5/93b5e52a46c65e8a32bbcc611d2e1329.jpg", "caption" => "You & I"]
];

// 3. Timeline Perjalanan Cinta
$journeyTimeline = [
    ["date" => "14 Feb 2023", "title" => "First Chapter", "desc" => "The day our eyes met and everything changed."],
    ["date" => "1 Jun 2023", "title" => "First Date", "desc" => "Hours felt like seconds when I was talking to you."],
    ["date" => "10 Sep 2023", "title" => "Ours", "desc" => "The day we decided to walk this path together."],
    ["date" => "Today", "title" => "Still Falling", "desc" => "And I will choose you, over and over again."]
];

// 4. Kupon Cinta (Menu Utama)
$loveCoupons = [
    ["title" => "Movie Night", "desc" => "Your choice of movie, snacks on me."],
    ["title" => "Warm Hugs", "desc" => "Unlimited hugs, valid anytime you need them."],
    ["title" => "Dinner Treat", "desc" => "Let me treat you to your favorite meal."],
    ["title" => "Win an Argument", "desc" => "You win. No questions asked. (Valid once)"]
];

// 5. Array Gambar Lokal untuk Memory Match Game
$matchImages = [
    "img/bubu1.jpeg",
    "img/bubu2.jpeg",
    "img/bubu3.jpeg",
    "img/dudu1.jpeg",
    "img/dudu2.jpeg",
    "img/dudu3.jpeg"
];
$gameCards = array_merge($matchImages,$matchImages);
shuffle($gameCards); 

$correctPinLength = 6; 
?>
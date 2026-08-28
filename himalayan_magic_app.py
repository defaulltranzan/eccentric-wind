import http.server
import socketserver
import webbrowser
import threading
import os
import time

PORT = 8000

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Himalayan Magic Adventure - Premium Treks & Tours</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            orange: '#FF6B35',
                            dark: '#0B132B',
                            slate: '#1C2541',
                            gold: '#FFD166',
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        serif: ['Playfair Display', 'serif'],
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .hero-bg {
            background-image: linear-gradient(rgba(11, 19, 43, 0.65), rgba(11, 19, 43, 0.85)), url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920');
            background-size: cover;
            background-position: center 30%;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #FF6B35;
            border-radius: 3px;
        }
    </style>
</head>
<body class="bg-slate-50 font-sans text-slate-800 antialiased selection:bg-brand-orange selection:text-white">

    <!-- TOP HEADER -->
    <div class="bg-brand-dark text-white text-xs py-2 px-4 border-b border-slate-800">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div class="flex items-center gap-4">
                <span><i class="fa-solid fa-phone text-brand-orange mr-1"></i> +977 01-5361254 | +977 9841 45 45 99</span>
                <span class="hidden md:inline"><i class="fa-solid fa-envelope text-brand-orange mr-1"></i> info@himalayanmagic.com</span>
            </div>
            <div class="flex items-center gap-4">
                <span><i class="fa-solid fa-location-dot text-brand-orange mr-1"></i> 318 Thamel Marg, Kathmandu, Nepal</span>
                <span class="bg-brand-orange text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase animate-pulse">24/7 Rescue Active</span>
            </div>
        </div>
    </div>

    <!-- MAIN NAVBAR -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="#" class="flex items-center gap-2">
                <div class="h-12 w-12 rounded-full bg-brand-orange flex items-center justify-center text-white font-serif font-bold text-xl shadow-md shadow-brand-orange/20">
                    H
                </div>
                <div>
                    <span class="block font-serif text-xl font-bold text-brand-dark tracking-tight">Himalayan Magic</span>
                    <span class="block text-[10px] text-brand-orange font-bold tracking-widest uppercase">Adventure & Tours</span>
                </div>
            </a>
            <nav class="hidden lg:flex items-center gap-8 font-medium text-slate-600">
                <a href="#" class="text-brand-orange border-b-2 border-brand-orange py-1">Home</a>
                <a href="#treks" class="hover:text-brand-orange transition-colors py-1">Trekking Regions</a>
                <a href="#departures" class="hover:text-brand-orange transition-colors py-1">Group Departures</a>
                <a href="#about" class="hover:text-brand-orange transition-colors py-1">Our Legacy</a>
                <a href="#contact" class="hover:text-brand-orange transition-colors py-1">Contact Us</a>
            </nav>
            <div class="flex items-center gap-4">
                <a href="#contact" class="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-brand-orange text-white text-sm font-semibold rounded-lg shadow-md shadow-brand-orange/15 hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5">
                    Plan My Expedition
                </a>
                <button class="lg:hidden text-brand-dark focus:outline-none p-1" onclick="toggleMobileMenu()">
                    <i id="menu-icon" class="fa-solid fa-bars text-2xl"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-lg">
            <a href="#" class="block px-3 py-2 rounded-md text-base font-medium text-brand-orange bg-orange-50">Home</a>
            <a href="#treks" class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onclick="toggleMobileMenu()">Trekking Regions</a>
            <a href="#departures" class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onclick="toggleMobileMenu()">Group Departures</a>
            <a href="#about" class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onclick="toggleMobileMenu()">Our Legacy</a>
            <a href="#contact" class="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-brand-orange hover:bg-slate-50" onclick="toggleMobileMenu()">Contact Us</a>
            <a href="#contact" class="block w-full text-center py-3 bg-brand-orange text-white font-semibold rounded-lg" onclick="toggleMobileMenu()">Plan My Expedition</a>
        </div>
    </header>

    <!-- HERO SECTION & SEARCH FILTER HUB -->
    <section class="relative hero-bg min-h-[600px] flex items-center justify-center px-4 sm:px-6 py-20 text-center text-white">
        <div class="max-w-4xl mx-auto space-y-8">
            <div class="space-y-4">
                <span class="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/20 border border-brand-orange/30 text-brand-orange rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                    <i class="fa-solid fa-medal"></i> Nepal's Premier Adventure Specialists
                </span>
                <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    Experience Nepal,<br><span class="text-brand-orange italic font-normal">Beyond Expectations</span>
                </h1>
                <p class="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light">
                    For 30+ years, we have guided global adventurers up legendary Himalayan paths with unmatched safety and certified local Sherpa excellence.
                </p>
            </div>

            <!-- Interative search bar -->
            <div class="bg-white/95 backdrop-blur p-4 sm:p-6 rounded-2xl shadow-2xl text-slate-800 text-left max-w-3xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Destination</label>
                        <div class="relative">
                            <i class="fa-solid fa-earth-asia absolute left-3 top-3.5 text-slate-400"></i>
                            <select id="search-dest" onchange="filterTreks()" class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange appearance-none cursor-pointer">
                                <option value="all">All Destinations</option>
                                <option value="nepal">Nepal</option>
                                <option value="tibet">Tibet</option>
                                <option value="bhutan">Bhutan</option>
                            </select>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Duration (Days)</label>
                        <div class="relative">
                            <i class="fa-solid fa-clock absolute left-3 top-3.5 text-slate-400"></i>
                            <select id="search-days" onchange="filterTreks()" class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange appearance-none cursor-pointer">
                                <option value="all">Any Duration</option>
                                <option value="short">Short (&le; 10 Days)</option>
                                <option value="medium">Medium (11 - 15 Days)</option>
                                <option value="long">Long (16+ Days)</option>
                            </select>
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Difficulty</label>
                        <div class="relative">
                            <i class="fa-solid fa-mountain absolute left-3 top-3.5 text-slate-400"></i>
                            <select id="search-diff" onchange="filterTreks()" class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange appearance-none cursor-pointer">
                                <option value="all">Any Level</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Challenging">Challenging</option>
                                <option value="Strenuous">Strenuous</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div class="relative w-full sm:max-w-xs">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-xs"></i>
                        <input id="search-text" onkeyup="filterTreks()" type="text" placeholder="Search by region or peak..." class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange">
                    </div>
                    <span id="results-count" class="text-xs text-slate-500 font-medium">Showing all 6 premium treks</span>
                </div>
            </div>
        </div>
    </section>

    <!-- TRUST & LEGACY BADGES -->
    <section class="bg-white py-8 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div class="pt-4 md:pt-0">
                    <div class="text-3xl sm:text-4xl font-serif font-bold text-brand-orange mb-1">30+</div>
                    <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Years of Safety Legacy</div>
                </div>
                <div class="pt-4 md:pt-0">
                    <div class="text-3xl sm:text-4xl font-serif font-bold text-brand-orange mb-1">100%</div>
                    <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Local Sherpa Guides</div>
                </div>
                <div class="pt-4 md:pt-0">
                    <div class="text-3xl sm:text-4xl font-serif font-bold text-brand-orange mb-1">Guaranteed</div>
                    <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Group Departures</div>
                </div>
                <div class="pt-4 md:pt-0">
                    <div class="text-3xl sm:text-4xl font-serif font-bold text-brand-orange mb-1">Eco-Safe</div>
                    <div class="text-xs font-bold uppercase text-slate-500 tracking-wider">Sustainable Trekking</div>
                </div>
            </div>
        </div>
    </section>

    <!-- FEATURED / BEST SELLER TREKS CAROUSEL -->
    <section id="treks" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center space-y-3 mb-12">
            <span class="text-brand-orange text-xs font-bold uppercase tracking-widest block">Legendary Journeys</span>
            <h2 class="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">Our Signature Treks</h2>
            <p class="text-slate-500 max-w-lg mx-auto text-sm sm:text-base">Compare prices, routes, and details of our hand-picked, world-class Himalayan adventures.</p>
        </div>

        <div id="treks-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Dynamic Cards generated by Javascript to support reactive filtering and look perfect -->
        </div>
    </section>

    <!-- LIVE UPCOMING GROUP DEPARTURES BOARD -->
    <section id="departures" class="bg-brand-dark text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
                <div class="space-y-3">
                    <span class="text-brand-orange text-xs font-bold uppercase tracking-widest block">Join a Team</span>
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold">Upcoming Group Departures</h2>
                    <p class="text-slate-400 text-sm sm:text-base">Guaranteed departure dates with local expert crews. Book a slot and save on logistics.</p>
                </div>
                <span class="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-semibold">
                    <span class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span> 4 Departures Guaranteed
                </span>
            </div>

            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-950/50">
                                <th class="p-4 sm:p-5">Trek Package</th>
                                <th class="p-4 sm:p-5">Departure Date</th>
                                <th class="p-4 sm:p-5">Duration</th>
                                <th class="p-4 sm:p-5">Availability</th>
                                <th class="p-4 sm:p-5 text-right">Price</th>
                                <th class="p-4 sm:p-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800 text-sm">
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="p-4 sm:p-5 font-semibold">Everest Base Camp Trek</td>
                                <td class="p-4 sm:p-5 text-slate-300">September 12, 2026</td>
                                <td class="p-4 sm:p-5">14 Days</td>
                                <td class="p-4 sm:p-5">
                                    <span class="inline-block px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange text-xs font-bold">Only 2 Seats Left!</span>
                                </td>
                                <td class="p-4 sm:p-5 text-right font-bold text-white">$1,300</td>
                                <td class="p-4 sm:p-5 text-center">
                                    <button onclick="openBooking('Everest Base Camp Trek', 'Sept 12, 2026', 1300)" class="px-4 py-2 bg-brand-orange hover:bg-opacity-90 rounded text-xs font-bold transition-all">Quick Book</button>
                                </td>
                            </tr>
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="p-4 sm:p-5 font-semibold">Annapurna Circuit Trek</td>
                                <td class="p-4 sm:p-5 text-slate-300">September 25, 2026</td>
                                <td class="p-4 sm:p-5">15 Days</td>
                                <td class="p-4 sm:p-5">
                                    <span class="inline-block px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold">Guaranteed (4 Open)</span>
                                </td>
                                <td class="p-4 sm:p-5 text-right font-bold text-white">$1,500</td>
                                <td class="p-4 sm:p-5 text-center">
                                    <button onclick="openBooking('Annapurna Circuit Trek', 'Sept 25, 2026', 1500)" class="px-4 py-2 bg-brand-orange hover:bg-opacity-90 rounded text-xs font-bold transition-all">Quick Book</button>
                                </td>
                            </tr>
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="p-4 sm:p-5 font-semibold">Everest 3 Passes Trek</td>
                                <td class="p-4 sm:p-5 text-slate-300">October 05, 2026</td>
                                <td class="p-4 sm:p-5">18 Days</td>
                                <td class="p-4 sm:p-5">
                                    <span class="inline-block px-2.5 py-1 rounded bg-brand-orange/20 text-brand-orange text-xs font-bold">Only 3 Seats Left!</span>
                                </td>
                                <td class="p-4 sm:p-5 text-right font-bold text-white">$1,700</td>
                                <td class="p-4 sm:p-5 text-center">
                                    <button onclick="openBooking('Everest 3 Passes Trek', 'Oct 05, 2026', 1700)" class="px-4 py-2 bg-brand-orange hover:bg-opacity-90 rounded text-xs font-bold transition-all">Quick Book</button>
                                </td>
                            </tr>
                            <tr class="hover:bg-slate-800/40 transition-colors">
                                <td class="p-4 sm:p-5 font-semibold">Annapurna Base Camp (Poon Hill)</td>
                                <td class="p-4 sm:p-5 text-slate-300">October 18, 2026</td>
                                <td class="p-4 sm:p-5">13 Days</td>
                                <td class="p-4 sm:p-5">
                                    <span class="inline-block px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold">Guaranteed (6 Open)</span>
                                </td>
                                <td class="p-4 sm:p-5 text-right font-bold text-white">$800</td>
                                <td class="p-4 sm:p-5 text-center">
                                    <button onclick="openBooking('Annapurna Base Camp (Poon Hill)', 'Oct 18, 2026', 800)" class="px-4 py-2 bg-brand-orange hover:bg-opacity-90 rounded text-xs font-bold transition-all">Quick Book</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <!-- LEGACY & HISTORY SECTION -->
    <section id="about" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="relative">
                    <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" alt="Beautiful mountains" class="rounded-2xl shadow-xl w-full object-cover h-[450px]">
                    <div class="absolute -bottom-6 -right-6 bg-brand-orange text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-[240px]">
                        <span class="block text-4xl font-serif font-bold mb-1">30+</span>
                        <span class="block text-xs font-bold uppercase tracking-wider text-slate-100">Years guiding Himalayan paths without a single major safety compromise.</span>
                    </div>
                </div>
                <div class="space-y-6">
                    <span class="text-brand-orange text-xs font-bold uppercase tracking-widest block">Trusted Mountaineering Legacy</span>
                    <h2 class="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">Thirty Years of High-Altitude Expertise</h2>
                    <p class="text-slate-500 text-sm sm:text-base leading-relaxed">
                        Himalayan Magic Adventure has been a pioneer of safe, sustainable, and immersive tourism across Nepal, Tibet, and Bhutan since its founding. We employ 100% certified local Sherpa guides, ensure optimal acclimatization spacing, and maintain a state-of-the-art rescue coordinate system.
                    </p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex items-start gap-3">
                            <i class="fa-solid fa-check text-green-500 mt-1"></i>
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm">Professional Accclimatization</h4>
                                <p class="text-slate-500 text-xs">Paced spacing for safety.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <i class="fa-solid fa-check text-green-500 mt-1"></i>
                            <div>
                                <h4 class="font-bold text-slate-800 text-sm">Sustainable Tourism</h4>
                                <p class="text-slate-500 text-xs">100% locally-owned operations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CONTACT & AGENCY INFORMATION -->
    <section id="contact" class="bg-slate-100 py-20 border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <!-- Contact Info Column -->
                <div class="lg:col-span-5 space-y-8">
                    <div class="space-y-3">
                        <span class="text-brand-orange text-xs font-bold uppercase tracking-widest block">Get in Touch</span>
                        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">Visit our Kathmandu HQ</h2>
                        <p class="text-slate-500 text-sm">Drop by our Thamel headquarters or ring our certified support desk around the clock.</p>
                    </div>

                    <div class="space-y-4">
                        <div class="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                            <div class="h-10 w-10 bg-orange-50 text-brand-orange rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                <i class="fa-solid fa-map-location-dot"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-slate-800">Physical Address</h4>
                                <p class="text-slate-500 text-xs mt-0.5">318 Thamel Marg, Kathmandu, Nepal</p>
                            </div>
                        </div>

                        <div class="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                            <div class="h-10 w-10 bg-orange-50 text-brand-orange rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                <i class="fa-solid fa-phone-volume"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-slate-800">Direct Contacts</h4>
                                <p class="text-slate-500 text-xs mt-0.5">+977 01-5361254 | 5363308 | 5362524</p>
                                <p class="text-slate-500 text-xs mt-0.5">Emergency Helpline: +977 9841 45 45 99</p>
                            </div>
                        </div>

                        <div class="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                            <div class="h-10 w-10 bg-orange-50 text-brand-orange rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                <i class="fa-solid fa-umbrella-beach"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm text-slate-800">Our Regions Covered</h4>
                                <p class="text-slate-500 text-xs mt-0.5">Nepal Himalayas, Tibet Sacred Circuits, Bhutan cultural tours.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Form Column -->
                <div class="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
                    <h3 class="text-xl font-bold text-brand-dark mb-6">Plan Your Custom Adventure</h3>
                    <form onsubmit="handleSubmit(event)" class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Your Name</label>
                                <input required type="text" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange">
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                <input required type="email" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange">
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Trek / Region Focus</label>
                                <select class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange appearance-none cursor-pointer">
                                    <option>Everest Base Camp Trek</option>
                                    <option>Everest Base Camp with Gokyo Lake</option>
                                    <option>Everest 3 Passes Trek</option>
                                    <option>Annapurna Circuit Trek</option>
                                    <option>Annapurna Base Camp (Poon Hill)</option>
                                    <option>Annapurna Base Camp (7 Days)</option>
                                    <option>Custom Expedition</option>
                                </select>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold text-slate-500 uppercase">Target Month</label>
                                <input type="month" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange">
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-500 uppercase">Special Requirements / Safety Concerns</label>
                            <textarea rows="4" placeholder="Mention any medical concerns, altitude experience, or layout preferences..." class="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"></textarea>
                        </div>
                        <button type="submit" class="w-full py-4 bg-brand-orange hover:bg-opacity-90 text-white font-bold rounded-lg shadow-md shadow-brand-orange/15 transition-all">
                            Submit Inquiry & Check Availability
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-brand-dark text-slate-400 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-8 mb-8">
                <div>
                    <span class="block font-serif text-2xl font-bold text-white">Himalayan Magic Adventure</span>
                    <p class="text-xs text-slate-400 mt-1">&copy; 2026 Himalayan Magic Adventure Pvt. Ltd. All Rights Reserved.</p>
                </div>
                <div class="flex items-center gap-4 text-white text-lg">
                    <a href="#" class="hover:text-brand-orange transition-colors"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#" class="hover:text-brand-orange transition-colors"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" class="hover:text-brand-orange transition-colors"><i class="fa-brands fa-tripadvisor"></i></a>
                    <a href="#" class="hover:text-brand-orange transition-colors"><i class="fa-brands fa-youtube"></i></a>
                </div>
            </div>
            <p class="text-[11px] text-slate-500 max-w-4xl mx-auto leading-relaxed text-center">
                Licenced by the Government of Nepal Travel Agency Registry. Member of TAAN (Trekking Agencies Association of Nepal), NMA (Nepal Mountaineering Association). Safety operations compliant with global rescue operations. Accclimatization profiles optimized.
            </p>
        </div>
    </footer>

    <!-- INTERACTIVE TREK LOOKUP / BOOKING MODAL -->
    <div id="trek-modal" class="hidden fixed inset-0 z-50 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col transform transition-all scale-95 opacity-0 duration-300" id="modal-container">
            
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <span id="modal-destination" class="text-xs font-bold uppercase tracking-widest text-brand-orange">Nepal</span>
                    <h3 id="modal-title" class="font-serif text-2xl font-bold text-brand-dark">Everest Base Camp Trek</h3>
                </div>
                <button onclick="closeModal()" class="text-slate-400 hover:text-slate-600 focus:outline-none p-1">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1 text-sm">
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-3 gap-4 bg-orange-50/50 p-4 rounded-xl text-center">
                    <div>
                        <span class="block text-[10px] uppercase font-bold text-slate-500">Duration</span>
                        <span id="modal-duration" class="font-bold text-brand-dark text-base">14 Days</span>
                    </div>
                    <div>
                        <span class="block text-[10px] uppercase font-bold text-slate-500">Difficulty</span>
                        <span id="modal-difficulty" class="font-bold text-brand-dark text-base">Challenging</span>
                    </div>
                    <div>
                        <span class="block text-[10px] uppercase font-bold text-slate-500">Group Price</span>
                        <span id="modal-price" class="font-bold text-brand-dark text-base text-brand-orange">$1,300</span>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="border-b border-slate-200">
                    <div class="flex gap-6 -mb-px">
                        <button onclick="switchTab('itinerary')" id="tab-btn-itinerary" class="pb-3 text-xs font-bold uppercase tracking-wider border-b-2 border-brand-orange text-brand-orange">Itinerary</button>
                        <button onclick="switchTab('inclusion')" id="tab-btn-inclusion" class="pb-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-600">Inclusions</button>
                        <button onclick="switchTab('info')" id="tab-btn-info" class="pb-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-600">Route & Elevation</button>
                    </div>
                </div>

                <!-- Tab: Itinerary -->
                <div id="tab-content-itinerary" class="space-y-4">
                    <div class="space-y-4" id="modal-itinerary-list">
                        <!-- Dynamic itinerary -->
                    </div>
                </div>

                <!-- Tab: Inclusion -->
                <div id="tab-content-inclusion" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <h4 class="font-bold text-green-600 text-xs uppercase tracking-wider flex items-center gap-1">
                            <i class="fa-solid fa-circle-check"></i> What's Included
                        </h4>
                        <ul class="space-y-2 text-xs text-slate-600 pl-1" id="modal-included-list">
                        </ul>
                    </div>
                    <div class="space-y-3">
                        <h4 class="font-bold text-rose-600 text-xs uppercase tracking-wider flex items-center gap-1">
                            <i class="fa-solid fa-circle-xmark"></i> What's Excluded
                        </h4>
                        <ul class="space-y-2 text-xs text-slate-600 pl-1" id="modal-excluded-list">
                        </ul>
                    </div>
                </div>

                <!-- Tab: Route Info -->
                <div id="tab-content-info" class="hidden space-y-4">
                    <div class="bg-slate-100 p-4 rounded-xl border border-slate-200">
                        <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Topographic Elevation Profile</h4>
                        <div class="h-24 bg-gradient-to-t from-slate-200 to-slate-50 rounded border border-slate-300 relative overflow-hidden flex items-end">
                            <svg class="w-full h-16 fill-orange-500/10 stroke-brand-orange stroke-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,100 L10,80 L25,85 L40,65 L55,70 L70,45 L85,50 L100,20 L100,100 Z" />
                            </svg>
                            <span class="absolute left-2 top-2 text-[10px] text-slate-500 font-bold">Max Altitude: <span id="modal-max-alt">5,545m</span></span>
                        </div>
                    </div>
                    <p class="text-xs text-slate-500 leading-relaxed">
                        This route is optimized for maximum altitude safety, following our 30-year legacy guidelines. Regular oximeter monitoring and local guides carrying supplemental oxygen tanks come standard on all high-altitude departures.
                    </p>
                </div>

            </div>

            <!-- Modal Footer -->
            <div class="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span class="text-xs text-slate-500">Need help? WhatsApp us 24/7 at +977 9841 45 45 99</span>
                <button id="modal-book-btn" class="w-full sm:w-auto px-6 py-3 bg-brand-orange hover:bg-opacity-90 text-white font-bold text-xs rounded-lg uppercase tracking-wider shadow-md shadow-brand-orange/15 transition-all">
                    Initiate Booking Process
                </button>
            </div>

        </div>
    </div>

    <!-- MAIN APP JAVASCRIPT SYSTEM -->
    <script>
        // Real-world, accurate package metadata sourced directly from company legacy
        const packages = [
            {
                id: "ebc-14",
                title: "Everest Base Camp Trek",
                dest: "nepal",
                days: 14,
                difficulty: "Challenging",
                price: 1300,
                rating: 4.9,
                reviews: 124,
                img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400",
                maxAlt: "5,364m (EBC) / 5,545m (Kala Patthar)",
                itinerary: [
                    "Day 1: Scenic flight to Lukla (2,860m) & Trek to Phakding (2,610m)",
                    "Day 2: Trek from Phakding to the legendary Namche Bazaar (3,440m)",
                    "Day 3: Acclimatization rest day in Namche Bazaar; hike to Everest View Hotel",
                    "Day 4: Trek from Namche to Tengboche Monastery (3,860m)",
                    "Day 5: Trek to Dingboche (4,410m) - beautiful views of Ama Dablam",
                    "Day 6: Second Acclimatization Day in Dingboche; peak trek preparation",
                    "Day 7: Dingboche to Lobuche (4,910m) along the lateral moraine",
                    "Day 8: Lobuche to Gorakshep (5,140m), Trek to Everest Base Camp (5,364m) & return",
                    "Day 9: Hike Kala Patthar (5,545m) for sunrise, then descend to Pheriche (4,240m)",
                    "Day 10: Descend from Pheriche back down to Namche Bazaar",
                    "Day 11: Namche Bazaar to Lukla",
                    "Day 12: Scenic flight Lukla to Kathmandu; hotel transfer",
                    "Day 13: Leisure day in Kathmandu / cultural sightseeing",
                    "Day 14: Airport transfer for final international departure"
                ],
                included: [
                    "Lukla flight round-trip ticket with cargo allowance",
                    "Government certified expert local Sherpa guide",
                    "All required TIMS card and Sagarmatha national park permits",
                    "Teahouse accommodation with three meals daily during the trek",
                    "Emergency first-aid medical kit and oximeter monitoring",
                    "Porter service (1 porter for every 2 trekkers)"
                ],
                excluded: [
                    "Nepal tourist visa fees and international flights",
                    "Travel and emergency evacuation insurance",
                    "Personal gear and high-altitude gear hire",
                    "Hot showers, Wi-Fi, and electronic charging fees on-trail",
                    "Tips for guides and local support crew"
                ]
            },
            {
                id: "ebc-gokyo-16",
                title: "Everest Base Camp with Gokyo Lake",
                dest: "nepal",
                days: 16,
                difficulty: "Strenuous",
                price: 1400,
                rating: 5.0,
                reviews: 86,
                img: "https://images.unsplash.com/photo-1533130061792-64b345e4e8cf?auto=format&fit=crop&q=80&w=400",
                maxAlt: "5,360m (Gokyo Ri) & Cho La Pass (5,420m)",
                itinerary: [
                    "Day 1: Kathmandu to Lukla Flight & Trek to Phakding",
                    "Day 2: Phakding to Namche Bazaar",
                    "Day 3: Rest and Acclimatization Day in Namche Bazaar",
                    "Day 4: Namche Bazaar to Dole (4,110m)",
                    "Day 5: Dole to Machhermo (4,470m)",
                    "Day 6: Machhermo to the beautiful sacred Gokyo Lakes (4,790m)",
                    "Day 7: Sunrise hike to Gokyo Ri (5,360m) and rest in Gokyo",
                    "Day 8: Gokyo to Thagnak (4,700m)",
                    "Day 9: Cross the challenging Cho La Pass (5,420m) to Dzongla (4,830m)",
                    "Day 10: Dzongla to Lobuche",
                    "Day 11: Lobuche to Gorakshep and afternoon trek to EBC (5,364m)",
                    "Day 12: Climb Kala Patthar (5,545m) then descend to Pheriche",
                    "Day 13: Pheriche to Namche Bazaar",
                    "Day 14: Namche Bazaar to Lukla",
                    "Day 15: Flight Lukla to Kathmandu",
                    "Day 16: Departure Kathmandu"
                ],
                included: [
                    "All flights, transfers, and land logistics",
                    "Sagarmatha National Park permits & Gokyo entry fees",
                    "Trekking guide and specialized pass navigation porters",
                    "All meals and accommodation on the circuit",
                    "Satellite emergency communications setup"
                ],
                excluded: [
                    "Personal travel insurance",
                    "Porter and guide tips",
                    "Hot showers, bar bills, and personal snacks"
                ]
            },
            {
                id: "everest-3passes-18",
                title: "Everest 3 Passes Trek",
                dest: "nepal",
                days: 18,
                difficulty: "Strenuous",
                price: 1700,
                rating: 4.8,
                reviews: 42,
                img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=400",
                maxAlt: "Kongma La (5,535m), Cho La (5,420m), Renjo La (5,360m)",
                itinerary: [
                    "Day 1: Lukla flight & trek to Phakding",
                    "Day 2: Phakding to Namche Bazaar",
                    "Day 3: Namche rest & acclimatization day",
                    "Day 4: Namche Bazaar to Tengboche",
                    "Day 5: Tengboche to Dingboche",
                    "Day 6: Dingboche acclimatization day",
                    "Day 7: Dingboche to Chhukung (4,730m)",
                    "Day 8: Cross Kongma La Pass (5,535m) to Lobuche",
                    "Day 9: Lobuche to Gorakshep, Trek to Everest Base Camp",
                    "Day 10: Kala Patthar climb, then trek to Dzongla",
                    "Day 11: Cross Cho La Pass (5,420m) to Dzongla",
                    "Day 12: Dzongla to Gokyo Lakes",
                    "Day 13: Climb Gokyo Ri and explore the fourth/fifth lakes",
                    "Day 14: Cross Renjo La Pass (5,360m) to Lungden (4,210m)",
                    "Day 15: Lungden to Thame (3,800m)",
                    "Day 16: Thame to Namche Bazaar",
                    "Day 17: Namche Bazaar to Lukla",
                    "Day 18: Lukla flight to Kathmandu & departure"
                ],
                included: [
                    "All accommodation, full board meals, and permits",
                    "Rope and emergency gear for high passes",
                    "Oxygen support tanks for extreme elevations"
                ],
                excluded: [
                    "Personal mountaineering clothing",
                    "Helicopter rescue excess fees"
                ]
            },
            {
                id: "annapurna-circuit-15",
                title: "Annapurna Circuit Trek",
                dest: "nepal",
                days: 15,
                difficulty: "Challenging",
                price: 1500,
                rating: 4.9,
                reviews: 95,
                img: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=400",
                maxAlt: "Thorong La Pass (5,416m)",
                itinerary: [
                    "Day 1: Drive Kathmandu to Besisahar (760m) & Chamje",
                    "Day 2: Trek Chamje to Dharapani (1,860m)",
                    "Day 3: Trek Dharapani to Chame (2,670m)",
                    "Day 4: Trek Chame to Pisang (3,200m)",
                    "Day 5: Trek Pisang to Manang (3,540m)",
                    "Day 6: Acclimatization Rest Day in Manang; explore lakes",
                    "Day 7: Trek Manang to Yak Kharka (4,018m)",
                    "Day 8: Trek Yak Kharka to Thorong Phedi (4,540m)",
                    "Day 9: Cross Thorong La Pass (5,416m) to Muktinath (3,760m)",
                    "Day 10: Drive Muktinath to Tatopani Hot Springs",
                    "Day 11: Trek Tatopani to Ghorepani (2,850m)",
                    "Day 12: Morning Ghorepani to Poon Hill (3,210m) & trek to Nayapul",
                    "Day 13: Drive Pokhara to Kathmandu",
                    "Day 14: Rest & local shopping day",
                    "Day 15: International departures"
                ],
                included: [
                    "All national park permits & TIMS cards",
                    "Jeep transfers from Kathmandu & Pokhara",
                    "Accommodations and meals on circuit",
                    "Licensed expert mountain guides"
                ],
                excluded: [
                    "Hot spring donations",
                    "Personal snacks and bar bills"
                ]
            },
            {
                id: "abc-poon-13",
                title: "Annapurna ABC with Poon Hill",
                dest: "nepal",
                days: 13,
                difficulty: "Moderate",
                price: 800,
                rating: 4.7,
                reviews: 58,
                img: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80&w=400",
                maxAlt: "Annapurna Base Camp (4,130m)",
                itinerary: [
                    "Day 1: Pokhara drive to Nayapul, Trek to Tikhedhunga",
                    "Day 2: Tikhedhunga to Ghorepani (Ulleri stone steps)",
                    "Day 3: Ghorepani to Poon Hill (3,210m) & Trek to Tadapani",
                    "Day 4: Tadapani to Chhomrong (2,170m)",
                    "Day 5: Chhomrong to Bamboo (2,310m)",
                    "Day 6: Bamboo to Deurali (3,230m)",
                    "Day 7: Deurali to Annapurna Base Camp (4,130m)",
                    "Day 8: Explore ABC, Trek back to Bamboo",
                    "Day 9: Bamboo to Jhinu Danda (Natural Hot Springs)",
                    "Day 10: Jhinu to Nayapul & Drive Pokhara",
                    "Day 11: Drive Pokhara to Kathmandu",
                    "Day 12: Kathmandu sightseeing day",
                    "Day 13: Final Departure"
                ],
                included: [
                    "ACAP permit and trekking infrastructure fees",
                    "Local vehicle transfers Pokhara to trailheads"
                ],
                excluded: [
                    "Wi-Fi and battery charging on-trail"
                ]
            },
            {
                id: "abc-7",
                title: "Annapurna Base Camp 7 Days",
                dest: "nepal",
                days: 7,
                difficulty: "Moderate",
                price: 750,
                rating: 4.7,
                reviews: 34,
                img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400",
                maxAlt: "Annapurna Base Camp (4,130m)",
                itinerary: [
                    "Day 1: Pokhara to Jhinu Drive, Trek to Chomrong",
                    "Day 2: Chomrong to Dovan",
                    "Day 3: Dovan to Machhapuchhre Base Camp (MBC)",
                    "Day 4: MBC to Annapurna Base Camp (4,130m) & descend to Bamboo",
                    "Day 5: Bamboo to Jhinu Hot Springs",
                    "Day 6: Jhinu to Pokhara drive",
                    "Day 7: Final airport drop Pokhara / Kathmandu"
                ],
                included: [
                    "Direct transport transfers, guides and local gear support"
                ],
                excluded: [
                    "Additional porter upgrades"
                ]
            }
        ];

        // Toggle mobile hamburger menu
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            const icon = document.getElementById('menu-icon');
            menu.classList.toggle('hidden');
            if (menu.classList.contains('hidden')) {
                icon.className = 'fa-solid fa-bars text-2xl';
            } else {
                icon.className = 'fa-solid fa-xmark text-2xl';
            }
        }

        // Generate and render trek cards based on search and selection
        function renderTreks(trekList) {
            const grid = document.getElementById('treks-grid');
            grid.innerHTML = '';

            if (trekList.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-slate-400">
                        <i class="fa-solid fa-mountain-sun text-4xl mb-3 block"></i>
                        <span class="block text-sm font-semibold">No treks match your filter criteria.</span>
                    </div>
                `;
                return;
            }

            trekList.forEach(t => {
                const card = document.createElement('div');
                card.className = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group transform hover:-translate-y-1";
                card.innerHTML = `
                    <div class="relative h-48 overflow-hidden bg-slate-900">
                        <img src="${t.img}" alt="${t.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90">
                        <span class="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
                            <i class="fa-solid fa-tag text-brand-orange"></i> Best Seller
                        </span>
                        <span class="absolute bottom-4 right-4 bg-brand-orange text-white px-3 py-1 rounded-lg text-xs font-bold">
                            ${t.days} Days
                        </span>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div class="space-y-2">
                            <div class="flex items-center justify-between text-xs text-slate-400">
                                <span class="capitalize font-semibold text-brand-orange"><i class="fa-solid fa-map-pin mr-1"></i>${t.dest}</span>
                                <span class="font-medium"><i class="fa-solid fa-star text-brand-gold mr-1"></i>${t.rating} (${t.reviews} reviews)</span>
                            </div>
                            <h3 class="font-serif text-lg font-bold text-brand-dark leading-tight line-clamp-1 group-hover:text-brand-orange transition-colors">${t.title}</h3>
                            <div class="flex items-center justify-between text-xs text-slate-500">
                                <span>Level: <strong>${t.difficulty}</strong></span>
                                <span>Max Elevation: <strong>4k-5k+</strong></span>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                                <span class="block text-[10px] text-slate-400 uppercase font-semibold">Trek price</span>
                                <span class="text-xl font-bold text-brand-orange">$${t.price} <span class="text-[10px] text-slate-400 font-normal">/person</span></span>
                            </div>
                            <button onclick="openModal('${t.id}')" class="px-4 py-2.5 bg-slate-100 hover:bg-brand-orange hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all">
                                View Details
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        // Interactive Filtering Algorithm
        function filterTreks() {
            const dest = document.getElementById('search-dest').value;
            const days = document.getElementById('search-days').value;
            const diff = document.getElementById('search-diff').value;
            const text = document.getElementById('search-text').value.toLowerCase();

            let filtered = packages;

            if (dest !== 'all') {
                filtered = filtered.filter(p => p.dest === dest);
            }

            if (days !== 'all') {
                if (days === 'short') filtered = filtered.filter(p => p.days <= 10);
                if (days === 'medium') filtered = filtered.filter(p => p.days > 10 && p.days <= 15);
                if (days === 'long') filtered = filtered.filter(p => p.days >= 16);
            }

            if (diff !== 'all') {
                filtered = filtered.filter(p => p.difficulty === diff);
            }

            if (text !== '') {
                filtered = filtered.filter(p => p.title.toLowerCase().includes(text));
            }

            renderTreks(filtered);
            document.getElementById('results-count').innerText = `Showing ${filtered.length} matching premium treks`;
        }

        // Booking and details Modal Engine
        let activeTrek = null;
        function openModal(id) {
            const t = packages.find(p => p.id === id);
            if(!t) return;
            activeTrek = t;

            document.getElementById('modal-title').innerText = t.title;
            document.getElementById('modal-destination').innerText = t.dest;
            document.getElementById('modal-duration').innerText = `${t.days} Days`;
            document.getElementById('modal-difficulty').innerText = t.difficulty;
            document.getElementById('modal-price').innerText = `$${t.price}`;
            document.getElementById('modal-max-alt').innerText = t.maxAlt;

            // Render itinerary list
            const itinList = document.getElementById('modal-itinerary-list');
            itinList.innerHTML = '';
            t.itinerary.forEach(day => {
                const div = document.createElement('div');
                div.className = "flex gap-3 items-start border-l-2 border-brand-orange/20 pl-4 py-1 relative";
                div.innerHTML = `
                    <span class="h-2 w-2 rounded-full bg-brand-orange absolute -left-[5px] top-2"></span>
                    <p class="text-xs text-slate-700 leading-normal font-medium">${day}</p>
                `;
                itinList.appendChild(div);
            });

            // Render inclusions
            const incList = document.getElementById('modal-included-list');
            incList.innerHTML = '';
            t.included.forEach(inc => {
                incList.innerHTML += `<li class="flex items-start gap-2"><i class="fa-solid fa-check text-green-500 mt-0.5"></i> <span>${inc}</span></li>`;
            });

            // Render exclusions
            const excList = document.getElementById('modal-excluded-list');
            excList.innerHTML = '';
            t.excluded.forEach(exc => {
                excList.innerHTML += `<li class="flex items-start gap-2"><i class="fa-solid fa-xmark text-rose-500 mt-0.5"></i> <span>${exc}</span></li>`;
            });

            // Set dynamic button behavior
            document.getElementById('modal-book-btn').onclick = function() {
                openBooking(t.title, "Flexible Dates", t.price);
            };

            // Switch to itinerary tab by default
            switchTab('itinerary');

            // Open Modal with smooth fade transition
            const modal = document.getElementById('trek-modal');
            const container = document.getElementById('modal-container');
            modal.classList.remove('hidden');
            setTimeout(() => {
                container.classList.remove('scale-95', 'opacity-0');
                container.classList.add('scale-100', 'opacity-100');
            }, 50);
        }

        function closeModal() {
            const modal = document.getElementById('trek-modal');
            const container = document.getElementById('modal-container');
            container.classList.add('scale-95', 'opacity-0');
            container.classList.remove('scale-100', 'opacity-100');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 250);
        }

        // Switch between tabs in modal
        function switchTab(tabId) {
            const tabs = ['itinerary', 'inclusion', 'info'];
            tabs.forEach(t => {
                const btn = document.getElementById(`tab-btn-${t}`);
                const content = document.getElementById(`tab-content-${t}`);
                if (t === tabId) {
                    btn.className = "pb-3 text-xs font-bold uppercase tracking-wider border-b-2 border-brand-orange text-brand-orange";
                    content.classList.remove('hidden');
                } else {
                    btn.className = "pb-3 text-xs font-bold uppercase tracking-wider border-b-2 border-transparent text-slate-400 hover:text-slate-600";
                    content.classList.add('hidden');
                }
            });
        }

        // Direct booking bridge
        function openBooking(trekName, departureDate, price) {
            closeModal();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            alert(`Booking Initiated!\nPackage: ${trekName}\nDeparture: ${departureDate}\nPrice: $${price}/person\n\nWe have automatically loaded your package context. Please fill out your details in the contact form, and our Sherpa coordination team will finalize your spot.`);
        }

        function handleSubmit(e) {
            e.preventDefault();
            alert("Congratulations! Your high-altitude inquiry has been transmitted successfully to our Kathmandu coordination desk. One of our local certified adventure agents will email/call you within the next 4 hours.");
            e.target.reset();
        }

        // Initialize App on load
        window.onload = function() {
            renderTreks(packages);
        }
    </script>
</body>
</html>"""

class RedesignHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/index.html':
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(HTML_CONTENT.encode('utf-8'))
        else:
            super().do_GET()

def start_server():
    # Write the static file locally so the user can double click it or run it
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)
    
    # Configure and launch local web server
    handler = RedesignHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"\\n[+] Redesign Preview successfully hosted on Localhost!")
        print(f"[*] Serving URL: http://localhost:{PORT}")
        print(f"[*] Standard index.html generated in local directory.")
        print(f"[!] Press CTRL+C in this terminal window to stop the server.\\n")
        
        # Trigger browser open
        threading.Timer(1.0, lambda: webbrowser.open(f"http://localhost:{PORT}")).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\\n[-] Local server stopped.")

if __name__ == "__main__":
    start_server()

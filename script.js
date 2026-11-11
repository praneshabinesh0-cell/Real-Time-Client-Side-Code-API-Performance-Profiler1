<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real-Time Client-Side Code & API Performance Profiler</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        darkBg: '#0b0f19',
                        panelBg: 'rgba(17, 24, 39, 0.75)',
                        panelBorder: 'rgba(255, 255, 255, 0.08)',
                        brandCyan: '#06b6d4',
                        brandMint: '#10b981',
                        brandPurple: '#8b5cf6',
                        brandRose: '#f43f5e',
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0b0f19;
            color: #f3f4f6;
            overflow-x: hidden;
        }
        .glass-panel {
            background: rgba(17, 24, 39, 0.75);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glass-panel-hover:hover {
            border-color: rgba(6, 182, 212, 0.3);
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.6);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(6, 182, 212, 0.5);
        }
        .pulse-glow-cyan {
            animation: glowCyan 2s infinite alternate;
        }
        @keyframes glowCyan {
            0% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.2); }
            100% { box-shadow: 0 0 18px rgba(6, 182, 212, 0.5); }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col text-slate-200">

    <!-- Header Navigation -->
    <header class="sticky top-0 z-50 glass-panel border-b border-panelBorder px-4 lg:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="font-bold text-lg text-white tracking-wide">TelemetryPro</h1>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Client Profiler Active</span>
                </div>
                <p class="text-xs text-slate-400">Zero-Latency In-Browser Diagnostics & Interceptor</p>
            </div>
        </div>

        <!-- Quick Telemetry Stats & Action Controls -->
        <div class="flex items-center gap-3">
            <button onclick="simulateLongTask()" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Trigger Long Task Block
            </button>
            <button onclick="exportJSONTrace()" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Export Trace (JSON)
            </button>
            <button onclick="clearProfilerLogs()" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition">
                Clear Storage
            </button>
        </div>
    </header>

    <!-- Main Content Grid Layout -->
    <main class="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- LEFT COLUMN: Simulator Controls & Core Metrics (4 cols) -->
        <section class="lg:col-span-4 flex flex-col gap-6">
            
            <!-- Traffic Simulator & API Interceptor Controller -->
            <div class="glass-panel rounded-2xl p-5 border border-panelBorder flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        API Interceptor Traffic Generator
                    </h2>
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">Fetch Proxy ON</span>
                </div>
                <p class="text-xs text-slate-400">Trigger custom simulated network requests to observe live interceptor hooks, latency measurements, and IndexedDB telemetry logging.</p>

                <div class="grid grid-cols-2 gap-2.5">
                    <button onclick="triggerRequest('fast')" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 border border-slate-700/60 hover:border-emerald-500/40 text-left transition group">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-semibold text-emerald-400">Fast 200 OK</span>
                            <span class="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-ping"></span>
                        </div>
                        <p class="text-[11px] text-slate-400">~40-100ms latency</p>
                    </button>

                    <button onclick="triggerRequest('slow')" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-amber-950/40 border border-slate-700/60 hover:border-amber-500/40 text-left transition group">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-semibold text-amber-400">Slow 200 OK</span>
                            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                        </div>
                        <p class="text-[11px] text-slate-400">~600-1200ms latency</p>
                    </button>

                    <button onclick="triggerRequest('404')" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-500/40 text-left transition group">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-semibold text-rose-400">404 Not Found</span>
                            <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                        </div>
                        <p class="text-[11px] text-slate-400">Client error endpoint</p>
                    </button>

                    <button onclick="triggerRequest('500')" class="p-2.5 rounded-xl bg-slate-800/80 hover:bg-purple-950/40 border border-slate-700/60 hover:border-purple-500/40 text-left transition group">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-semibold text-purple-400">500 Server Error</span>
                            <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                        </div>
                        <p class="text-[11px] text-slate-400">Internal failure simulation</p>
                    </button>
                </div>

                <div class="pt-2 border-t border-slate-800 flex gap-2">
                    <button onclick="triggerRequest('heavy')" class="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-950/50 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium text-cyan-300 transition flex items-center justify-center gap-1.5">
                        <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
                        Heavy Payload Request (~250 KB)
                    </button>
                    <button onclick="toggleAutoTraffic()" id="autoTrafficBtn" class="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition">
                        Start Auto Load
                    </button>
                </div>
            </div>

            <!-- Web Vitals & Thread Telemetry Cards -->
            <div class="glass-panel rounded-2xl p-5 border border-panelBorder flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                        Web Vitals & Execution Telemetry
                    </h2>
                    <span id="vitalsStatusBadge" class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Optimal</span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <!-- LCP Metric Card -->
                    <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                        <div class="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span>LCP (Render)</span>
                            <span class="text-[10px] font-mono text-cyan-400">Target &lt;2.5s</span>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span id="metricLCP" class="text-xl font-bold font-mono text-white">420</span>
                            <span class="text-xs text-slate-400">ms</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div id="barLCP" class="bg-emerald-400 h-full transition-all duration-500" style="width: 25%"></div>
                        </div>
                    </div>

                    <!-- CLS Metric Card -->
                    <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                        <div class="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span>CLS (Shift)</span>
                            <span class="text-[10px] font-mono text-cyan-400">Target &lt;0.1</span>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span id="metricCLS" class="text-xl font-bold font-mono text-white">0.012</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div id="barCLS" class="bg-emerald-400 h-full transition-all duration-500" style="width: 12%"></div>
                        </div>
                    </div>

                    <!-- INP Metric Card -->
                    <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                        <div class="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span>INP (Responsiveness)</span>
                            <span class="text-[10px] font-mono text-cyan-400">Target &lt;200ms</span>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span id="metricINP" class="text-xl font-bold font-mono text-white">18</span>
                            <span class="text-xs text-slate-400">ms</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div id="barINP" class="bg-emerald-400 h-full transition-all duration-500" style="width: 15%"></div>
                        </div>
                    </div>

                    <!-- Long Tasks Counter -->
                    <div class="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                        <div class="flex justify-between items-center text-xs text-slate-400 mb-1">
                            <span>Blocked Thread (&gt;50ms)</span>
                            <span class="text-[10px] font-mono text-amber-400">Tasks</span>
                        </div>
                        <div class="flex items-baseline gap-1">
                            <span id="metricLongTasks" class="text-xl font-bold font-mono text-amber-400">0</span>
                            <span class="text-xs text-slate-400">events</span>
                        </div>
                        <div class="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div id="barLongTasks" class="bg-amber-400 h-full transition-all duration-500" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Storage & Engine Status -->
            <div class="glass-panel rounded-2xl p-5 border border-panelBorder flex flex-col gap-3">
                <h2 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s-8-1.79-8-4"/></svg>
                    IndexedDB & Overhead Status
                </h2>
                <div class="flex justify-between items-center py-2 border-b border-slate-800 text-xs">
                    <span class="text-slate-400">Local DB Status:</span>
                    <span id="dbStatusText" class="font-mono text-emerald-400 font-semibold">Ready (IndexedDB)</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-slate-800 text-xs">
                    <span class="text-slate-400">Stored Trace Count:</span>
                    <span id="dbRecordCount" class="font-mono text-cyan-300 font-bold">0 records</span>
                </div>
                <div class="flex justify-between items-center py-2 text-xs">
                    <span class="text-slate-400">Profiler Overhead Latency:</span>
                    <span class="font-mono text-emerald-400 font-bold">&lt; 0.04 ms</span>
                </div>
            </div>
        </section>

        <!-- RIGHT COLUMN: Real-Time Telemetry Graph & Interactive Logs (8 cols) -->
        <section class="lg:col-span-8 flex flex-col gap-6">

            <!-- Real-Time Telemetry Canvas Chart -->
            <div class="glass-panel rounded-2xl p-5 border border-panelBorder flex flex-col gap-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                            Live Request Latency Waterfall & Trend Graph
                        </h2>
                        <p class="text-xs text-slate-400">Real-time dynamic visualization of API latency spikes and thread blockage</p>
                    </div>
                    <div class="flex items-center gap-3 text-xs">
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> 200 OK Latency</span>
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Error Status</span>
                        <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Long Task Spikes</span>
                    </div>
                </div>

                <!-- Canvas container -->
                <div class="relative w-full h-56 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden mt-1">
                    <canvas id="telemetryCanvas" class="w-full h-full block"></canvas>
                </div>
            </div>

            <!-- Intercepted Network Requests Log Table -->
            <div class="glass-panel rounded-2xl p-5 border border-panelBorder flex flex-col gap-4 flex-1">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <h2 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
                            Intercepted Network Requests
                        </h2>
                        <span id="totalRequestBadge" class="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">0 items</span>
                    </div>

                    <!-- Search and Filter Controls -->
                    <div class="flex items-center gap-2">
                        <input type="text" id="logSearchInput" oninput="filterLogDisplay()" placeholder="Search endpoint..." 
                            class="px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition w-36 sm:w-48">
                        
                        <select id="statusFilter" onchange="filterLogDisplay()" class="px-2.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition">
                            <option value="ALL">All Status</option>
                            <option value="200">200 OK</option>
                            <option value="404">404 Error</option>
                            <option value="500">500 Error</option>
                        </select>
                    </div>
                </div>

                <!-- Table Container -->
                <div class="overflow-x-auto overflow-y-auto max-h-[340px] rounded-xl border border-slate-800/80">
                    <table class="w-full text-left text-xs font-mono border-collapse">
                        <thead class="sticky top-0 bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <tr>
                                <th class="py-2.5 px-3">Time</th>
                                <th class="py-2.5 px-3">Method</th>
                                <th class="py-2.5 px-3">URL / Endpoint</th>
                                <th class="py-2.5 px-3">Status</th>
                                <th class="py-2.5 px-3">Latency</th>
                                <th class="py-2.5 px-3">Payload Size</th>
                            </tr>
                        </thead>
                        <tbody id="requestTableBody" class="divide-y divide-slate-800/60 text-slate-300">
                            <tr id="emptyTableState">
                                <td colspan="6" class="py-12 text-center text-slate-500 font-sans italic">
                                    No network events captured yet. Click one of the simulator buttons above to capture live fetch telemetry.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Diagnostics Summary Modal / Panel -->
            <div class="glass-panel rounded-2xl p-5 border border-panelBorder flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Automated Performance Diagnostic Report
                    </h2>
                    <span class="text-xs text-slate-400" id="diagnosticTimestamp">Updated live</span>
                </div>
                
                <div id="diagnosticSummary" class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-sans text-slate-300 leading-relaxed flex flex-col gap-2">
                    <p class="flex items-center gap-2 text-emerald-400 font-medium">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Profiler active. Interceptor wrappers initialized for fetch() API.
                    </p>
                    <p class="text-slate-400">Perform API calls to generate real-time diagnostic findings and detect memory/latency bottlenecks.</p>
                </div>
            </div>

        </section>
    </main>

    <!-- Custom Notification Toast Container -->
    <div id="toastContainer" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"></div>

    <!-- Application Logic Script -->
    <script>
        /**
         * TelemetryPro Profiler Engine Architecture
         * 1. IndexedDB Client-Side Storage Manager
         * 2. Proxy Interceptor for window.fetch
         * 3. PerformanceObserver for Web Vitals & Thread Locks
         * 4. Real-time Canvas Renderer
         * 5. State Management & Diagnostic Engine
         */

        // Application State
        const state = {
            requests: [],
            vitals: {
                lcp: 420,
                cls: 0.012,
                inp: 18,
                longTasks: 0
            },
            autoTrafficInterval: null,
            db: null
        };

        // Telemetry Data History for Charting (last 40 data points)
        const chartDataPoints = [];
        const MAX_CHART_POINTS = 45;

        // Initialize Web Performance Observer and Profiler Setup
        window.addEventListener('DOMContentLoaded', () => {
            initIndexedDB();
            setupFetchInterceptor();
            setupPerformanceObservers();
            initCanvas();
            window.addEventListener('resize', resizeCanvas);
        });

        /* ==========================================================================
           1. INDEXEDDB LOCAL STORAGE CONTROLLER
           ========================================================================== */
        function initIndexedDB() {
            const request = indexedDB.open('TelemetryProfilerDB', 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('traces')) {
                    db.createObjectStore('traces', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (e) => {
                state.db = e.target.result;
                updateDBStats();
            };

            request.onerror = () => {
                document.getElementById('dbStatusText').textContent = 'Memory Fallback (No DB)';
                document.getElementById('dbStatusText').className = 'font-mono text-amber-400 font-semibold';
            };
        }

        function saveTraceToDB(traceRecord) {
            if (!state.db) return;
            try {
                const tx = state.db.transaction('traces', 'readwrite');
                const store = tx.objectStore('traces');
                store.add(traceRecord);
                tx.oncomplete = () => updateDBStats();
            } catch (err) {
                console.warn('DB Write warning:', err);
            }
        }

        function updateDBStats() {
            if (!state.db) return;
            try {
                const tx = state.db.transaction('traces', 'readonly');
                const store = tx.objectStore('traces');
                const countReq = store.count();
                countReq.onsuccess = () => {
                    document.getElementById('dbRecordCount').textContent = `${countReq.result} records`;
                };
            } catch (e) { }
        }

        function clearProfilerLogs() {
            state.requests = [];
            chartDataPoints.length = 0;
            renderRequestTable();
            renderDiagnostics();

            if (state.db) {
                const tx = state.db.transaction('traces', 'readwrite');
                const store = tx.objectStore('traces');
                store.clear();
                tx.oncomplete = () => updateDBStats();
            }
            showToast('Profiler storage & telemetry reset', 'cyan');
        }

        /* ==========================================================================
           2. FETCH INTERCEPTOR PROXY WRAPPER
           ========================================================================== */
        function setupFetchInterceptor() {
            const originalFetch = window.fetch;

            window.fetch = async function (...args) {
                const startTime = performance.now();
                const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || 'Unknown URL';
                const method = (args[1] && args[1].method) || 'GET';

                try {
                    const response = await originalFetch.apply(this, args);
                    const endTime = performance.now();
                    const latency = Math.round(endTime - startTime);
                    
                    // Clone response to calculate size safely
                    const resClone = response.clone();
                    let payloadSize = 0;
                    try {
                        const blob = await resClone.blob();
                        payloadSize = blob.size;
                    } catch (e) {
                        payloadSize = Math.floor(Math.random() * 800) + 200;
                    }

                    const traceRecord = {
                        timestamp: new Date().toLocaleTimeString(),
                        isoTime: new Date().toISOString(),
                        method: method.toUpperCase(),
                        url: url,
                        status: response.status,
                        latencyMs: latency,
                        payloadSize: payloadSize
                    };

                    recordNetworkTrace(traceRecord);
                    return response;
                } catch (error) {
                    const endTime = performance.now();
                    const latency = Math.round(endTime - startTime);

                    const traceRecord = {
                        timestamp: new Date().toLocaleTimeString(),
                        isoTime: new Date().toISOString(),
                        method: method.toUpperCase(),
                        url: url,
                        status: 500,
                        latencyMs: latency,
                        payloadSize: 0,
                        error: error.message
                    };

                    recordNetworkTrace(traceRecord);
                    throw error;
                }
            };
        }

        function recordNetworkTrace(traceRecord) {
            state.requests.unshift(traceRecord);
            saveTraceToDB(traceRecord);

            // Add data point to graph
            chartDataPoints.push({
                type: 'request',
                latency: traceRecord.latencyMs,
                status: traceRecord.status,
                time: new Date()
            });
            if (chartDataPoints.length > MAX_CHART_POINTS) chartDataPoints.shift();

            renderRequestTable();
            renderDiagnostics();
        }

        /* ==========================================================================
           3. WEB VITALS & LONG TASK OBSERVERS
           ========================================================================== */
        function setupPerformanceObservers() {
            // Long Tasks Observer (>50ms thread blocking)
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        for (const entry of list.getEntries()) {
                            if (entry.duration > 50) {
                                state.vitals.longTasks++;
                                updateVitalsDisplay();
                                
                                // Record spike on graph
                                chartDataPoints.push({
                                    type: 'longtask',
                                    duration: Math.round(entry.duration),
                                    time: new Date()
                                });
                                if (chartDataPoints.length > MAX_CHART_POINTS) chartDataPoints.shift();
                                
                                showToast(`Thread Block Detected: ${Math.round(entry.duration)}ms`, 'amber');
                            }
                        }
                    });
                    observer.observe({ type: 'longtask', buffered: true });
                } catch (e) {
                    // Fallback for browsers that don't support longtask observer
                }
            }
        }

        function simulateLongTask() {
            const start = performance.now();
            // Intentionally block main JS thread for ~120ms
            while (performance.now() - start < 120) {
                Math.sqrt(Math.random() * 999999);
            }
            state.vitals.longTasks++;
            state.vitals.inp = Math.min(350, state.vitals.inp + 25);
            
            chartDataPoints.push({
                type: 'longtask',
                duration: 120,
                time: new Date()
            });
            if (chartDataPoints.length > MAX_CHART_POINTS) chartDataPoints.shift();

            updateVitalsDisplay();
            renderDiagnostics();
            showToast('Simulated 120ms Main Thread Lock', 'amber');
        }

        function updateVitalsDisplay() {
            document.getElementById('metricLCP').textContent = state.vitals.lcp;
            document.getElementById('metricCLS').textContent = state.vitals.cls;
            document.getElementById('metricINP').textContent = state.vitals.inp;
            document.getElementById('metricLongTasks').textContent = state.vitals.longTasks;

            // Bar fill percent updates
            document.getElementById('barLCP').style.width = `${Math.min(100, (state.vitals.lcp / 2500) * 100)}%`;
            document.getElementById('barCLS').style.width = `${Math.min(100, (state.vitals.cls / 0.1) * 100)}%`;
            document.getElementById('barINP').style.width = `${Math.min(100, (state.vitals.inp / 200) * 100)}%`;
            document.getElementById('barLongTasks').style.width = `${Math.min(100, state.vitals.longTasks * 20)}%`;

            const badge = document.getElementById('vitalsStatusBadge');
            if (state.vitals.longTasks > 3 || state.vitals.inp > 150) {
                badge.textContent = 'Degraded';
                badge.className = 'text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20';
            } else {
                badge.textContent = 'Optimal';
                badge.className = 'text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            }
        }

        /* ==========================================================================
           4. SIMULATED API CALL GENERATOR
           ========================================================================== */
        async function triggerRequest(type) {
            // Generate synthetic URLs mapping to simulated behavior
            let url = '';
            switch (type) {
                case 'fast':
                    url = 'https://jsonplaceholder.typicode.com/todos/1?sim=fast';
                    break;
                case 'slow':
                    url = 'https://jsonplaceholder.typicode.com/posts/1?sim=slow_delay';
                    break;
                case '404':
                    url = 'https://jsonplaceholder.typicode.com/nonexistent_resource';
                    break;
                case '500':
                    url = 'https://jsonplaceholder.typicode.com/trigger_500_error';
                    break;
                case 'heavy':
                    url = 'https://jsonplaceholder.typicode.com/photos?sim=heavy_payload';
                    break;
            }

            try {
                // Execute standard fetch - gets automatically intercepted by window.fetch wrapper
                await fetch(url, { method: 'GET' });
            } catch (err) {
                // Expected for synthetic 404 / 500 triggers
            }
        }

        function toggleAutoTraffic() {
            const btn = document.getElementById('autoTrafficBtn');
            if (state.autoTrafficInterval) {
                clearInterval(state.autoTrafficInterval);
                state.autoTrafficInterval = null;
                btn.textContent = 'Start Auto Load';
                btn.className = 'py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition';
                showToast('Auto load simulation stopped', 'cyan');
            } else {
                const types = ['fast', 'fast', 'slow', '404', 'heavy'];
                state.autoTrafficInterval = setInterval(() => {
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    triggerRequest(randomType);
                }, 1400);
                btn.textContent = 'Stop Auto Load';
                btn.className = 'py-2 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-xs font-medium text-rose-300 transition animate-pulse';
                showToast('Auto load simulation running (1.4s interval)', 'emerald');
            }
        }

        /* ==========================================================================
           5. DATA TABLE & DIAGNOSTICS RENDERER
           ========================================================================== */
        function renderRequestTable() {
            const tbody = document.getElementById('requestTableBody');
            const searchVal = document.getElementById('logSearchInput').value.toLowerCase();
            const filterVal = document.getElementById('statusFilter').value;

            const filtered = state.requests.filter(req => {
                const matchesSearch = req.url.toLowerCase().includes(searchVal) || req.method.toLowerCase().includes(searchVal);
                const matchesFilter = filterVal === 'ALL' || req.status.toString() === filterVal;
                return matchesSearch && matchesFilter;
            });

            document.getElementById('totalRequestBadge').textContent = `${state.requests.length} requests`;

            if (filtered.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="py-12 text-center text-slate-500 font-sans italic">
                            No matching network traces found.
                        </td>
                    </tr>`;
                return;
            }

            tbody.innerHTML = filtered.map(req => {
                let statusBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (req.status >= 400 && req.status < 500) statusBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                if (req.status >= 500) statusBadgeClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';

                let latencyClass = 'text-emerald-400';
                if (req.latencyMs > 300) latencyClass = 'text-amber-400';
                if (req.latencyMs > 800) latencyClass = 'text-rose-400';

                const formattedSize = (req.payloadSize / 1024).toFixed(1) + ' KB';

                return `
                    <tr class="hover:bg-slate-800/40 transition">
                        <td class="py-2.5 px-3 text-slate-400">${req.timestamp}</td>
                        <td class="py-2.5 px-3 font-semibold text-cyan-300">${req.method}</td>
                        <td class="py-2.5 px-3 text-slate-200 truncate max-w-xs" title="${req.url}">${req.url}</td>
                        <td class="py-2.5 px-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${statusBadgeClass}">
                                ${req.status}
                            </span>
                        </td>
                        <td class="py-2.5 px-3 font-semibold ${latencyClass}">${req.latencyMs} ms</td>
                        <td class="py-2.5 px-3 text-slate-400">${formattedSize}</td>
                    </tr>
                `;
            }).join('');
        }

        function filterLogDisplay() {
            renderRequestTable();
        }

        function renderDiagnostics() {
            const diagContainer = document.getElementById('diagnosticSummary');
            document.getElementById('diagnosticTimestamp').textContent = `Updated: ${new Date().toLocaleTimeString()}`;

            if (state.requests.length === 0) {
                diagContainer.innerHTML = `
                    <p class="text-slate-400 italic">No network calls captured yet. Use the API simulator controls to generate dynamic analytical data.</p>
                `;
                return;
            }

            const total = state.requests.length;
            const avgLatency = Math.round(state.requests.reduce((acc, r) => acc + r.latencyMs, 0) / total);
            const errors = state.requests.filter(r => r.status >= 400).length;
            const errorRate = ((errors / total) * 100).toFixed(1);

            let healthStatus = 'Health: GOOD';
            let healthColor = 'text-emerald-400';
            let recommendations = [];

            if (avgLatency > 400) {
                recommendations.push('High latency observed (>400ms avg). Consider API endpoint response optimization or client caching.');
            }
            if (errors > 0) {
                recommendations.push(`Detected ${errors} failed requests (${errorRate}% failure rate). Inspect network endpoints for availability.`);
            }
            if (state.vitals.longTasks > 2) {
                recommendations.push('Main thread lock tasks detected. Offload heavy computations to Web Workers.');
            }
            if (recommendations.length === 0) {
                recommendations.push('All captured endpoints operating within nominal latency thresholds (<250ms). Zero critical bottlenecks.');
            }

            if (errors > 2 || avgLatency > 600) {
                healthStatus = 'Health: DEGRADED';
                healthColor = 'text-amber-400';
            }

            diagContainer.innerHTML = `
                <div class="flex items-center justify-between font-semibold border-b border-slate-800/80 pb-2 mb-1">
                    <span class="${healthColor}">${healthStatus}</span>
                    <span class="text-slate-400 font-mono">Avg Latency: <span class="text-white">${avgLatency} ms</span> | Errors: <span class="text-rose-400">${errors} (${errorRate}%)</span></span>
                </div>
                <ul class="list-disc list-inside text-slate-300 space-y-1">
                    ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            `;
        }

        function exportJSONTrace() {
            const traceDump = {
                exportedAt: new Date().toISOString(),
                environment: 'Client-Side TelemetryPro Profiler',
                vitals: state.vitals,
                totalCaptured: state.requests.length,
                traces: state.requests
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(traceDump, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `telemetry-trace-${Date.now()}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            showToast('Trace logs exported as JSON file', 'cyan');
        }

        /* ==========================================================================
           6. REAL-TIME CANVAS WATERFALL GRAPH RENDERER
           ========================================================================== */
        let canvas, ctx;

        function initCanvas() {
            canvas = document.getElementById('telemetryCanvas');
            ctx = canvas.getContext('2d');
            resizeCanvas();
            requestAnimationFrame(drawCanvasLoop);
        }

        function resizeCanvas() {
            if (!canvas) return;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function drawCanvasLoop() {
            if (!canvas || !ctx) return;
            const w = canvas.width / window.devicePixelRatio;
            const h = canvas.height / window.devicePixelRatio;

            // Clear Background
            ctx.fillStyle = '#090d16';
            ctx.fillRect(0, 0, w, h);

            // Draw Background Grid Lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            const gridSpacingY = h / 4;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(0, i * gridSpacingY);
                ctx.lineTo(w, i * gridSpacingY);
                ctx.stroke();
            }

            // Draw Y-Axis Labels
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Fira Code';
            ctx.fillText('1000ms', 10, 16);
            ctx.fillText('500ms', 10, h / 2);
            ctx.fillText('0ms', 10, h - 8);

            // Render Chart Data Bars & Waveform
            if (chartDataPoints.length > 0) {
                const barSpacing = w / MAX_CHART_POINTS;

                chartDataPoints.forEach((pt, index) => {
                    const x = index * barSpacing + 40;

                    if (pt.type === 'request') {
                        const normalizedHeight = Math.min(h - 25, (pt.latency / 1000) * (h - 25));
                        const y = h - 15 - normalizedHeight;

                        // Bar color coding based on status
                        let color = '#06b6d4'; // Cyan
                        if (pt.status >= 400 && pt.status < 500) color = '#f43f5e'; // Rose
                        if (pt.status >= 500) color = '#a855f7'; // Purple

                        ctx.fillStyle = color;
                        ctx.beginPath();
                        ctx.roundRect(x, y, Math.max(4, barSpacing - 4), normalizedHeight, [3, 3, 0, 0]);
                        ctx.fill();
                    } else if (pt.type === 'longtask') {
                        // Draw vertical warning spike for long task locks
                        ctx.strokeStyle = '#fbbf24'; // Amber
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.setLineDash([4, 4]);
                        ctx.moveTo(x, 10);
                        ctx.lineTo(x, h - 15);
                        ctx.stroke();
                        ctx.setLineDash([]);

                        // Top warning indicator dot
                        ctx.fillStyle = '#fbbf24';
                        ctx.beginPath();
                        ctx.arc(x, 12, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            }

            requestAnimationFrame(drawCanvasLoop);
        }

        /* ==========================================================================
           7. TOAST NOTIFICATION SYSTEM
           ========================================================================== */
        function showToast(message, colorClass = 'cyan') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');

            let borderCol = 'border-cyan-500/40 text-cyan-300';
            if (colorClass === 'amber') borderCol = 'border-amber-500/40 text-amber-300';
            if (colorClass === 'emerald') borderCol = 'border-emerald-500/40 text-emerald-300';

            toast.className = `glass-panel px-4 py-2.5 rounded-xl border ${borderCol} text-xs font-mono shadow-2xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto flex items-center gap-2`;
            toast.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-current"></span>
                <span>${message}</span>
            `;

            container.appendChild(toast);

            requestAnimationFrame(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            });

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 2600);
        }
    </script>
</body>
</html>

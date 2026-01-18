/**
 * scripts.js
 * Cleaned up DOM access logic with English documentation.
 */

/**
 * Toggles the visibility of a collapsible section.
 * @param {string} boxId - ID of the content container.
 * @param {string} iconId - ID of the chevron/icon element.
 */
function toggleSection(boxId, iconId) {
  const box = document.getElementById(boxId);
  const icon = document.getElementById(iconId);

  if (box && icon) {
    const isOpen = box.classList.contains("open");

    if (isOpen) {
      box.classList.remove("open");
      icon.classList.remove("rotate-180");
    } else {
      box.classList.add("open");
      icon.classList.add("rotate-180");
    }
  }
}

/**
 * VIDEO SYSTEM - GLOBAL SCOPE
 * ย้ายออกมาจาก DOMContentLoaded เพื่อให้ปุ่ม HTML เรียกใช้งานได้
 */
const video = document.getElementById('main-video-player');
const embedPlayer = document.getElementById('embed-player');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('video-progress');
const timeDisplay = document.getElementById('video-time');
const timelineTimestamp = document.getElementById('timeline-timestamp');
const timelineTrack = document.getElementById('timeline-track');
const renderIndicator = document.getElementById('render-indicator');
const videoControls = document.getElementById('video-controls');
const timelineSection = document.getElementById('timeline-section');

function formatTime(seconds) {
	if (isNaN(seconds) || seconds === Infinity) return "00:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateVideoUI() {
	if (!video.duration) return;
	const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.width = `${percent}%`;
	
	const current = formatTime(video.currentTime);
	const total = formatTime(video.duration);
	timeDisplay.innerText = `${current} / ${total}`;
	
	// Frame calculation simulation (30fps)
	const frames = Math.floor((video.currentTime % 1) * 30);
	timelineTimestamp.innerText = `00:${current}:${frames.toString().padStart(2, '0')}`;
}

function setSource(src, type) {
	if (type === 'direct') {
		video.classList.remove('hidden');
		embedPlayer.classList.add('hidden');
		videoControls.classList.remove('hidden');
		timelineSection.style.opacity = '1';
		timelineSection.style.pointerEvents = 'auto';
		video.src = src;
		video.load();
		stopVideo();
	} else if (type === 'embed') {
		video.classList.add('hidden');
		embedPlayer.classList.remove('hidden');
		videoControls.classList.add('hidden');
		timelineSection.style.opacity = '0.3';
		timelineSection.style.pointerEvents = 'none';
		embedPlayer.src = src;
		timeDisplay.innerText = "LIVE / STREAM";
		timelineTimestamp.innerText = "EXTERNAL_SOURCE";
		renderIndicator.classList.remove('bg-blue-500/20');
		renderIndicator.classList.add('bg-red-500', 'animate-pulse');
	} 
}

function toggleVideoPlay() {
	if (video.paused) {
		video.play();
		playIcon.className = "fas fa-pause text-xs";
		renderIndicator.classList.remove('bg-blue-500/20');
		renderIndicator.classList.add('bg-blue-500', 'animate-pulse');
	} else {
		video.pause();
		playIcon.className = "fas fa-play text-xs";
		renderIndicator.classList.add('bg-blue-500/20');
		renderIndicator.classList.remove('bg-blue-500', 'animate-pulse');
	}
}

function stopVideo() {
	video.pause();
	video.currentTime = 0;
	playIcon.className = "fas fa-play text-xs";
	renderIndicator.classList.add('bg-blue-500/20');
	renderIndicator.classList.remove('bg-blue-500', 'animate-pulse', 'bg-red-500');
	updateVideoUI();
}

function rewindVideo() {
	video.currentTime = Math.max(0, video.currentTime - 5);
}
		
/**
 * Handles sending messages in the simulated chat interface.
 */
function sendMessage() {
  const input = document.getElementById("chat-input");
  const container = document.getElementById("message-container");

  if (input && container && input.value.trim() !== "") {
    const msg = document.createElement("div");
    msg.className = "flex gap-3";
    msg.innerHTML = `<span class="text-green-500">YOU:</span><span class="text-gray-500">${input.value}</span>`;
    container.appendChild(msg);
    input.value = "";
    container.scrollTop = container.scrollHeight;
  }
}


/**
 * SECURITY MODAL SYSTEM
 */
function openSecurityPrompt() {
  const modal = document.getElementById("security-modal");
  const main = document.getElementById("main-interface");
  if (modal && main) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    main.classList.add("blur-sm");
  }
}

function closeSecurityModal() {
  const modal = document.getElementById("security-modal");
  const main = document.getElementById("main-interface");
  if (modal && main) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    main.classList.remove("blur-sm");
  }
}

function revealHiddenContent() {
  closeSecurityModal();
  const contentModal = document.getElementById("hidden-links-modal");
  const main = document.getElementById("main-interface");
  if (contentModal && main) {
    contentModal.classList.remove("hidden");
    contentModal.classList.add("flex");
    main.classList.add("blur-md");
  }
}

function closeHiddenContent() {
  const contentModal = document.getElementById("hidden-links-modal");
  const main = document.getElementById("main-interface");
  if (contentModal && main) {
    contentModal.classList.add("hidden");
    contentModal.classList.remove("flex");
    main.classList.remove("blur-md");
  }
}

// Support Enter key for the chat input outside DOMContentLoaded to ensure availability
const chatInput = document.getElementById("chat-input");
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

// --- INITIALIZE ON DOM LOAD ---
document.addEventListener("DOMContentLoaded", () => {
  // --- SELECT DOM ELEMENTS ---
  const bootScreen = document.getElementById("boot-screen");
  const mainInterface = document.getElementById("main-interface");
  const btnInitialize = document.getElementById("btn-initialize");
  const btnDisconnect = document.getElementById("btn-disconnect");
  const bootLogs = document.getElementById("boot-logs");
  const navLinks = document.querySelectorAll(".nav-link[data-target]");
  const sections = document.querySelectorAll(".content-section");
  const viewTitle = document.getElementById("view-title");
  const input = document.getElementById("command-input");
  const outputLog = document.getElementById("output-log");
  const screen = document.getElementById("terminal-screen");
  const debugContent = document.getElementById("debug-log-content") || document.getElementById("debug-console");

  // --- CONFIGURATION ---
  const logSequences = [
    "LOADER: [OK] System image found",
    "KERNEL: Loading drivers...",
    "NETWORK: Handshake with 127.0.0.1",
    "SECURITY: RSA 4096-bit verified",
    "UI: Pre-rendering glass panels...",
    "READY: Waiting for user signal",
    'INFO: PRESS "INITIAL SESSION"',
  ];

  const COMMANDS = {
    help: "Available commands: [about, clear, contact, projects, skills, status]",
    about: "Identity: Amateur Developer/Editor\nFocus: Building something interesting!.\nLocation: TH, South East Asia",
    projects: "Executing search... \n> Video Tool PRO (Video Kit)\n> FreelanceFlow (Financial Management System)",
    skills: "Coding: JavaScript, Python, C++, HTML, CSS\nEditing: Premiere Pro, After Effects, CapCut, DaVinci Resolve",
    contact: "Email: m4rtkl2000@proton.me\nGitHub: github.com/m4rtkl2000-art",
    status: "System: Operational\nUptime: 10,432 hours\nLatency: 24ms",
  };

  // --- GLOBAL EVENT PREVENTION ---
  // Prevents dragging of non-input elements to maintain UI aesthetics
  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  }, false);

  // --- CORE FUNCTIONS ---

  /**
   * Simulates a system boot sequence by printing logs sequentially.
   */
  function startBootAnimation() {
    if (!bootLogs) return;
    bootLogs.innerHTML = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i >= logSequences.length) {
        clearInterval(interval);
        return;
      }
      const log = document.createElement("div");
      log.innerText = `> ${logSequences[i]}`;
      bootLogs.appendChild(log);
      i++;
    }, 400);
  }

  /**
   * Processes terminal commands and displays results.
   * @param {string} cmd - The command entered by the user.
   */
  function execute(cmd) {
    if (!outputLog) return;
    
    const echo = document.createElement("div");
    echo.innerHTML = `<span class="terminal-text font-bold">root@m4rtkl:~#</span> ${cmd}`;
    outputLog.appendChild(echo);

    const response = document.createElement("div");
    response.className = "mb-3 pl-4 border-l border-white/10 text-gray-400 italic";

    if (cmd === "clear") {
      outputLog.innerHTML = "";
    } else if (COMMANDS[cmd]) {
      response.innerText = COMMANDS[cmd];
      outputLog.appendChild(response);
    } else if (cmd !== "") {
      response.innerHTML = `<span class="text-red-500">Unknown command: ${cmd}</span>`;
      outputLog.appendChild(response);
    }

    // Auto-scroll to the bottom of the terminal screen
    const container = screen ? screen.parentElement : null;
    if (container) container.scrollTop = container.scrollHeight;
  }

  /**
   * Updates system statistics (CPU/Memory) with simulated values.
   */
  function updateStats() {
    const cpuText = document.getElementById("cpu-text");
    const cpuBar = document.getElementById("cpu-bar");
    const memText = document.getElementById("mem-text");
    const memBar = document.getElementById("mem-bar");

    if (cpuText && cpuBar) {
      const cpuVal = Math.floor(Math.random() * (65 - 12) + 12);
      cpuText.innerText = `${cpuVal}%`;
      cpuBar.style.width = `${cpuVal}%`;
      cpuBar.className = cpuVal > 60
        ? "bg-red-500 h-full transition-all duration-500"
        : "bg-green-500 h-full transition-all duration-500";
    }

    if (memText && memBar) {
      const baseMem = 1.2;
      const fluctuation = Math.random() * 20;
      const memUsed = (baseMem + fluctuation).toFixed(1);
      const memPercent = ((parseFloat(memUsed) / 128) * 100).toFixed(0);
      memText.innerText = `${memUsed}GB / 128GB`;
      memBar.style.width = `${memPercent}%`;
    }
  }

  /**
   * Adds a simulated debug log entry to the console.
   */
  function addDebugLog() {
    if (!debugContent) return;
    const time = new Date().toLocaleTimeString();
    const levels = ["INFO", "WARN", "ERROR"];
    const level = levels[Math.floor(Math.random() * 3)];
    const msg = "System signal processed successfully";
    const logEntry = document.createElement("div");
    
    const color = level === "ERROR" ? "text-red-500" :
                 level === "WARN" ? "text-yellow-500" : "text-gray-500";

    logEntry.innerHTML = `<span class="opacity-30">[${time}]</span> <span class="${color} font-bold">[${level}]</span> ${msg}`;
    debugContent.prepend(logEntry);

    // Limit log history to the last 20 entries
    if (debugContent.children.length > 20) {
      debugContent.removeChild(debugContent.lastChild);
    }
  }

  // --- INTERFACE EVENT LISTENERS ---

  if (btnInitialize) {
    btnInitialize.addEventListener("click", () => {
      bootScreen.classList.add("glitch-active");
      setTimeout(() => {
        bootScreen.style.opacity = "0";
        bootScreen.style.transform = "scale(1.1)";
        setTimeout(() => {
          bootScreen.style.display = "none";
          bootScreen.classList.remove("glitch-active");
          mainInterface.style.display = "block";
          setTimeout(() => (mainInterface.style.opacity = "1"), 50);
          if (input) input.focus();
        }, 800);
      }, 600);
    });
  }

  if (btnDisconnect) {
    btnDisconnect.addEventListener("click", () => {
      document.body.classList.add("glitch-active");
      mainInterface.style.opacity = "0";
      setTimeout(() => {
        document.body.classList.remove("glitch-active");
        mainInterface.style.display = "none";
        bootScreen.style.display = "flex";
        bootScreen.style.opacity = "1";
        bootScreen.style.transform = "scale(1)";
        startBootAnimation();
      }, 800);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = link.getAttribute("data-target");
      
      // Update navigation active state
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      
      // Toggle content sections
      sections.forEach((s) => s.classList.remove("active"));
      const targetSection = document.getElementById(`${target}-section`);
      if (targetSection) targetSection.classList.add("active");
      
      // Update breadcrumb title
      if (viewTitle) viewTitle.innerText = `PATH: //M4RTKL_OS/${target.toUpperCase()}`;
    });
  });

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = input.value.trim().toLowerCase();
        execute(val);
        input.value = "";
      }
    });
  }

  // Maintain terminal focus when clicking the interface
  document.addEventListener("click", () => {
    if (mainInterface && mainInterface.style.display === "block" && input) {
      input.focus();
    }
  });

  // --- STARTUP PROCESSES ---
  startBootAnimation();
  updateStats();
  setInterval(updateStats, 2000);
  setInterval(addDebugLog, 1500);
  
  // Pre-populate with initial debug logs
  for (let i = 0; i < 5; i++) addDebugLog();
});
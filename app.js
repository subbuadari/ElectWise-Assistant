/**
 * ElectWise - Main Application Logic
 * Integrates navigation, UI interactivity, Google Services (GA4, Gemini),
 * and an offline fallback knowledge base.
 */

/* ===== GOOGLE ANALYTICS (GA4) HELPER ===== */
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }
}

/* ===== SECURITY: INPUT SANITIZATION ===== */
function sanitizeInput(str) {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    "/": '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => (map[match]));
}

/* ===== NAVIGATION & UI ===== */
function navigateTo(id) {
  // Track navigation
  trackEvent('section_view', { section_name: id });

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  
  const btn = document.querySelector(`.nav-btn[data-section="${id}"]`);
  if (btn) btn.classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Close mobile nav
  document.querySelector('.nav').classList.remove('mobile-open');
  const menuBtn = document.getElementById('menuToggle');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.innerHTML = '<span class="material-icons">menu</span>';
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.section));
});

document.getElementById('menuToggle').addEventListener('click', (e) => {
  const nav = document.querySelector('.nav');
  const isOpen = nav.classList.toggle('mobile-open');
  e.currentTarget.setAttribute('aria-expanded', isOpen);
  e.currentTarget.innerHTML = isOpen ? '<span class="material-icons">close</span>' : '<span class="material-icons">menu</span>';
});

/* ===== STEPS TABS ===== */
document.querySelectorAll('.step-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    trackEvent('tab_click', { tab_name: tab.dataset.target });
    document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.steps-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    
    // Close all others
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      trackEvent('faq_open', { question: btn.textContent.trim().replace('+', '') });
    }
  });
});

/* ===== AI KNOWLEDGE BASE (FALLBACK) ===== */
const knowledge = [
  {
    keywords: ['register', 'registration', 'sign up', 'enroll'],
    answer: `**Voter Registration** is your first step to participating in elections. Here's how:\n\n1. **Check eligibility** — Be a U.S. citizen, 18+ by Election Day, and a state resident.\n2. **Register online** at [vote.gov](https://vote.gov) or your state's election website.\n3. **By mail** — Download a form from vote.gov, fill it out, and mail it.\n4. **In person** — Visit your local election office, DMV, or other government agency.\n\n⏰ **Deadlines** vary by state — typically 15–30 days before Election Day. Some states offer same-day registration!\n\n💡 **Pro Tip:** Register early and check your status before each election in case you've been removed.`
  },
  {
    keywords: ['change phone number', 'update number', 'change number', 'update details', 'update registration'],
    answer: `**Updating Your Voter Registration Details**\n\nIf you need to change your phone number, address, or name on your voter registration, you generally need to **update your registration**.\n\n1. **Online:** Most states allow you to update your details online through your state's official election portal. Visit [vote.gov](https://vote.gov) to find your state's specific link.\n2. **By Mail:** You can submit a new National Mail Voter Registration Form with your updated information.\n3. **In Person:** You can update your details at your local election office, DMV, or other designated government agencies.\n\n⚠️ **Note:** Some states may not require a phone number for registration to be valid, but if you wish to update it for contact purposes, re-registering or updating via the state portal is the standard process.`
  },
  {
    keywords: ['electoral college', 'electors', 'electoral votes', '270'],
    answer: `**The Electoral College** is how the U.S. President is officially elected. Here's how it works:\n\n• Each state gets electoral votes = House seats + 2 Senators\n• **538 total electoral votes** — need **270 to win**\n• 48 states use winner-take-all (the most votes in the state = all electoral votes)\n• Maine & Nebraska split by congressional district\n• If no one gets 270 → the House of Representatives picks the President\n\n🗓️ **Key Dates:**\n- Electors meet in December\n- Congress certifies in January\n\n💡 This is why candidates focus on swing states like Pennsylvania, Michigan, and Wisconsin.`
  },
  {
    keywords: ['election day', 'when', 'date', 'november', 'tuesday'],
    answer: `**Election Day** in the U.S. is always the **first Tuesday after the first Monday in November** in even-numbered years.\n\n📅 **Types of Elections:**\n- **Presidential Elections** — every 4 years (2024, 2028...)\n- **Midterm Elections** — 2 years after presidential elections (2026, 2030...)\n- **Primary Elections** — Spring of election year (varies by state)\n- **Local Elections** — Often in odd-numbered years\n\n🕐 **Poll Hours:** Typically 6 AM – 7 PM or 8 PM (varies by state). If you're in line when polls close, you **must be allowed to vote**.`
  },
  {
    keywords: ['mail', 'absentee', 'mail-in', 'mail in', 'ballot'],
    answer: `**Voting by Mail (Absentee Voting)** is available in most states. Here's what to know:\n\n✅ **States with universal mail voting:** California, Colorado, Hawaii, Oregon, Utah, Washington — all voters automatically receive mail ballots.\n\n📋 **For other states:**\n1. Request an absentee ballot (by a state deadline)\n2. Receive ballot by mail\n3. Fill it out carefully\n4. Return by mail OR in-person drop-off by the deadline\n\n🔍 **Track your ballot** using your state's online tracker.\n\n⚠️ **Important:** Return it on time! Many states don't count ballots received after Election Day, even if postmarked before.`
  },
  {
    keywords: ['primary', 'caucus', 'primaries', 'nomination'],
    answer: `**Primaries & Caucuses** determine each party's nominee for the general election.\n\n🗳️ **Primary Election** — A standard secret-ballot vote at a polling place. Held in most states.\n\n👥 **Caucus** — A public meeting where voters physically group by candidate and discuss. More time-intensive.\n\n**Types of Primaries:**\n- **Open:** Any registered voter can participate\n- **Closed:** Only registered party members can vote\n- **Semi-closed:** Party members + independents\n\n📅 **Timeline:** January–June of the election year\n- Iowa Caucuses (traditionally first)\n- New Hampshire Primary (first primary)\n- **Super Tuesday** — ~15 states vote on the same day\n\nThe candidate who accumulates enough **delegates** wins the nomination at the National Convention.`
  },
  {
    keywords: ['id', 'identification', 'photo id', 'voter id'],
    answer: `**Voter ID Requirements** vary significantly by state:\n\n📋 **States with strict photo ID laws:** Georgia, Indiana, Wisconsin, and others require a government-issued photo ID.\n\n📋 **States with flexible ID:** Some accept non-photo IDs (utility bill, bank statement) or allow you to sign an affidavit.\n\n📋 **No ID required:** Some states only verify your signature or name on the rolls.\n\n✅ **Acceptable photo IDs typically include:**\n- Driver's license or state ID\n- Passport\n- Military ID\n- Tribal ID\n\n💡 **If you don't have ID:** Ask your election office about alternatives — you usually can cast a provisional ballot and follow up later.`
  },
  {
    keywords: ['gerrymander', 'gerrymandering', 'district', 'redistricting'],
    answer: `**Gerrymandering** is the manipulation of electoral district boundaries for political advantage.\n\n🗺️ **How it works:**\n- After each Census (every 10 years), state legislatures redraw congressional districts\n- **Packing** — Cramming opposition voters into a few districts so they "waste" votes\n- **Cracking** — Splitting opposition voters across many districts so they're never a majority\n\n📊 **Why it matters:** It can allow a party to win more seats than their statewide vote share would suggest.\n\n⚖️ **Legal challenges:** The Supreme Court has ruled partisan gerrymandering is beyond federal court oversight (2019), but racial gerrymandering is unconstitutional. Some states use independent redistricting commissions to reduce bias.`
  },
  {
    keywords: ['tie', '269', 'house', 'contingent', 'no winner'],
    answer: `**What happens if there's an Electoral College tie (269–269)?**\n\n🏛️ The election goes to **Congress** under the **12th Amendment**:\n\n1. **House of Representatives** chooses the President\n   - Each **state delegation** gets ONE vote (not each member)\n   - Requires 26 state votes to win\n\n2. **Senate** chooses the Vice President\n   - Each Senator votes individually\n   - Requires 51 votes to win\n\n⚠️ This could result in a split result (President from one party, VP from another)!\n\n📅 This has happened twice in U.S. history: **1800** (Jefferson vs. Burr) and **1824** (John Quincy Adams selected by House).`
  },
  {
    keywords: ['swing state', 'battleground', 'purple state'],
    answer: `**Swing States (Battleground States)** are states where neither major party has a consistent, strong advantage — making them pivotal to winning elections.\n\n🗺️ **Key swing states include:**\n- Pennsylvania (19 electoral votes)\n- Michigan (15)\n- Wisconsin (10)\n- Arizona (11)\n- Georgia (16)\n- Nevada (6)\n- North Carolina (16)\n\n🎯 **Why they matter:** Because most states are reliably "red" or "blue," candidates focus enormous resources on swing states — rallies, ads, and ground game.\n\n💡 **The math:** A candidate can win the presidency while losing the popular vote if they win the right combination of swing states.`
  },
  {
    keywords: ['certified', 'certification', 'count', 'recount', 'results'],
    answer: `**From Votes Cast to Certified Results** — here's the process:\n\n1. **Election Night** — Media outlets project winners based on results, but it's NOT official yet\n2. **Counting Period** — Takes days to weeks; mail-in and provisional ballots are processed\n3. **Canvassing** — County officials review and tally all votes\n4. **State Certification** — Each state's election officials certify results (typically weeks after Election Day)\n5. **Electoral College Meets** — Mid-December, electors cast official votes\n6. **Congressional Certification** — January 6, Congress certifies the Electoral College results\n7. **Inauguration** — January 20, new president is sworn in\n\n🔍 **Recounts:** Triggered automatically in very close races (often within 0.5%) or can be requested by candidates.`
  },
  {
    keywords: ['campaign finance', 'fundraising', 'money', 'donation', 'pac', 'super pac'],
    answer: `**Campaign Finance** — How campaigns raise and spend money:\n\n💰 **Direct Contributions** (regulated by FEC):\n- Individuals can give up to $3,300 per candidate per election (2024 limits)\n- Political parties have higher limits\n\n🏢 **PACs (Political Action Committees):**\n- Collect contributions from members and donate to campaigns\n- Subject to contribution limits\n\n🌟 **Super PACs:**\n- Can raise UNLIMITED money from individuals, corporations, unions\n- Cannot directly coordinate with campaigns\n- Must disclose donors\n\n👻 **Dark Money:**\n- Nonprofits that don't disclose donors but can spend on political ads\n\n📊 Presidential campaigns can raise and spend hundreds of millions of dollars.`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'what can you', 'start'],
    answer: `Hello! 👋 Welcome to **ElectWise**, your interactive election guide!\n\nI can answer questions about:\n\n🗳️ **Voting & Registration** — How to register, voter ID, mail-in ballots\n📅 **Timelines & Dates** — When elections happen, key dates\n🏛️ **How It Works** — Electoral College, primaries, caucuses\n🗺️ **Key Concepts** — Swing states, gerrymandering, campaign finance\n📊 **Results & Certification** — How votes are counted and certified\n\nJust type your question and I'll do my best to help! Or click one of the suggestion buttons below.`
  }
];

function getFallbackAnswer(query) {
  const q = query.toLowerCase().trim();
  for (const entry of knowledge) {
    if (entry.keywords.some(kw => q.includes(kw))) {
      return entry.answer;
    }
  }
  return null;
}

/* ===== CHAT UI & API CALLS ===== */
const answerCache = new Map();

function markdownToHtml(md) {
  return md
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--accent)">$1</a>')
    .split('\n')
    .map(line => {
      if (line.startsWith('• ') || line.startsWith('- ')) return `<li>${line.slice(2)}</li>`;
      if (/^\d+\. /.test(line)) return `<li>${line.replace(/^\d+\. /, '')}</li>`;
      if (line.trim() === '') return '';
      return `<p>${line}</p>`;
    })
    .join('')
    .replace(/(<li>.*<\/li>)+/g, match => `<ul>${match}</ul>`);
}

function addMessage(text, role) {
  const container = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = `msg ${role}`;
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'bot' ? '🤖' : '👤';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  
  if (role === 'bot') {
    bubble.innerHTML = markdownToHtml(text);
  } else {
    // Escape user input heavily before placing in DOM
    bubble.textContent = text;
  }
  
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  container.appendChild(msg);
  
  // Accessibility: announce new bot messages
  if (role === 'bot') {
    container.setAttribute('aria-live', 'polite');
  }
  
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = 'msg bot typing-msg';
  msg.id = 'typingIndicator';
  msg.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

async function callGeminiAPI(query) {
  try {
    // Call the secure Vercel Serverless Function instead of Google directly
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    return data.answer || "I encountered an error formatting the response.";
  } catch (error) {
    console.error("Error calling secure backend:", error);
    return "I'm sorry, I encountered an error communicating with my secure backend. Ensure you have deployed the api/chat.js function and set the GEMINI_API_KEY environment variable in Vercel.";
  }
}

// Debounce state
let isWaiting = false;

async function sendMessage() {
  if (isWaiting) return;
  
  const input = document.getElementById('chatInput');
  const rawText = input.value;
  const sanitizedText = sanitizeInput(rawText.trim());
  
  if (!sanitizedText) return;
  
  input.value = '';
  addMessage(sanitizedText, 'user');
  trackEvent('chat_query', { query: sanitizedText.substring(0, 50) });
  
  showTyping();
  isWaiting = true;

  try {
    let answer;
    
    // Check Cache
    if (answerCache.has(sanitizedText.toLowerCase())) {
      answer = answerCache.get(sanitizedText.toLowerCase());
      // Simulate slight delay for cached answers to feel natural
      await new Promise(r => setTimeout(r, 400));
    } 
    else {
      // Check Static Knowledge Base
      let staticAnswer = getFallbackAnswer(sanitizedText);
      if (staticAnswer) {
        answer = staticAnswer;
        await new Promise(r => setTimeout(r, 600)); // simulate typing delay
      }
      // If no static answer, route to Vercel Backend
      else {
        answer = await callGeminiAPI(sanitizedText);
        if(!answer.includes("encountered an error")) {
           answerCache.set(sanitizedText.toLowerCase(), answer);
        }
      }
    }
    
    removeTyping();
    addMessage(answer, 'bot');
  } catch (err) {
    removeTyping();
    addMessage("Something went wrong processing your request.", 'bot');
  } finally {
    isWaiting = false;
  }
}

function sendSuggestion(btn) {
  document.getElementById('chatInput').value = btn.textContent;
  sendMessage();
}

document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMessage();
});

// Handle 'Continue without AI' logic
// Need to re-bind this since it's referenced in HTML via onclick but the function was missing
window.closeApiModal = function() {
  document.getElementById('apiKeyModal').classList.remove('active');
  sessionStorage.setItem('api_modal_dismissed', 'true');
};

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item, .step-item, .faq-item, .feature-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

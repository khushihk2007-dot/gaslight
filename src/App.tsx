import { useState, useEffect, useRef } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { 
  RotateCcw, 
  AlertCircle, 
  Heart
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

type BestieType = 'girly_pop' | 'bro' | null;

export default function App() {
  // Navigation & Bestie selection state
  const [page, setPage] = useState<'landing' | 'chat'>('landing');
  const [selectedBestie, setSelectedBestie] = useState<BestieType>(null);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  
  // Webhook URL configuration state
  const [webhookUrl, setWebhookUrl] = useState('YOUR_N8N_WEBHOOK_URL');
  const [showSettings, setShowSettings] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState('YOUR_N8N_WEBHOOK_URL');

  // DOM references
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Session ID & Load saved bestie choice
  useEffect(() => {
    // Generate unique session ID if not exists
    let activeSessionId = sessionStorage.getItem('gaslight_session_id');
    if (!activeSessionId) {
      activeSessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
      sessionStorage.setItem('gaslight_session_id', activeSessionId);
    }
    setSessionId(activeSessionId);

    // Load saved bestie from localStorage if available
    const savedBestie = localStorage.getItem('gaslight_saved_bestie') as BestieType;
    if (savedBestie === 'girly_pop' || savedBestie === 'bro') {
      setSelectedBestie(savedBestie);
    }

    // Load saved webhook URL if customized previously
    const savedWebhook = localStorage.getItem('gaslight_webhook_url');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
      setTempWebhookUrl(savedWebhook);
    }
  }, []);

  // Enforce Redirection Rule: If page is chat but no bestie selected, go back to landing
  useEffect(() => {
    if (page === 'chat' && !selectedBestie) {
      setPage('landing');
    }
  }, [page, selectedBestie]);

  // Handle auto-scroll to bottom of the chat feed
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Bestie selection
  const selectBestie = (type: 'girly_pop' | 'bro') => {
    setSelectedBestie(type);
    localStorage.setItem('gaslight_saved_bestie', type);
    setPage('chat');
  };

  // Handle Back to Page 1
  const goBack = () => {
    setPage('landing');
  };

  // Reset chat thread and session
  const resetSession = () => {
    if (window.confirm('Clear conversation and start a new reality check?')) {
      setMessages([]);
      const newSessionId = `sess_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
      sessionStorage.setItem('gaslight_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  };

  // Open Webhook URL Settings
  const openSettings = () => {
    setTempWebhookUrl(webhookUrl);
    setShowSettings(true);
  };

  // Save custom Webhook URL
  const saveSettings = () => {
    setWebhookUrl(tempWebhookUrl);
    localStorage.setItem('gaslight_webhook_url', tempWebhookUrl);
    setShowSettings(false);
  };

  // Generate responsive mock replies for preview when webhook is placeholder
  const getMockResponse = (userMsg: string, bestie: 'girly_pop' | 'bro'): string => {
    const text = userMsg.toLowerCase();
    
    const hasLying = text.includes('lie') || text.includes('lying') || text.includes('cheat') || text.includes('secret') || text.includes('hid');
    const hasIgnore = text.includes('ignore') || text.includes('ignoring') || text.includes('reply') || text.includes('ghost');
    const hasAnger = text.includes('mad') || text.includes('angry') || text.includes('yell') || text.includes('scream') || text.includes('fight');
    const hasCrazy = text.includes('crazy') || text.includes('overreact') || text.includes('dramatic') || text.includes('paranoid');

    if (bestie === 'girly_pop') {
      if (hasLying) {
        return "OMG babe... 🚩 LITERALLY RUN. He lied to you, and then had the audacity to make you feel like YOU were the issue for catching him? That is textbook gaslighting, queen. 💅 He's trying to flip the script because he's embarrassed he got caught. You are not crazy, your feelings are 100% valid! Drop him immediately. 😤💖";
      }
      if (hasIgnore) {
        return "Ugh, the silent treatment? Seriously? 🙄 That is so childish and toxic! He is ignoring you to gain power and make you beg for his attention. Do NOT text him again. Let him sit in his own silence while you go live your best life. You are a prize, never forget that! 👑✨";
      }
      if (hasCrazy) {
        return "Wait, hold up... 🙅‍♀️ Calling you 'crazy' or 'too sensitive' is literally Gaslighting 101! He is trying to make you doubt your own sanity so he can do whatever he wants without consequences. You are NOT overreacting. Trust your gut, sister, because it is spot on! 💖🔥";
      }
      if (hasAnger) {
        return "Whoa, raising his voice and getting super defensive? Big yikes! 😳 That is a massive deflection tactic. He's turning it into a fight about *how* you brought it up rather than *what* he actually did. Stay strong, babe, don't let him intimidate you! 🚩💁‍♀️";
      }
      return "Babe, I am listening and let me tell you: that is NOT how someone who loves you is supposed to make you feel! 🥺 It sounds like he's trying to manipulate the situation to protect his own ego. You deserve someone who communicates like a mature adult, not someone who plays mind games. I'm in your corner! 💖💅";
    } else {
      // The Bro Persona
      if (hasLying) {
        return "Look, let's analyze the facts here. You caught him in a lie. That's a breach of trust. Instead of owning up to it, he's telling you that you're overreacting. That's a classic defense mechanism to avoid accountability. Trust is binary, bro. Don't let him rewrite the facts of what happened. Keep your head clear.";
      }
      if (hasIgnore) {
        return "Ignorance is a power play. When someone ghosts or ignores you during a disagreement, they are trying to dictate the terms of your communication. It's control, plain and simple. Let's look at it objectively: a mature partner talks through issues. Stay calm, don't double text, and see if he's willing to act like an adult when he cools down.";
      }
      if (hasCrazy) {
        return "Here's the logical breakdown: by calling you 'dramatic' or 'paranoid', he is shifting the focus from his actions to your reaction. It's a smoke screen. Your response is standard for someone who was misled. Stick to the timeline and the hard evidence. Don't let his emotional outbursts make you question your own memory. Stay grounded.";
      }
      if (hasAnger) {
        return "Defensiveness and anger are usually covers for guilt. When you bring up a valid concern and it leads to an explosion, it's meant to shut down the discussion. Let's look at the facts: you asked a question, he reacted with aggression. That's not a healthy resolution strategy. Stand your ground, but don't match his volume.";
      }
      return "Let's look at this objectively. A healthy relationship is built on mutual respect and open communication. If you explain a situation and their immediate response is to minimize your feelings or shift the blame, that's redirection. Your emotions are valid, but keep your response logical. Don't let them bait you into an argument where you lose your composure.";
    }
  };

  // Send message handler
  const handleSendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping || !selectedBestie) return;

    const userMessageContent = inputText.trim();
    
    // Add user message to list
    const newUserMessage: Message = {
      id: `msg_${Date.now()}_u`,
      sender: 'user',
      text: userMessageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    // Focus input field again if on desktop
    if (inputRef.current) {
      inputRef.current.focus();
    }

    try {
      if (webhookUrl === 'YOUR_N8N_WEBHOOK_URL') {
        // Simulate premium typing delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        const responseText = getMockResponse(userMessageContent, selectedBestie);
        const newAiMessage: Message = {
          id: `msg_${Date.now()}_ai`,
          sender: 'ai',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAiMessage]);
      } else {
        // Send request to actual webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessageContent,
            persona: selectedBestie,
            sessionId: sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        
        let responseText = '';
        if (data && data.data && typeof data.data.output === 'string') {
          responseText = data.data.output;
        } else if (data && typeof data.output === 'string') {
          responseText = data.output;
        } else if (typeof data === 'string') {
          responseText = data;
        } else {
          responseText = data?.message || data?.text || JSON.stringify(data);
        }

        const newAiMessage: Message = {
          id: `msg_${Date.now()}_ai`,
          sender: 'ai',
          text: responseText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAiMessage]);
      }
    } catch (err) {
      console.error('Webhook error:', err);
      const errorText = selectedBestie === 'girly_pop'
        ? "OMG babe, something went wrong! 😭 I tried to reach my AI brain but the connection dropped. Make sure your webhook URL is working and try again! 💔"
        : "Connection error, bro. The server at the webhook URL is currently unreachable. Make sure the backend is active and configured correctly.";
      
      const newErrorMessage: Message = {
        id: `msg_${Date.now()}_err`,
        sender: 'ai',
        text: errorText,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, newErrorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Listen to keyboard Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`app-wrapper ${selectedBestie ? `theme-${selectedBestie}` : ''}`}>
      {/* GLOBAL HEADER BAR */}
      <header className="global-header">
        <div className="header-brand">
          <Heart size={16} className="brand-icon" />
          <span>REALITY CHECK PROTOCOL</span>
        </div>
        <div className="header-status">
          <span>v1.4.0</span>
          <span className="status-separator">•</span>
          <button className="status-indicator-btn" onClick={openSettings}>
            <span className={`status-dot ${webhookUrl === 'YOUR_N8N_WEBHOOK_URL' ? 'demo' : 'connected'}`}></span>
            {webhookUrl === 'YOUR_N8N_WEBHOOK_URL' ? 'Demo Mode' : 'n8n Connected'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {page === 'landing' ? (
          /* ==================== PAGE 1 — PICK YOUR BESTIE ==================== */
          <div className="landing-layout fade-in">
            {/* Left Column: Bold Editorial Typography */}
            <div className="landing-left">
              <span className="editorial-step">01. PICK YOUR BESTIE</span>
              <h1 className="editorial-title">
                IS IT<br />GASLIGHTING?
              </h1>
              <p className="editorial-lead">
                Relationships are hard. Spotting toxic mind games is harder. Choose the energy you need right now to run a factual reality check.
              </p>
            </div>

            {/* Right Column: Grid of Cards */}
            <div className="landing-right">
              <div className="bestie-grid">
                {/* GIRLY POP CARD */}
                <div 
                  className="bestie-card girly-pop-card"
                  onClick={() => selectBestie('girly_pop')}
                >
                  <div className="card-badge badge-pink">HIGH ENERGY</div>
                  <h3 className="card-name">
                    GIRLY POP <span className="emoji-space">🌸</span>
                  </h3>
                  <div className="card-subtitle pink-text">YOUR SUPPORTIVE, HIGH-ENERGY HYPE WOMAN</div>
                  <p className="card-description">
                    Your protective soul sister. Gen Z slang, validating vibes, and zero tolerance for toxic nonsense. She's got your back, bestie. ✨
                  </p>
                  <button className="card-link pink-text">
                    CHOOSE GIRLY POP &rarr;
                  </button>
                </div>

                {/* THE BRO CARD */}
                <div 
                  className="bestie-card bro-card"
                  onClick={() => selectBestie('bro')}
                >
                  <div className="card-badge badge-green">LOGICAL</div>
                  <h3 className="card-name">
                    THE BRO <span className="emoji-space">👊</span>
                  </h3>
                  <div className="card-subtitle green-text">YOUR CALM, LOGICAL OLDER BROTHER</div>
                  <p className="card-description">
                    The grounded older brother. Direct, factual, and calm. He'll help you look at the evidence objectively without losing your cool. Real talk only.
                  </p>
                  <button className="card-link green-text">
                    CHOOSE THE BRO &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================== PAGE 2 — CHAT WITH YOUR BESTIE ==================== */
          <div className="chat-layout fade-in">
            <div className="chat-panel">
              {/* Chat Panel Header */}
              <div className="panel-header">
                <button className="panel-back-btn" onClick={goBack}>
                  &larr; BACK TO SELECTION
                </button>
                <div className="panel-title-wrapper">
                  <span className="panel-emoji">
                    {selectedBestie === 'girly_pop' ? '🌸' : '👊'}
                  </span>
                  <span className="panel-title">
                    CHATTING WITH {selectedBestie === 'girly_pop' ? 'GIRLY POP' : 'THE BRO'}
                  </span>
                </div>
                <button className="panel-reset-btn" onClick={resetSession} title="Clear Chat">
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Chat Panel Feed */}
              <div className="panel-feed" ref={chatFeedRef}>
                {messages.length === 0 ? (
                  <div className="panel-watermark">
                    START TYPING BELOW TO RUN REALITY CHECK
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`message-row ${msg.sender === 'user' ? 'user-row' : msg.isError ? 'error-row' : 'ai-row'}`}
                    >
                      <div className="chat-bubble">
                        {msg.isError && <AlertCircle size={16} className="error-icon" />}
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="message-row ai-row">
                    <div className="typing-bubble">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Panel Input */}
              <div className="panel-footer">
                <form onSubmit={handleSendMessage} className="panel-input-container">
                  <textarea
                    ref={inputRef}
                    className="panel-input"
                    placeholder="Describe the situation..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button 
                    type="submit" 
                    className="panel-send-btn" 
                    disabled={!inputText.trim() || isTyping}
                  >
                    SEND
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="global-footer">
        Is It Gaslighting &copy; 2026. Made with Google AI Studio.
      </footer>

      {/* ==================== SETTINGS MODAL ==================== */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-card">
            <h3 className="settings-title">Configure Backend</h3>
            <p className="settings-desc">
              Connect this app to your n8n workflow or backend webhook URL. The app sends a POST request with the user's message, selected persona, and sessionId.
            </p>
            
            <div className="settings-input-group">
              <label className="settings-label">Webhook Endpoint URL</label>
              <input 
                type="text" 
                className="settings-input" 
                value={tempWebhookUrl} 
                onChange={(e) => setTempWebhookUrl(e.target.value)}
                placeholder="https://your-n8n-instance/webhook/..."
              />
            </div>

            <div className="settings-actions">
              <button className="settings-btn cancel" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
              <button className="settings-btn save" onClick={saveSettings}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

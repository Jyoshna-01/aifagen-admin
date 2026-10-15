import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
  X,
} from "lucide-react";
import {
  answerPageQuestion,
  buildPageBriefing,
  buildPageContext,
} from "../services/pageContextService";
import "./AIAssistant.css";

export function AIButton({ onClick, expanded }) {
  return (
    <button
      type="button"
      className={`assistant-fab ${expanded ? "assistant-fab-open" : ""}`}
      onClick={onClick}
      aria-label={expanded ? "Close AI assistant" : "Open AI assistant"}
      aria-expanded={expanded}
      title="Voice briefing demo"
    >
      <Sparkles size={21} aria-hidden="true" />
      <span>AI</span>
    </button>
  );
}

function AIMessage({ message, onSpeak }) {
  return (
    <div className={`assistant-message assistant-message-${message.role}`}>
      <p>{message.text}</p>
      {message.role === "assistant" && (
        <button
          type="button"
          className="assistant-speak-answer"
          onClick={() => onSpeak(message.text)}
          aria-label="Speak this answer"
        >
          <Volume2 size={15} />
          <span>Speak answer</span>
        </button>
      )}
    </div>
  );
}

function AIQuickQuestions({ questions, onAsk }) {
  return (
    <div className="assistant-quick-questions" aria-label="Suggested questions">
      {questions.slice(0, 2).map((question) => (
        <button type="button" key={question} onClick={() => onAsk(question)}>
          {question}
        </button>
      ))}
    </div>
  );
}

function currentCaption(text, charIndex) {
  if (charIndex < 0) return text;
  const sentenceStart = Math.max(
    text.lastIndexOf(". ", charIndex),
    text.lastIndexOf("? ", charIndex),
    text.lastIndexOf("! ", charIndex)
  );
  const sentenceEndCandidates = [
    text.indexOf(". ", charIndex),
    text.indexOf("? ", charIndex),
    text.indexOf("! ", charIndex),
  ].filter((index) => index >= 0);
  const sentenceEnd = sentenceEndCandidates.length
    ? Math.min(...sentenceEndCandidates) + 1
    : text.length;
  return text.slice(sentenceStart < 0 ? 0 : sentenceStart + 2, sentenceEnd).trim();
}

export default function AIAssistantPanel({
  pageId,
  title,
  snapshot,
  open,
  onClose,
}) {
  const context = useMemo(
    () =>
      buildPageContext({
        pageId,
        title,
        data: snapshot?.data,
        status: snapshot?.status || "loading",
        error: snapshot?.error,
      }),
    [pageId, title, snapshot]
  );
  const briefing = useMemo(() => buildPageBriefing(context), [context]);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [speechState, setSpeechState] = useState("idle");
  const [speechError, setSpeechError] = useState("");
  const [caption, setCaption] = useState("");
  const [speechKind, setSpeechKind] = useState("briefing");
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [speechVoicesAvailable, setSpeechVoicesAvailable] = useState(false);
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const inputRef = useRef(null);
  const utteranceRef = useRef(null);
  const recognitionRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const askRef = useRef(null);

  onCloseRef.current = onClose;

  const cancelSpeech = useCallback(() => {
    if (utteranceRef.current) {
      utteranceRef.current.onstart = null;
      utteranceRef.current.onboundary = null;
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  const speak = useCallback((text, kind = "briefing") => {
    if (typeof window === "undefined" || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setSpeechAvailable(false);
      setSpeechError("Speech output is not supported in this browser. The briefing captions are still available.");
      setSpeechState("error");
      setCaption(text);
      return;
    }

    const synthesis = window.speechSynthesis;
    const voices = synthesis.getVoices();
    if (!voices.length) {
      setSpeechVoicesAvailable(false);
      setSpeechError("No browser speech voice is available right now. Captions remain available; try again after voices load.");
      setSpeechState("error");
      setCaption(text);
      return;
    }

    cancelSpeech();
    setSpeechError("");
    setCaption(text);
    setSpeechKind(kind);
    setSpeechState("speaking");
    const utterance = new window.SpeechSynthesisUtterance(text);
    const englishVoice = voices.find((voice) => /^en([_-]|$)/i.test(voice.lang));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.lang = englishVoice?.lang || "en-US";
    utterance.rate = 1;
    utterance.onstart = () => setSpeechState("speaking");
    utterance.onboundary = (event) => {
      if (typeof event.charIndex === "number") {
        setCaption(currentCaption(text, event.charIndex));
      }
    };
    utterance.onend = () => {
      utteranceRef.current = null;
      setCaption(text);
      setSpeechState("completed");
    };
    utterance.onerror = (event) => {
      utteranceRef.current = null;
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setSpeechError("Speech playback failed. You can still read the briefing captions.");
        setSpeechState("error");
      }
    };
    utteranceRef.current = utterance;
    synthesis.speak(utterance);
  }, [cancelSpeech]);

  const ask = useCallback((value) => {
    const prompt = value.trim();
    if (!prompt) return;
    stopRecognition();
    setMessages((previous) => [...previous, { role: "user", text: prompt }]);
    setQuestion("");
    setVoiceError("");
    setSpeechError("");
    const answer = answerPageQuestion(context, prompt);
    setMessages((previous) => [...previous, { role: "assistant", text: answer }]);
  }, [context, stopRecognition]);
  askRef.current = ask;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const synthesis = window.speechSynthesis;
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    setSpeechAvailable(Boolean(synthesis && window.SpeechSynthesisUtterance));
    setRecognitionAvailable(Boolean(Recognition));
    if (!synthesis) return undefined;

    const updateVoices = () => {
      const available = synthesis.getVoices().length > 0;
      setSpeechVoicesAvailable(available);
      if (available) {
        setSpeechError((previous) =>
          previous.startsWith("No browser speech voice") ? "" : previous
        );
      }
    };
    updateVoices();
    synthesis.addEventListener?.("voiceschanged", updateVoices);
    synthesis.onvoiceschanged = updateVoices;
    return () => {
      synthesis.removeEventListener?.("voiceschanged", updateVoices);
      if (synthesis.onvoiceschanged === updateVoices) synthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    cancelSpeech();
    stopRecognition();
    setSpeechState("idle");
    setCaption("");
    setSpeechError("");
    setVoiceError("");
    setMessages([]);
    setQuestion("");
  }, [open, pageId, title, snapshot, cancelSpeech, stopRecognition]);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCloseRef.current?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(
    () => () => {
      cancelSpeech();
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
        recognitionRef.current = null;
      }
    },
    [cancelSpeech]
  );

  const playBriefing = () => speak(briefing);
  const pauseOrResume = () => {
    const synthesis = window.speechSynthesis;
    if (speechState === "paused") {
      synthesis.resume();
      setSpeechState("speaking");
    } else if (speechState === "speaking") {
      synthesis.pause();
      setSpeechState("paused");
    }
  };
  const stopPlayback = () => {
    cancelSpeech();
    setSpeechState("idle");
    setCaption("");
  };
  const replay = () => speak(briefing);

  const startVoiceQuestion = () => {
    const Recognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!Recognition) {
      setVoiceError("Voice input is not supported in this browser. Type your question instead.");
      return;
    }
    stopRecognition();
    setVoiceError("");
    try {
      const recognition = new Recognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();
        if (transcript) {
          setQuestion(transcript);
          askRef.current?.(transcript);
        }
      };
      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceError("Microphone permission was denied. Allow microphone access or type your question.");
        } else if (event.error === "no-speech") {
          setVoiceError("No speech was detected. Try again or type your question.");
        } else {
          setVoiceError("Voice input is unavailable right now. Type your question instead.");
        }
        setListening(false);
      };
      recognition.onend = () => {
        recognitionRef.current = null;
        setListening(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      setListening(false);
      setVoiceError("The microphone could not start. Check browser permission or type your question.");
    }
  };

  if (!open) return null;

  const isSpeaking = speechState === "speaking";
  const playDisabled = context.status === "loading";
  return (
    <aside id="ai-assistant-panel" className="assistant-panel" aria-label="Voice briefing demo">
      <header className="assistant-header">
        <div className="assistant-heading-icon"><Sparkles size={19} /></div>
        <div>
          <p>VOICE BRIEFING DEMO · RULE-BASED</p>
          <h2>{title || "Current page"}</h2>
        </div>
        <button type="button" className="assistant-close" onClick={onClose} aria-label="Close assistant"><X size={19} /></button>
      </header>

      <div className="assistant-body">
        <div className={`assistant-voice-card ${isSpeaking ? "is-speaking" : ""}`}>
          <div className="assistant-voice-card-top">
            <div className="assistant-wave" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
            </div>
            <div>
              <span className="assistant-page-name">{title || "Current page"}</span>
              <span className="assistant-speech-status" role="status">
                {speechState === "speaking" ? `Speaking ${speechKind}` :
                  speechState === "paused" ? `${speechKind[0].toUpperCase()}${speechKind.slice(1)} paused` :
                    speechState === "completed" ? `${speechKind[0].toUpperCase()}${speechKind.slice(1)} complete` :
                      context.status === "loading" ? "Loading page context" :
                        context.status === "error" ? "Page context unavailable" : "Briefing ready"}
              </span>
            </div>
          </div>

          <p className={`assistant-captions ${isSpeaking ? "caption-active" : ""}`} aria-live="polite">
            {caption || briefing}
          </p>
          {speechError && <p className="assistant-voice-notice" role="status">{speechError}</p>}
          {!speechAvailable && <p className="assistant-voice-notice">Speech output is not supported here. Read the briefing below; voice questions are available only in supported browsers.</p>}
          {speechAvailable && !speechVoicesAvailable && <p className="assistant-voice-notice">Waiting for a browser voice. Captions remain available.</p>}

          <div className="assistant-playback-controls" aria-label="Briefing playback controls">
            <button type="button" className="assistant-play-button" onClick={playBriefing} disabled={playDisabled} aria-label="Play briefing">
              <Play size={16} fill="currentColor" /> <span>Play briefing</span>
            </button>
            <button type="button" onClick={pauseOrResume} disabled={!["speaking", "paused"].includes(speechState)} aria-label={speechState === "paused" ? "Resume speech" : "Pause speech"}>
              {speechState === "paused" ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button type="button" onClick={stopPlayback} disabled={!["speaking", "paused"].includes(speechState)} aria-label="Stop speech"><Square size={15} /></button>
            <button type="button" onClick={replay} disabled={playDisabled} aria-label="Replay briefing"><RotateCcw size={16} /></button>
          </div>
          <button type="button" className="assistant-brief-again" onClick={playBriefing} disabled={playDisabled}>
            Brief this page again
          </button>
        </div>

        <div className="assistant-context-line">
          <strong>{context.description}</strong>
          <p>{context.status === "loading" ? "Page data is loading." : context.summary}</p>
        </div>

        <section className="assistant-question-area" aria-label="Ask about this page">
          <h3>Ask about this page</h3>
          <AIQuickQuestions questions={context.questions} onAsk={ask} />
          <form className="assistant-compose" onSubmit={(event) => { event.preventDefault(); ask(question); }}>
            <label className="sr-only" htmlFor="assistant-question">Type a question about this page</label>
            <input id="assistant-question" ref={inputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question…" autoComplete="off" />
            <button type="button" className={`assistant-mic-button ${listening ? "is-listening" : ""}`} onClick={startVoiceQuestion} aria-label={listening ? "Listening for question" : "Ask a question by voice"} disabled={!recognitionAvailable || listening}>
              <Mic size={17} />
            </button>
            <button type="submit" aria-label="Send typed question" disabled={!question.trim()}><ArrowUp size={18} /></button>
          </form>
          {listening && <p className="assistant-voice-notice" role="status">Listening… Speak your question.</p>}
          {voiceError && <p className="assistant-voice-notice" role="status">{voiceError}</p>}
          {!recognitionAvailable && <p className="assistant-microphone-note">Voice questions are not supported in this browser; typing works instead.</p>}
          {messages.length > 0 && (
            <section className="assistant-conversation" aria-label="Question answers">
              {messages.map((message, index) => (
                <AIMessage
                  key={`${index}-${message.role}`}
                  message={message}
                  onSpeak={(text) => speak(text, "answer")}
                />
              ))}
            </section>
          )}
        </section>
      </div>
      <p className="assistant-footer">Local rule-based demo. No external AI service or private-data transfer.</p>
    </aside>
  );
}

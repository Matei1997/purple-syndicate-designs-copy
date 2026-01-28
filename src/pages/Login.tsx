import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/login.css";

type LogLine = {
  time: string;
  message: string;
  level?: "warning" | "error" | "success";
};

const BOOT_LINES: LogLine[] = [
  { time: "10:42:01", message: "[SYS] Initializing handshake protocol..." },
  { time: "10:42:02", message: "[NET] Node connection established (24ms)" },
  { time: "10:42:05", message: "[SEC] Pre-auth check: IDENTITY_HIDDEN", level: "warning" },
  { time: "10:42:05", message: "[SYS] Waiting for operator credentials..." },
  { time: "10:42:15", message: "[NET] Packet verify: OK" },
  { time: "10:42:30", message: "[SYS] Session keep-alive sent" },
];

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export default function Login() {
  const navigate = useNavigate();
  const [operatorId, setOperatorId] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [extraLines, setExtraLines] = useState<LogLine[]>([]);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (typingIndex >= BOOT_LINES.length) {
      return;
    }

    const currentLine = BOOT_LINES[typingIndex];
    if (typedChars < currentLine.message.length) {
      const timeout = window.setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, 18);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setTypingIndex((prev) => prev + 1);
      setTypedChars(0);
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [typingIndex, typedChars]);

  const terminalLines = useMemo(() => {
    const lines: { key: string; line: LogLine; typedMessage?: string }[] = [];
    BOOT_LINES.forEach((line, index) => {
      if (index < typingIndex) {
        lines.push({ key: `boot-${index}`, line });
        return;
      }

      if (index === typingIndex) {
        lines.push({
          key: `boot-${index}`,
          line,
          typedMessage: line.message.slice(0, typedChars),
        });
      }
    });

    extraLines.forEach((line, index) => {
      lines.push({ key: `extra-${index}`, line });
    });

    return lines;
  }, [typingIndex, typedChars, extraLines]);

  const promptActive = typingIndex >= BOOT_LINES.length && !isAuthenticating && !isRedirecting;

  const handleAuthenticate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!operatorId.trim() || !securityKey.trim() || isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    const now = new Date();
    setExtraLines((prev) => [
      ...prev,
      {
        time: formatTime(now),
        message: `[GATE] Input received: ${operatorId.toUpperCase()} ••••••`,
      },
    ]);

    window.setTimeout(() => {
      setExtraLines((prev) => [
        ...prev,
        {
          time: formatTime(new Date()),
          message: "[AUTH] Verifying key signature...",
        },
      ]);
    }, 500);

    window.setTimeout(() => {
      setExtraLines((prev) => [
        ...prev,
        {
          time: formatTime(new Date()),
          message: "[AUTH] Access granted. Redirecting to armory...",
          level: "success",
        },
      ]);
      setIsRedirecting(true);
    }, 1200);

    window.setTimeout(() => {
      navigate("/armory");
    }, 2200);
  };

  return (
    <div className="login-export">
      <div className="gateway-container">
        <div className="scanline" aria-hidden="true" />
        <div className="auth-panel">
          <div className="corner-mark tl" />
          <div className="corner-mark bl" />

          <div className="auth-header">
            <div className="system-badge">
              <span className="icon">🛡️</span>
              Secure Gateway v4.0
            </div>
            <h1 className="auth-title">System Access</h1>
            <p className="auth-subtitle">
              Enter secure credentials to establish session.
            </p>
          </div>

          <form onSubmit={handleAuthenticate}>
            <div className="form-group">
              <label className="form-label" htmlFor="operator-id">
                Operator ID
              </label>
              <div className="input-wrapper">
                <div className="input-icon">👤</div>
                <input
                  id="operator-id"
                  type="text"
                  className="form-input"
                  placeholder="OP-XXXX-XX"
                  autoComplete="off"
                  value={operatorId}
                  onChange={(event) => setOperatorId(event.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="security-key">
                Security Key
              </label>
              <div className="input-wrapper">
                <div className="input-icon">🔑</div>
                <input
                  id="security-key"
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••••••"
                  autoComplete="off"
                  value={securityKey}
                  onChange={(event) => setSecurityKey(event.target.value)}
                />
              </div>
            </div>

            <button className="btn-auth" type="submit" disabled={isAuthenticating}>
              {isAuthenticating ? "Authenticating..." : "Authenticate Session"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="auth-footer">
            <span>NODE: EU-WEST-4</span>
            <div className="secure-badge">
              <span aria-hidden="true">🔒</span>
              TLS 1.3 ENCRYPTED
            </div>
          </div>
        </div>

        <div className="feed-panel">
          <div className="corner-mark tr" />
          <div className="corner-mark br" />

          <div className="feed-header">
            <span className="feed-title">Live Diagnostic Feed</span>
            <div className="live-indicator">
              <span className="blink-dot" aria-hidden="true" />
              Active
            </div>
          </div>

          <div className="terminal-content" aria-live="polite">
            {terminalLines.map(({ key, line, typedMessage }) => (
              <div
                className={`log-line${line.level ? ` ${line.level}` : ""}`}
                key={key}
              >
                <span className="log-time">{line.time}</span>
                <span
                  className={`log-msg${line.level ? ` ${line.level}` : ""}`}
                >
                  {typedMessage ?? line.message}
                  {typedMessage !== undefined && typedMessage.length < line.message.length ? (
                    <span className="cursor" aria-hidden="true" />
                  ) : null}
                </span>
              </div>
            ))}

            {promptActive ? (
              <div className="log-line active">
                <span className="log-time">{formatTime(new Date())}</span>
                <span className="log-msg">
                  [GATE] Awaiting input<span className="cursor" aria-hidden="true" />
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

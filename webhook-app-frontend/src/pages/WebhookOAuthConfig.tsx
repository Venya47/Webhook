import { useState } from "react";

/* ─── Types ─── */
interface HeaderRow { id: number; key: string; value: string; }
interface PayloadRow { id: number; key: string; value: string; }

interface TokenConfig {
  method: string;
  url: string;
  headers: HeaderRow[];
  payloads: PayloadRow[];
  responseTokenKey: string;
  expiryMode: "response" | "manual";
  expiryKey: string;
  dateFormat: string;
  expiryBoundInJWT: boolean;
  refreshTokenKey: string;
}

const defaultConfig = (): TokenConfig => ({
  method: "POST",
  url: "",
  headers: [],
  payloads: [],
  responseTokenKey: "",
  expiryMode: "response",
  expiryKey: "",
  dateFormat: "UNIX",
  expiryBoundInJWT: false,
  refreshTokenKey: "",
});

let nextId = 1;
const uid = () => nextId++;

/* ─── Sub-components ─── */

function Select({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; }) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.floatLabel}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={s.select}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <span style={s.chevron}>▾</span>
    </div>
  );
}

function TextInput({
  label, value, onChange, placeholder, required,
}: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; }) {
  return (
    <div style={s.fieldWrap}>
      {label && <label style={s.floatLabel}>{label}{required && " *"}</label>}
      <input
        style={s.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
      />
    </div>
  );
}

function UrlField({
  value, onChange,
}: { value: string; onChange: (v: string) => void; }) {
  return (
    <div style={{ ...s.fieldWrap, flex: 1 }}>
      <div style={s.urlRow}>
        <span style={s.urlScheme}>https://</span>
        <input
          style={{ ...s.input, borderLeft: "none", borderRadius: "0 6px 6px 0", paddingLeft: 10 }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL"
        />
      </div>
      <p style={s.hint}>Ex: https://www.google.com</p>
    </div>
  );
}

function KeyValueRows({
  rows, onChange, onAdd, onDelete, label,
}: {
  rows: HeaderRow[] | PayloadRow[];
  onChange: (id: number, field: "key" | "value", val: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  label: string;
}) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardTitle}>{label}</span>
        <button style={s.addBtn} onClick={onAdd}>+ Add {label.split(" ")[1]}</button>
      </div>
      {rows.length > 0 && (
        <div style={{ padding: "16px 20px 4px" }}>
          {rows.map(row => (
            <div key={row.id} style={s.kvRow}>
              <div style={{ flex: 1 }}>
                <TextInput label="Key" value={row.key} onChange={v => onChange(row.id, "key", v)} required />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput label="Value" value={row.value} onChange={v => onChange(row.id, "value", v)} required />
              </div>
              <button style={s.deleteBtn} onClick={() => onDelete(row.id)} title="Delete">
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResponseSection({
  config, onChange,
}: {
  config: TokenConfig;
  onChange: (partial: Partial<TokenConfig>) => void;
}) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={s.cardTitle}>Response</span>
        <span style={s.infoIcon} title="Configure how to extract tokens from the response">ⓘ</span>
      </div>
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Access Token */}
        <div>
          <p style={s.subLabel}>Access Token</p>
          <TextInput
            value={config.responseTokenKey}
            onChange={v => onChange({ responseTokenKey: v })}
            placeholder="Token Key *"
          />
        </div>

        {/* Access Expiry */}
        <div>
          <p style={s.subLabel}>Access Expiry</p>
          <div style={s.tabGroup}>
            <button
              style={{ ...s.tabBtn, ...(config.expiryMode === "response" ? s.tabBtnActive : {}) }}
              onClick={() => onChange({ expiryMode: "response" })}
            >
              Get from Response
            </button>
            <button
              style={{ ...s.tabBtn, ...(config.expiryMode === "manual" ? s.tabBtnActive : {}) }}
              onClick={() => onChange({ expiryMode: "manual" })}
            >
              Set Manually
            </button>
          </div>

          {config.expiryMode === "response" && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <TextInput
                  value={config.expiryKey}
                  onChange={v => onChange({ expiryKey: v })}
                  placeholder="Expiry Key *"
                />
              </div>
              <div style={{ flex: 1, minWidth: 160 }}>
                <Select
                  label="Date Format"
                  value={config.dateFormat}
                  onChange={v => onChange({ dateFormat: v })}
                  options={["UNIX", "ISO 8601", "RFC 2822", "Milliseconds"]}
                />
              </div>
              <label style={s.checkLabel}>
                <input
                  type="checkbox"
                  checked={config.expiryBoundInJWT}
                  onChange={e => onChange({ expiryBoundInJWT: e.target.checked })}
                  style={s.checkbox}
                />
                <span>Expiry bound in JWT</span>
              </label>
            </div>
          )}

          {config.expiryMode === "manual" && (
            <div style={{ marginTop: 12 }}>
              <TextInput
                value={config.expiryKey}
                onChange={v => onChange({ expiryKey: v })}
                placeholder="Expiry value in seconds *"
              />
            </div>
          )}
        </div>

        {/* Refresh Token */}
        <div>
          <p style={s.subLabel}>Refresh Token</p>
          <TextInput
            value={config.refreshTokenKey}
            onChange={v => onChange({ refreshTokenKey: v })}
            placeholder="Token Key"
          />
        </div>
      </div>
    </div>
  );
}

function TokenConfigSection({
  title, config, onChange, showCopyFromAccess, onCopyFromAccess,
}: {
  title: string;
  config: TokenConfig;
  onChange: (partial: Partial<TokenConfig>) => void;
  showCopyFromAccess?: boolean;
  onCopyFromAccess?: () => void;
}) {
  const updateHeader = (id: number, field: "key" | "value", val: string) =>
    onChange({ headers: config.headers.map(h => h.id === id ? { ...h, [field]: val } : h) });
  const addHeader = () =>
    onChange({ headers: [...config.headers, { id: uid(), key: "", value: "" }] });
  const deleteHeader = (id: number) =>
    onChange({ headers: config.headers.filter(h => h.id !== id) });

  const updatePayload = (id: number, field: "key" | "value", val: string) =>
    onChange({ payloads: config.payloads.map(p => p.id === id ? { ...p, [field]: val } : p) });
  const addPayload = () =>
    onChange({ payloads: [...config.payloads, { id: uid(), key: "", value: "" }] });
  const deletePayload = (id: number) =>
    onChange({ payloads: config.payloads.filter(p => p.id !== id) });

  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>{title}</h3>
        {showCopyFromAccess && (
          <button style={s.copyBtn} onClick={onCopyFromAccess}>
            Copy from Access Token
          </button>
        )}
      </div>

      {/* Method + URL */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{ width: 160, flexShrink: 0 }}>
          <Select
            label="Method *"
            value={config.method}
            onChange={v => onChange({ method: v })}
            options={["POST", "GET", "PUT", "PATCH"]}
          />
        </div>
        <UrlField value={config.url} onChange={v => onChange({ url: v })} />
      </div>

      <KeyValueRows
        rows={config.headers}
        onChange={updateHeader}
        onAdd={addHeader}
        onDelete={deleteHeader}
        label="Custom Header"
      />

      <KeyValueRows
        rows={config.payloads}
        onChange={updatePayload}
        onAdd={addPayload}
        onDelete={deletePayload}
        label="Custom Payload"
      />

      <ResponseSection config={config} onChange={onChange} />
    </div>
  );
}

/* ─── Main Component ─── */
export default function WebhookOAuthConfig() {
  const [authType, setAuthType] = useState("No Auth");
  const [useRefreshToken, setUseRefreshToken] = useState(true);
  const [accessConfig, setAccessConfig] = useState<TokenConfig>(defaultConfig);
  const [refreshConfig, setRefreshConfig] = useState<TokenConfig>({
    ...defaultConfig(),
    headers: [{ id: uid(), key: "Authorization", value: "Bearer ${refresh_token}" }],
  });

  const updateAccess = (partial: Partial<TokenConfig>) =>
    setAccessConfig(prev => ({ ...prev, ...partial }));
  const updateRefresh = (partial: Partial<TokenConfig>) =>
    setRefreshConfig(prev => ({ ...prev, ...partial }));
  const copyFromAccess = () =>
    setRefreshConfig({ ...accessConfig, headers: [...accessConfig.headers.map(h => ({ ...h, id: uid() }))] });

  const handleSave = () => {
    alert("Configuration saved!\n\n" + JSON.stringify({ authType, useRefreshToken, accessConfig, refreshConfig }, null, 2));
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      <div style={s.container}>
        <div style={s.topBar}>
          <h2 style={s.pageTitle}>Webhook OAuth Configuration</h2>
        </div>

        {/* Auth Type */}
        <div style={{ marginBottom: 24, maxWidth: 260 }}>
          <Select
            label="Authentication Type *"
            value={authType}
            onChange={setAuthType}
            options={["No Auth", "OAuth 2.0", "Bearer Token", "API Key", "Basic Auth"]}
          />
        </div>

        {/* Refresh Token Toggle */}
        <label style={s.refreshToggle}>
          <input
            type="checkbox"
            checked={useRefreshToken}
            onChange={e => setUseRefreshToken(e.target.checked)}
            style={s.checkboxBlue}
          />
          <span style={s.refreshLabel}>Refresh Token</span>
        </label>

        {/* Access Token Config */}
        <TokenConfigSection
          title="Access Token Configuration"
          config={accessConfig}
          onChange={updateAccess}
        />

        {/* Refresh Token Config */}
        {useRefreshToken && (
          <TokenConfigSection
            title="Refresh Token Configuration"
            config={refreshConfig}
            onChange={updateRefresh}
            showCopyFromAccess
            onCopyFromAccess={copyFromAccess}
          />
        )}

        {/* Actions */}
        <div style={s.actions}>
          <button style={s.cancelBtn}>Cancel</button>
          <button style={s.saveBtn} onClick={handleSave}>Save Configuration</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#f4f6f9",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    color: "#1e2a3b",
    padding: "32px 16px 60px",
  },
  container: {
    maxWidth: 860,
    margin: "0 auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    padding: "32px 40px 40px",
  },
  topBar: {
    marginBottom: 28,
    borderBottom: "1px solid #e8edf3",
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e2a3b",
    margin: 0,
    letterSpacing: "-0.01em",
  },

  /* Section */
  section: {
    border: "1px solid #e0e7ef",
    borderRadius: 10,
    padding: "24px 24px 20px",
    marginBottom: 20,
    background: "#fff",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1e2a3b",
    margin: 0,
  },
  copyBtn: {
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
  },

  /* Card (header, kv rows) */
  card: {
    border: "1px solid #e0e7ef",
    borderRadius: 8,
    marginBottom: 14,
    overflow: "hidden",
    background: "#fafbfd",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 20px",
    borderBottom: "1px solid #e0e7ef",
    background: "#fff",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e2a3b",
  },
  addBtn: {
    background: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  kvRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    color: "#94a3b8",
    padding: "10px 4px",
    alignSelf: "center",
    transition: "color 0.15s",
  },

  /* URL field */
  urlRow: {
    display: "flex",
    alignItems: "stretch",
    border: "1px solid #d1d9e0",
    borderRadius: 6,
    overflow: "hidden",
    background: "#fff",
    transition: "border-color 0.15s",
  },
  urlScheme: {
    background: "#f0f4f9",
    border: "none",
    borderRight: "1px solid #d1d9e0",
    padding: "0 12px",
    fontSize: 13,
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  hint: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 5,
    marginLeft: 2,
  },

  /* Form fields */
  fieldWrap: {
    position: "relative",
    width: "100%",
  },
  floatLabel: {
    position: "absolute",
    top: -8,
    left: 10,
    background: "#fff",
    fontSize: 11,
    color: "#64748b",
    padding: "0 4px",
    fontWeight: 600,
    zIndex: 1,
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    border: "1px solid #d1d9e0",
    borderRadius: 6,
    padding: "11px 12px",
    fontSize: 13,
    color: "#1e2a3b",
    background: "#fff",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  select: {
    width: "100%",
    border: "1px solid #d1d9e0",
    borderRadius: 6,
    padding: "11px 36px 11px 12px",
    fontSize: 13,
    color: "#1e2a3b",
    background: "#fff",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    fontFamily: "inherit",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  chevron: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#64748b",
    fontSize: 13,
  },

  /* Response section internals */
  subLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1e2a3b",
    marginBottom: 10,
  },
  tabGroup: {
    display: "inline-flex",
    border: "1px solid #d1d9e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  tabBtn: {
    background: "none",
    border: "none",
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
    borderRight: "1px solid #d1d9e0",
  },
  tabBtnActive: {
    background: "none",
    color: "#1a73e8",
    fontWeight: 700,
    borderBottom: "2px solid #1a73e8",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 13,
    color: "#1e2a3b",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    paddingTop: 12,
  },
  checkbox: {
    width: 15,
    height: 15,
    cursor: "pointer",
    accentColor: "#1a73e8",
  },
  infoIcon: {
    fontSize: 15,
    color: "#94a3b8",
    cursor: "help",
  },

  /* Auth Type + Refresh toggle */
  refreshToggle: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    marginBottom: 24,
    cursor: "pointer",
    userSelect: "none",
  },
  checkboxBlue: {
    width: 16,
    height: 16,
    accentColor: "#1a73e8",
    cursor: "pointer",
  },
  refreshLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1e2a3b",
  },

  /* Actions */
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
    paddingTop: 20,
    borderTop: "1px solid #e8edf3",
  },
  cancelBtn: {
    background: "none",
    border: "1px solid #d1d9e0",
    borderRadius: 6,
    padding: "10px 24px",
    fontSize: 14,
    color: "#64748b",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  saveBtn: {
    background: "#1a73e8",
    border: "none",
    borderRadius: 6,
    padding: "10px 24px",
    fontSize: 14,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 2px 8px rgba(26,115,232,0.3)",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  input:focus, select:focus {
    border-color: #1a73e8 !important;
    box-shadow: 0 0 0 3px rgba(26,115,232,0.12) !important;
  }

  input::placeholder { color: #b0bec5; }

  button:hover { opacity: 0.88; }

  .delete-btn:hover { color: #ef4444 !important; }
`;
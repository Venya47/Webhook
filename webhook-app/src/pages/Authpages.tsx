import { useState } from "react";

type AuthMode = "login" | "register";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldError {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const validate = (mode: AuthMode, data: FormData): FieldError => {
  const errors: FieldError = {};
  if (mode === "register" && !data.name.trim()) errors.name = "Full name is required";
  if (!data.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email";
  if (!data.password) errors.password = "Password is required";
  else if (data.password.length < 8) errors.password = "At least 8 characters";
  if (mode === "register") {
    if (!data.confirmPassword) errors.confirmPassword = "Please confirm password";
    else if (data.password !== data.confirmPassword) errors.confirmPassword = "Passwords don't match";
  }
  return errors;
};

export default function AuthPages() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormData>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldError]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const fieldErrors = validate(mode, form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setSubmitted(false);
    setShowPassword(false);
  };

  return (
    <div style={styles.root}>
      <style>{css}</style>
      <div style={styles.panel}>
        <div style={styles.brand}>
          <div style={styles.logo}>✦</div>
          <span style={styles.brandName}>Luminary</span>
        </div>

        {submitted ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>
              {mode === "login" ? "Welcome back!" : "Account created!"}
            </h2>
            <p style={styles.successSub}>
              {mode === "login"
                ? "You've been signed in successfully."
                : "Your account is ready. Redirecting…"}
            </p>
            <button style={styles.resetBtn} onClick={() => { setSubmitted(false); switchMode("login"); }}>
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <div style={styles.tabRow}>
              {(["login", "register"] as AuthMode[]).map(m => (
                <button
                  key={m}
                  style={{ ...styles.tab, ...(mode === m ? styles.tabActive : {}) }}
                  onClick={() => switchMode(m)}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <h1 style={styles.heading}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p style={styles.subheading}>
              {mode === "login"
                ? "Enter your credentials to continue"
                : "Fill in the details to get started"}
            </p>

            <div style={styles.form}>
              {mode === "register" && (
                <Field
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  error={errors.name}
                  onChange={handleChange}
                />
              )}
              <Field
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                error={errors.email}
                onChange={handleChange}
              />
              <Field
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                error={errors.password}
                onChange={handleChange}
                suffix={
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowPassword(p => !p)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                }
              />
              {mode === "register" && (
                <Field
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={handleChange}
                />
              )}

              {mode === "login" && (
                <div style={styles.forgotRow}>
                  <a href="#" style={styles.forgotLink}>Forgot password?</a>
                </div>
              )}

              <button
                style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
                onClick={handleSubmit}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? (
                  <span style={styles.spinner} className="spinner" />
                ) : (
                  mode === "login" ? "Sign In →" : "Create Account →"
                )}
              </button>
            </div>

            <p style={styles.switchText}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                style={styles.switchLink}
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
              >
                {mode === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </>
        )}
      </div>

      <div style={styles.deco} aria-hidden="true">
        <div style={styles.decoCircle1} />
        <div style={styles.decoCircle2} />
        <div style={styles.decoGrid} />
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: React.ReactNode;
}

function Field({ label, name, type, placeholder, value, error, onChange, suffix }: FieldProps) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrap}>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ ...styles.input, ...(error ? styles.inputError : {}), ...(suffix ? { paddingRight: 44 } : {}) }}
          autoComplete={name === "password" || name === "confirmPassword" ? "current-password" : name}
        />
        {suffix && <div style={styles.inputSuffix}>{suffix}</div>}
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f4f8",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  panel: {
    position: "relative",
    zIndex: 10,
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 24,
    padding: "44px 40px 36px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
    backdropFilter: "blur(20px)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg, #4f7ef7, #7c5cfc)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "#ffffff",
    fontWeight: 700,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: "#1a1a2e",
  },
  tabRow: {
    display: "flex",
    background: "#f0f4f8",
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
    gap: 4,
  },
  tab: {
    flex: 1,
    padding: "9px 0",
    border: "none",
    background: "transparent",
    borderRadius: 9,
    color: "rgba(0,0,0,0.35)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  tabActive: {
    background: "#ffffff",
    color: "#1a1a2e",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: "0 0 6px",
    letterSpacing: "-0.03em",
  },
  subheading: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
    margin: "0 0 28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(0,0,0,0.5)",
    letterSpacing: "0.01em",
  },
  inputWrap: {
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    background: "#f8fafc",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 10,
    color: "#1a1a2e",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputError: {
    borderColor: "rgba(220,50,50,0.4)",
    background: "rgba(255,50,50,0.03)",
  },
  inputSuffix: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    opacity: 0.5,
    padding: 2,
    lineHeight: 1,
  },
  errorText: {
    fontSize: 12,
    color: "#e03232",
    marginTop: 2,
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: -6,
  },
  forgotLink: {
    fontSize: 13,
    color: "#4f7ef7",
    textDecoration: "none",
    opacity: 0.85,
  },
  submitBtn: {
    marginTop: 6,
    padding: "14px",
    background: "linear-gradient(135deg, #4f7ef7, #7c5cfc)",
    border: "none",
    borderRadius: 12,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "opacity 0.2s, transform 0.1s",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  switchText: {
    textAlign: "center",
    fontSize: 13,
    color: "rgba(0,0,0,0.35)",
    marginTop: 22,
    marginBottom: 0,
  },
  switchLink: {
    background: "none",
    border: "none",
    color: "#4f7ef7",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 0 8px",
    textAlign: "center",
  },
  successIcon: {
    width: 60,
    height: 60,
    background: "linear-gradient(135deg, #4f7ef7, #7c5cfc)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 26,
    color: "#ffffff",
    fontWeight: 700,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: "0 0 8px",
    letterSpacing: "-0.02em",
  },
  successSub: {
    fontSize: 14,
    color: "rgba(0,0,0,0.4)",
    margin: "0 0 28px",
  },
  resetBtn: {
    background: "#f0f4f8",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 10,
    color: "rgba(0,0,0,0.5)",
    fontSize: 14,
    padding: "10px 24px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  deco: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
  },
  decoCircle1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,126,247,0.08) 0%, transparent 70%)",
    top: -150,
    right: -100,
  },
  decoCircle2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,92,252,0.07) 0%, transparent 70%)",
    bottom: -100,
    left: -80,
  },
  decoGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; }

  input:focus {
    border-color: rgba(79,126,247,0.5) !important;
    box-shadow: 0 0 0 3px rgba(79,126,247,0.1) !important;
    background: #ffffff !important;
  }

  input::placeholder {
    color: rgba(0,0,0,0.25);
  }

  .submit-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
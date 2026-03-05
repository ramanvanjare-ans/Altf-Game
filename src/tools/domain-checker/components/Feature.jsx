import React from "react";
import { useTheme } from "@mui/material/styles";

// Feature Icons
const Lightning = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
);
const Globe = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);
const Search = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    </svg>
);
const Shield = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const Clock = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
const Zap = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

export default function Features({ isDark = false }) {
    const theme = useTheme();

    const features = [
        {
            icon: <Lightning />,
            iconBg: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
            title: "Instant Results",
            description: "Get domain availability status in real-time with lightning-fast checks",
            color: theme.palette.primary.main,
        },
        {
            icon: <Globe />,
            iconBg: "linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)",
            title: "All Extensions",
            description: "Check any domain extension - .com, .net, .org, .io, and hundreds more",
            color: theme.palette.secondary.main,
        },
        {
            icon: <Search />,
            iconBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            title: "Smart Search",
            description: "Intelligent domain validation with instant format checking",
            color: theme.palette.primary.main,
        },
        {
            icon: <Shield />,
            iconBg: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
            title: "Accurate Data",
            description: "Real-time queries to registration databases for precise results",
            color: theme.palette.primary.main,
        },
        {
            icon: <Clock />,
            iconBg: "linear-gradient(135deg, #a78bfa 0%, #9333ea 100%)",
            title: "Always Available",
            description: "24/7 access to check domains whenever inspiration strikes",
            color: theme.palette.secondary.main,
        },
        {
            icon: <Zap />,
            iconBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            title: "No Registration",
            description: "Start checking domains immediately - no signup required",
            color: theme.palette.primary.main,
        },
    ];

    const badgeStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "50px",
        background: isDark
            ? "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 600,
        marginBottom: "24px",
        boxShadow: isDark
            ? "0 4px 16px rgba(129, 140, 248, 0.3)"
            : "0 4px 16px rgba(102, 126, 234, 0.2)",
    };

    const cardStyle = (feature) => ({
        background: isDark
            ? "linear-gradient(135deg, #1a102b 0%, #3a1f5d 50%, #5b21b6 100%)"
            : "linear-gradient(135deg, #e0f2fe 0%, #c7d2fe 50%, #f3e8ff 100%)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
        // padding: "32px",
        padding: "clamp(20px, 4vw, 32px)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
    });

    const iconBoxStyle = (gradient) => ({
        // width: "64px",
        // height: "64px",
        width: "clamp(48px, 8vw, 64px)",   
height: "clamp(48px, 8vw, 64px)",
        borderRadius: "16px",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        marginBottom: "20px",
        boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.1)",
    });

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
            {/* <div style={{ padding: "80px 32px", Height: "100vh" }}> */}

<div
  style={{
    padding: "clamp(48px, 8vw, 80px) clamp(16px, 5vw, 32px)", 
    minHeight: "100vh",                                      
  }}
>


                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={badgeStyle}>
                            <span>⚡</span>
                            <span>Powerful Features</span>
                        </div>
                    </div>
                    <h2
                        style={{
                            // fontSize: "56px",
                            fontSize: "clamp(32px, 6vw, 56px)",
                            fontWeight: 800,
                            margin: "0 0 16px 0",
                            background: !isDark
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "none",
                            WebkitBackgroundClip: !isDark ? "text" : "unset",
                            WebkitTextFillColor: isDark ? "#ffffff" : "transparent",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Why Domain Checker
                    </h2>
                    <p
                        style={{
                            // fontSize: "20px",
                            fontSize: "clamp(16px, 3vw, 20px)",
                            color: isDark ? "#cbd5e0" : "#4a5568",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
                        Fast, reliable, and comprehensive domain availability checking
                    </p>
                </div>

                {/* Features Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={cardStyle(feature)}
                            onMouseEnter={(e) => {
                                if (window.innerWidth < 768) return;
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.borderColor = feature.color;
                                e.currentTarget.style.boxShadow = isDark
                                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${feature.color}40`
                                    : `0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px ${feature.color}40`;
                            }}
                            onMouseLeave={(e) => {
                                  if (window.innerWidth < 768) return;
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.borderColor = theme.palette.divider;
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={iconBoxStyle(feature.iconBg)}>{feature.icon}</div>
                            <h3
                                style={{
                                    // fontSize: "24px",
                                    fontSize: "clamp(18px, 4vw, 24px)", 
                                    fontWeight: 700,
                                    color: isDark ? "#ffffff" : "#1a202c",
                                    marginBottom: "12px",
                                }}
                            >
                                {feature.title}
                            </h3>
                            <p
                                style={{
                                    // fontSize: "16px",
                                    fontSize: "clamp(14px, 3vw, 16px)",
                                    color: isDark ? "#cbd5e0" : "#4a5568",
                                    lineHeight: "1.6",
                                    margin: 0,
                                }}
                            >
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

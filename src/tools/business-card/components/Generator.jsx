import React, { useState, useRef } from "react";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Check,
} from "lucide-react";
import { toPng } from "html-to-image";
const Generator = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    linkedin: "",
    tagline: "",
    cardColor: "#6366f1",
    textColor: "#ffffff",
  });

  const cardRef = useRef(null);

  const templates = [
    {
      name: "Corporate Blue",
      category: "Professional",
      bgColor: "#1e40af",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    },
    {
      name: "Executive Black",
      category: "Professional",
      bgColor: "#0f172a",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
    },
    {
      name: "Tech Purple",
      category: "Technology",
      bgColor: "#7c3aed",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    },
    {
      name: "Digital Cyan",
      category: "Technology",
      bgColor: "#0891b2",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)",
    },
    {
      name: "Creative Pink",
      category: "Creative",
      bgColor: "#db2777",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #db2777 0%, #ec4899 100%)",
    },
    {
      name: "Artist Indigo",
      category: "Creative",
      bgColor: "#4f46e5",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)",
    },
    {
      name: "Energy Orange",
      category: "Fitness",
      bgColor: "#ea580c",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #ea580c 0%, #fb923c 100%)",
    },
    {
      name: "Power Red",
      category: "Fitness",
      bgColor: "#dc2626",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    },
    {
      name: "Nature Green",
      category: "Healthcare",
      bgColor: "#059669",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    },
    {
      name: "Medical Teal",
      category: "Healthcare",
      bgColor: "#0d9488",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
    },
    {
      name: "Finance Gold",
      category: "Finance",
      bgColor: "#ca8a04",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #ca8a04 0%, #eab308 100%)",
    },
    {
      name: "Luxury Navy",
      category: "Finance",
      bgColor: "#1e3a8a",
      textColor: "#ffffff",
      gradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      cardColor: template.gradient || template.bgColor,
      textColor: template.textColor,
    }));
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High quality
      });

      const link = document.createElement("a");
      link.download = `business-card-${formData.name || "card"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <section className="py-10 px-6 min-h-[calc(100vh-200px)]">
      <div className="max-w-350 mx-auto">
        <h2 className="subheading text-center pt-6 mb-4">
          Create Your Business Card
        </h2>
        <p className="content text-center mb-4">
          Fill in your details and customize your card
        </p>

        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(350px,1fr))]">
          {/* Form Section */}
          <div>
            {/* Personal Information */}
            <div className="bg-(--background) rounded-md border border-(--border) p-8  mb-6">
              <h3 className="subheading mb-4">Personal Information</h3>
              <input
                type="text"
                name="name"
                placeholder="Full Name*"
                value={formData.name}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />

              <input
                type="text"
                name="title"
                placeholder="Job Title *"
                value={formData.title}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />

              <input
                type="text"
                name="company"
                placeholder="Company Name *"
                value={formData.company}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
              <input
                type="text"
                name="tagline"
                placeholder="Tagline or Motto"
                value={formData.tagline}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
            </div>

            {/* Contact Details */}
            <div className="bg-(--background) rounded-md border border-(--border) p-8  mb-6">
              <h3 className="subheading mb-4">Contact Details</h3>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
              <input
                type="text"
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn Profile"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="
    w-full
    px-4 py-3
    text-base
    rounded-lg
    mb-4  border border-(--border) bg-(--background) text-(--foreground)"
              />
            </div>

            {/* Templates */}
            <div className="bg-(--background) text-(--foreground) border border-(--border) p-8 rounded-2xl">
              <h3 className="subheading mb-4">Choose Template</h3>
              <p className="text-(--foreground) mb-4">
                Select from {templates.length} professional designs
              </p>

              <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    style={{
                      padding: "20px 12px",
                      background: template.gradient || template.bgColor,
                      border:
                        formData.cardColor ===
                        (template.gradient || template.bgColor)
                          ? "3px solid #10b981"
                          : "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.2s",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    //                     className={`
                    //   p-5 px-3
                    //   rounded-xl
                    //   cursor-pointer
                    //   relative
                    //   transition-all duration-200
                    //   shadow-md
                    //   ${formData.cardColor === (template.gradient || template.bgColor) ? "border-3 border-emerald-500" : "border-0"}
                    //   ${template.gradient ? "" : `bg-[${template.bgColor}]`}
                    // `}

                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.1)";
                    }}
                  >
                    {formData.cardColor ===
                      (template.gradient || template.bgColor) && (
                      <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 flex items-center justify-center">
                        <Check size={16} color="white" />
                      </div>
                    )}
                    <div
                      className={`text-[1.8rem] font-bold text-center mb-2`}
                      style={{ color: template.textColor }}
                    >
                      Aa
                    </div>
                    <div
                      className={`text-[0.75rem] font-semibold text-center opacity-90`}
                      style={{ color: template.textColor }}
                    >
                      {template.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <div className="bg-(--background) rounded-md border border-(--border) p-8 sticky top-25">
              <h3 className="subheading mb-4">Live Preview</h3>
              {/* Business Card Preview */}
              <div
                ref={cardRef}
                className={`
  w-full 
  aspect-[1.75] 
  rounded-2xl 
  p-8 
  flex flex-col justify-between 
  mb-6 
  relative overflow-hidden 
  shadow-[0_20px_60px_rgba(0,0,0,0.3)]
`}
                style={{
                  background: formData.cardColor,
                  color: formData.textColor,
                }}
              >
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-50 h-50 rounded-full bg-[rgba(255,255,255,0.1)]" />
                <div className="absolute -bottom-7 -left-7 w-37.5 h-37.5 rounded-full bg-[rgba(255,255,255,0.1)]" />

                {/* Card Content */}
                <div className="relative z-10">
                  <h2 className="subheading">{formData.name || "Your Name"}</h2>
                  <p className="subheading">{formData.title || "Your Title"}</p>
                  <p className="text-[clamp(0.9rem,1.5vw,1.1rem)] font-semibold opacity-80">
                    {formData.company || "Company Name"}
                  </p>
                  {formData.tagline && (
                    <p className="text-[clamp(0.8rem,1.5vw,0.95rem)] opacity-70 italic mt-2">
                      "{formData.tagline}"
                    </p>
                  )}
                </div>

                <div className="relative z-10 text-[clamp(0.75rem,1.5vw,0.9rem)]">
                  {formData.email && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <Mail size={16} />
                      <span className="break-all">{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <Phone size={16} />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                  {formData.website && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <Globe size={16} />
                      <span className="break-all">{formData.website}</span>
                    </div>
                  )}
                  {formData.linkedin && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <Linkedin size={16} />
                      <span style={{ wordBreak: "break-all" }}>
                        {formData.linkedin}
                      </span>
                    </div>
                  )}
                  {formData.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{formData.address}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Download Button */}
              <button
                onClick={downloadCard}
                disabled={!formData.name || !formData.title}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "12px",
                  background:
                    !formData.name || !formData.title
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  color: "white",
                  cursor:
                    !formData.name || !formData.title
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (formData.name && formData.title) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Download size={20} />
                Download Business Card
              </button>
              +
              {(!formData.name || !formData.title) && (
                <p className="text-[0.85rem] text-center mt-3  text-(--foreground)">
                  Please fill in at least Name and Title to download
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Generator;

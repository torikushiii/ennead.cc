import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <input
          type="text"
          placeholder="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full p-2.5 md:p-3 text-sm md:text-base bg-secondary/30 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email (optional)"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full p-2.5 md:p-3 text-sm md:text-base bg-secondary/30 rounded-lg border border-white/10 focus:outline-none focus:border-white/20"
        />
      </div>
      <div>
        <textarea
          placeholder="Message"
          required
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full p-2.5 md:p-3 text-sm md:text-base bg-secondary/30 rounded-lg border border-white/10 focus:outline-none focus:border-white/20 min-h-[120px] resize-y"
        />
      </div>
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-3 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Send className="w-4 h-4" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </motion.button>
      {submitStatus === "success" && (
        <p className="text-green-500 text-sm">Message sent successfully!</p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-500 text-sm">
          {errorMessage || "Failed to send message. Please try again."}
        </p>
      )}
    </form>
  );
}

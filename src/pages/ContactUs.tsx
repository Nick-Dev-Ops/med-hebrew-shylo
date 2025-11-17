import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Helmet } from "react-helmet-async";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { MessageSquare, Bug, Languages, Users, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const MAX_MESSAGE_CHARS = 1500;
const GENERIC_ERROR = "Sorry, something went wrong. Please try again later.";

const ContactUs = () => {
  const { user, profile } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Templates
  const bugTemplate = `🐛 Bug Report:

App area/page: 
Steps to reproduce:
Expected result:
Actual result:
Browser/OS:
Screenshot link (optional):`;

  const translationTemplate = `🌐 Translation Issue:

Language:
Phrase/word:
Current translation:
Suggested correction:
Context (where it appears):`;

  const featureTemplate = `💡 Feature Request:

Feature description:
Problem it solves:
Who would benefit:`;

  const collaborationTemplate = `🤝 Collaboration:

Your role/background:
How you'd like to help:
Skills/expertise:
Availability:
Links (portfolio/GitHub/LinkedIn):`;

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setEmail(user?.email || "");
    } else if (user) {
      const meta = user.user_metadata || {};
      const likelyName = meta.full_name || meta.name || "";
      setName(likelyName || "");
      setEmail(user.email || "");
    }
  }, [user, profile]);

  // Prefill template based on URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    if (!type || message) return;

    const templates: Record<string, string> = {
      bug: bugTemplate,
      translation: translationTemplate,
      feature: featureTemplate,
      collab: collaborationTemplate
    };

    if (templates[type]) {
      setMessage(templates[type]);
    }
  }, []);

  function clampMessage(input: string) {
    return input.slice(0, MAX_MESSAGE_CHARS);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError("");

    try {
      const trimmed = message.trim();

      if (!trimmed) {
        setError("Please enter a message.");
        return;
      }

      if (trimmed.length > MAX_MESSAGE_CHARS) {
        setError(`Message is too long. Please keep it under ${MAX_MESSAGE_CHARS} characters.`);
        return;
      }

      if (!user && !email.trim()) {
        setError("Please include a reply email so we can respond to you.");
        return;
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString();
      const timeStr = now.toLocaleTimeString();
      const textLines = [
        "📨 New contact message",
        `Date: ${dateStr} Time: ${timeStr}`,
        user
          ? `User: ${user.email || "unknown"} (${user.id})`
          : "User: anonymous",
        profile ? `Profile: ${profile.full_name || "-"}, ${profile.specialization || "-"}, ${profile.hospital || "-"}` : null,
        `Name: ${name?.trim() || "-"}`,
        `Email: ${email?.trim() || "-"}`,
        "-----",
        trimmed,
      ].filter(Boolean);
      const textToSend = textLines.join("\n");

      const resp = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });

      if (resp.ok) {
        setSuccess(true);
        setMessage("");
      } else {
        setError(GENERIC_ERROR);
      }
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - Doctor Hebrew</title>
        <meta name="description" content="Contact the Doctor Hebrew team for bug reports, feature requests, translations, or collaboration opportunities." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Get In Touch</CardTitle>
            <CardDescription className="text-center text-base">
              <div className="flex items-center justify-center gap-2 mt-2">
                <Clock className="h-4 w-4" />
                <span>We typically respond within 24-48 hours</span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Why Contact Us Section */}
            <div className="bg-secondary/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-center">Why Reach Out?</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your feedback is essential! We're a community-driven project built by medical students and developers. 
                Every message helps us improve Doctor Hebrew for students everywhere.
              </p>
            </div>

            {/* Quick Select Categories */}
            <div className="space-y-3">
              <label className="text-sm font-medium">What can we help you with?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setMessage(bugTemplate)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-border hover:border-red-500 hover:bg-red-500/5 transition-all"
                >
                  <Bug className="h-5 w-5 text-red-500" />
                  <span className="text-xs font-medium">Bug Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessage(translationTemplate)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-border hover:border-blue-500 hover:bg-blue-500/5 transition-all"
                >
                  <Languages className="h-5 w-5 text-blue-500" />
                  <span className="text-xs font-medium">Translation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessage(featureTemplate)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-border hover:border-green-500 hover:bg-green-500/5 transition-all"
                >
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span className="text-xs font-medium">Feature</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMessage(collaborationTemplate)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-border hover:border-purple-500 hover:bg-purple-500/5 transition-all"
                >
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="text-xs font-medium">Collaborate</span>
                </button>
              </div>
            </div>

            <Separator />

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Reply email {!user && <span className="text-red-500">*</span>}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your message <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={(e) => setMessage(clampMessage(e.target.value))}
                  rows={10}
                  className="resize-none"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Be as detailed as possible</span>
                  <span>{message.length}/{MAX_MESSAGE_CHARS}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={sending || !message.trim()}
                className="w-full"
                size="lg"
              >
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            {/* Success Message with Animation */}
            {success && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-1 animate-scale-in">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <AlertTitle className="text-green-800 dark:text-green-300 font-semibold">Message Sent Successfully! ✨</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      Thank you for reaching out! We'll review your message and respond within 24-48 hours.
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-300">Error</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ContactUs;

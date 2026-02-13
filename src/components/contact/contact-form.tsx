
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import MsgModal from "../msg-modal";

import { ui, useTranslations } from "@/i18n/ui";

interface ContactFormProps {
  lang?: string;
}

export function ContactForm({ lang = 'en' }: ContactFormProps) {
  const t = useTranslations(lang as keyof typeof ui);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('cx_contact_form', {
        body: { contact_message: formData }
      });

      if (error) throw error;

      setModalContent({
        title: "Message Sent",
        message: "Thank you for contacting us. We will get back to you shortly."
      });
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        industry: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      setModalContent({
        title: "Submission Failed",
        message: error.message || "There was an error sending your message. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 md:p-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">
        {t('contact-form-title') || "Send us a Message"}
      </h2>
      <p className="text-zinc-500 mb-6">
        {t('contact-form-subtitle') || "Values, specs, or custom inquiries? We're here to help."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">{t('first-name') || "First Name"}</Label>
            <Input
              id="first_name"
              required
              placeholder="First name"
              value={formData.first_name}
              onChange={e => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">{t('last-name') || "Last Name"}</Label>
            <Input
              id="last_name"
              required
              placeholder="Last name"
              value={formData.last_name}
              onChange={e => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email') || "Email"}</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone-optional') || "Phone (Optional)"}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">{t('company') || "Company"}</Label>
            <Input
              id="company"
              required
              placeholder="Your company name"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">{t('industry-optional') || "Industry (Optional)"}</Label>
            <Input
              id="industry"
              placeholder="e.g. Pharmaceutical"
              value={formData.industry}
              onChange={e => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">{t('subject') || "Subject"}</Label>
          <Input
            id="subject"
            required
            placeholder="How can we help?"
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t('message') || "Message"}</Label>
          <Textarea
            id="message"
            required
            placeholder="Tell us more details about your needs..."
            className="min-h-30"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            t('send-message') || "Send Message"
          )}
        </Button>
      </form>

      <MsgModal
        open={modalOpen}
        title={modalContent.title}
        message={modalContent.message}
        onButtonPressed={() => setModalOpen(false)}
      />
    </div>
  );
}

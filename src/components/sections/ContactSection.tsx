'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Send, LucideIcon } from 'lucide-react';
import FadeUp from '../ui/FadeUp';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import ContactItem from '../shared/ContactItem';

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export interface IContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const contactInfo: IContactInfoItem[] = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+880-1715-052-808',
    href: 'tel:+8801715052808',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'ismailjosim@yahoo.com',
    href: 'mailto:ismailjosim@yahoo.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bangladesh · Remote Available',
  },
];

export default function ContactSection() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      toast.success("Message sent successfully 🚀 I'll get back to you soon!");

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24 scroll-mt-20 md:scroll-mt-24">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <FadeUp>
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Get in Touch
            </p>
            <h2 className="mt-3 text-4xl font-bold text-foreground md:text-5xl">Contact Me</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          </div>
        </FadeUp>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Side */}
          <FadeUp delay={100}>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              I&apos;m available for freelance projects, full-time roles, and mentoring. Whether you
              have a project in mind or just want to say hi — feel free to reach out.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item) => (
                <ContactItem key={item.label} {...item} />
              ))}
            </div>
          </FadeUp>

          {/* Right Side - Form */}
          <FadeUp delay={200} className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full group" disabled={loading}>
                <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

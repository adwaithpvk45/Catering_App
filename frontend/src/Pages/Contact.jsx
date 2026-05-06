import React from 'react';
import { Field, Form, Formik } from 'formik';
import { 
  MessageSquare, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { submitComplaint } from '../api/public/complaints';

const ContactInfoCard = ({ icon: Icon, title, detail, subDetail }) => (
  <div className="flex gap-4 p-6 rounded-3xl bg-base-200 border border-base-content/5 hover:border-[#FF7D44]/30 transition-all duration-300 group">
    <div className="size-12 rounded-2xl bg-[#FF7D44]/10 flex items-center justify-center text-[#FF7D44] group-hover:bg-[#FF7D44] group-hover:text-white transition-colors duration-300">
      <Icon className="size-6" />
    </div>
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-base-content/70 font-medium">{detail}</p>
      {subDetail && <p className="text-xs text-base-content/40 mt-1 uppercase tracking-widest">{subDetail}</p>}
    </div>
  </div>
);

function Contact() {
  return (
    <div className="bg-base-100 text-base-content min-h-screen py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Get in <span className="text-[#FF7D44]">Touch</span>
            </h1>
            <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-medium">
              Have a question or just want to say hi? We'd love to hear from you.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactInfoCard 
              icon={Mail} 
              title="Email Us" 
              detail="hello@feastify.com" 
              subDetail="Online Support 24/7"
            />
            <ContactInfoCard 
              icon={Phone} 
              title="Call Us" 
              detail="+1 (555) 000-1234" 
              subDetail="Mon-Fri, 9am - 6pm"
            />
            <ContactInfoCard 
              icon={MapPin} 
              title="Office Location" 
              detail="123 Culinary Ave, Foodie City" 
              subDetail="Global Headquarters"
            />
            <ContactInfoCard 
              icon={Clock} 
              title="Business Hours" 
              detail="Always Open for Bookings" 
              subDetail="Service available 365 days"
            />
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            className="lg:col-span-7 bg-base-200 p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-base-content/5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Formik 
              initialValues={{ fullName: '', email: '', subject: '', message: '' }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {   
                let errorMessage = "";
                if (!values.fullName) errorMessage = "Name is required";
                else if (!values.email) errorMessage = "Email is required";
                else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) errorMessage = "Invalid email address";
                else if (!values.subject) errorMessage = "Subject is required";
                else if (!values.message) errorMessage = "Message is required";

                if (errorMessage) {
                  toast.error(errorMessage);
                  setSubmitting(false);
                  return;
                }

                try {
                  const res = await submitComplaint(values);
                  toast.success(res.message || "Message sent successfully!");
                  resetForm();
                } catch (error) {
                  toast.error(error.message || "Failed to send message.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <Form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 opacity-60 uppercase tracking-widest">Full Name</label>
                      <Field 
                        name="fullName" 
                        placeholder="John Doe"
                        className="w-full bg-base-100 border-2 border-transparent focus:border-[#FF7D44] p-4 rounded-2xl outline-none transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1 opacity-60 uppercase tracking-widest">Email Address</label>
                      <Field 
                        name="email" 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-base-100 border-2 border-transparent focus:border-[#FF7D44] p-4 rounded-2xl outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 opacity-60 uppercase tracking-widest">Subject</label>
                    <Field 
                      name="subject" 
                      placeholder="How can we help?"
                      className="w-full bg-base-100 border-2 border-transparent focus:border-[#FF7D44] p-4 rounded-2xl outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold ml-1 opacity-60 uppercase tracking-widest">Your Message</label>
                    <Field name="message">
                      {({ field }) => (
                        <textarea
                          {...field}
                          rows={5}
                          placeholder="Tell us more about your event..."
                          className="w-full bg-base-100 border-2 border-transparent focus:border-[#FF7D44] p-4 rounded-2xl outline-none transition-all font-medium resize-none"
                        />
                      )}
                    </Field>
                  </div>

                  <button 
                    className="btn btn-warning text-white w-full py-4 h-auto text-lg font-black tracking-tight rounded-2xl shadow-lg shadow-orange-200/20 group overflow-hidden relative" 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-6 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
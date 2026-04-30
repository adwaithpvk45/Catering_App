import { TextareaAutosize, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CookingPot, EyeOff, MessageSquare, Loader2 } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitComplaint } from '../api/public/complaints';

function Contact() {


  return (
      <div className='min-h-screen grid pt-10'>
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
       <div className='w-full max-w-md space-y-8'>
        <div className='text-center mb-8'>
          <div className="flex flex-col items-center gap-2 group">
            <div className='size-12 rounded-xl bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors'>
                <MessageSquare className='size-6 text-warning'/>
            </div>
            <h1 className='text-2xl font-bold mt-2'>Contact Us</h1>
            <p className='text-base-content/60'>Got a technical issue? Want to send feedback? Let us know.</p>
          </div>
        </div>
        <Formik 
          initialValues={{ fullName: '', email: '', subject: '', message: '' }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {   
            // 1. Manual Validation Check
            let errorMessage = "";
            if (!values.fullName) errorMessage = "Name is required";
            else if (!values.email) errorMessage = "Email is required";
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) errorMessage = "Invalid email address";
            else if (!values.subject) errorMessage = "Subject is required";
            else if (!values.message) errorMessage = "Message is required";

            // 2. If there's an error, show toast and STOP
            if (errorMessage) {
              toast.error(errorMessage, { duration: 3000 });
              setSubmitting(false);
              return; // <--- This prevents the API from being called
            }

            // 3. If validation passes, call the API
            try {
              const res = await submitComplaint(values);
              toast.success(res.message || "Complaint submitted successfully!", {
                duration: 4000,
                position: 'top-center'
              });
              resetForm({ values: { fullName: '', email: '', subject: '', message: '' } });
            } catch (error) {
              toast.error(error.message || "Failed to submit complaint.", {
                duration: 4000
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <Field name="fullName">
                  {({ field }) => (
                    <TextField {...field} value={field.value || ''} className="w-full" variant="standard" label="Full Name" />
                  )}
                </Field>
              </div>
              <div>
                <Field name="email">
                  {({ field }) => (
                    <TextField {...field} value={field.value || ''} className="w-full" variant="standard" type="email" label="Email Address" />
                  )}
                </Field>
              </div>
              <div>
                <Field name="subject">
                  {({ field }) => (
                    <TextField {...field} value={field.value || ''} className="w-full" variant="standard" label="Subject" />
                  )}
                </Field>
              </div>
              <div>
                <Field name="message">
                  {({ field }) => (
                    <TextareaAutosize
                      {...field}
                      value={field.value || ''}
                      minRows={5}
                      placeholder="How can we help you?"
                      className="w-full p-4 border rounded-xl mt-4 focus:outline-warning"
                    />
                  )}
                </Field>
              </div>
              <button className="btn btn-warning w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='size-5 animate-spin mr-2'/>
                    Submitting...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </Form>
          )}
        </Formik>
        </div>
       </div>
      </div>
  )
}

export default Contact
import { TextareaAutosize, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CookingPot, EyeOff, MessageSquare, Loader2 } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitComplaint } from '../api/public/complaints';

function Contact() {

  const validate = (values) => {
    const errors = {};
    if (!values.fullName) {
      errors.fullName = 'Name is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.subject) {
      errors.subject = 'Subject is required';
    }
    if (!values.message) {
      errors.message = 'Message is required';
    }
    
    // Show first error in toast if any
    const firstError = Object.values(errors)[0];
    if (firstError) toast.error(firstError);
    
    return errors;
  };

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
          validate={validate}
          validateOnChange={false}
          onSubmit={async (values, { setSubmitting, resetForm }) => {   
            try {
              const res = await submitComplaint(values);
              toast.success(res.message || "Complaint submitted successfully!");
              resetForm();
            } catch (error) {
              toast.error(error.message || "Failed to submit complaint.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <Field as={TextField} className="w-full" variant="standard" type="text" name="fullName" label="Full Name" />
              </div>
              <div>
                <Field as={TextField} className="w-full" variant="standard" type="email" name="email" label="Email Address" />
              </div>
              <div>
                <Field as={TextField} className="w-full" variant="standard" type="text" name="subject" label="Subject" />
              </div>
              <div>
                <Field as={TextareaAutosize} name="message" minRows={5} placeholder="How can we help you?" className="w-full p-4 border rounded-xl mt-4 focus:outline-warning" />
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
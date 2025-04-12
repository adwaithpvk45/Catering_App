import { TextareaAutosize, TextField } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { CookingPot, EyeOff, MessageSquare } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

function Contact() {

  const validate = (values) => {
    const errors = {};
    console.log(values)
    if (!values.fullName) {
      errors.fullName = 'Name is required';
      toast.error(errors.fullName);
    }
    if (!values.email) {
      errors.email = 'Email is required';
      toast.error(errors.email);
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
      toast.error(errors.email);
    }
    if (!values.password) {
      errors.password = 'Password is required';
      toast.error(errors.password);
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
      toast.error(errors.password);
    } else if (!/[A-Z]/.test(values.password)) {
      errors.password = 'Must contain at least one uppercase letter';
      toast.error(errors.password);
    } else if (!/[0-9]/.test(values.password)) {
      errors.password = 'Must contain at least one number';
      toast.error(errors.password);
    }
    if(!values.role){
     errors.role = "Role should be selected"
     toast.error(errors.role)
    }
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
  initialValues={{ fullName: '', email: '', password: '' }}
  validate={validate}
  validateOnChange={false}
  onSubmit={  async(values, { setSubmitting}) => {   
   try{
    console.log(values)
    // signUp(values);
    toast.success("Success")
    setSubmitting(false);
  }catch(error){
    toast.error("SignUp unsuccessfull!")
  }
  }}
>
             {({handleSubmit,isSubmitting})   =>
                      (
                      <Form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <Field as={TextField} className="w-full pl-10" variant="standard" type="text" name="Email" label="Email"></Field>
            </div>
            <div>
             <Field type="name" name="name" className="w-full pl-10" as={TextField} variant="standard" label="Subject"></Field>
            </div>
            <div>
             <Field as={TextareaAutosize} name="description" minRows={3} placeholder="Enter your concern...." className="w-[450px] h-[450px] p-4 border-1 rounded-xl"/>
            </div>
            <button className="btn btn-md lg:btn-lg xl:btn-xl w-full pl-10" type="submit" disabled={isSubmitting}>
              {isSubmitting?(<>
              <Loader2 className='size-5 animate-spin'/>
              Loading ...
              </>):(
               "Submit"
               )}</button>
          </Form>)}
        </Formik>
        </div>
       </div>
      </div>
  )
}

export default Contact
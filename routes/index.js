const express = require('express');

const router = express.Router();

const Contact = require('../models/Contact');

const CONTACT_TITLE = 'Contact us | Lost & Found';

const emptyContactForm = () => ({ name: '', email: '', subject: '', message: '' });

const cleanText = (value) => (typeof value === 'string' ? value.trim() : '');

router.get('/', (req,res) => res.render('index',{title:'Home | Lost & Found',currentPage:'home'}));

router.get('/about', (req,res) => res.render('about',{title:'About | Lost & Found',currentPage:'about'}));

router.get('/contact', (req,res) => res.render('contact',{title:CONTACT_TITLE,currentPage:'contact',form:emptyContactForm(),errors:{},sent:req.query.sent==='1'}));

router.post('/contact', async (req,res,next) => {

    try {

        const body=req.body||{};

        const form={name:cleanText(body.name),email:cleanText(body.email).toLowerCase(),subject:cleanText(body.subject),message:cleanText(body.message)};

        const errors={};

        if(!form.name) errors.name='Please enter your name.'; else if(form.name.length>80) errors.name='Your name must be 80 characters or fewer.';

        if(!form.email) errors.email='Please enter your email address.'; else if(!/^\S+@\S+\.\S+$/.test(form.email)) errors.email='Enter a valid email address.';

        if(!form.subject) errors.subject='Please choose a subject.';

        if(!form.message) errors.message='Tell us how we can help.'; else if(form.message.length>1500) errors.message='Your message must be 1,500 characters or fewer.';

        if(Object.keys(errors).length) return res.status(422).render('contact',{title:CONTACT_TITLE,currentPage:'contact',form,errors,sent:false});

        await new Contact(form).save();

        res.redirect('/contact?sent=1');

    } catch(error){ next(error); }

});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// load helper


// load schema
require('../models/Band');
const Band = mongoose.model('bands');

// Band Index Page
router.get('/', ensureAuthenticated, (req,res) => {
  Band.find({user: req.user.id}).sort({creationDate:'descending'}).then(bands => {
    res.render('bands/index', {
      bands:bands
    })
  }) // find something in DB
});



// add band form
router.get('/add', ensureAuthenticated, (req,res) => {
  res.render('bands/add'); 
});

// edit band form
router.get('/edit/:id', ensureAuthenticated, (req,res) => {
  Band.findOne({
    _id: req.params.id
  }).then(band => {
    if (band.user != req.user.id) {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/bands');
    } else {
     res.render('bands/edit', {
       band: band
     });
   }; 
  })
});

// process  form
router.post('/', ensureAuthenticated, (req,res) => {
  let errors = [];
  
  if (!req.body.title) {
    errors.push({
      text: 'Please add title'
    })
  }
  
  if (errors.length > 0) {
    res.render('bands/add', {
      errors: errors,
      title: req.body.title,
    });
  } else {
    const newUser = {
      title: req.body.title,
     
      user: req.user.id,
      
    };
    new Band(newUser).save().then(band => {
      req.flash('success_msg', 'Band added');
      res.redirect('/bands');
    })
  }
});

// edit form process
router.put('/:id', ensureAuthenticated, (req,res) => {
  Band.findOne({
    _id: req.params.id
  }).then(band => {
    // new values
    band.title = req.body.title;
    band.save().then( band => {
      req.flash('success_msg', 'Band updated');
      res.redirect('/bands');
    });
  });
});

// delete Band
router.delete('/:id', ensureAuthenticated, (req,res) => {
  Band.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Band removed');
    res.redirect('/bands');
  })
});



module.exports = router;

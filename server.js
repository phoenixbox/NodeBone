// Setup the app module dependencies
var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  mongoose = require('mongoose');

// Create the app server with an express instance
var app = express();

// Configure the server
app.configure( function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, 'client')));
  app.use(express.errorHandler({dumpExecutions:true, showStack:true}));
});

// Mongoose connect & schema setup
mongoose.connect('mongodb://localhost/library_database');

var Keywords = new mongoose.Schema({
  keywords: String
});

var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date,
  keywords: [ Keywords ]
});


var BookModel = mongoose.model('Book', Book);

app.get('/api', function(request, response){
  response.send('API up and running');
});

app.get('/api/books', function(request, response){
  return BookModel.find(function(err, books){
    if(!err){
      return response.send(books);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/books',function(request, response){
  var book = new BookModel({
   title: request.body.title,
   author: request.body.author,
   releaseDate: request.body.releaseDate,
   keywords: request.body.keywords
  });
  book.save(function(err){
    if(!err){
      console.log('SAVING ' + book.title);
    } else {
      console.log('ERROR SAVING: ' +book.title);
    }
  });

  return response.send(book);
});

// Colon notation so that express knows this is a dynamic url parameter
app.get('/api/books/:id', function(request, response){
  return BookModel.findById(request.params.id, function(err, book){
    return BookModel.findById(request.params.id, function(err, book){
      if(!err){
        return response.send(book);
      } else {
        return console.log(err);
      }
    });
  });
});

app.put('/api/books/:id', function(request, response){
  console.log('UPDATING: ' + request.body.title);
  return BookModel.findById( request.params.id, function(err, book){
    book.title = request.body.title;
    book.author = request.body.author;
    book.releaseDate = request.body.releaseDate;
    book.keywords = request.body.keywords;

    return book.save(function(err){
      if(!err){
        console.log('UPDATED: ' + book.title);
      } else {
        console.log('ERROR UPDATING: ' + book.title);
      }
      return response.send(book);
    });
  });
});

app.delete('/api/books/:id', function(request, response){
  return BookModel.findById(request.params.id, function(err, book){
    return book.remove(function(err){
      if(!err){
        console.log('REMOVED BOOK');
        return response.send('');
      } else {
        console.log(err);
      }
    });
  });
});

var port = 4711;
app.listen(port, function(){
  console.log('Express server listening on port %d in %s mode',
    port,app.settings.env);
});
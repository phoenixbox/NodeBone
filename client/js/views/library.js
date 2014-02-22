var app = app || {};

app.LibraryView = Backbone.View.extend({
  el: '#books',

  events: {
    'click #add': 'addBook'
  },

  initialize: function(){
    this.collection = new app.Library();
    this.collection.fetch({reset: true});
    this.render();

    this.listenTo(this.collection, 'add', this.renderBook);
    this.listenTo(this.collection, 'reset', this.render0);
  },

  render: function(){
    var that = this;
    this.collection.each(function(book){
      that.renderBook(book);
    });
  },

  renderBook: function(book){
    var bookView = new app.BookView({
      model: book
    });
    this.$el.append(bookView.render().el);
  },

  addBook: function(event){
    event.preventDefault();

    // Cache input vals in a hash
    var formData = {};

    // Create new models
    $('#addBook div').children('input').each(function(i,el){
      if($(el).val() !== ''){
        formData[el.id] = $(el).val();
      }
    });
    // Create model instance and add to the collection
    this.collection.add(new app.Book(formData));
  }
});
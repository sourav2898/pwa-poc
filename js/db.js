// enable offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

// real-time listener
db.collection('tasks').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    console.log(change.doc.data(), change.doc.id)
    if(change.type === 'added'){
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if(change.type === 'removed'){
      // remove the document data from the web page
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', event => {
  event.preventDefault();
  
  const recipe = {
    name: form.name.value,
    email: form.email.value,
    age: form.age.value,
    contact: form.contact.value
  };
  if(recipe.name && recipe.email && recipe.contact && recipe.age){
    db.collection('tasks').add(recipe)
    .catch(err => console.log(err));
  } else {
    alert('Please fill all the details in the form.')
  }

  form.name.value = '';
  form.email.value = '';
  form.age.value = null;
  form.contact.value = null;
});

// remove a recipe
const detailsContainer = document.querySelector('.recipes');
detailsContainer.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    //console.log(id);
    db.collection('tasks').doc(id).delete();
  }
})
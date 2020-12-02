//handling offline data using firebase
db.enablePersistence()
  .catch(err => {
        if(err.code == 'failed-precondition'){
            //probably multiple tabs is open
            console.log('persistence failed')
        }else if(err.code == 'unimplimented'){
            //lack of browser support
            console.log('persistence is not available')
        }
    })

db.collection('recipes').onSnapshot((snapshots) => {
    snapshots.docChanges().forEach(change => {
       // console.log(change, change.doc.data(), change.doc.id)
       if(change.type === 'added'){
           //add data to document page
            renderRecipes(change.doc.data(), change.doc.id)
       }
       if(change.type === 'removed'){
           //remove data from document page
           removeRecipe(change.doc.id)
       }
    });
})

//add new recipe to firestore database

const form = document.querySelector('form')
form.addEventListener('submit', e => {
    e.preventDefault()

    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    }

    db.collection('recipes').add(recipe)
      .catch((err) => console.log(err))

      form.title.value = ''
      form.ingredients.value = ''
})

//delete the recipe from firestore

const recipeContainer = document.querySelector('.recipes')
recipeContainer.addEventListener('click', e => {
    // console.log(e)
    if(e.target.tagName === 'I'){
        const id = e.target.getAttribute('data-id')
        db.collection('recipes').doc(id).delete()
    }
})
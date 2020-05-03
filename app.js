const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true })
    .then(() => console.log('Connexion réussi !'))
    .catch(() => console.log('Connexion échoué !!'));

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type : String, required : true}
});

const User = mongoose.model('User', userSchema);

app.get('/api/users', (req, res, next) =>{
    User.find()
    .then((users) => res.status(200).json({users}))
    .catch((error) => res.status(401).json({error}))
})

app.post('/api/users', (req, res, next) =>{
    const user = new User({
        ...req.body
    })
    user.save()
    .then(() => res.status(200).json({message: 'Utilisateur ajouté !'}))
    .catch((error) => res.status(400).json(error.message));
})

app.put('/api/users/:id', (req, res, next) =>{
    const user = new User({
        _id: req.params.id,
        name: req.body.name,
        email: req.body.email
    })
    User.updateOne({_id : req.params.id}, user)
    .then(() => res.status(200).json({message: 'Utilisateur modifié !'}))
    .catch((error) => res.status(400).json(error.message));
})

app.delete('/api/users/:id', (req, res, next) => {
    User.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message : 'Utilisateur supprimé !'}))
    .catch((error) => res.status(400).json(error.message))
})


const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log('app listen to port', port)
})
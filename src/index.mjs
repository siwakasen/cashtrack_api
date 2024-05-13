import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

const users = [
    {id:1, name: 'John Doe', age: 25},
    {id:2, name: 'Jane Doe', age: 24},
    {id:3, name: 'John Smith', age: 30},
    {id:4, name: 'Jane Smith', age: 29},
    {id:5, name: 'Marry Doe', age: 22},
    {id:6, name: 'Marry Smith', age: 26},
];

app.get('/api', (req, res) => {
   res.status(200).send({ 
        message: 'Hello this is daily expense api'});
    });

app.get('/api/users', (req, res) => {
    console.log(req.params);
    res.status(200).send({
        message: 'success get all users',
        data: users
    });
});

app.get('/api/users/:id', (req, res) => {
    const parsedId = parseInt(req.params.id);
    if (isNaN(parsedId)) {
        res.status(400).send({
            message: 'invalid id'
        });
        return;
    }
    
    const user = users.find(user => user.id == parsedId);
    if(!user) {
        res.status(404).json({
            message: 'user not found'
        });
        return;
    }
    res.status(200).json({
        message: 'success get user by id',
        data: user
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

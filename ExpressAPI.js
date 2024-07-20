//Main Backend FIle

//imports
const db = require("./Database/index.js");

//console.log(db);

//API
//import express
const express=require("express");

const app=express();
app.use(express.json());

//Approach 1
// const {MongoClient} = require('mongodb');
// const url= "mongodb+srv://vaishnavi_bookapi:BookAPI@bookapi.arddfsm.mongodb.net/BookApiDatabase?retryWrites=true&w=majority&appName=BookAPI";


// const client = new MongoClient(url);

// // async function listDatabases(client){
// //     //this will list down all databses for you
// //     databaseList= await client.db().admin().listDatabases();
// //     console.log("The databases are: ");
// //     databaseList.databases.forEach(db=>console.log(db.name));
// // }

// async function connectToDatabase() {
//     try {
//         await client.connect();
//         //result is promise
//         //const result= await client.db("BookApiDatabase").collection("books").findOne({ISBN:"12345FOUR"});
//         //console.log(result);
//         //await listDatabases(client);
//        ///const bcollection = client.db("BookApiDatabase").collection("books");
//        // console.log(bcollection);
//     } catch (err) {
//         console.error(err);
//     } finally {
//         await client.close();
//     }
// }
//connectToDatabase();

//IMPORT FROE DATABASE
const BookModel = require("./Database/books.js");

//APPROACH 2
var mongoose = require('mongoose');
var mongodb="mongodb+srv://vaishnavi_bookapi:BookAPI@bookapi.arddfsm.mongodb.net/BookApiDatabase?retryWrites=true&w=majority&appName=BookAPI";
mongoose.connect(mongodb).then(() => console.log("Connection Established")).catch(err => console.error("Connection failed", err));

//-----GET API----------------------
//----------------------------BOOK API------------------------
//get all books

//localhost:3000/books
//Express api
// app.get('/books',(req,res)=>{
//     const getAllBooks = db.books;
//     return res.json(getAllBooks);
// })

//-------------mongoDB book Api-----------
//localhost:3000/books
app.get('/books', async (req,res)=>{
    const getAllBooks =  await BookModel.find();
    return res.json(getAllBooks);
})

//-------Express ApI
//get specific books
//localhost://book/12345TWO
app.get('/book/:isbn',(req,res)=>{
    //req.params = isbn
    const {isbn}=req.params;//destructuring
    const getspecificBook=db.books.filter((book)=>book.ISBN === isbn); 
    //filter will always return a array
    if(getspecificBook.length === 0){
        return res.json({"error": `No Book found for the ISBN of ${isbn}` });
    }else{
        return res.json(getspecificBook[0]);
    }
});

//get list of  book based on category
app.get('/books-category/:category',(req,res)=>{
    const {category}=req.params;
    const getBooksBasedOnCategory=db.books.filter((book)=>book.category.includes(category));
    if(getBooksBasedOnCategory === 0){
        return res.json({"error": `No Book found for the Catogory of ${category}` });
    }else{
        return res.json(getBooksBasedOnCategory);
    }
}
);


//get list of books based on author
app.get('/book-author/:author',(req,res)=>{
    const {author}=req.params;
    const getBookBasedOnAuthor=db.books.filter((book)=>book.authors.includes(parseInt(author)));
    if(getBookBasedOnAuthor.length === 0){
        return res.json({"error": `No Book found for the Author of ${author}` });
    }else{
        return res.json(getBookBasedOnAuthor);
    }
});

//---------------------Author Api---------------------

//get all authors
app.get("/authors",(req,res)=>{
    const getAllAuthors= db.authors;
    return res.json(getAllAuthors);
})

//req.params return string
//get specific author
app.get('/author/:id',(req,res)=>{
    const {id}=req.params;
    const getAuthor=db.authors.filter((author)=>author.id=== parseInt(id));
    if(getAuthor.length === 0){
        return res.json(`{"Error": No author found on this ${id}}`);
    }else{
        return res.json(getAuthor);
    }
});

//get a specific author based on books
app.get('/authors/:isbn',(req,res)=>{
    const {isbn}=req.params;
    const getAuthors=db.authors.filter((author)=>author.books.includes(isbn));
    if(getAuthors.length === 0){
        return res.json({"Error  ":` No Author Found for this book ${isbn}`});
    }else{
        return res.json(getAuthors);
    }
});


//------------------------Publication GET API ---------------------
//get all publication
app.get('/allpublication',(req,res)=>{
    const allpublication=db.publications;
    return res.json(allpublication);
});

//get a specific publication
app.get('/publication/:id',(req,res)=>{
    const {id}=req.params;
    const getSpecificPublication=db.publications.filter((publication)=>publication.id === parseInt(id));
    if(getSpecificPublication.length === 0){
        return res.json({"Error":`No Publication found for this ${id}`});
    }else{
        return res.json(getSpecificPublication);
    }
}
);

//get specific publication based on book
app.get('/publications/:isbn',(req,res)=>{
    const {isbn}= req.params;
    const getPublicationByIsbn=db.publications.filter((publication)=>publication.books.includes(isbn));
    if(getPublicationByIsbn.length===0){
        return res.json({"Error":`No Publication found for this book ${isbn}`});
    }else{
        return res.json(getPublicationByIsbn);
    }
});


//---------------------POST API-----------------------------------
//post a book
//http://localhost:3000/book
app.post("/book",(req,res)=>{
    //console.log("Request body:", req.body); // Log the entire request body
    const {newBook} = req.body;
    //console.log("newBook:", newBook); // Log the newBook value
    if (newBook) {
        db.books.push(newBook);
        return res.json(db.books);
    } else {
        return res.status(400).json({ error: "newBook is undefined" });
    }
});

//post author
//http://localhost:3000/author
app.post("/author",(req,res)=>{
    const {newAuthor}=req.body;
    if (newAuthor) {
        db.authors.push(newAuthor);
        return res.json(db.authors);
    } else {
        return res.status(400).json({ error: "newAuthor is undefined" });
    }

});

//post publication
//http://localhost:3000/publication
app.post("/publication",(req,res)=>{
//another approach
db.publications.push(req.body);
return res.json(db.publications);
});

//-------------------PUT API----------------------------------------
//upadte book details
//http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn",(req,res)=>
{

    console.log("REQUEST BODY: ",req.body);
    console.log("REQUEST PARAMS: ",req.params);
    const {isbn}=req.params;
    db.books.forEach((book)=>{
        if(book.ISBN === isbn){
            console.log({...book,...req.body});
            return {...book,...req.body};
        }
        return book;
    })
    return res.json(db.books);

});

//Update/add new author
//http://localhost:3000/author-update/1
app.put("/author-update/:id",(req,res)=>
    {
    
        console.log("REQUEST BODY: ",req.body);
        console.log("REQUEST PARAMS: ",req.params);
        const {id}=req.params;
        db.authors.forEach((author)=>{
            if(author.id === id){
                console.log({...author,...req.body});
                return {...author,...req.body};
            }
            return author;
        })
        return res.json(db.authors);
    
    });

//update publication
//http://localhost:3000/publication-update/1
app.put("/publication-update/:id",(req,res)=>
    {
    
        console.log("REQUEST BODY: ",req.body);
        console.log("REQUEST PARAMS: ",req.params);
        const {id}=req.params;
        db.publications.forEach((publication)=>{
            if(publication.id === id){
                console.log({...publication,...req.body});
                return {...publication,...req.body};
            }
            return publication;
        })
        return res.json(db.publications);
    
    });

//delete book based on ISBN
//http://localhost:3000/book-delete/12345ONE
app.delete('/book-delete/:isbn',(req,res)=>{
    const {isbn}= req.params;
    const filteredBooks=db.books.filter((book)=>{
       return book.ISBN !== isbn;
    })
    db.books=filteredBooks;
    console.log(db.books);
    return res.json(db.books);
});

//delete author based on id
//http://localhost:3000/author-delete/1
app.delete('/author-delete/:id',(req,res)=>{
    const {id}= req.params;
    const filteredauthors=db.authors.filter((author)=>{
       return author.id !== parseInt(id);
    })
    db.authors=filteredauthors;
    console.log(db.authors);
    return res.json(db.authors);
});


//delete publication based on id
//http://localhost:3000/publication-delete/1
app.delete('/publication-delete/:id',(req,res)=>{
    const {id}= req.params;
    const filteredpublications=db.publications.filter((publication)=>{
       return publication.id !== parseInt(id);
    })
    db.publications=filteredpublications;
    console.log(db.publications);
    return res.json(db.publications);
});

//delete an author from book
//http://localhost:3000/book-author-delete/:isbn/:id
app.delete('/book-author-delete/:isbn/:id',(req,res)=>{
    const {isbn,id}=req.params;
    db.books.forEach((book)=>{
        if(book.ISBN === isbn){
            if(!book.authors.includes(parseInt(id))){
                return ;
            }
            book.authors= book.authors.filter((author)=> author != parseInt(id));
            return book;
        }
        return book;
    })
    return res.json(db.books);
});

//delete an publication from book
//http://localhost:3000/book-publication-delete/:isbn/:id

//app.listen(3000);

app.listen(3000,()=>{
    console.log("My Express App is Running on Port :  3000");
})



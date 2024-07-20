//Main Backend FIle
require('dotenv').config();
//IMPORT FROE DATABASE
const BookModel = require("./Database/books.js");
const AuthorModel = require("./Database/authors.js");
const PublicationModel = require("./Database/publications.js");

//imports
const db = require("./Database/index.js");

//console.log(db);

//API
//import express
const express=require("express");

const app=express();
app.use(express.json());

//Approach 1


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



//APPROACH 2
var mongoose = require('mongoose');
var mongodb=process.env.MONGO_URI;
mongoose.connect(mongodb).then(() => console.log("Connection Established")).catch(err => console.error("Connection failed", err));

//-----GET API----------------------
//----------------------------MongoDB BOOK API------------------------

//get all books
//-------------mongoDB book Api-----------
//localhost:3000/books
app.get('/books', async (req,res)=>{
    const getAllBooks =  await BookModel.find();
    return res.json(getAllBooks);
})


//get specific books
//localhost:3000/book/12345TWO
app.get('/book/:isbn',async (req,res)=>{
    //req.params = isbn
    const {isbn}=req.params;//destructuring
    const getspecificBook=await BookModel.findOne({ISBN:isbn});
    //filter will always return a array
    if(getspecificBook === null){
        return res.json({"error": `No Book found for the ISBN of ${isbn}` });
    }else{
        return res.json(getspecificBook);
    }
});

//get list of  book based on category
//http://localhost:3000/books-category/fiction
app.get('/books-category/:category',async (req,res)=>{
    const {category}=req.params;
    const getBooksBasedOnCategory=await BookModel.find({category:category});
    if(getBooksBasedOnCategory.length === 0){
        return res.json({"error": `No Book found for the Catogory of ${category}` });
    }else{
        return res.json(getBooksBasedOnCategory);
    }
}
);


//get list of books based on author
//http://localhost:3000/book-author/1
app.get('/book-author/:author',async (req,res)=>{
    const {author}=req.params;
    const authorId = parseInt(author);

    if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid author ID. It must be a number.' });
      }
    const getBookBasedOnAuthor=await BookModel.find({authors:authorId});
    if(getBookBasedOnAuthor.length === 0){
        return res.json({"error": `No Book found for the Author of ${author}` });
    }else{
        return res.json(getBookBasedOnAuthor);
    }
});

//---------------------Author Api---------------------

//get all authors
//http://localhost:3000/authors
app.get("/authors",async (req,res)=>{
    const getAllAuthors= await AuthorModel.find();
    return res.json(getAllAuthors);
});

//req.params return string
//http://localhost:3000/author/2
//get specific author
app.get('/author/:id',async(req,res)=>{
    const {id}=req.params;
    const getAuthor=await AuthorModel.findOne({id:id});
    if(getAuthor=== 0){
        return res.json(`{"Error": No author found on this ${id}}`);
    }else{
        return res.json(getAuthor);
    }
});

//get a specific author based on books
//http://localhost:3000/authors/12345ONE
app.get('/authors/:isbn',async(req,res)=>{
    const {isbn}=req.params;
    const getAuthors=await AuthorModel.find({books:isbn});
    if(getAuthors.length === 0){
        return res.json({"Error  ":` No Author Found for this book ${isbn}`});
    }else{
        return res.json(getAuthors);
    }
});


//------------------------Publication GET API ---------------------
//get all publication
//http://localhost:3000/allpublication
app.get('/allpublication',async (req,res)=>{
    const allpublication= await PublicationModel.find();
    return res.json(allpublication);
});

//get a specific publication
//http://localhost:3000/publication/1
app.get('/publication/:id',async(req,res)=>{
    const {id}=req.params;
    const getSpecificPublication=await PublicationModel.findOne({id:id});
    if(getSpecificPublication.length === 0){
        return res.json({"Error":`No Publication found for this ${id}`});
    }else{
        return res.json(getSpecificPublication);
    }
}
);

//get specific publication based on book
//http://localhost:3000/publications/12345ONE
app.get('/publications/:isbn',async (req,res)=>{
    const {isbn}= req.params;
    const getPublicationByIsbn=await PublicationModel.find({books:isbn});
    if(getPublicationByIsbn.length===0){
        return res.json({"Error":`No Publication found for this book ${isbn}`});
    }else{
        return res.json(getPublicationByIsbn);
    }
});

//post using POSTMAN
//---------------------POST API-----------------------------------
//post a book
//http://localhost:3000/book
app.post("/book",async (req,res)=>{
    const addnewBook = await BookModel.create(req.body);
    return res.json({
        books:addnewBook,
        message: "Book was added!!"
    });
});



//post author
//http://localhost:3000/author
app.post("/author",async(req,res)=>{

    const addnewAuthor= await AuthorModel.create(req.body);
    return res.json({addedAuthor:addnewAuthor,message:"Author added Successfully"});

});

//post publication
//http://localhost:3000/publication
app.post("/publication",async(req,res)=>{
//another approach
// db.publications.push(req.body);
// return res.json(db.publications);
const addnewPublication=await PublicationModel.create(req.body);
return res.json({AddedPublication:addnewPublication,message:"Publication added Successfully"});
});


//-------------------PUT API----------------------------------------
//upadte book details
//http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn",async(req,res)=>
{
    const {isbn}=req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN:isbn},req.body,{new:true});
    //new : true -> it will return me the new data from postman ,if false just get find data not updated
    return res.json({bookUpadted: updateBook , message:"Book was upadtes !!!"});

});


//Update/add new author
//http://localhost:3000/author-update/1
app.put("/author-update/:id",async (req,res)=>
    {
    
      const {id}=req.params;
      const upadteAuthor = await AuthorModel.findOneAndUpdate({id:id},req.body,{new : true});
      return res.json({UpadatedAuthor:upadteAuthor,message:"Author upadted Successfully"});
    
    });

//update publication
//http://localhost:3000/publication-update/1
app.put("/publication-update/:id",async(req,res)=>
    {
    
     const {id}=req.params;
     const upadtePublication =await PublicationModel.findOneAndUpdate({id:id},req.body,{new:true});
     return res.json({UpadtedPublication:upadtePublication,message:"Publication updated successfully"});
});

//delete book based on ISBN
//http://localhost:3000/book-delete/12345ONE
app.delete('/book-delete/:isbn',async (req,res)=>{
    const {isbn}= req.params;
    const deleteBook = await BookModel.deleteOne({ISBN:isbn});
    return res.json({deletedBook:deleteBook,message:"Book was Deleted"});
});

//delete author based on id
//http://localhost:3000/author-delete/1
app.delete('/author-delete/:id', async(req,res)=>{
   const {id}=req.params;
   const deleteAuthor=await AuthorModel.deleteOne({id:id});
   return res.json({DeletedAuthor:deleteAuthor,message:"Author Deleted"});
});


//delete publication based on id
//http://localhost:3000/publication-delete/1
app.delete('/publication-delete/:id',async(req,res)=>{
    const {id}=req.params;
    const deletePublication = await PublicationModel.deleteOne({id:id});
    return res.json({DeletedPublication:deletePublication,message:"Publication deleted"});
});

//delete an author from book
//http://localhost:3000/book-author-delete/:isbn/:id
app.delete('/book-author-delete/:isbn/:id',async (req,res)=>{
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    else {
        getSpecificBook.authors.remove(id);
        const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, getSpecificBook, {new: true});
        return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
    }

});

//delete an publication from book
//http://localhost:3000/book-publication-delete/:isbn/:id

//app.listen(3000);

app.listen(3000,()=>{
    console.log("My Express App is Running on Port :  3000");
})



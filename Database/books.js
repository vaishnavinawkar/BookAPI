const mongoose = require("mongoose");

//create book schema(schema - rules and regulation and gievn some constriant or structure to data)
const BookSchema = mongoose.Schema(
    {
        ISBN:String,
        title:String,
        author:[Number],
        language:String,
        pubDate:String,
        numPage:Number,
        category:[String],
        publication:Number

    }
);

//creating BookModel
//(books ) is colllection name in mongoDB
const BookModel = mongoose.model("books",BookSchema);

module.exports=BookModel;
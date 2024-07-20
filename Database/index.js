//we are using javascript object as a database fro now

//books is a collection of an object
let books=[
    {
        ISBN :"12345ONE",
        title:"Getting Started with MERN",
        authors:[1,2],
        language:"en",
        pubDate:"2024-01-04",
        numOfPages:255,
        category:["fiction","tech","web dev","Programming"],
        publication:1
    },
    {
        ISBN :"12345TWO",
        title:"Ikigai",
        authors:[2,3],
        language:"en",
        pubDate:"2024-02-04",
        numOfPages:259,
        category:["tech","web dev","Programming"],
        publication:3

    },
    {
        ISBN :"12345THREE",
        title:"5 am Club",
        authors:[1,3],
        language:"en",
        pubDate:"2024-03-12",
        numOfPages:309,
        category:["Self improvement","fiction","novel"],
        publication:2

    }
];


//Authors

let authors=[
    {
        id:1,
        name:"Robin",
        books:["12345ONE","12345THREE"]
    },
    {
        id:2,
        name:"Hector Gracia",
        books:["12345TWO","12345ONE"]

    },
    {
        id:3,
        name:"Francesc Meralles",
        books:["12345THREE","12345TWO"]
    }
];

//publications
let publications=[
    {
        id:1,
        name:"ShapeAI publication",
        books:["12345ONE"]
    },
    {
        id:2,
        name:"Robhin Publication",
        books:["12345THREE"]
    },
    {
        id:3,
        name:"Sharma Publication",
        books:["12345TWO"]
    }
];

//exports
module.exports={books,authors,publications};
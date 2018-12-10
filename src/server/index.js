import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve client folder as client side
app.use(express.static('dist/client'));

// List Collection
const list = {
    "t0q0b3vubco": {
        title: "Gifts",
        content : "List of gits to make.",
        parent : null
      },
    "hfdjdjsfGFf": {
        title: "Mom & Daddy",
        content : "",
        parent : 't0q0b3vubco'
      },
    "fjsdjfdshqsd": {
        title: "Bro'",
        content : "",
        parent : 't0q0b3vubco'
      },
    "Hfhdsbbfdhs": {
        title: "iPad Air",
        content : "Waiting for Black Friday",
        parent : 'hfdjdjsfGFf'
      },
    "HVHBdygshdb": {
        title: "Sweatshirt",
        content : "",
        parent : 'fjsdjfdshqsd'
      },
    "bcYBbfuzlbd": {
        title: "New Nike Baskets",
        content : "",
        parent : 'fjsdjfdshqsd'
      },
    "t5l7h6r52f8": {
        title: "Home Decoration",
        content : "",
        parent : null
    },
    "Hfbdsfoidsff": {
        title: "Christmas tree",
        content : "Nordmann type",
        parent : "t5l7h6r52f8"
    },
    "BHbvuefebzjf": {
        title: "Table runner",
        content : "",
        parent : "t5l7h6r52f8"
    },
    "NBkvjucezfnz": {
        title: "Light strings",
        content : "",
        parent : "t5l7h6r52f8"
    }
}

// return a free id in collection. Return null if no id left available
const generateUniqueId = () => {
    let key = null;
    do{
        key = Math.random().toString(32).slice(2);
    }while( list[key] != undefined )
    return key;
}

// check if a param is correctly formated
const isParamCorrect = ( param ) => {
    if( param && typeof param === "string" && param != "" )
        return true;
    return false;

}

// check if the body param (title & parent id) are correctly formated
const validateForm = ( body ) => {
    if( isParamCorrect(body.title) )
        return true;
    return false;
}

const listRoute = express.Router();  // express Router to catch all list API Request

// middleware to use for all list requests
listRoute.use(function(req, res, next) {
    next();
});

listRoute.route('/list')
    // Create a new Todo
    .post( (req, res) => {
        // check if a title is send in the request && check its req.body.title && typeof req.body.title === "string" &type
        if( validateForm( req.body ) ){
            // make sure to use a unique id
            let uid = generateUniqueId();
            list[uid] = {  title : req.body.title, content : req.body.content, parent: req.body.parent  };

            res.sendStatus(200); // send 'Ok' message, entry saved
        }
        else{
            res.sendStatus(400); // Send Error : missing content
        } 
    })
    .get( (req, res) => {
        res.send(list);
    });

listRoute.route('/list/:id')
    .put((req, res) => {
        let id = req.params.id; // get string id from url, and not number 
        // check if a content is send in the request && check its type
        // and check if id exists
        if( validateForm( req.body ) ){
            list[id].title = req.body.title || list[id].title;
            list[id].content = req.body.content || list[id].content;
            if( isParamCorrect(req.body.parent) )
                list[id].parent = req.body.parent == "null" ? null : req.body.parent;
            res.sendStatus(200); // send 'ok', entry updated
        }
        else
            res.sendStatus(400); // Send Error : missing content to update
    })
    .get((req, res) => {
        let id = req.params.id; // get id from url
        // merge route for one & 'all' list the same
        if( id === "all" ) 
            res.send(list);
        else
            res.send(list[id]);
    })
    .delete((req, res) => {
        let id = req.params.id; // get id from url
        delete list[id];
        res.sendStatus(200); // send 'ok', entry updated
    });

// define the middleware
app.use( listRoute );

app.listen(4000, () => {
    console.log('Listening on port 4000...');
});
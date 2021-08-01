const express=require("express");
const ejs=require("ejs");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");

const app=express();
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect("mongodb://localhost/wikiDB", {useNewUrlParser: true,useUnifiedTopology: true});

const { Schema } = mongoose;
const wikiSchema=new Schema({
    title:String,
    content:String
});
const Article=mongoose.model("Article",wikiSchema);
// ---------------- Route-/articles ---------------------------
app.route("/articles")

.get(function(req,res){

    Article.find(function(err,foundArticles){
        if(!err) res.send(foundArticles);

    });

})

.post(function(req,res){
    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save(function(err){
        if(!err) res.send("Success");
        else res.send(err);
    });

})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err) res.send("Successfully deleted");
        else res.send(err);
    })
});


///////////////--------------------REQUEST FOR SPECIFIC ARTICLES------------//////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle) res.send(foundArticle);
    else res.send("no items");
})
})

.put(function(req,res){

    Article.update(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
        if(!err) res.send("Successfully")
    }
    )


})

.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        function(err){
            if(!err) res.send("done successfully")
        }
    )
})

.delete(function(req,res){

    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err) res.send("Deleted successfully");
        else res.send(err);
    })

});









app.listen(3000,function(req,res){
    console.log("server started");
})
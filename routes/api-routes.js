const express = require('express');
const router = express.Router();
const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models");



router.get('/', function (req, res) {
    res.render('home');
});

//Scrape route
router.get("/scrape", function (req, res) {
    console.log("***scrape***");
    var url = "http://www.nytimes.com/";
    axios.get(url).then(function (response) {
      let artArr = []
        var $ = cheerio.load(response.data);

      
        $("article").each(function (i, element) {

            // let e = element.find("h1").innerText;
            //  console.log(e);

            // let h = $("article").find("h1").innerText;
            // console.log(h);

            let headline = $(this)
                .children("h2")
                .text()
                .trim();
                letArr.push(headline);
                console.log(headline);
        });
        db.Article.create(artArr);
    });
});

            // let url = $(this)
            //     .children("header")
            //     .children("h1")
            //     .children("a").attr("href");


            // let summary = $(this)
            //     .children(".item__content")
            //     .children(".entry-summary")
            //     .children("p")
            //     .text()
            //     .trim();




    /*
    request(url, function (error, response, html) {
        if (error) {
            throw error;
        }
        console.log(response)

        //Load the scraped site's html into cheerio
        var $ = cheerio.load(html);

        //loop through each scraped article
        $("h2.post-title").children().each(function (i, element) {
            var title = $(element).text().trim();
            var link = $(element).attr("href");

            var result = {
                title: title,
                link: link
            };

            Article.find({
                link: result.link
            }, function (error, articleArr) {
                //If the current article is already in the database
                if (articleArr.length) {
                    console.log("Article skipped: ", articleArr)
                } //Otherwise, store it to the DB
                else {
                    var scrapedArticle = new Article(result);
                    scrapedArticle.save(function (error, doc) {
                        if (error) {
                            console.log("error: ", error);
                        } else {
                            console.log("new article scraped:", doc);
                        }
                    });
                }
            })
        });

        */
    // response.send("Site scraped!")




//Retrieve all articles from the DB
router.get("/articles", function (request, response) {
    Article.find({}, function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            response.json(doc);
        }
    });
});

//Retrieve a specific article by id
router.get("/articles/:id", function (request, response) {
    //Find the specific article in the DB
    Article.findOne({
            "_id": request.params.id
        })
        //Populate thehat article's comments
        .populate("comment")
        //Run the query
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                response.json(doc);
            }
        });
});

//Add and replace notes
router.post("/articles/:id", function (request, response) {
    //Make a new Note from the user's input
    var newNote = new Note(request.body);

    newNote.save(function (error, doc) {
        if (error) {
            console.log(error);
        } else {
            //Add new note/replace old note with new note
            Article.findOneAndUpdate({
                    "_id": request.params.id
                }, {
                    "note": doc._id
                })
                .exec(function (error, doc) {
                    if (error) {
                        console.log(error);
                    } else {
                        response.send(doc);
                    }
                })
        }
    });
});

module.exports = router;
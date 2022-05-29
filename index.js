const PORT = process.env.PORT || 8000; //for heroku deployment
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "times",
    address: "https://www.thetimes.co.uk/#section-money",
    base: "https://www.thetimes.co.uk",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/uk/technology",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/technology",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/money",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "es",
    address: "https://www.standard.co.uk/esmoney/investing",
    base: "https://www.standard.co.uk",
  },
  {
    name: "independent",
    address: "https://www.independent.co.uk/news/business",
    base: "https://www.independent.co.uk",
  },
  {
    name: "dm",
    address: "https://www.dailymail.co.uk/money/index.html",
    base: "https://www.dailymail.co.uk",
  },
  {
    name: "nypost",
    address: "https://nypost.com/business",
    base: "",
  },
  {
    name: "nyTimes",
    address: "https://www.nytimes.com/section/technology",
    base: "https://www.nytimes.com",
  },
  {
    name: "laTimes",
    address: "https://www.latimes.com/business/technology",
    base: "",
  },
  {
    name: "sydneymh",
    address: "https://www.smh.com.au/topic/cryptocurrencies-hpc",
    base: "https://www.smh.com.au",
  },
  {
    name: "cityAM",
    address: "https://www.cityam.com/crypto/",
    base: "",
  },
  {
    name: "dailyRecord",
    address: "https://www.dailyrecord.co.uk/news/science-technology",
    base: "",
  },
  {
    name: "onion",
    address: "https://www.theonion.com/breaking-news",
    base: "",
  },
  {
    name: "skyNews",
    address: "https://news.sky.com/technology",
    base: "https://news.sky.com",
  },
  {
    name: "coinTelegraph",
    address: "https://cointelegraph.com/",
    base: "https://cointelegraph.com",
  },
  {
    name: "usa",
    address: "https://eu.usatoday.com/money/investing",
    base: "",
  },
  {
    name: "newsday",
    address: "https://www.newsday.com/business",
    base: "",
  },
  {
    name: "irishTimes",
    address: "https://www.irishtimes.com/business/financial-services",
    base: "",
  },
  {
    name: "vox",
    address: "https://www.vox.com/business-and-finance",
    base: "",
  },
  {
    name: "mirror",
    address: "https://www.mirror.co.uk/money/",
    base: "",
  },
  {
    name: "express",
    address: "https://www.express.co.uk/finance",
    base: "https://www.express.co.uk",
  },
  {
    name: "metro",
    address: "https://metro.co.uk/news/tech",
    base: "",
  },
  {
    name: "huff",
    address: "https://www.huffpost.com/life/money",
    base: "",
  },
  {
    name: "irishindependent",
    address: "https://www.independent.ie/business/technology",
    base: "",
  },
  {
    name: "wired",
    address: "https://www.wired.co.uk/topic/business",
    base: "https://www.wired.co.uk",
  },
  {
    name: "mash",
    address: "https://www.thedailymash.co.uk/news/business",
    base: "",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("crypto")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my Crypto News API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("crypto")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

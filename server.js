/**
 * Main server file. Define node server and HTTP routes
 * /game allows user to see any j-archive game clue-by-clue
 * 
 */

const http = require('node:http');

// index.js
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 80;

app.use(cors());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.set("view engine", "ejs");


// create server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// /game 
app.get("/game/:id", async (req, res) => {
  const gameId = req.params.id;
  const url = `https://j-archive.com/showgame.php?game_id=${gameId}`;

  console.log("Fetching game:", gameId);
  console.log("URL:", url);

  try {
    const response = await axios.get(url);
    console.log("Fetched HTML length:", response.data.length);

    const $ = cheerio.load(response.data);
    console.log("Cheerio loaded");


    // Pull categories
    const categories = [];

    $(".category_name").each((i, el) => {
      const categoryName = $(el).text().trim();
      categories.push({ categoryName });
    });

    console.log("categories\n", categories);
    console.log("Total categories parsed:", categories.length);


    const clues = [];
    categoryCounter = 0;
    categoryIndex = 0;
    round = "";

    $(".clue").each((i, el) => {
      const question = $(el).find(".clue_text").filter(function() {
        return $(this).css("display") !== "none";
      }).text().trim();
      
      const answer = $(el).find(".correct_response").text().trim();
      value = $(el).find(".clue_value").text().trim();
      id = $(el).find(".clue_text").attr('id');

      if (id.includes("_J")) {
        id = 'A' + id;
        categoryIndex = categoryCounter%6;
        round = "Jeopardy!"
      } else if (id.includes("_DJ")) {
        categoryIndex = categoryCounter%6 + 6;
        round = "Double Jeopardy!"
      } else if (id.includes("_FJ")) {
        categoryIndex = 12
        round = "Final Jeopardy!"
      } else {
        console.log("⚠️ clue with unknown round type found");
      }

      // if this clue is a DD
      if($(el).find(".clue_value_daily_double").length > 0) {
        value = "Daily Double"
      }

      console.log('question   ', question);
      console.log('cat name right now is ', categories[categoryIndex]?.categoryName);

      if (question) {
        clues.push({
          question,
          answer,
          value,
          id,
          category: categories[categoryIndex]?.categoryName,
          round
        });
      }

      categoryCounter++;
    });

    console.log("cluesbeforesorting\n", clues);
    console.log("Total clues parsed:", clues.length);

    clues.sort((a, b) => a.id.localeCompare(b.id));

    console.log("clues\n", clues);
    console.log("Total clues parsed:", clues.length);

    if (clues.length === 0) {
      console.warn("⚠️ No clues found — selector may be wrong");
    }

    if (categories.length === 0) {
      console.warn("⚠️ No categories found — selector may be wrong");
    }


    res.render("game", { clues });

  } catch (err) {
    console.error("❌ ERROR in /game route:");
    console.error(err.message);
    console.error(err.stack);

    res.status(500).send("Internal Server Error");
  }
});


//error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED PROMISE REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});


app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:");
  console.error(err.stack);
  res.status(500).send("Something broke");
});
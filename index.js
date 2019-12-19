const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");


const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
    return inquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "What is your github username?"
        },
        {
            type: "list",
            message: "what is your favorite color?",
            name: "color",
            choices: [
                "green",
                "blue",
                "purple",
                "orange",
                "pink"
            ]
        },
    ]).then(function ({ username, color }) {
        const queryUrl = `https://api.github.com/users/${username}`;

        axios.get(queryUrl).then(function (res) {
            const user = res.data

            const name = user.name
            const pic = user.avatar_url
            const bio = user.bio
            const repo = user.html_url
            const company = user.company
            const numRepos = user.public_repos
            const followers = user.followers
            const following = user.following
            const location = user.location
            
            writeFileAsync("index.html", generateHTML(color, name, pic, bio, repo, company, numRepos, followers, following, location));
        });

    });
}
function generateHTML(color, name, pic, bio, repo, company, numRepos, followers, following, location) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <title>Document</title>
  </head>
  <body style="background-color:grey">
      <h1 class="display-4" style="color:${color}">${name}</h1>
      <img src="${pic}" alt="adam">
      <p>Bio: ${bio} </p>
      <p>Repo URL: <a href="${repo}"target="_blank">Adam's repo</a> </p>
      <p>Company: ${company}</p>
      <p>Public Repos: ${numRepos} </p>
      <p>Followers: ${followers}</p>
      <p>Following: ${following}</p>
      <p>Location: ${location}</p>

    

  </body>
  </html>`;
}

promptUser()
    .then(function () {
        console.log("Successfully wrote to index.html");
    })
    .catch(function (err) {
        console.log(err);
    });

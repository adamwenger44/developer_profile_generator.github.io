const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");
var pdf = require('html-pdf');




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
  <body style="background-color:${color}; padding-left:25px">
      <h1 class="display-4">${name}</h1>
      <img src="${pic}" alt="adam">
      <p style="color:white">Bio: ${bio} </p>
      <p style="color:white">Repo URL: <a href="${repo}"target="_blank">${name}'s profile</a> </p>
      <p style="color:white">Company: ${company}</p>
      <p style="color:white">Public Repos: ${numRepos} </p>
      <p style="color:white">Followers: ${followers}</p>
      <p style="color:white">Following: ${following}</p>
      <p style="color:white">Location: ${location}</p>

    
    
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


    var html = fs.readFileSync('./index.html', 'utf8');
    var options = { format: 'Letter' };
     
    pdf.create(html, options).toFile('./index.pdf', function(err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
    });
     
    
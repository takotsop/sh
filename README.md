# Secret Hitler Online
An online implementation of the tabletop game [Secret Hitler](http://secrethitler.com), built on node.js and socket.io.

Play at [secrethitler.online](https://secrethitler.online) (requires 5 players, use guest accounts to test).

Supports 5-10 players, text or voice (beta) chat, and the game's core rule set. Game data is persisted to allow features like stat aggregation, or game replays in future.

# Development

The app is written in vanilla HTML5, CSS3, and JS ES5. Files in `/server` run on the node.js server, files in `/public` are served statically when users load the page (index.html, bundle.js, and images), while files in `/common` are used in both.

#### Node

For testing/development purposes clone/fork the repository, and ensure you have [node.js](https://nodejs.org/en/) installed to start the server:
```
node server.js
```

By default, the app is served at `localhost:8004`

#### WebPack

Install [WebPack](https://webpack.github.io) to recompile assets in `/public` as they change:
```
npm install --global webpack
cd secret-hitler
webpack --watch
```

#### Database

Unless you specifically need to test the user accounts system or game persistence features, you don't need to run a local db instance. Instead, simply sign in via the guest button (note that in this mode, not all features are available). If you do want to run the database, you'll need to be running a recent version of [Postgres](http://www.postgresql.org).

1. Create a new database and import [schema.sql](schema.sql)
2. Set `LOCAL_DB_URL` in [server/tools/config.js](server/tools/config.js) to the Postgres database URL
3. (optional) Set `SENDGRID_API_KEY` to your [SendGrid](https://sendgrid.com) account's API key if you want to test email delivery

# Contributing

Pull requests welcome, or create an [issue](https://github.com/kylecoburn/secret-hitler/issues) to make a bug report or feature suggestion.

# Attribution
"Secret Hitler" is a game designed by Max Temkin, Mike Boxleiter, Tommy Maranges, and Mackenzie Schubert. This adaptation is neither affiliated with, nor endorsed by the copyright holders.

It is licensed under [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (non-commercial, share-alike, attribution required).

# Screenshots
![Secret Hitler Online start](http://i.imgur.com/QJ1kEXS.png)


# Project Name : Blog Website <a href="https://debashisblog.herokuapp.com/">Visit</a> 
<hr>
<h2>Description</h2>
<p>A Blogging Website, where you can <b>signup/login</b> using <b>google account</b> and <b>start writting</b> 
  anything about coding, <b>read</b> what other people posting and <b>perticipate</b> in discuusiion 
  through <b>comment</b> and <b>reply</b> dialogs. you can also <b>support other</b> view by <b>liking</b> their comments, replies and posts.</p>

<h2>Technologies</h2>
<table>
      <tbody>
        <tr>
          <th>express-handlebars</th>
          <th>css</th>
           <th>jquery</th>
           <th>editor.js</th>
        </tr>
         <tr>
           <th>axios</th>
          <th>node.js</th>
          <th>express.js</th>
           <th>mongodb</th>
        </tr>
          <tr>
           <th>REST Api</th>
         </tr>
      </tbody>    
</table>

## Features
<table>
      <tbody>
         <tr>
          <td>Read posts, Write comment, Reply on comment, Like others comments and replies on posts by visiting individual post page.</td>
        </tr>
        <tr>
          <td>Home page with recents posts, can be sort by last week and month.</td>
        </tr>
        <tr>
          <td>Search posts by post title .</td>
        </tr>
        <tr>
          <td>User Authenticating with google oauth 2.0 .</td>
        </tr>
         <tr>
          <td>Sign in Sign out using google account.</td>
        </tr>
        <tr>
          <td>Upload cover image and write a post with user friendly block level editor, editorjs .</td>
        </tr>
         <tr>
          <td>Personalised user profile .</td>
        </tr>
         <tr>
          <td>Personalised user dashboard, manage posts from here .</td>
        </tr>
          <tr>
          <td>Email your message from contact page .</td>
        </tr>
         <tr>
          <td>About page .</td>
        </tr>
      </tbody>    
</table>

### NPM Packages
- method-override
- express-session
- passport
- passport-google-oauth20
- googleapis
- nodemailer
- mongoose
- connect-mongo
- multer
- moment
- random
- morgan
- dotenv
- nodemon
### Other Applications
- Postman
- vs code
## How to setup locally and getting started to improve and add new features.
### 1. Create a new directory, cd into it and run 'git init' .
### 2. Clone this repository
### 3. Create a .gitignore file add node-modules, .env .
### 4. Run 'npm installl' , it will install all npm packages and dependencies .
### 5. Create and setup a app in google developer console and obtain CLIENT_ID and CLIENT_SECRET
### 6. Obtain Refresh token by providing CLIENT_ID, CLIENT_SECRET from google's OAuth 2.0 playground to access Gmail Api 
### 7. Setup mongodb cloud database and obtain connection url
### 8. Create a .env in config directory inside projects root directory.
### 9. setupp .env variables 
- PORT
- MONGO_URI
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- SESSION_SECRET
- COOKIE_NAME
- GMAIL_REFRESH_TOKEN
- USER_EMAIL
- MESSAGE_RECEIVER
### 10. Replace 'callbackURL' inside root -> config -> passport.js  with callback url of your app that you  provided in google developer console.
### 11. Replace baseUrl with your host address (eg:- http://localhost:3000/ ) for Api call in client side scripts present inside root -> public -> js
### 12. Run 'npm run dev' to run the app in development mode
### 13. open host addess to view the website.

### Concepts

#### This website is build on four basic concepts

- Blogs:  The root concept of the website. A blog has posts .

- Posts:  A blog post is the publishable item that the blog author has created. This information is meant to be timely, reflecting what the authors want to publish to the world now. It is understood that as time passes, blog posts content ages and becomes less relevent.

- Comments:  A comment is the place where people including blog post author can react to the post, perticiapte in comment and replie dialogs.

- Users:  A user is someone who interacts with the website, be they acting as an Author, an Administrator, or just a Reader. For public blogs, readers may be anonymous, but to write post and react to post a reader must be identified by the wensite .

(2021 Edit : Some heavily used npm modules are deprecated. All functions may not work properly. Will need a few hours of fixing.)
# Discoodle

# Discoo.dog : A discoodle implementation.

Discoo.dog is a web application with the main features of Discord and Moodle. It can be used by students to chat, voice chat, check announcements, and discuss with their teachers.

It has a similar interface to discord, with channels, servers, WebRTC voice and video chat.

## Main Features :

1. Real time WebSocket chat with custom profile pictures and sent dates.
2. Real time WebSocket image upload and display. Images are stored server side and on the database and are served to every user.
3. Server - Channel - Chat hierarchy. Dynamic. Can be used for a wide range of projects (Like Discord and Slack.)
4. Client side custom SQL API. Can interact with database anywhere in any file to get and display data.
5. Real time calling with voice and camera. Private rooms for any course. Can have multiple rooms for multiple courses at the same time.
6. HTTPS certificate on discoo.dog - needed for modern browsers to allow Peer to Peer voice / video chat.
7. Permission system with Admin, Teacher and Student panels. Depending on the roles, they can change roles, assign to courses, create courses, create articles etc...
8. Profile page, to display information about the current user, and change the profile picture and update it to the whole server.
9. Home page displaying the last information and updates to the user. Teachers and admins can add articles on the home page using the "write articles" page.
10. Full Login / Register, Session cookies, safe database with encrypted passwords. No need to reconnect everytime you join discoo.dog.

## Implementation :

Discoo.dog is a fully dynamic web application. **It is almost 100% javascript.** Which makes it asynchronous and way faster. Since it's a web app, it can also be multiplatform or implemented into a standalone executable as in Discord (using Electron).

### Languages used :

Front end : HTML5, Javascript, CSS.

Back end : NodeJs, SQL.

### Main libraries used :

1. Express Server (HTTP Requests)
2. Mutler (File Upload)
3. Socket.io (WebSockets)
4. bCrypt (Back-end encryption)
5. CookieParser (Back-End cookie parser)
6. MySQL (SQL)
7. HandShake (Client-Server middleware)
8. PeerJS (Peer-to-Peer WebRTC for voice and video)

## How to run :

### Prerequisites :

In order to run discoo.dog, **you need (Linux Terminal):**

**1) Npm :** `apt install npm`

**2) NodeJs :** `apt install nodejs`

**3) MySql :** `apt install mysql`

In order to run discoo.dog, **you need (Mac Terminal):**

**1) Npm :** `brew install npm`

**2) NodeJs :** `brew install nodejs`

**3) MySql :** `brew install mysql`

### Running :

If you're running this for the first time, you need to setup your mysql database. Execute these lines **in order in the git folder** :

```
mysql -u root -p
CREATE DATABASE discoodle;
USE discoodle
SOURCE discoodle.sql
```

**PS: You can use PhpMyAdmin for an easier mysql database setup.**

Then, we need to install npm prerequisites and run the local server. Execute these lines **in order in the git folder** :

```
npm install
npm start
```

But you may have problems here, this is probably due to the bcrypt library.
If this happens, please follow these commands

```
sudo npm install
sudo npm uninstall bcrypt
sudo npm install bcrypt
sudo npm start
```

If the console logs `Server started`, we can open a web browser and type the url:

`localhost:5000`

You can also go directly to : `https://discoo.dog:5000`

## How to use the website:

### Home page :

After logging in, you are redirected to the home page. You see the main news displayed to your screen. You can access, from the navigation bar :

1. **Profile :** Here you will have all the info related to your profile (Username, email, etc...). **You can also change your profile picture.**

2. **Messages :** Here you can access the main web application. **You can consult courses, chat in realtime, access realtime voice and video chat (one room for each course), upload images, etc...**

3. **Write an article :** Here you can access the page to write an article. **The article will be then displayed on the public home page.**

4. **Teacher's panel :** Here you can access the teacher's panel. **Teacher can assign student to courses, create / delete courses etc...**

5. **Admin panel :** If you are admin, you can access the admin panel. **You can change users roles.**

### Role system :

Discoo.dog works with a role hierarchy.

Every user can either be an `admin`, a `teacher` or a `student`.

**Admin > Teacher > Student.**

Account created have the `student` role by default.

The user `admin` can administer the whole server and manage users and professors (You can access the administration panel from the `home` page ).

The user `teacher` can administer the classes, courses and modules (You can access the professor panel from the `home` page ).

The user `student` can join a class. Class which are composed of different courses themselves
composed of different modules

Examples : You have three different accounts created by default :

1. `admin@admin.com` with the password `admin`
2. `teacher@teacher.com` with the password `teacher`
3. `student@student.com` with the password `student`

### Dynamic hierarchy :

Discoo.dog uses dynamic hierarchy, and can be used by multiple establishements / servers / licenses.

An example of a possible hierarchy :

L1 Info -> Modules of L1 Info -> Courses for each module of L1 Info + Different chat channel + A unique voice chat room.

You can dynamically adjust the hierarchy to basicly fit whatever your needs are using the admin panels.

1. Students can only see the servers and the courses they are assigned to (by themselves, teachers or admins).
2. Teachers can only see the servers and the courses they are assigned to, **and they can write announcements or information in the courses rooms**. Students can see the rooms but cannot write in them.
3. **Admins can see all the servers and all the courses. They can assign anything to anyone. They basicly have every permission on the server.**

### Possible improvement :

Discoo.dog is a 100% JavaScript, HTML and CSS web app. **This means it can be implemented easily on Electron, and be an executable file like Discord, Spotify, Slack, VSCode etc...**

**A web browser wouldn't be needed anymore.**

# German Election Map Simulator
This is a website with interactive maps and data about the 2017 German general election. This website attempts to inform people about the German election system and politics in Germany.

## Code
This website is written with HTML, using CSS for styling and JavaScript for most of the functions to do with maps and other interactive elements.

## Question and Answers

### What is the point?
This project was initially created for my IB (International Baccalaureate) Personal Project which every person of the same year group had to complete to pass the Middle Years Program. 
My intention with this project is to inform people about politics in other countries and how their systems differ from more well-known elections such as those in the USA.

### Launching the website by opening the ```index.html``` file in my browser returns an error.
Yes, this is because one of the functions I used to parse the CSV data does not recognise the ```file:///``` origin (CORS request not HTTP) and as a consequence I had to move the website onto my localhost.

### How do I set up localhost?
#### Windows 10
##### Setting up localhost
1. Go to the Control Panel
2. Click on "Programs"
3. Under "Programs and Features" select "Turn Windows features on or off"
4. In the new pop-up window expand the "Internet Information Services" (IIS) option
5. Tick the "Web Management" Tools and "World Wide Web Services" options
6. Now you have set up your localhost. In any browser type "localhost" in the search bar and it should redirect you to the default localhost front page (a cheesy and grainy Micorsoft collage)

##### Running a website
1. Navigate to ```C:\inetpub\wwwroot```
2. In this directory there should be a .png and .htm file, you can delete these if you want to but I recommend that you keep them stored in a separate directory just in case
3. In this directory you can create new files and write on them. To create a website you need to have at least one HTML file called index.html, this will be the page that opens first so you would probably want this to be your home page. It does not matter what any of the other folders or files are called.
4. Now just launch your locahost and the results should appear.

##### Issues
1. If you have insufficient permissions to edit the files in this directory, exit the `wwwroot` file and right click the `inetpub` folder
2. Click "properties" and navigate to the "security" tab
3. Select your user account and tick all permissions
4. Press "OK"

#### macOS
https://websitebeaver.com/set-up-localhost-on-macos-high-sierra-apache-mysql-and-php-7-with-sslhttps 

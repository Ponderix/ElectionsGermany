# German Election Map Simulator
This is a website with interactive maps and data about the 2017 German general election. This website attempts to inform people about the German election system and politics in Germany.

## Code
Languages used: HTML, CSS, JavaScript
Libraries used: d3.js (v6) for most of the graphical representations and topojson to convert GeoJSON into SVG.

## Questions and Answers

### What's the point?
This project was initially created for as a school project. My intention with this project was and is to inform people about politics in Germany and their unique election system.

### How did you do it?
First of all I must mention that this was not really my own idea. A lot of the ways in which this website is constructed and how it works is based off https://principalfish.co.uk/electionmaps/?map=prediction (link to their github: https://github.com/principalfish/principalfish.github.io).
The maps are generated from GeoJSON files released by the Bundestagswahleiter https://www.bundeswahlleiter.de/service/glossar/w/wahlleiter.html (the detailed election results also originate from there), this was then converted into TopoJSON using https://mapshaper.org/. With d3.js and topojson this is converted into a vector graphic. 

Please note that d3.js v6 has different syntax thanm the previous versions, most online tutorials are sadly working with versions prior to this one, if something is not working always check if it is because of the version first.

### Launching the website by opening the ```index.html``` file in my browser returns an error.
Yes, this is because one of processing .json and .csv files in d3.js creates and error as it does not recognise the ```file:///``` origin (CORS request not HTTP). The solution is the use a localhost.

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

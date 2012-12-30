Enyo 2.0 With WebWorks Extensions
=================================

This example shows how to build an application with Enyo 2.0 and include native functionality with BlackBerry WebWorks extensions. This sample will include displaying data from the application's config.xml file, the battery status, accelerometer, and downloading a remote binary file and opening it with the default handler on the PlayBook. This sample uses some extensions that are customized for the PlayBook, and requires the BlackBerry WebWorks for Tablet packager.

## Enyo 2.0
Enyo 2.0 is available from the EnyoJS organization on Github (https://github.com/enyojs/enyo), and from a zip: http://enyojs.com/#download. Enyo 2.0 is released under the Apache 2.0 license.

Enyo 2.0 is based on the Enyo 1.0 framework but is designed to be a cross platform framework for all modern mobile and desktop browsers. Since BlackBerry 6, 7.x, PlayBook 1/2.x and BlackBerry 10 all have WebKit Browsers, and allow you to package web content into full applications, it's possible to port Enyo 2.0 applications to BlackBerry relatively quickly. 

## Building for BlackBerry
This application requires Enyo 2.0, and was built with the beta 3 version. This is the approach that was followed, starting with a basic index.html file.

1. Download 2.0 from EnyoJS.com
2. Create an /enyo dir and put enyo.js and enyo.css there
3. Include enyo references: &lt;link href='enyo/enyo.css' rel='stylesheet' type='text/css'&gt; and &lt;script src='enyo/enyo.js'&gt;&lt;/script&gt;
4. Create a /lib folder and copy Enyo libraries (Onyx and a couple extras: ProgressBar and Slider)
5. Create a package.js file in /js and link to it
6. Create a config.xml file
7. Write Enyo code with WebWorks Extensions
8. Zip your package
9. Run the zip through the WebWorks Packager

### Package.js for Enyo dependencies
package.js is the standard name of the dependency file for Enyo 2.0. This file was put in the /js folder and loads the Onyx library:

> enyo.depends(

>	"$lib/onyx"

> );

### Creating a config.xml file
The config.xml file tells the packager the details it needs in order to build an application.

The details to set are as follows:
* Name appears on the Homescreen
* Description appears in the Application list
* Author must match Debug Token
* Add an Icon and Loading Screen image (loading screen is optional)
* Can force a single orientation if necessary
* Content points to our index.html
* Permissions for shared directory on file system

> &lt;rim:permissions&gt;

> 	&lt;rim:permit&gt;access_shared&lt;/rim:permit&gt;

> &lt;/rim:permissions&gt;

* Feature inclusions for WebWorks Extensions

> &lt;feature id="blackberry.app" required="true" version="1.0.0.0"/&gt;

> ...

See our documentation on creating a config.xml file here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Working_with_Config_XML_file_1866970_11.html

### Write Enyo code with WebWorks Extensions
Obviously the code is there for viewing, but there are a couple of special things to note.

The binary file download uses base64ArrayBuffer.js from Jon Leighton (https://gist.github.com/958841).
The saving of that file uses a patch to the WebWorks Tablet SDK stringToBlob method, posted here: https://github.com/timwindsor/WebWorks-TabletOS/commit/c67549e58d04f3b7b26e8a352a7f78021c3c5cee

Due to the patch, this sample only works with the Tablet SDK right now.

### Zip the package
The zip file needs to follow a basic pattern: config.xml must be at the root of the zip, but other resources can be in folders. You just need to reference the content appropriately.

See more documentation on the zip archive here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Creating_an_archive_file_1873325_11.html

### Package with WebWorks
Depending on which platforms you are targetting, there are different packagers. Each takes the same archive content and creates a different application container in the appropriate SDK. The WebWorks packagers can be downloaded here: https://bdsc.webapps.blackberry.com/html5/download/sdk. Note that this sample is only designed to work with the Tablet SDK.

For *BlackBerry PlayBook tablets* with OS 1.0 and 2.x, the packager creates an AIR application. Details on packaging an application are here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Compile_WW_app_for_Tablets_1873322_11.html

The basic WebWorks SDK supports command line packaging, but packaging is also supported through the [Ripple Emulator](https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Packaging_your_app_in_Ripple_1904611_11.html), and the [BlackBerry Graphical Aid](http://supportforums.blackberry.com/t5/Testing-and-Deployment/BlackBerry-Tablet-OS-Graphical-Aid/ta-p/1207067)

## Additional Resources on Enyo
The Enyo JS framework has a website with many resources, including links to forums, samples and documentation here: http://enyojs.com/

The main Github site is here: https://github.com/enyojs

## Addiitonal Resources on BlackBerry
The BlackBerry WebWorks microsite is here: https://bdsc.webapps.blackberry.com/html5/

Forums for WebWorks development are here: http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/bd-p/browser_dev

The main BlackBerry Github site is here: http://github.com/blackberry

## License
Enyo Framework and sample is released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).

Packaging files for this sample are also released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html).

## Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
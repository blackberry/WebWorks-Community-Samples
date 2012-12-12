Enyo 1.0 Style Matters Example
==============================

This example shows how to build the Enyo 1.0 sample application Style Matters as a BlackBerry WebWorks application.

## Enyo 1.0
Enyo 1.0 is available from the EnyoJS organization on Github (https://github.com/enyojs/enyo-1.0), and from a zip: https://github.com/downloads/enyojs/enyo-1.0/enyo-1.0-r1.zip. Enyo 1.0 is released under the Apache 2.0 license.

Enyo 1.0 was the development platform on the webOS devices and requires a WebKit based browser for rendering. Since BlackBerry 6, 7.x, PlayBook 1/2.x and BlackBerry 10 all have WebKit Browsers, and allow you to package web content into full applications, it's possible to port Enyo 1.0 applications to BlackBerry relatively quickly. 

## Style Matters
The Style Matters sample comes with Enyo 1.0, and is a showcase application with UI Samples and Enyo code. We will use this example as our starting point to build a WebWorks application for BlackBerry. Source for this can be viewed here: https://github.com/enyojs/enyo-1.0/tree/master/support/examples/StyleMatters

## Building for BlackBerry
Enyo 1.0 was built into the webOS device so applications simply referred to the onboard location in their HTML like this: 
&lt;script src="../../../../1.0/framework/enyo.js" launch="debug" type="text/javascript"&gt;&lt;/script&gt;
When building for BlackBerry or another platform, you will need to obtain a copy of the framework to build into your application, and follow steps like this:

1. Download 1.0 from EnyoJS.com
2. Unpack the framework directory into your project
3. Update your enyo.js reference: &lt;script src="/framework/enyo.js" launch="debug" type="text/javascript"&gt;&lt;/script&gt;
4. Remove webOSconnect_1_3.jar from framework/build/palm/services/bridge and framework/source/palm/services/bridge
5. Create a config.xml file
6. Zip your package
7. Run the zip through the WebWorks Packager

### Creating a config.xml file
The config.xml file tells the packager the details it needs in order to build an application.

The details to set are as follows:
* Name appears on the Homescreen
* Description appears in the Application list
* Author must match Debug Token
* Add an Icon and Loading Screen image (loading screen is optional)
* Can force a single orientation if necessary
* Content points to our index.html

See our documentation on creating a config.xml file here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Working_with_Config_XML_file_1866970_11.html

### Zip the package
The zip file needs to follow a basic pattern: config.xml must be at the root of the zip, but other resources can be in folders. You just need to reference the content appropriately.

See more documentation on the zip archive here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Creating_an_archive_file_1873325_11.html

### Package with WebWorks
Depending on which platforms you are targetting, there are different packagers. Each takes the same archive content and creates a different application container in the appropriate SDK. The WebWorks packagers can be downloaded here: https://bdsc.webapps.blackberry.com/html5/download/sdk

For *BlackBerry Java Smartphones* with OS 5, 6 or 7.x, the WebWorks packager makes a Java application. Details on packaging an application are here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Compile_WW_app_for_Smartphones_1873321_11.html

For *BlackBerry PlayBook tablets* with OS 1.0 and 2.x, the packager creates an AIR application. Details on packaging an application are here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Compile_WW_app_for_Tablets_1873322_11.html

For *BlackBerry 10 devices*, the packager creates a native application in JavaScript and C/C++. Details on packaging an application are here: https://bdsc.webapps.blackberry.com/html5/documentation/ww_developing/Package_your_BB10_app_with_WW_SDK_2008473_11.html

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
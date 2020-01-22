# One Api

OneApi uses [Azure/iisnode](https://github.com/Azure/iisnode) to run nodejs on IIS. 

## How to install: 
- install [nodejsx x64](https://nodejs.org/en/download/)
- Turn On IIS on windows features
- Configure site. Use oneapi folder as physical Path
- Install [Url Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite) 
- Install [iisnode module](https://github.com/Azure/iisnode) 
- Unlock [ApplicationHost.Config]( https://stackoverflow.com/questions/34199976/iis-config-error-this-configuration-section-cannot-be-used-at-this-path/35332431)
- cd oneapi
- Run `npm install`
- Start website
- To test, open your browser or curl and set a request to oneapi. e.g `http://mysite/api` 


## How to debug locally: 
- Install [Visual Studio code](https://code.visualstudio.com/)
- Update desired port number(Don't use the same port number as IIS) by updating `.vscode/launch.json`. Default `884`
- Add breakpoints 
- Run debugger via `F5` 

## How to debug on IIS:
- under **iisnode folder** there is an index.html that contains log files.  
- *-stderr-*.txt contains log errors.
									
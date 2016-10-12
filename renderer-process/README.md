# Renderer Process

Since Electron uses Chromium for displaying web pages, Chromium’s multi-process 
architecture is also used. Each web page in Electron runs in its own process, 
which is called the renderer process.

In normal browsers, web pages usually run in a sandboxed environment and are not allowed 
access to native resources. Electron users, however, have the power to use Node.js 
APIs in web pages allowing lower level operating system interactions.

* [More info](http://electron.atom.io/docs/tutorial/quick-start/#renderer-process)
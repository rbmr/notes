Suppose you want to quickly automate some simple process, and maybe share it with some people that dont know how to code. How would you do this?

We tackle this problem from the perspective of ux. We divide into:
1. accessibility (how easy it is to get access to the app),
2. usage (how easy it is to use the app for your use cases). 

The winner on both fronts is generally a website. Then, any person with access to a browser can use your tool. This comes with the following two limitations:
1. The issue of deployment. For people to be able to use your app, you will need a server. If your tool can be built as a static web app, this is generally free, and comes with the added benefit of privacy as your site doesn't store or access any user data.
2. The issue of capability. Websites are quite limited in the amount of actions they can do on the users behalf, and JavaScript is generally quite slow. One could offload more complex actions to the back-end but this would come at the cost of more server-side compute.

The alternative is to have a user install the tool once, and then run it on the their own system entirely. We divide into two approaches: graphical user interfaces, or command line interfaces, or a combination of both (e.g. install via CLI, use via GUI).

For graphical user interfaces (GUIs) a user downloads an installer using a link, and then runs the installer to install the app on their machine (respecting their OS). Next, the user can launch the tool using their system search, or by opening some file that represents the entry point to the application. This launches the GUI providing them access to all the needed functionalities.

For command line interfaces (CLIs) a user installs the tool via a package manager, or fetches it via curl (if the tool requires installation, we fetch an install script first). Then, a user uses the tool via the CLI. 

The GUI approach is generally more intuitive for users that have little experience with the terminal. However, the CLI approach is generally easier to set up, and makes it easier for the users to write scripts that utilize the tool internally.

Note: a use may also want to work with the source code directly. However, this is only really recommended if the requirements of users differ significantly, and they just need some starting point to work from. In this case you are actually just publishing a package.








# Ripple

A browser based, platform agnostic mobile application development and testing tool.
 
All source code (excluding third party libraries) are subject to:

Copyright (c) 2011 Research In Motion Limited

## License

All assets in this repository, unless otherwise stated through sub-directory LICENSE or NOTICE files, are subject to the Apache Software License v.2.0.

In particular, the assets under `assets/*/images` are excluded from the Apache Software License v.2.0.  Please see the [NOTICE](https://github.com/blackberry/Ripple-UI/tree/master/ssets/client/images) file for more details.

## Build Requirements

* nodejs, npm
* OSX or linux (windows is not currently supported for development)

## Getting Started

To install:

    npm install -g ripple-emulator

This will install a global script called `ripple`. To see usage, run:

    ripple help

To use emulate a local application or a remote website, try:

    ripple emulate --path to/my/app

    # or

    ripple emulate --remote http://remote-site.com

Then navigating to (your app's html file):

    http://localhost:PORT/index.html?enableripple=true

## Hacking

If you plan to dive into the source, be sure to check out the [HACKING](https://github.com/blackberry/Ripple-UI/blob/master/HACKING.md) file.

To get started, you need to setup a few things, first- run (in the project root):

    ./configure

This script will pull down the needed npm packages and initialize the submodules.

### Build Commands

    jake

This will build ripple to the `pkg/` folder. In that folder there are various targets that can be used.

    jake -T

This will describe all the available commands for building and running the tests, etc.

### Running As A Chrome Extension

* Go to the extension management page (chrome://chrome/extensions/) in chrome.
* Ensure that you have selected the developer mode checkbox.
* Click the Load Unpacked extension button.
* Select the `pkg/chrome.extension` folder.

NOTE: For development you should be fine to just build with jake and refresh your browser.
If you end up editing anything in the ext folder you will need to refresh the extension from the extension management page.

For more information see [doc/chrome_extension.md](https://github.com/blackberry/Ripple-UI/blob/master/doc/chrome_extension.md).

## Contributing

The `master` branch is the latest (stable) release. The `next` branch is where all development happens.

If you like the project, and want to contribute code, please issue a pull request (on [GitHub](https://github.com/blackberry/Ripple-UI/pulls)) into the `next` branch.

Note: You will need to submit an Apache [ICLA](http://www.apache.org/licenses/#clas) (Individual Contributor License Agreement) for your contribution to be accepted.

## Code Guidelines

* 4 spaces per editor tab.
* `jake lint`, no new lint errors introduced.
* All unit tests are green.

## Reference Material &amp; Community

You can also find associated reference material for the Ripple tool as well as contributor forums at the following locations.

* [Blackberry Contributor Forums](http://supportforums.blackberry.com/t5/Ripple-Contributions/bd-p/ripple)
* [Developer Documentation](https://github.com/blackberry/Ripple-UI/tree/master/doc)


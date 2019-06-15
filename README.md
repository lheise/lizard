Lizard repo
*for personal use only*

========
Tooling credit goes to Jeremy Peter
========

## System Requirements
**Node**  -  `>= v8.9`   
**Xcode** - `Latest` with [Command Line Tools] installed  
**Phantomjs** - `Latest` [Download here](http://phantomjs.org/download.html)  

[Command Line Tools]: http://stackoverflow.com/questions/9329243/xcode-4-4-and-later-install-command-line-tools

Once you've cloned the repo and system requirements are met, follow the 2 steps below.

## Step 1 - Install gulp

Install [gulp] globally with the command below. *__NOTE:__ If you get an error, add ```sudo``` at the beginning of the command* 

[gulp]: https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally

```bash
npm install -g gulp
```

## Step 2 - Install node modules

    
```bash
npm install
```

### Terminal Commands

Run these commands at the root of the repo. 

`gulp`  - Watch files and builds email [Campaign Monitor] / [Mandrill]  
`gulp build` - Compiles `template.html` file to `email.html` file
`gulp test`  - Use run mocha tests for `email.html` (please keep in mind that gulp must be running to run `gulp test`)       


### Add environment variables to bash config file

Your bash config file is typically named either `.bash_profile`, `.bashrc` or even `.profile`. It's usually located in your home directory as a hidden file. 

If you don't have one then, create one running `touch ~/.bash_profile` from the command line. Then, you can run `open ~/.bash_profile` to open it up. 

### Handlebars Template Tags

[Available tags](https://mandrill.zendesk.com/hc/en-us/articles/205582537-Using-Handlebars-for-dynamic-content)


### Tips to remember

When updating/creating emails, always develop in the **template.html**. Gulp will create an **email.html** file that will contain the production ready code for you every time you save the **template.html** file. There should not be a need to touch the **email.html** unless your debugging. 
    
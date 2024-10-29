# Basic Static Website with Decap

## Project requirements

This project requires Node version 14 or greater to be installed.

## Where are your website files?

### Generating your website
Open a console in the root folder of the project. That is the folder this the 
file you are reading is in.

If you hane not previously, run `npm install`, and the package manager will
install the required project dependencies to the ./node_module folder.

Run this command in the console  
`npm run build`  

Your website files should now be located in the `_site` directory.˝

## The _static Directory

Any files and folders in `src\_static\` will be added to the root directory of
the site, unchanged.

ie: `src/_static/somefile.md` will not be processed into an html file, and will
instead be available at `<URL>/somefile.md``

## Local Development

`npm start`

This will start the eleventy dev server, tailwind in watch mode, and the Decap 
local server

You can make and commit edits in Decap localy (ie: not committing directly to github). 

### Frameworks and tools installed

Tailwind CSS in installed and set up in this project.  
:warning:Tailwind includes the [Preflight](https://tailwindcss.com/docs/preflight) CSS reset.

### Differences of note

Non-local editing in Decap will commit directly to branch 'main'.  
Local editing will be confined to the branch currently checked out localy.

Non-local editing in Decap will send the commits to main on each page save.  
Local editing saves commits localy, then you can push/merge them when you choose.
This means that non-local will trigger github actions on every save, while local 
editing will trigger github actions when you push the changes.


# Contributing
Changes and improvements are more than welcome! Feel free to fork and open a pull request.

Please follow the house rules to have a bigger chance of your contribution being merged.

## House rules

### How to make changes
 - To make changes, create a new branch based on `master` (do not create one from `gh-pages` unless strictly necessary) and make them there, then create a Pull Request to master.  
 `gh-pages` is different from master in that it contains sharing features, analytics and other things that have no direct bearing with the game. `master` is the "pure" version of the game.
 - If you want to modify the CSS, please edit the SCSS files present in `style/`: `main.scss` and others. Don't edit the `main.css`, because it's supposed to be generated.  
 In order to compile your SCSS modifications, you need to use the `sass` gem (install it by running `gem install sass` once Ruby is installed).  
 To run SASS, simply use the following command:  
 `sass --watch style/main.scss`  
 SASS will automatically recompile your css when changed.
 - `Rakefile` contains some tasks that help during development. Feel free to add useful tasks if needed.
 - Please use 2-space indentation when editing the JavaScript. A `.jshintrc` file is present, which will help your code to follow the guidelines if you install and run `jshint`.
 - Please test your modification thouroughly before submitting your Pull Request.

### Changes that might not be accepted
We have to be conservative with the core game. This means that some modifications won't be merged, or will have to be evaluated carefully before being merged:

 - Undo/redo features
 - Save/reload features
 - Changes to how the tiles look or their contents
 - Changes to the layout
 - Changes to the grid size

### Changes that are welcome
 - Bug fixes
 - Compatibility improvements
 - "Under the hood" enhancements
 - Small changes that don't have an impact on the core gameplay

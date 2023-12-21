## IMPORTANT

- [x] add categories to add item
- [x] add categories to edit item
- [x] check if category - items connections is bug on prod
- [ ] categories manage section -> reshape catalogue to show categories which will be expanded to show items in the category
- [x] search phase information, reset search
- [x] add tests to electron and FE if reasonable with test DB
- [x] adjust project structure - changes based on
      `https://stackoverflow.com/questions/38397215/electron-new-app-structure` and `https://github.com/yhirose/react-typescript-electron-sample-with-create-react-app-and-electron-builder`

### MAJOR

- [ ] secure credentials.json after electron-build -> require password, hash
- [x] add sequelize migrations
- [ ] electron goes TS and sequelize TS
- [x] CSV export/import
- [x] Google Cloud sync

### MINOR

- [ ] auto import sort hook
- [ ] from csv file import data preview
- [ ] color palette/themes in settings ?
- [ ] add proper error informations on FE
- [ ] add proper docker stuff
- [ ] change logo and add cute images
- [ ] galaxy of animals - 3D
- [ ] create form from create modal - useform
- [ ] refactor useCatalogue to use useReducer?
- [ ] setup debug env for VS - https://www.electronjs.org/docs/latest/tutorial/debugging-vscode

#### FAILED

- electron hot-reload - following https://www.tutorialspoint.com/hot-reload-in-electronjs and official github and npm docs https://www.npmjs.com/package/electron-reload and https://www.npmjs.com/package/electron-reloader doesnt work. 1rst throws error, second indeed reloads but whole window gets reloaded and console returns error.

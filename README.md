# Vet Base Electron

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## RUN APP DEV

#### RUN FE

```
yarn cra
```

#### RUN ELECTRON

```
yarn eld
```

#### RUN ELECTRON TESTS

```
yarn eltest
```

### RUN APP USING BUILD SETTINGS

```
yarn el
```

### BUILD APP USING ELECTRON-FORGE

https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging#creating-a-distributable

```
yarn make
```

## This project utilizes:

- https://www.slatejs.org/examples/richtext as text editor
- https://mui.com/material-ui/react-text-field/
- https://www.electronjs.org/docs/
- https://sequelize.org/docs as ORM

## Available Scripts CRA

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## PRs & branches naming convention:

- `https://www.conventionalcommits.org/en/v1.0.0/?fbclid=IwAR1-XIZHvaIvlCQa604mobWt5yG1Gv2rkrQEk_IaCjUP4quLwpoYPS_LJdk`
- `https://githubflow.github.io/?fbclid=IwAR0-yzG-mMeCtw0g30GtQmI4TJv_YsVotS4A9tRbEhsoC9y6ptgjSapH_ys`
- `https://tilburgsciencehub.com/building-blocks/collaborate-and-share-your-work/use-github/naming-git-branches/?fbclid=IwAR2q5GloZ9AUV6eDiueU2VMsM_7Z0L-WHpK-sELwbII43YS3c-6xq6ke5VE`

```
branch: snake case feature descriptive
type: fix/feat - !breaking changes
```

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## GOOGLE API:

1. credentials file should be automaticly created with proper values based on credentials.public.json
2. file is named: `credentials.json`
3. empty keys should be put in envvars in `.env`

```
GOOGLE_CLIENT_SECRET="<proper-value>"
GOOGLE_CLIENT_ID="<proper-value>"
```

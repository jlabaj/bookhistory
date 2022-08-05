# BOOKHISTORY
    the

## UX instructions

The theming comes from the indigo, pink and red pallete(see src/assets/styles/_theme.scss) of angular material + some primitive stylings in components, which are quite unsophisticated and sometimes with provocative colors(light green). 
Feel free to use _pallete.scss for defining your own pallete, _scaffolding.scss for defining your mixins(rename it to mixins if you want), _variables.scss for defining your sass or css variables.
For your convenience you can just do @use 'variables' @use scaffolding(mixins) etc. without absolute pahts, there is a preprocessing for that in angular.json.
From the functionality point of view tha app works mostly, there are a few bugs. 
Components in the app are:
•	table
•	list
•	form
•	input
•	button
•	label
•	hint
•	checkbox
•	toolbar
•	dialog
•	datepicker
•	paginator
•	snack-bar

Feel free to style the application in any consistent and modern UX way using your own or combining external colors and fonts(like fontawesome).  
Consider using dynamic css variables and sass modules. 
Consider making the app responsive in mobile and other platforms for example with adding a layout package ro using your own media queries.
Consider adding your own components like slide toggle, select, tree, sidenav or even an accordion or a drag and drop.
Consider using ripple effect.



## Description

Web front-end in Angular with a backend component that displays the history of changes of book entities with pagination, filtering, ordering and optionally grouping.

The book entity has 
•	An id
•	A title
•	A short description
•	Publish date
•	Authors

An example of changes could be a title was changed, an author was added, etc. It should also be possible to add books.
In the list of changes it should display at least the time of change and a description of what was changed (e.g. Title was changed to “The Hobbit”)
Type of storage used is firebase realtime database

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

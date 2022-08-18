# Project Guidelines

This is a guideline drafted by Wesley, it is only a suggestion so if you have any objections or questions please raise them!

# Pre-requisites

### 1. HTML + CSS(frontend)

This two are declarative ‘languages’, there is nothing too difficult about them. Familiarize yourself with them but please spend as little time as possible on this.

### 2. JavaScript(frontend + backend)

This will be the programming language we have to use for our frontend. In this case, our backend will also be written in Javascript, although in reality in can be other languages. **Please spend more time on this.**

### 3. React(frontend)

This is the frontend framework we are going to use. It is meant to make developing the frontend reusable and loosely coupled. **Please spend more time on this as well.**

### 4. NestJS(backend)

This is the backend framework we are going to use. It simplifies the creation of a server by pre-defining the flow of control. Honestly, I’ve only used it once before and will have to refresh myself on it.

Since most of you guys are unfamiliar with web development, I’m thinking that you guys can work on the frontend which is more friendly and fun. Although the backend seemingly requires fewer pre-requisites(Javascript + NestJS), mistakes made here are quite punishing, and it requires experience to build a good backend so Ngoc and I(wesley) will mainly be the ones working on it. If you have any objections or questions please raise them!

# Workflow: Agile(SCRUM)

In this framework, the project is divided into sprints(usually 2 weeks, but 1 week in our case)

There are four ceremonies in this workflow framework

1. (optional) Stand-ups: Mainly to give an update on what you have done in the past workday and what you will be doing this workday. Can also raise any blockers(things that are hindering you from completing your ticket). For example, if I am building a navigation bar, but my colleague is in charge of the button component, I cannot complete my ticket until he/she has finished building the button component.
2. Sprint planning: Divide out the project into measurable, distinct portions called tickets and assign these to each member
3. Sprint review: Demo your ticket to the team. We will raise any design issues and give comments.
4. Sprint retrospective: Give comments on what has gone well and what has gone poorly in the past sprint
5. (no need) Code review: Not necessary to have team code review as we already require you to raise a pull request where the reviewer(me or Ngoc) will review the code before merging it.

For this week we are meeting on Friday but I think ideally we want to do sprint planning at the start of each sprint(so Wednesday/Thursday) and sprint demo before the sprint ends(so Monday/Tuesday) so that we have time to do last minute fixes if necessary. However this might not work out as we as well all probably have different timetables, but let’s discuss further on friday :)

# Git Stuff

### Commit message convention

Commit messages should be of the form `<branchName> (<type>): <Capitalized message>`

For example `homepage (feat): Add footer component to page container`

Types:

- chore: Changes to our project configuration files and scripts, such as CI or CD pipelines (example scopes: Travis, Circle)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code (white space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

Most of the time we will be using feat/fix/refactor only

### Github branches

We have two branches master and development. Never develop on master, it is only for merging stable versions of the development branch.

So as a failsafe check whenever you open your IDE please do `git status` and `git switch development` if necessary

Feature branching

This means we create a new branch(branches off development) whenever we are developing a new feature. The reason this is used is that all of us will be working on a different feature individually.

To do this make sure you are on the development branch and do

```jsx
git checkout -b <featureName>
```

and whenever you are pushing to the feature branch in the origin do

```jsx
git push origin <featureName>
```

When you pull you need to switch to the development branch, pull the latest development version, and switch back to your branch and merge the two branches `git merge development`

### Git workflow

Always pull the `development` branch to the latest version before branching out to your feature branch

Before you push, do the following:

- TEST YOUR CODE
- Pull `development` to the latest
- Merge your branch with with development
- Resolve any conflicts + remove merge markers/console.logs
- TEST YOUR CODE AGAIN!
- Finally push your code to development, a link will appear in the terminal to create a pull request.

Go to GitHub/GitLab(whichever one we decided to use) and raise a pull request with Ngoc and me as code reviewers.

# Application setup

### Recommended extensions

Git lens: See the author of any given line of code

Prettier: Code formatting

Tailwind intellisense: Tailwind class autocompletion, documentation appears if you hover over the class

### On initial clone of project

There are some pre-requisite modules that need to be installed globally, but I’m not sure what they are because my laptop already has them installed. But off the top of my head:

- TypeScript
- Node

Then, you can proceed to install the dependencies of the project.

You can use the terminal built-in to VS code.

On one terminal:

- Go into the `sc2006-web` directory: `cd sc2006-web`
- Install required modules: `npm ci`

On another terminal:

- Go into the `sc2006-backend` directory: `cd sc2006-backend`
- Install required modules: `npm ci`

### Starting up the application

You can use the terminal built-in to VS code.

On one terminal:

- Go into the `sc2006-web` directory: `cd sc2006-web`
- Start up the development server: `npm run dev`

On another terminal:

- Go into the `sc2006-backend` directory: `cd sc2006-backend`
- Start up the development server: `npm run start:dev`

# Coding guidelines

---

This a non exhaustive list of guidelines that we will likely be continuously updating as we develop the project.

It would be very helpful if you guys take a look at the first few chapter of Clean Code by Robert C. Martin.

## Conventions

1. Lower camelCase for variable names and Upper camelCase for ClassNames
2. Booleans: start with english words that are ‘binary’ e.g. is, has
3. Avoid using `var` and globally scoped variables

## Practices

1. Names of (functions/variables/…) should be clear enough to expose its intent, such that the need for comments should be minimal
2. If you feel the code is hacky/the intent of the code will not be clear to others, then use a comment to describe what you are doing
3. SOLID principles: Adhere to them as much as possible. Listing them here for convenience
   1. Single Responsibility Principle: Functions should do only one thing, and that is the thing that is described in its name.
   2. Open closed principle: Modules should be closed for modification, open for extension: In my opinion, this just means that the type/interfaces that interact with your code should contain only the minimum properties required to interact with the function. In this way, the interface is closed for modification, and classes can extend it and still be able to interact with the function
   3. Liskov Substitution Principle: (Not very relevant here, especially since React prefers composition over inheritance)
   4. Interface segregation principle: Something like Single Responsibility Principle but for interfaces
   5. Dependency Inversion principle: high level modules should not depend on low level modules, both should depend on abstractions. In my opinion, this is related to Open closed principle because all it means is we should add a level of abstraction(an interface) so the implementation of high level modules do not depend on the implementation of low level modules
4. Don’t rush into coding, please spend enough time thinking if your implementation is complete and correct. Otherwise, just skip thinking and google for a tried and tested implementation that has been used widely by developers.

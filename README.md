# Overview
A web app that helps plan events based on everyone’s schedules and suggest optimal places based on everyone’s preferences and addresses
Core Technologies used: NextJS, NestJS, Firestore, TypeScript

# Structure
sc2006-common contains the types and api-models to be used by both the frontend and backend. Kind of redundant as NextJs doesn't support importing types
outside the root folder(in this case sc2006-web)

sc2006-backend contains the NestJS server application

sc2006-web contains the NextJs web application

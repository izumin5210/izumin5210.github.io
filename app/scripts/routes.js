import angular from "angular";
import {appName, templateFileExt, rootTemplateName} from "./constants";

const app = angular.module(appName);

let routes = ($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode(false)
  $routeProvider
  .when("/", {
    templateUrl: `${rootTemplateName}.${templateFileExt}`
  })
  .when("/:page", {
    templateUrl: (params) => `${params.page}.${templateFileExt}`
  });
};


app.config([
  "$routeProvider",
  "$locationProvider",
  routes
]);

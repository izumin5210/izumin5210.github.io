import angular from "angular";
import {appName} from "./constants";

const app = angular.module(appName);

app.config(($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode(false)
  $routeProvider
    .when("/:page", {
      templateUrl: (params) => `${params.page}.html`
    });
});

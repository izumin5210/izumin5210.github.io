import angular from "angular";
import {appName, prefix, menuItems} from "../constants";

let app = angular.module(appName);

class GlobalNavigationController {
  constructor($routeParams) {
    this.$routeParams = $routeParams;
    this.menuItems = menuItems;
  }

  isActive(item) {
    return item.name === this.$routeParams.page;
  }
}

function globalNavigationDDO() {
  return {
    restrict: "E",
    controller: [
        "$routeParams",
        GlobalNavigationController
    ],
    controllerAs: "globalNavigation",
    templateUrl: "global_navigation.html",
    scope: {},
    bindToController: {}
  };
}

app.directive(`${prefix}GlobalNavigation`, globalNavigationDDO);

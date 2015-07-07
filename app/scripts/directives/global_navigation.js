import _ from "lodash";
import angular from "angular";
import {appName, prefix, menuItems, rootTemplateName} from "../constants";

let app = angular.module(appName);

class GlobalNavigationController {
  constructor($routeParams) {
    this.$routeParams = $routeParams;
    this.menuItems = menuItems;
  }

  isActive(item) {
    if (_.has(this.$routeParams, "page")) {
      return item.name === this.$routeParams.page;
    } else {
      return item.name === rootTemplateName;
    }
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

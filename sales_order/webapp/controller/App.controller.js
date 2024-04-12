sap.ui.define(
	[
		"smk/so/salesorder/controller/BaseController",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("smk.so.salesorder.controller.App", {
			// onInit: function () {
			// 	this.oOwnerComponent = this.getOwnerComponent();
			// 	this.oRouter = this.oOwnerComponent.getRouter();
			// 	this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			// },
			// onRouteMatched: function (oEvent) {}

		});
	}
);

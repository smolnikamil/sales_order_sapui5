sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent",
	],
	function (Controller, History, UIComponent) {
		"use strict";

		return Controller.extend("smk.so.salesorder.controller.BaseController", {
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			},
			onRouteMatched: function (oEvent) {},

			getRouter: function () {
				return UIComponent.getRouterFor(this);
			},

			onNavBack: function () {
				var oHistory, sPreviousHash;

				oHistory = History.getInstance();
				sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("appHome", {}, true /*no history*/);
				}
			},
		});
	}
);

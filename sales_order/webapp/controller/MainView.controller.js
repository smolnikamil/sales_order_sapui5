sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel) {
		"use strict";

		return Controller.extend("smk.so.salesorder.controller.MainView", {
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			},

			onRouteMatched: function (oEvent) {
				const oModel = this.getOwnerComponent().getModel();
				let jsonModel = this.getOwnerComponent().getModel("myJsonModel");

				const setModelJson = (oData, response) => {
					jsonModel.setData(oData.results, true);
					console.log(jsonModel);
					this.getView().setModel(jsonModel, "myJsonModel");
				};
				const errorHandler = (response) => {
					console.log(response);
				};

				oModel.read("/ZI_SMK_SALES_ORDER_HEADER/", {
					success: function (oData, response) {
						setModelJson(oData, response);
					},
					error: function (response) {
						errorHandler(response);
					},
				});
				oModel.read("/ZI_SMK_SALES_ORDER_ITEMS/", {
					success: function (oData, response) {
						setModelJson(oData, response);
					},
					error: function (response) {
						errorHandler(response);
					},
				});
			},
		});
	}
);

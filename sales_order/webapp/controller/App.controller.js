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

<<<<<<< HEAD
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
=======
>>>>>>> v1
		});
	}
);

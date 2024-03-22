sap.ui.define(
	[
		"smk/so/salesorder/controller/BaseController",
		"sap/ui/model/json/JSONModel",
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("smk.so.salesorder.controller.Home", {
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			},

			onRouteMatched: function (oEvent) {
				const oModel = this.getOwnerComponent().getModel();
				let jsonModelHeader =
					this.getOwnerComponent().getModel("myJsonModelHeader");
				let jsonModelItems =
					this.getOwnerComponent().getModel("myJsonModelItems");
				this.getView().setModel(jsonModelHeader, "orders");

				// const get_unique_values = (oData) => {
				// 	let unique_values = [
				// 		new Set(oData.map((element) => element.SalesDocument)),
				// 	];
				// 	return unique_values[0];
				// };
				const get_unique_values = (oData, uniqueBy, keepFirst) => {
					return Array.from(
						oData
							.reduce((map, e) => {
								let key = uniqueBy
									.map((key) => [e[key], typeof e[key]])
									.flat()
									.join("-");
								if (keepFirst && map.has(key)) return map;
								return map.set(key, e);
							}, new Map())
							.values()
					);
				};

				const setModelJsonHeader = (oData, response) => {
					const unique_salesOrderNumbers = get_unique_values(
						oData.results,
						["SalesDocument"],
						true
					);
					jsonModelHeader.setData(unique_salesOrderNumbers);
				};
				const setModelJsonItems = (oData, response) => {
					jsonModelItems.setData(oData.results);
				};
				const errorHandler = (response) => {
					console.log(response);
				};

				oModel.read("/ZI_SMK_SALES_ORDER_HEADER/", {
					success: function (oData, response) {
						setModelJsonHeader(oData, response);
					},
					error: function (response) {
						errorHandler(response);
					},
				});

				oModel.read("/ZI_SMK_SALES_ORDER_ITEMS/", {
					success: function (oData, response) {
						setModelJsonItems(oData, response);
					},
					error: function (response) {
						errorHandler(response);
					},
				});
			},

			onPress(oEvent) {
				// const oOrder = oEvent.getSource();
				// const oRouter = this.getOwnerComponent().getRouter();
				// oRouter.navTo("OrderDetail");
				let oItem, oCtx;

				oItem = oEvent.getSource();
				// oCtx = oItem.getContext();
				let path = oItem.getBindingContext("orders").getPath().substring(1);
				this.getRouter().navTo("detail", {
					salesDocument: oItem
						.getBindingContext("orders")
						.getPath()
						.substring(1),
				});
			},
		});
	}
);

sap.ui.define(
	[
		"smk/so/salesorder/controller/BaseController",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
	],
	function (BaseController, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("smk.so.salesorder.controller.Detail", {
			onInit: function () {
				this.oOwnerComponent = this.getOwnerComponent();
				this.oRouter = this.oOwnerComponent.getRouter();
				this.oRouter.attachRouteMatched(this.onRouteMatched, this);
				// var oRouter = this.getRouter();
				// oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);
			},

			onRouteMatched: function (oEvent) {
				const oModel = this.getOwnerComponent().getModel();
				let jsonModelHeader =
					this.getOwnerComponent().getModel("myJsonModelHeader");
				let jsonModelItems =
					this.getOwnerComponent().getModel("myJsonModelItems");
				this.getView().setModel(jsonModelHeader, "orders");
				this.getView().setModel(jsonModelItems, "items");

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

				//binding single field (Property binding)
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				oView = this.getView();
				// let myField = this.byId("salesID");
				// let mySelectedField =
				// 	"orders>/" + oArgs.salesDocument + "/SalesDocument";
				// console.log(mySelectedField);
				// myField.bindProperty("value", mySelectedField);
				// jsonModelItems = this.getView().getModel("items");
				// for (let i = 0; i < jsonModelItems.length; i++) {
				// 	if (jsonModelItems[i].SalesDocument == oArgs.salesDocument) {
				// 		jsonModelItems.push(jsonModelItems[i]);
				// 	}
				// }

				//binding model to item from array
				oView.bindElement({
					path: "orders>/" + oArgs.salesDocument,
					// 	events: {
					// 		change: this._onBindingChange.bind(this),
					// 		dataRequested: function (oEvent) {
					// 			oView.setBusy(true);
					// 		},
					// 		dataReceived: function (oEvent) {
					// 			oView.setBusy(false);
					// 		},
					// 	},
				});

				oView.bindElement({
					path: "items>/",
					// 	events: {
					// 		change: this._onBindingChange.bind(this),
					// 		dataRequested: function (oEvent) {
					// 			oView.setBusy(true);
					// 		},
					// 		dataReceived: function (oEvent) {
					// 			oView.setBusy(false);
					// 		},
					// 	},
				});
				// const filterItems = () => {
				// 	var oFilter = new Filter(
				// 		"SalesDocument",
				// 		FilterOperator.Contains,
				// 		"1"
				// 	);
				// 	var aFilter = [];
				// 	aFilter.push(oFilter);

				// 	var oList = this.getView.byId("salesOrderItemList");
				// 	var oBinding = oList.getBinding("items>");
				// 	oBinding.filter(aFilter);
				// };
			},

			_onBindingChange: function (oEvent) {
				// No data for the binding
				if (!this.getView().getBindingContext()) {
					this.getRouter().getTargets().display("notFound");
				}
			},

		});
	}
);

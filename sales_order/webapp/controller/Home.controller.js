sap.ui.define(
	[
		"smk/so/salesorder/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (BaseController, JSONModel, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("smk.so.salesorder.controller.Home", {
			// onInit: function () {
			// 	this.oOwnerComponent = this.getOwnerComponent();
			// 	this.oRouter = this.oOwnerComponent.getRouter();
			// 	this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			// },
			// onInit: function () {},

			onRouteMatched: function (oEvent) {
				let oModel = this.getOwnerComponent().getModel();
				let jsonMyModel = new JSONModel();
				this.getView().setModel(jsonMyModel, "OrderListModel");
				let oView = this.getView();

				const errorHandler = (response) => {
					console.log(response);
				};
				oView.setBusy(true)
				oModel.read("/ZI_SMK_SALES_ORDER", {
					urlParameters: {
						$expand: "to_SalesDocumentItem",
						$top: "1000",
						$inlinecount: "allpages",
					},
					success: function (oData, response) {
						jsonMyModel.setData(oData.results);
						bindOrderModel();
						oView.setBusy(false)
					},
					error: function (response) {
						oView.setBusy(false)
						errorHandler(response);
					},
				});
				const bindOrderModel = () => {
					this.getView().bindElement({
						path: "OrderListModel>/",
					});
				};
			},
			onListItemPressed: function (oEvent) {
				let oItem;
				oItem = oEvent.getSource();
				let path = oItem
					.getBindingContext("OrderListModel")
					.getProperty("SalesDocument");
				this.getRouter().navTo("detail", {
					salesDocument: path,
				});
			},
			onSearchField: function (oEvent) {
				let aFilter = [];
				let sQuery = oEvent.getParameter("query");
				if (sQuery) {
					aFilter.push(new Filter("SalesDocument", FilterOperator.EQ, sQuery));
				}
				let oList = this.byId("orderList");
				let oBinding = oList.getBinding("items");
				oBinding.filter(aFilter);
			},
		});
	}
);

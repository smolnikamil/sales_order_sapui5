sap.ui.define(
	[
		"smk/so/salesorder/controller/BaseController",
		"sap/ui/model/Filter",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
	],
	function (
		BaseController,
		Filter,
		Fragment,
		MessageToast,
		FilterOperator,
		JSONModel
	) {
		"use strict";

		return BaseController.extend("smk.so.salesorder.controller.Detail", {
			sMaterialValueHelpItem: "",
			onInit: function () {
				var oRouter = this.getRouter();
				oRouter.getRoute("detail").attachMatched(this._onRouteMatched, this);
			},

			_onRouteMatched: function (oEvent) {
				const oModel = this.getOwnerComponent().getModel();
				let jsonMyModel = new JSONModel();
				this.getView().setModel(jsonMyModel, "OrderListModel");
				let oView = this.getView();
				let oArgs;
				oArgs = oEvent.getParameter("arguments");

				const errorHandler = (response) => {
					console.log(response);
				};
				oView.setBusy(true);
				oModel.read("/ZI_SMK_SALES_ORDER('" + oArgs.salesDocument + "')", {
					urlParameters: {
						$expand: "to_SalesDocumentItem",
					},
					success: function (oData, response) {
						jsonMyModel.setData(oData);
						for (
							let i = 0;
							i < jsonMyModel.oData.to_SalesDocumentItem.results.length;
							i++
						) {
							console.log(jsonMyModel.oData.to_SalesDocumentItem.results[i]);
							jsonMyModel.oData.to_SalesDocumentItem.results[
								i
							].checkbox = false;
						}

						bindOrderModel();
						oView.setBusy(false);
					},
					error: function (response) {
						oView.setBusy(false);
						errorHandler(response);
					},
				});
				const bindOrderModel = () => {
					var oView = this.getView();
					this.getView().bindElement({
						path: "OrderListModel>/",
						events: {
							dataRequested: function () {
								oView.setBusy(true);
							},
							dataReceived: function () {
								oView.setBusy(false);
							},
						},
					});
				};
			},
			_onCreatePress: function (oEvent) {
				var oModel = this.getView()
					.getModel("OrderListModel")
					.getProperty("/to_SalesDocumentItem");
				var modelArray = oModel.results;
				var currnetlastElement = parseInt(
					modelArray[modelArray.length - 1].SalesDocumentItem
				);
				var newLastElement = currnetlastElement + 10;
				var newItem = {
					SalesDocument: oModel.results[0].SalesDocument,
					SalesDocumentItem: newLastElement.toString(),
					Material: "",
					OrderQuantity: "",
					OrderQuantityUnit: oModel.results[0].OrderQuantityUnit,
					checkbox: false,
				};
				oModel.results.push(newItem);
				this.getView()
					.getModel("OrderListModel")
					.setProperty("/to_SalesDocumentItem", oModel);
			},
			_onDeletePress: function (oEvent) {
				var oModel = this.getView()
					.getModel("OrderListModel")
					.getProperty("/to_SalesDocumentItem");
				oModel.results.forEach((element, index) => {
					if (element.checkbox === true) {
						oModel.results.splice(index, 1);
					}
				});
				this.getView()
					.getModel("OrderListModel")
					.setProperty("/to_SalesDocumentItem", oModel);
			},

			_onSubmitPress: function (oEvent) {
				const oModel = this.getOwnerComponent().getModel();
				let bindingContext = this.getView().getBindingContext("OrderListModel");
				let path = bindingContext.getPath();
				let mySalesOrder = bindingContext.getModel().getProperty(path);
				var orderChangeList = [];
				var SalesDocumentItem = {};
				for (
					let i = 0;
					i < mySalesOrder.to_SalesDocumentItem.results.length;
					i++
				) {
					var SalesDocumentItem = {};
					SalesDocumentItem.SalesDocument =
						mySalesOrder.to_SalesDocumentItem.results[i].SalesDocument;
					SalesDocumentItem.SalesDocumentItem =
						mySalesOrder.to_SalesDocumentItem.results[i].SalesDocumentItem;
					SalesDocumentItem.Material =
						mySalesOrder.to_SalesDocumentItem.results[i].Material;
					SalesDocumentItem.OrderQuantity =
						mySalesOrder.to_SalesDocumentItem.results[i].OrderQuantity;
					SalesDocumentItem.OrderQuantityUnit =
						mySalesOrder.to_SalesDocumentItem.results[i].OrderQuantityUnit;
					orderChangeList.push(SalesDocumentItem);
				}
				var mParams = {};
				mParams.groupId = "1001";
				mParams.merge = false;
				mParams.success = function () {
					sap.m.MessageToast.show("Create successful");
				};
				mParams.error = this.onErrorCall;
				for (var k = 0; k < orderChangeList.length; k++) {
					oModel.update(
						"/ZI_SMK_SALES_ITEM(SalesDocument='" +
							orderChangeList[k].SalesDocument +
							"',SalesDocumentItem='" +
							orderChangeList[k].SalesDocumentItem +
							"')",
						orderChangeList[k],
						mParams
					);
				}
				oModel.submitChanges({
					success: function (oData) {
						sap.m.MessageToast.show("SUCCESS");
					},
					error: function (oError) {
						sap.m.MessageToast.show("ERROR");
					},
				});
			},
			//Function for testing purpose
			onSelectionChange: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("listItem");
				if (oSelectedItem) {
					// Get the row path of the selected item
					var sPath = oSelectedItem
						.getBindingContext("OrderListModel")
						.getPath();
					console.log("Selected row path:", sPath);
				}
			},
			_onMaterialSearch: function (oEvent) {
				let oSelectedItem = oEvent
					.getSource()
					.getBindingContext("OrderListModel")
					.getPath();
				this.sMaterialValueHelpItem = oSelectedItem;
				// var oControl = oEvent.getSource();
				// var aCustomData = oControl.getCustomData();
				// aCustomData.forEach(function (oCustomData) {
				// 	if (oCustomData.getKey() === "materialToChange") {
				// 		oCustomData.setValue(oSelectedItem);
				// 	}
				// });
				// oField = new sap.ui.core.CustomData();
				// oField.setKey("materialToChange");
				// oField.setValue(oSelectedItem);

				let oModel = this.getOwnerComponent().getModel();
				let jsonMyModel = new JSONModel();
				this.getView().setModel(jsonMyModel, "Materials");
				let oView = this.getView();
				const searchProcess = (jsonMyModel) => {
					oView = this.getView();
					if (!this._pDialog) {
						this._pDialog = Fragment.load({
							id: this.oView.getId(),
							name: "smk.so.salesorder.fragment.ValueHelpTable",
							controller: this,
						}).then(function (oDialog) {
							oDialog.setModel(jsonMyModel, "Materials");
							// oDialog.addCustomData(oField);
							return oDialog;
						});
					}
					this._pDialog.then(
						function (oDialog) {
							this._configDialog(oDialog);
							oDialog.open();
						}.bind(this)
					);
				};
				oModel.read("/I_MaterialStdVH", {
					urlParameters: {
						$top: "1000",
						$inlinecount: "allpages",
					},
					success: function (oData, response) {
						jsonMyModel.setData(oData.results);
						bindOrderModel();
						searchProcess(jsonMyModel);
					},
					error: function (response) {
						errorHandler(response);
					},
				});
				const bindOrderModel = () => {
					// let oView = this.getView();
					this.getView().bindElement({
						path: "Materials>/",
						events: {
							dataRequested: function () {
								this.oView.setBusy(true);
							},
							dataReceived: function () {
								this.oView.setBusy(false);
							},
						},
					});
				};
			},
			_onSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("Material", FilterOperator.Contains, sValue);
				var oBinding = oEvent.getParameter("itemsBinding");
				oBinding.filter([oFilter]);
			},
			_configDialog: function (oDialog) {
				oDialog.getBinding("items").filter([]);
				oDialog.getBinding("items");
			},

			_handleTableValueHelpConfirm: function (oEvent) {
				let oModel = this.getView().getModel("OrderListModel");
				let sSelectedValue = oEvent.getParameter("selectedItem");
				let sMaterial = this.getView()
					.getModel("OrderListModel")
					.getProperty(this.sMaterialValueHelpItem);
				sMaterial.Material = sSelectedValue.getTitle();
				oModel.setProperty(this.sMaterialValueHelpItem, sMaterial);
				oModel.refresh(true);
			},
		});
	}
);

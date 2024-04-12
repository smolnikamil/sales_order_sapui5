sap.ui.define(
	[
		"smk/so/salesorder/controller/BaseController",
		"sap/ui/model/Filter",
		"sap/ui/core/Fragment",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/json/JSONModel",
	],
	function (BaseController, Filter, Fragment, FilterOperator, JSONModel) {
		"use strict";

		return BaseController.extend("smk.so.salesorder.controller.Detail", {
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
						oData.to_SalesDocumentItem.results[0].checkbox = false;
						jsonMyModel.setData(oData);
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

			// _updatedB: function (mySalesOrder, path) {
			// 	const oModel = this.getOwnerComponent().getModel();

			// 	var batchChanges = [];
			// 	oModel.addBatchChangeOperations(batchChanges);
			// 	oModel.submitBatch(
			// 		function (data) {
			// 			that.oModel.refresh();
			// 			sap.ui.commons.MessageBox.show(
			// 				data.__batchResponses[0].__changeResponses.length +
			// 					" contacts created",
			// 				sap.ui.commons.MessageBox.Icon.SUCCESS,
			// 				"Batch Save",
			// 				sap.ui.commons.MessageBox.Action.OK
			// 			);
			// 		},
			// 		function (err) {
			// 			alert("Error occurred ");
			// 		}
			// 	);

			// oModel.update("/ZI_SMK_SALES_ORDER('" + oArgs.salesDocument + "')", {
			// 	urlParameters: {
			// 		$expand: "to_SalesDocumentItem",
			// 	},
			// 	success: function (oData, response) {
			// 		jsonMyModel.setData(oData);
			// 		bindOrderModel();
			// 	},
			// 	error: function (response) {
			// 		errorHandler(response);
			// 	},
			// });

			_onCreatePress: function (oEvent) {
				var oModel = this.getView()
					.getModel("OrderListModel")
					.getProperty("/to_SalesDocumentItem");
				// var oModel = this.getView().getModel("OrderListModel")
				// var aData = oModel.getProperty("/to_SalesDocumentItem");
				var modelArray = oModel.results;
				var currnetlastElement = parseInt(
					modelArray[modelArray.length - 1].SalesDocumentItem
				);
				var newLastElement = currnetlastElement + 10;
				// newLastElement = newLastElement.toString;
				var newItem = {
					SalesDocument: oModel.results[0].SalesDocument,
					SalesDocumentItem: newLastElement.toString(),
					Material: "",
					OrderQuantity: "",
					OrderQuantityUnit: oModel.results[0].OrderQuantityUnit,
				};
				oModel.results.push(newItem);
				// oModel.to_SalesDocumentItem = newItem;
				this.getView()
					.getModel("OrderListModel")
					.setProperty("/to_SalesDocumentItem", oModel);

				// let bindingContext = this.getView().getBinding("OrderListModel>to_SalesDocumentItem/results/");
				// let oList = this.byId("table");
				// let oBinding = oList.getBinding("items");
				// let oData = oBinding.getData();
				// oBinding.to_SalesDocumentItem = newItem;
				// oModel.setData(oBinding);

				// let path = oBinding.sPath;
				// var aData = oModel.getProperty(path);
				// let path = bindingContext.getPath();
				// let aData = bindingContext.getModel().getProperty(path);
				// aData.push(newItem);
				// oModel.setProperty("to_SalesDocumentItem", newItem);
				// console.log(aData);
			},
			_onDeletePress: function (oEvent) {
				var oModel = this.getView()
					.getModel("OrderListModel")
					.getProperty("/to_SalesDocumentItem");
				oModel.results.sort((a, b) => b - a);
				oModel.results.forEach((index) => {
					oModel.results.splice(index, 1);
				});
				this.getView()
					.getModel("OrderListModel")
					.setProperty("/to_SalesDocumentItem", oModel);
			},

			_onSubmitPress: function (oEvent) {
				let bindingContext = this.getView().getBindingContext("OrderListModel");
				let path = bindingContext.getPath();
				let mySalesOrder = bindingContext.getModel().getProperty(path);

				// var orderChangeList = [];
				var orderChangeList = [];
				// var orderDetails = {};
				var SalesDocumentItem = {};
				// var to_SalesDocumentItem = [];

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

				// orderDetails.SalesDocument = mySalesOrder.SalesDocument;
				// orderDetails.SoldToParty = mySalesOrder.SoldToParty;

				// orderChangeList.push(orderDetails);

				// orderDetails.to_SalesDocumentItem = to_SalesDocumentItem;

				//create an array of batch changes and save
				// var oParams = {};
				// oParams.json = true;
				// oParams.defaultUpdateMethod = "PUT";
				// oParams.useBatch = true;
				// const oModel = this.getOwnerComponent().getModel();

				var mParams = {};
				mParams.groupId = "1001";
				// mParams.useBatch = true;
				mParams.merge = false;
				mParams.success = function () {
					sap.m.MessageToast.show("Create successful");
				};
				mParams.error = this.onErrorCall;

				// this._callUpdateService(orderChangeList, SalesDocumentItem);

				// for (var k = 0; k < orderChangeList.length; k++) {
				// 	// batchModel.create("/ZI_SMK_SALES_ORDER", orderChangeList[k], mParams);
				// 	oModel.update(
				// 		"/ZI_SMK_SALES_ORDER('" + orderChangeList[k].SalesDocument + "')",
				// 		orderChangeList[k],
				// 		mParams
				// 	);
				// }

				//working
				for (var k = 0; k < orderChangeList.length; k++) {
					// batchModel.create("/ZI_SMK_SALES_ORDER", orderChangeList[k], mParams);
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
					// groupId: "foo",
					success: function (oData) {
						sap.m.MessageToast.show("SUCCESS");
					},
					error: function (oError) {
						sap.m.MessageToast.show("ERROR");
					},
				});
			},

			_callUpdateService: function (orderChangeList, SalesDocumentItem) {
				var oLink = {};
				oLink.uri = "$2";

				var xhr = new XMLHttpRequest();

				xhr.open(
					"POST",
					"/sap/opu/odata/sap/ZUI_SMK_SALESORDER_ODATAV2/$batch",
					true
				);

				var token = this._getCSRFToken();
				xhr.setRequestHeader("X-CSRF-Token", token);
				xhr.setRequestHeader("Accept", "*/*");
				xhr.setRequestHeader("Content-Type", "multipart/mixed;boundary=batch");
				// xhr.setRequestHeader("DataServiceVersion", "2.0");
				// xhr.setRequestHeader("MaxDataServiceVersion", "2.0");
				let mySalesOrder = "{'SalesDocument':'5','SoldToParty':'130'}";

				var body = "";
				body += "--batch" + "\r\n";
				body += "Content-Type: multipart/mixed; boundary=changeset\r\n";
				body += "\n";
				body += "\n";
				body += "--changeset" + "\r\n";
				body += "Content-Type:application/http" + "\r\n";
				body += "Content-Transfer-Encoding: binary\r\n";
				body += "Content-ID:1\r\n";
				body += "\n";
				body += "PUT ZI_SMK_SALES_ORDER('5') HTTP/1.1\r\n";
				body += "Content-Type: application/json\r\n";
				body += "\n";
				body += mySalesOrder;
				body += "\n";
				body += "\n";
				body += "\n";
				body += "--changeset" + "\r\n";
				body += "Content-Type:application/http" + "\r\n";
				body += "Content-Transfer-Encoding: binary\r\n";
				body += "Content-ID:2\r\n";
				body += "\n";
				body +=
					"PUT ZI_SMK_SALES_ITEM(SalesDocument='" +
					orderChangeList[0].SalesDocument +
					"',SalesDocumentItem='" +
					orderChangeList[0].SalesDocumentItem +
					"') HTTP/1.1\r\n";
				body += "Content-Type: application/json\r\n";
				var jsonAdd = JSON.stringify(orderChangeList[0]);
				body += "\n";
				body += jsonAdd;
				body += "\n";
				body += "\n";
				body += "\n";
				body += "--changeset" + "\r\n";
				body += "Content-Type:application/http" + "\r\n";
				body += "Content-Transfer-Encoding: binary\r\n";
				var jsonLink = JSON.stringify(oLink);
				body += "Content-ID:3\r\n";
				body += "\n";
				body += "PUT $1/$links/to_SalesDocumentItem HTTP/1.1\r\n";
				body += "Content-Type: application/json\r\n";
				body += "\n";
				// body += "{'SalesDocument':'5','uri': $2 }";
				body += "{'uri': '$2'}";
				body += "\n";
				body += "\n";
				body += "\n";

				body += "--changeset--\r\n";
				body += "\n";
				body += "--batch--\r\n";

				// {
				// 	"SalesDocument" : "6",
				// 	"SoldToParty" : "130",
				// 	"to_SalesDocumentItem" : [{
				// 	  "SalesDocument" : "6",
				// 	  "SalesDocumentItem":"10",
				// 	  "OrderQuantity":"5"
				//     },{
				//     "SalesDocument" : "6",
				//     "SalesDocumentItem":"20",
				//     "OrderQuantity":"5"
				//     }]
				//     }

				// body += "--changeset" + "\r\n";
				// body += "Content-Type:application/http" + "\r\n";
				// body += "Content-Transfer-Encoding:binary\r\n";
				// body += "Content-ID: 1\r\n";
				// body += "\r\n";

				// body += "POST ZI_SMK_SALES_ORDER?sap-client=805&batch HTTP/1.1\r\n";
				// body += "Content-Type: application/json\r\n";
				// body += "Accept: application/json\r\n";
				// // var jsonBP = JSON.stringify(orderChangeList);
				// body += "Content-Length:" + mySalesOrder.length + "\r\n";
				// body += "\r\n";
				// body += mySalesOrder + "\r\n";
				// body += "--changeset" + "\r\n";

				// body += "Content-Type:application/http" + "\r\n";
				// body += "Content-Transfer-Encoding:binary\r\n";
				// body += "Content-ID: 2\r\n";
				// body += "\r\n";

				// body += "POST ZI_SMK_SALES_ITEM HTTP/1.1\r\n";
				// body += "Content-Type:application/json\r\n";
				// var jsonAdd = JSON.stringify(SalesDocumentItem);
				// body += "Content-Length:" + jsonAdd.length + "\r\n";
				// body += "\r\n";

				// body += jsonAdd + "\r\n";
				// body += "--changeset" + "\r\n";

				// body += "Content-Type:application/http" + "\r\n";
				// body += "Content-Transfer-Encoding:binary\r\n";
				// body += "\r\n";

				// body += "POST $1/$links/AddRef HTTP/1.1\r\n";
				// body += "Content-Type:application/json\r\n";
				// var jsonLink = JSON.stringify(oLink);
				// body += "Content-Length:" + jsonLink.length + "\r\n";
				// body += "\r\n";

				// body += jsonLink + "\r\n";

				// body += "--changeset" + "--\r\n";
				// body += "\r\n";

				// body += "--batch" + "--\r\n";
				console.log(body);
				xhr.onload = function () {};
				xhr.send(body);
				sap.m.MessageToast.show("Business Partner created");
			},

			_getCSRFToken: function () {
				var token = null;
				$.ajax({
					url: "/sap/opu/odata/sap/ZUI_SMK_SALESORDER_ODATAV2/ZI_SMK_SALES_ORDER?sap-client=805",
					type: "GET",
					async: false,
					crossDomain: true,
					beforeSend: function (xhr) {
						xhr.setRequestHeader("X-CSRF-Token", "Fetch");
					},
					complete: function (xhr) {
						token = xhr.getResponseHeader("X-CSRF-Token");
					},
				});
				return token;
			},
			_onMaterialSearch: function (oEvent) {
				let oModel = this.getOwnerComponent().getModel();
				let jsonMyModel = new JSONModel();
				this.getView().setModel(jsonMyModel, "Materials");
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
					var oView = this.getView();
					this.getView().bindElement({
						path: "Materials>/",
						events: {
							//change: this._onBindingChange.bind(this),
							dataRequested: function () {
								oView.setBusy(true);
							},
							dataReceived: function () {
								oView.setBusy(false);
							},
						},
					});
				};
				const searchProcess = (jsonMyModel) => {
					var oButton = oEvent.getSource(),
						oView = this.getView();

					if (!this._pDialog) {
						this._pDialog = Fragment.load({
							id: oView.getId(),
							name: "smk.so.salesorder.fragment.ValueHelpTable",
							controller: this,
						}).then(function (oDialog) {
							oDialog.setModel(jsonMyModel, "Materials");
							return oDialog;
						});
					}

					this._pDialog.then(
						function (oDialog) {
							this._configDialog(oButton, oDialog);
							oDialog.open();
						}.bind(this)
					);
				};
			},
			_handleTableValueHelpConfirm: function (oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					this.byId(this.inputId).setValue(
						oSelectedItem.getBindingContext().getObject().SalesDocument
					);
					this.readRefresh(oEvent);
				}
				this.oDialog.destroy();
			},
			_configDialog: function (oButton, oDialog) {
				// clear the old search filter
				oDialog.getBinding("items").filter([]);
				oDialog.getBinding("items");
			},
			_onSearch: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter = new Filter("Material", FilterOperator.Contains, sValue);
				var oBinding = oEvent.getParameter("itemsBinding");
				oBinding.filter([oFilter]);
			},
			_onCheckBoxSelect: function (oEvent) {
				var bSelected = oEvent.getParameter("selected");
			},
		});
	}
);

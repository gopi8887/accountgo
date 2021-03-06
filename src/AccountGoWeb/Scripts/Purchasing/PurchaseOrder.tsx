﻿import * as React from "react";
import * as ReactDOM from "react-dom";
import {observer} from "mobx-react";

import Config = require("Config");

import SelectVendor from "../Shared/Components/SelectVendor";
import SelectPaymentTerm from "../Shared/Components/SelectPaymentTerm";
import SelectLineItem from "../Shared/Components/SelectLineItem";
import SelectLineMeasurement from "../Shared/Components/SelectLineMeasurement";

import PurchaseOrderStore from "../Shared/Stores/Purchasing/PurchaseOrderStore";

let purchId = window.location.search.split("?purchId=")[1];

let store = new PurchaseOrderStore(purchId);

@observer
class ValidationErrors extends React.Component<any, {}>{
    render() {
        if (store.validationErrors !== undefined && store.validationErrors.length > 0) {
            var errors = [];
            store.validationErrors.map(function (item, index) {
                errors.push(<li key={index}>{item}</li>);                
            });
            return (
                <div>
                    <ul>
                        {errors}
                    </ul>
                </div>

            );
        }
        return null;
    }
}

class SavePurchaseOrderButton extends React.Component<any, {}>{
    saveNewPurchaseOrder(e) {
        store.savePurchaseOrder();
    }

    render() {
        return (
            <input type="button" value="Save" onClick={this.saveNewPurchaseOrder.bind(this)} />
            );
    }
}

class CancelPurchaseOrderButton extends React.Component<any, {}>{
    render() {
        return (
            <input type="button" value="Cancel" />
        );
    }
}

@observer
class PurchaseOrderHeader extends React.Component<any, {}>{
    onChangeOrderDate(e) {
        store.changedOrderDate(e.target.value);
    }
    render() {        
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">Vendor Information</h3>
                    <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="box-body">
                    <div className="col-sm-6">
                        <div className="row">
                            <div className="col-sm-2">Vendor</div>
                            <div className="col-sm-10"><SelectVendor store={store} selected={store.purchaseOrder.vendorId} /></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">Payment Term</div>
                            <div className="col-sm-10"><SelectPaymentTerm store={store} selected={store.purchaseOrder.paymentTermId} /></div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-2">Date</div>
                            <div className="col-sm-10"><input type="date" className="form-control pull-right" onChange={this.onChangeOrderDate.bind(this) } value={store.purchaseOrder.orderDate} /></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-2">Reference no.</div>
                            <div className="col-sm-10"><input type="text" className="form-control" /></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

@observer
class PurchaseOrderLines extends React.Component<any, {}>{
    addLineItem() {
        var itemId, measurementId, quantity, amount, discount;
        itemId = (document.getElementById("optNewItemId") as HTMLInputElement).value;
        measurementId = (document.getElementById("optNewMeasurementId") as HTMLInputElement).value;
        quantity = (document.getElementById("txtNewQuantity") as HTMLInputElement).value;
        amount = (document.getElementById("txtNewAmount") as HTMLInputElement).value;
        discount = (document.getElementById("txtNewDiscount") as HTMLInputElement).value;

        //console.log(`itemId: ${itemId} | measurementId: ${measurementId} | quantity: ${quantity} | amount: ${amount} | discount: ${discount}`);
        store.addLineItem(itemId, measurementId, quantity, amount, discount);

        (document.getElementById("txtNewQuantity") as HTMLInputElement).value = "1";
        (document.getElementById("txtNewAmount") as HTMLInputElement).value = "0";
        (document.getElementById("txtNewDiscount") as HTMLInputElement).value = "0";
    }

    onClickRemoveLineItem(e) {
        store.removeLineItem(e.target.name);
    }

    onChangeQuantity(e) {
        store.updateLineItem(e.target.name, "quantity", e.target.value);
    }

    onChangeAmount(e) {
        store.updateLineItem(e.target.name, "amount", e.target.value);
    }

    onChangeDiscount(e) {
        store.updateLineItem(e.target.name, "discount", e.target.value);
    }

    render() {        
        var lineItems = [];
        for (var i = 0; i < store.purchaseOrder.purchaseOrderLines.length; i++) {
            lineItems.push(
                <tr key={i}>
                    <td><SelectLineItem store={store} row={i} selected={store.purchaseOrder.purchaseOrderLines[i].itemId} /></td>
                    <td>{store.purchaseOrder.purchaseOrderLines[i].itemId}</td>
                    <td><SelectLineMeasurement row={i} store={store} selected={store.purchaseOrder.purchaseOrderLines[i].measurementId} /></td>
                    <td><input type="text" className="form-control" name={i} value={store.purchaseOrder.purchaseOrderLines[i].quantity} onChange={this.onChangeQuantity.bind(this)} /></td>
                    <td><input type="text" className="form-control" name={i} value={store.purchaseOrder.purchaseOrderLines[i].amount} onChange={this.onChangeAmount.bind(this) } /></td>
                    <td><input type="text" className="form-control" name={i} value={store.purchaseOrder.purchaseOrderLines[i].discount} onChange={this.onChangeDiscount.bind(this) } /></td>
                    <td>{store.lineTotal(i)}</td>
                    <td><input type="button" name={i} value="Remove" onClick={this.onClickRemoveLineItem.bind(this) } /></td>
                </tr>
            );
        }
        return (
            <div className="box">
                <div className="box-header with-border">
                    <h3 className="box-title">Line Items</h3>
                    <div className="box-tools pull-right">
                        <button type="button" className="btn btn-box-tool" data-widget="collapse" data-toggle="tooltip" title="Collapse">
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="box-body table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <td>Item Id</td>
                                <td>Item Name</td>
                                <td>Measurement</td>
                                <td>Quantity</td>
                                <td>Amount</td>
                                <td>Discount</td>
                                <td>Line Total</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems}
                            <tr>
                                <td><SelectLineItem store={store} controlId="optNewItemId" /></td>
                                <td>Item Name</td>
                                <td><SelectLineMeasurement store={store} controlId="optNewMeasurementId" /></td>
                                <td><input className="form-control" type="text" id="txtNewQuantity" defaultValue={1} /></td>
                                <td><input className="form-control" type="text" id="txtNewAmount" /></td>
                                <td><input className="form-control" type="text" id="txtNewDiscount" /></td>
                                <td></td>
                                <td><input type="button" value="Add" onClick={this.addLineItem} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

@observer
class PurchaseOrderTotals extends React.Component<any, {}>{
    render() {
        return (
            <div className="box">
                <div className="box-body">
                    <div className="row">
                        <div className="col-md-2"><label>Running Total: </label></div>
                        <div className="col-md-2">{0}</div>
                        <div className="col-md-2"><label>Tax Total: </label></div>
                        <div className="col-md-2">{0}</div>
                        <div className="col-md-2"><label>Grand Total: </label></div>
                        <div className="col-md-2">{store.grandTotal() }</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default class AddPurchaseOrder extends React.Component<any, {}> {
    render() {
        return (
            <div>
                <ValidationErrors />
                <PurchaseOrderHeader />
                <PurchaseOrderLines />
                <PurchaseOrderTotals />
                <div>
                    <SavePurchaseOrderButton />
                    <CancelPurchaseOrderButton />
                </div>
            </div>
            );
    }
}

ReactDOM.render(<AddPurchaseOrder />, document.getElementById("divPurchaseOrder"));
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/unified/FileUploader",
    "sap/m/Dialog",
    "sap/m/Button"
], (Controller, JSONModel, FileUploader, Dialog, Button) => {
    "use strict";

    return Controller.extend("fileupload.controller.View1", {
        onInit() {
            var oViewModel=new JSONModel({
                toppings:[]
            })
            this.getView().setModel(oViewModel,"object")
        },
        onAddExcelData:function(){
            var that=this;
                if(this.fixedDialog === undefined){
                    this.fixedDialog=new Dialog({
                    title:"Choose CSV File for Upload",
                    beginButton:new sap.m.Button({
                        text:"Upload",
                        press:function(oEvent){
                            that.fixedDialog.close();
                        }
                    }),
                    content:[
                        new FileUploader("excelUploader")
                    ],
                    endButton:new sap.m.Button({
                        text:"cancel",
                        press:function(){
                            that.fixedDialog.close()
                        }
                    })
                })
                this.getView().addDependent(this.fixedDialog);
                this.fixedDialog.attachBeforeClose(this.setDataToJsonFromExcel,this)
                }
            this.fixedDialog.open();
        },
        setDataToJsonFromExcel:function(oEvent){
            var oUploader=oEvent.getSource().getContent()[0];
            var domRef=oUploader.getFocusDomRef();
            if(domRef.files.length===0){
                return
            }
            var file=domRef.files[0];
            var that=this;
            this.fileName=file.name;
            this.fileType=file.type;
            var reader=new FileReader()
            reader.onload=function(e){
                var arrCSV = e.currentTarget.result.match(/[\w .]+(?=,?)/g);
                var noOfCol = 3;
                var headerRow = arrCSV.splice(0, noOfCol);
                var data = [];

                while (arrCSV.length > 0) {
                    var record = {};
                    var excelData = arrCSV.splice(0, noOfCol);

                    for (var i = 0; i < excelData.length; i++) {
                        record[headerRow[i]] = excelData[i].trim();
                    }

                    data.push(record);
                }
                that.getView().getModel("object").setProperty("/toppings",data)

            }
            oUploader.clear();
            reader.readAsBinaryString(file);
        }
    });
});
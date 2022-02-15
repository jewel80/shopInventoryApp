function SalesProductTab(UN) {
    if (Ext.getCmp('sales_product')) {
        tab_panel.setActiveTab(Ext.getCmp("sales_product"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Sales Product',
            layout: 'fit',
            closable: true,
            id: 'sales_product',
            autoScroll: true,
            items: [salesProductGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function salesProductGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('SALES_PRODUCT_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'inv_item_code',
                type: 'string',
                mapping: 'Inv_Product_Table.item_code'
            }]
        }),
        proxy: {
            type: 'ajax',
            url: '/getSalesList',
            reader: {
                root: 'rows',
                totalProperty: 'count'
            },
            simpleSortMode: true
        },
        sorters: [{
            property: 'id',
            direction: 'ASC'
        }]
    });

    var gridPaging = Ext.create('Ext.toolbar.Paging', {
        override: 'Ext.toolbar.Paging',
        store: store,
        displayInfo: true,
        displayMsg: 'DISPLAYING {0} - {1} OF {2}',
        emptyMsg: "No records to display",
    });

    var sales_product_grid = Ext.create('Ext.grid.Panel', {
        id: 'sales_product_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        viewConfig: {
            emptyText: 'No records',
            listeners: {
                afterrender: function(self, eOpts) {}
            }
        },
        tbar: [

            /*Ext.create('Ext.form.field.ComboBox', {
                name: 'product_type',
                id: 'inv_product_type_search',
                editable: false,
                emptyText: 'Search By Category...',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                padding: 5,
                store: {
                    fields: ['id', 'name'],
                    pageSize: 0,
                    limit: 0,
                    proxy: {
                        type: 'ajax',
                        url: '/getProductTypeList',
                        reader: {
                            root: 'rows'
                        }
                    },
                    autoLoad: true,
                    autoSync: true
                },
                listeners: {
                    change: {
                        fn: function(field, value) {
                            sales_product_grid.paramsReload({
                                product_type: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Text', {
                name: 'item_name',
                id: 'inv_item_name_search',
                emptyText: 'Search By Item Name...',
                padding: 5,
                listeners: {
                    change: {
                        fn: function(field, value) {
                            sales_product_grid.paramsReload({
                                item_name: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Text', {
                name: 'item_code',
                id: 'inv_item_code_search',
                emptyText: 'Search By Item Code...',
                padding: 5,
                listeners: {
                    change: {
                        fn: function(field, value) {
                            sales_product_grid.paramsReload({
                                item_code: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Date', {
                id: 'inv_start_date_search',
                name: 'from_date',
                padding: 5,
                emptyText: 'Select From Date...',
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            sales_product_grid.paramsReload({
                                from_date: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Date', {
                id: 'inv_end_date_search',
                name: 'to_date',
                padding: 5,
                emptyText: 'Select To Date...',
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            sales_product_grid.paramsReload({
                                to_date: value
                            });
                        }
                    }
                }
            }), {
                xtype: 'button',
                icon: '/public/icons/clear.png',
                tooltip: 'Clear The Search Boxes',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('inv_product_type_search').setValue(undefined);
                    Ext.getCmp('inv_item_name_search').setValue(undefined);
                    Ext.getCmp('inv_item_code_search').setValue(undefined);
                    Ext.getCmp('inv_start_date_search').setValue(undefined);
                    Ext.getCmp('inv_end_date_search').setValue(undefined);
                    Ext.getCmp('sales_product_grid').getStore().load();
                }
            }, */

            {
                xtype: 'button',
                icon: '/public/icons/create.png',
                tooltip: 'Add New BOX Archive',
                hidden: (UN.role < 2) ? true : false,
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    SalesProductFormWindow();
                }
            }, {
                xtype: 'button',
                icon: '/public/icons/refresh.png',
                tooltip: 'Reload',
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('sales_product_grid').paramsReload();
                }
            },
            gridPaging
        ],
        // }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50
        }), {
            header: 'ITEM NAME',
            dataIndex: 'item_name',
            align: 'left',
            flex: .4,
        }, {
            header: 'ITEM CODE',
            dataIndex: 'item_name',
            align: 'left',
            editor: 'textfield',
            flex: .4,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'INV ITEM CODE',
            dataIndex: 'inv_item_code',
            align: 'left',
            flex: .4,
        }, {
            header: 'SALES PRICE',
            dataIndex: 'sales_price',
            align: 'left',
            editor: 'textfield',
            flex: .4,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'SALES QTY',
            dataIndex: 'quantity',
            align: 'left',
            editor: 'textfield',
            flex: .4,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'DISCOUNT',
            dataIndex: 'discount',
            align: 'left',
            editor: 'textfield',
            flex: .4,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'TOTAL PRICE',
            dataIndex: 'total_price',
            align: 'left',
            editor: 'textfield',
            flex: .4,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'REMARKS',
            dataIndex: 'remark',
            align: 'left',
            editor: 'textfield',
            flex: .4,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'DATE',
            dataIndex: 'date',
            tdCls: 'x-change-cell',
            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
            align: 'center',
            flex: .4,
            editor: {
                xtype: 'datefield',
            },
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }],
        selModel: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            autoCancel: false
        })],
    });
    store.loadPage(1);
    return sales_product_grid;
}

function SalesProductFormWindow() {
    var prodID = 1;
    return Ext.create('Ext.window.Window', {
        title: 'Add New Sales Product',
        modal: true,
        id: 'SalesProductFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            id: 'importStatusFormWindowID',
            width: '35%',
            bodyPadding: 10,
            border: true,
            items: [{
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [Ext.create('Ext.panel.Panel', {
                    bodyPadding: 10,
                    border: false,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [{
                        border: false,
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [{
                                layout: 'hbox',
                                border: false,
                                align: 'stretch',
                                bodyStyle: 'padding-bottom: 7px;',
                                items: [{
                                    xtype: 'combo',
                                    name: 'product_type',
                                    fieldLabel: 'Product Type',
                                    id: 'product_type_combo_load',
                                    allowBlank: false,
                                    editable: true,
                                    width: 300,
                                    labelWidth: 90,
                                    labelAlign: 'left',
                                    labelSeparator: '',
                                    emptyText: 'Select Product Type...',
                                    labelClsExtra: 'some-class',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    selectOnFocus: true,
                                    triggerAction: 'all',
                                    anyMatch: true,
                                    typeAhead: true,
                                    transform: 'stateSelect',
                                    forceSelection: true,
                                    store: {
                                        fields: ['id', 'name'],
                                        pageSize: 0,
                                        limit: 0,
                                        proxy: {
                                            type: 'ajax',
                                            url: '/getProductTypeList',
                                            reader: {
                                                root: 'rows'
                                            }
                                        },
                                        autoLoad: true,
                                        autoSync: true
                                    },
                                    listeners: {
                                        blur: function(self, The, eOpts) {
                                            if (self.value) {
                                                prodID = self.value;
                                                Ext.getCmp("userInputFormProductItemCodeField").setDisabled(false);
                                                Ext.getCmp("userInputFormProductItemCodeField").getStore().setProxy({
                                                    type: 'ajax',
                                                    url: '/singleProductInventory/' + prodID
                                                }).load();
                                            }
                                        }
                                    }

                                }]
                            },

                            {
                                layout: 'hbox',
                                border: false,
                                align: 'stretch',
                                bodyStyle: 'padding-bottom: 7px;',
                                items: [{
                                    xtype: 'combo',
                                    name: 'product_item_code',
                                    fieldLabel: 'Product Code',
                                    id: 'userInputFormProductItemCodeField',
                                    width: 300,
                                    labelWidth: 90,
                                    anyMatch: true,
                                    typeAhead: true,
                                    transform: 'stateSelect',
                                    forceSelection: true,
                                    disabled: true,
                                    allowBlank: false,
                                    editable: true,
                                    labelAlign: 'left',
                                    labelSeparator: '',
                                    emptyText: 'Select Product Item Code...',
                                    labelClsExtra: 'some-class',
                                    fieldStyle: 'text-align: left;font-size: 12px;',
                                    autoScroll: true,
                                    queryMode: 'local',
                                    displayField: 'item_code',
                                    valueField: 'id',
                                    selectOnFocus: true,
                                    triggerAction: 'all',
                                    store: {
                                        fields: ['id', 'item_code'],
                                        pageSize: 0,
                                        limit: 0,
                                        proxy: {
                                            type: 'ajax',
                                            url: '/singleProductInventory' + prodID,
                                            reader: {
                                                root: 'rows'
                                            }
                                        },
                                        autoLoad: true,
                                        autoSync: true
                                    },
                                    listeners: {
                                        change: function(combo, newValue, oldValue) {
                                            var item_name = combo.getSelection().data.item_name;
                                            var BuyingPrice = combo.getSelection().data.buying_price;
                                            var CurrentStock = combo.getSelection().data.buying_quantity - combo.getSelection().data.sold_quantity;

                                            if (Ext.getCmp("userInputFormFingerPrintIDField").getValue() == 0)
                                                Ext.getCmp("userInputFormFingerPrintIDField").setValue(item_name);

                                            if (Ext.getCmp("userInputFormCurrentStockField").getValue() == 0)
                                                Ext.getCmp("userInputFormCurrentStockField").setValue(CurrentStock);

                                            if (Ext.getCmp("userInputFormBuyPriceField").getValue() == 0)
                                                Ext.getCmp("userInputFormBuyPriceField").setValue(BuyingPrice);
                                        }
                                    }

                                }]
                            },

                            {
                                xtype: 'textfield',
                                id: 'userInputFormFingerPrintIDField',
                                name: 'item_name',
                                fieldLabel: ' Item Name',
                                filedAlign: 'top',
                                width: 300,
                                editable: false,
                                labelWidth: 90,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }, {
                                xtype: 'textfield',
                                name: 'CurrentStock',
                                id: 'userInputFormCurrentStockField',
                                fieldLabel: 'Available Stock',
                                filedAlign: 'top',
                                editable: false,
                                width: 300,
                                labelWidth: 90,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }, {
                                xtype: 'textfield',
                                id: 'userInputFormBuyPriceField',
                                name: 'BuyingPrice',
                                fieldLabel: 'Buying Prcie',
                                filedAlign: 'top',
                                editable: false,
                                width: 300,
                                labelWidth: 90,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }
                        ]
                    }, {
                        border: false,
                        margin: '0 0 0 15',
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'numberfield',
                            name: 'sales_price',
                            fieldLabel: 'Sale price',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 300,
                            labelWidth: 80,
                            minValue: 0,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Sale price...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }, {
                            xtype: 'numberfield',
                            name: 'quantity',
                            fieldLabel: 'Sale Qty.',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 300,
                            labelWidth: 80,
                            minValue: 0,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Sale Quantity...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true,
                            validator: function(value) {
                                var currentStock = Ext.getCmp('userInputFormCurrentStockField').value; 
                                if (value <= currentStock) {
                                    return true;
                                } else {
                                    return "The product Qty is not available in stores.";
                                }
                            }
                        }, {
                            xtype: 'numberfield',
                            name: 'discount',
                            fieldLabel: 'Discount',
                            filedAlign: 'top',
                            allowBlank: true,
                            width: 300,
                            labelWidth: 80,
                            minValue: 0,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Discount...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }, {
                            xtype: 'datefield',
                            name: 'date',
                            fieldLabel: 'Date',
                            filedAlign: 'top',
                            allowBlank: true,
                            width: 300,
                            labelWidth: 80,
                            minValue: 0,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Date...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }, {
                            xtype: 'textfield',
                            name: 'remark',
                            fieldLabel: 'Remark',
                            filedAlign: 'top',
                            allowBlank: true,
                            width: 300,
                            labelWidth: 80,
                            minValue: 0,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Remark...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }]
                    }]
                })]
            }],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true,
                handler: function() {
                    var panel = this.up('form');
                    var form = panel.getForm();
                    var values = form.getValues();
                    console.log({
                        values
                    })
                    for (var key in values) {
                        if (values[key] === '') {
                            values[key] = null;
                        }
                    }
                    Ext.Ajax.request({
                        url: '/CreateSalesProduct',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            if (Ext.getCmp('sales_product_grid')) {
                                Ext.getCmp('sales_product_grid').getStore().load();
                            }
                            Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                            Ext.getCmp('SalesProductFormWindow').close()
                        },
                        failure: function(response) {
                            Ext.MessageBox.alert('Error',
                                'Please contact with the developer');
                        }
                    });
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('SalesProductFormWindow').close()
                }
            }]
        })]
    }).show();
}
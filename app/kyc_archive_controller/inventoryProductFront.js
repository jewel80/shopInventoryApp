function inventoryProductTab(UN) {
    if (Ext.getCmp('inventory_product')) {
        tab_panel.setActiveTab(Ext.getCmp("inventory_product"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Inventory Product',
            layout: 'fit',
            closable: true,
            id: 'inventory_product',
            autoScroll: true,
            items: [inventoryProductGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function inventoryProductGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('INV_PRODUCT_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'product_type',
                type: 'string',
                mapping: 'Product_Type_Table.name'
            }]
        }),
        proxy: {
            type: 'ajax',
            url: '/getInvProductList',
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

    var inventory_product_grid = Ext.create('Ext.grid.Panel', {
        id: 'inventory_product_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        viewConfig: {
            emptyText: 'No records',
            listeners: {
                afterrender: function(self, eOpts) {}
            }
        },
        tbar: [Ext.create('Ext.form.field.ComboBox', {
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
                        inventory_product_grid.paramsReload({
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
                        inventory_product_grid.paramsReload({
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
                        inventory_product_grid.paramsReload({
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
                        inventory_product_grid.paramsReload({
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
                        inventory_product_grid.paramsReload({
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
                Ext.getCmp('inventory_product_grid').getStore().load();
            }
        }, {
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
                inventoryProductFormWindow();
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
                Ext.getCmp('inventory_product_grid').paramsReload();
            }
        }, gridPaging],
        // }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50
        }),  {
            header: 'CATEGORY',
            dataIndex: 'product_type',
            align: 'left',
            flex: .4,
        }, {
            header: 'ITEM NAME',
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
            header: 'ITEM CODE',
            dataIndex: 'item_code',
            align: 'left',
            flex: .4,
        }, {
            header: 'BUYING PRICE',
            dataIndex: 'buying_price',
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
            header: 'BUYING QTY',
            dataIndex: 'buying_quantity',
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
            header: 'SELLING PRICE',
            dataIndex: 'selling_price',
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
            header: 'SOLD QTY',
            dataIndex: 'sold_quantity',
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
            header: 'REMAINING',
            dataIndex: 'remaining',
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
            dataIndex: 'in_date',
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
        }, {
            header: 'REMARK',
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
        }, ],
        selModel: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            autoCancel: false
        })],
    });
    store.loadPage(1);
    return inventory_product_grid;
}

function inventoryProductFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Inventory Product',
        modal: true,
        id: 'inventoryProductFormWindow',
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
                                    }
                                }, {
                                    xtype: 'button',
                                    icon: '/public/icons/create.png',
                                    tooltip: 'Add New Product Type',
                                    border: 1,
                                    handler: function() {
                                        productTypeFormWindow();
                                    }
                                }]
                            }, {
                                xtype: 'textfield',
                                name: 'item_name',
                                fieldLabel: ' Item Name',
                                filedAlign: 'top',
                                allowBlank: false,
                                width: 300,
                                labelWidth: 90,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Item Name...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }, {
                                xtype: 'textfield',
                                name: 'item_code',
                                fieldLabel: ' Item Code',
                                filedAlign: 'top',
                                allowBlank: false,
                                width: 300,
                                labelWidth: 90,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Item Code...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }, {
                                xtype: 'numberfield',
                                name: 'buying_price',
                                fieldLabel: 'Buying Price',
                                filedAlign: 'top',
                                allowBlank: false,
                                width: 300,
                                labelWidth: 90,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Buying Price...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }, {
                                xtype: 'numberfield',
                                name: 'buying_quantity',
                                fieldLabel: 'Buying Qty',
                                filedAlign: 'top',
                                allowBlank: false,
                                width: 300,
                                labelWidth: 90,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give AIT...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }]
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
                                name: 'selling_price',
                                fieldLabel: 'Selling Price',
                                filedAlign: 'top',
                                allowBlank: false,
                                width: 300,
                                labelWidth: 80,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Selling Price...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
                            }, {
                                xtype: 'numberfield',
                                name: 'sold_quantity',
                                fieldLabel: 'Sold Qty.',
                                filedAlign: 'top',
                                allowBlank: false,
                                width: 300,
                                labelWidth: 80,
                                minValue: 0,
                                labelAlign: 'left',
                                labelStyle: 'text-align:left;border solid 1px white;',
                                labelSeparator: '',
                                emptyText: 'Give Sold Quantity...',
                                labelClsExtra: 'some-class',
                                fieldStyle: 'text-align: left;font-size: 12px;',
                                autoScroll: true
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
                                name: 'in_date',
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
                    for (var key in values) {
                        if (values[key] === '') {
                            values[key] = null;
                        }
                    }
                    Ext.Ajax.request({
                        url: '/CreateInvProduct',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            if (Ext.getCmp('inventory_product_grid')) {
                                Ext.getCmp('inventory_product_grid').getStore().load();
                            }
                            Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                            Ext.getCmp('inventoryProductFormWindow').close()
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
                    Ext.getCmp('inventoryProductFormWindow').close()
                }
            }]
        })]
    }).show();
}


function productTypeFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Product Type',
        modal: true,
        id: 'productTypeFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Name',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                minValue: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Product Name...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: 'Description',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Product Description...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, ],
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
                    for (var key in values) {
                        if (values[key] === '') {
                            values[key] = null;
                        }
                    }
                    Ext.Ajax.request({
                        url: '/CreateProductType',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            if (Ext.getCmp('product_type_combo_load')) {
                                Ext.getCmp('product_type_combo_load').getStore().load();
                            }
                            Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                            Ext.getCmp('productTypeFormWindow').close()
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
                    Ext.getCmp('productTypeFormWindow').close()
                }
            }]
        })]
    }).show();
}
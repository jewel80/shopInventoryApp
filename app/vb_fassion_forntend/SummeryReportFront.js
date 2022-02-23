function SummeryReportTab(UN) {
    if (Ext.getCmp('summery_report')) {
        tab_panel.setActiveTab(Ext.getCmp("summery_report"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Summery Report',
            layout: 'fit',
            closable: true,
            id: 'summery_report',
            autoScroll: true,
            items: [SummerReportGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function SummerReportGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('SUMMERY_REPORT_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'item_code',
                type: 'string',
                mapping: 'Inv_Product_Table.item_code'
            }, {
                name: 'item_name',
                type: 'string',
                mapping: 'Inv_Product_Table.item_name'
            }, {
                name: 'buying_price',
                type: 'int',
                mapping: 'Inv_Product_Table.buying_price'
            }, {
                name: 'buying_quantity',
                type: 'int',
                mapping: 'Inv_Product_Table.buying_quantity'
            }, {
                name: 'selling_price',
                type: 'int',
                mapping: 'Inv_Product_Table.selling_price'
            }, {
                name: 'sold_quantity',
                type: 'int',
                mapping: 'Inv_Product_Table.sold_quantity'
            }, {
                name: 'remaining',
                type: 'string',
                mapping: 'Inv_Product_Table.remaining'
            }, ]
        }),
        proxy: {
            type: 'ajax',
            url: '/getSummeryList',
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

    var summery_report_grid = Ext.create('Ext.grid.Panel', {
        id: 'summery_report_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        viewConfig: {
            emptyText: 'No records',
            listeners: {
                afterrender: function(self, eOpts) {}
            }
        },
        features: [{
            ftype: 'summary',
            dock: 'bottom'
        }],
        tbar: [Ext.create('Ext.form.field.Text', {
                name: 'item_name',
                id: 'summery_item_name_search',
                emptyText: 'Search By Item Name...',
                padding: 5,
                border: 2,
                style: {
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                listeners: {
                    change: {
                        fn: function(field, value) {
                            summery_report_grid.paramsReload({
                                item_name: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Text', {
                name: 'item_code',
                id: 'summery_item_code_search',
                emptyText: 'Search By Item Code...',
                padding: 5,
                border: 2,
                style: {
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                listeners: {
                    change: {
                        fn: function(field, value) {
                            summery_report_grid.paramsReload({
                                item_code: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Date', {
                id: 'summery_start_date_search',
                name: 'from_date',
                padding: 5,
                border: 2,
                style: {
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                emptyText: 'Select From Date...',
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            summery_report_grid.paramsReload({
                                from_date: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Date', {
                id: 'summery_end_date_search',
                name: 'to_date',
                padding: 5,
                border: 2,
                style: {
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                emptyText: 'Select To Date...',
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            summery_report_grid.paramsReload({
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
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('summery_start_date_search').setValue(undefined);
                    Ext.getCmp('summery_end_date_search').setValue(undefined);
                    Ext.getCmp('summery_item_name_search').setValue(undefined);
                    Ext.getCmp('summery_item_code_search').setValue(undefined);
                    Ext.getCmp('summery_report_grid').getStore().load();
                }
            },

            {
                xtype: 'button',
                icon: '/public/icons/create.png',
                tooltip: 'Add New Sales Product',
                hidden: (UN.role < 2) ? true : false,
                border: 1,
                style: {
                    borderColor: 'green',
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
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('summery_report_grid').paramsReload();
                }
            },
            gridPaging
        ],
        // }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50,
        }), {
            header: 'DATE',
            dataIndex: 'date',
            tdCls: 'x-change-cell',
            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
            align: 'center',
            width: 110
        }, {
            header: 'MEMO E.N',
            dataIndex: 'memo_e_n',
            align: 'left',
            width: 130,
            renderer: function(value, meta) {
                meta.style = "background-color: rgb(207 181 206)";
                return value;
            },
        }, {
            header: 'ITEM NAME',
            dataIndex: 'item_name',
            align: 'left',
            width: 130,
        }, {
            header: 'ITEM CODE',
            dataIndex: 'item_code',
            align: 'left',
            width: 130
        }, {
            header: 'SALES QTY',
            dataIndex: 'quantity',
            align: 'right',
            width: 130,
            renderer: function(value, meta) {
                meta.style = "background-color: rgb(155 140 167)";
                return value;
            },
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, field, metaData) {
                return '<b><big>' + Ext.String.format('{0}', value) + '</big></b>';
            },
        }, {
            header: 'SALES RATE',
            dataIndex: 'sales_price',
            align: 'right',
            width: 130,
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return '<b><big>৳' + value.formatMoney(2, '.', ',') + '</big></b> ';
            },
            renderer: function(value, meta, record, rowIdx, colIdx, store, view) {
                meta.style = "background-color: rgb(150 192 193)";
                return value.formatMoney(2, '.', ',');
            },
        }, {
            header: 'DISCOUNT',
            dataIndex: 'discount',
            align: 'right',
            width: 110,
            renderer: function(value, meta) {
                meta.style = "background-color: #dbdb9f";
                return value;
            }
        }, {
            header: 'TOTAL SALES PRICE',
            dataIndex: 'total_price',
            align: 'right',
            width: 130,
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return '<b><big>৳' + value.formatMoney(2, '.', ',') + '</big></b> ';
            },
            renderer: function(value, meta, record, rowIdx, colIdx, store, view) {
                meta.style = "background-color: rgb(203 217 156)";
                return value.formatMoney(2, '.', ',');
            },
        }, {
            header: 'PROFIT',
            dataIndex: 'profit',
            align: 'right',
            width: 130,
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                var thisGrid = Ext.getCmp('summery_report_grid').getStore().data;
                var amount = 0;
                for (var i = thisGrid.length - 1; i >= 0; i--) {
                    var Qty = parseInt(thisGrid.items[i].data.quantity);
                    var BuyingPrice = parseInt(thisGrid.items[i].data.Inv_Product_Table.buying_price);
                    var salesPrice = parseInt(thisGrid.items[i].data.total_price);
                    amount += salesPrice - (BuyingPrice * Qty);
                };
                return '<b><big>৳' + amount.toFixed(2) + '</big></b> ';
            },
            renderer: function(value, meta, recordX, rowIndex, colIndex, store, view) {
                var buyCost = (parseInt(recordX.data.buying_price) * parseInt(recordX.data.quantity));
                var salesPrice = parseInt(recordX.data.total_price);
                var value = salesPrice - buyCost;
                meta.style = "background-color: rgb(190 204 219)";
                return value.formatMoney(2, '.', ',');
            },
        }, {
            header: 'REMARKS',
            dataIndex: 'remark',
            align: 'left',
            width: 150
        }],
        selModel: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            autoCancel: false
        })],
    });
    store.loadPage(1);
    return summery_report_grid;
}
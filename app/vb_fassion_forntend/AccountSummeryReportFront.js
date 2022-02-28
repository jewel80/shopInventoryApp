function AccountSummeryTab(UN) {
    if (Ext.getCmp('account_summery_report')) {
        tab_panel.setActiveTab(Ext.getCmp("account_summery_report"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Account Summery',
            layout: 'fit',
            closable: true,
            id: 'account_summery_report',
            autoScroll: true,
            items: [AccountSummerReportGrid()]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function AccountSummerReportGrid(UN) {
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
            }]
        }),
        proxy: {
            type: 'ajax',
            url: '/getAccountSummeryList',
            // reader: {
            //     root: 'rows',
            //     totalProperty: 'count'
            // },
            // simpleSortMode: true
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

    var ac_summery_report_grid = Ext.create('Ext.grid.Panel', {
        id: 'ac_summery_report_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        cls: 'custom-grid',
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
        tbar: [Ext.create('Ext.form.field.Month', {
            id: 'month_account_summery',
            name: 'month',
            format: 'F, Y',
            padding: 5,
            border: 2,
            style: {
                borderColor: 'green',
                borderStyle: 'solid'
            },
            emptyText: 'Select To Month...',
            listeners: {
                change: {
                    fn: function(combo, value) {
                        ac_summery_report_grid.paramsReload({
                            month: value
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
                Ext.getCmp('month_account_summery').setValue(undefined);
                Ext.getCmp('ac_summery_report_grid').getStore().load();
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
                Ext.getCmp('ac_summery_report_grid').paramsReload();
            }
        }],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50,
        }), {
            header: 'DATE',
            dataIndex: 'date',
            tdCls: 'x-change-cell',
            renderer: Ext.util.Format.dateRenderer('M-Y'),
            align: 'center',
            width: 110
        }, {
            header: 'BUY PRICE',
            dataIndex: 'buyingPrice',
            align: 'right',
            flex: .5,
            renderer: function(value, meta) {
                meta.style = "background-color: #9196c1c2";
                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
            },
        }, {
            header: 'SALES PRICE',
            dataIndex: 'totalPrice',
            align: 'right',
            flex: .5,
            renderer: function(value, meta, recordX, rowIndex, colIndex, store, view) {
                meta.style = "background-color: #9196c1c2";
                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
            },
        }, {
            header: 'EXPENCE',
            dataIndex: 'expence',
            align: 'right',
            flex: .5,
            renderer: function(value, meta, recordX, rowIndex, colIndex, store, view) {
                meta.style = "background-color: #9196c1c2";
                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
            },
        }, {
            header: 'PROFIT',
            dataIndex: 'profit',
            align: 'right',
            editor: 'textfield',
            flex: .5,
            renderer: function(value, meta, recordX, rowIndex, colIndex, store, view) {
                var value = (recordX.data.totalPrice - recordX.data.expence);
                // meta.style = "background-color: #9196c1c2";
                meta.style = "background-color: #79cfa1";
                return '<b><big>' + value.formatMoney(2, '.', ',') + '</big></b>';
            },
        }, ],
        selModel: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            autoCancel: false
        })],
    });
    store.loadPage(1);
    return ac_summery_report_grid;
}
function kycReportListTab(UN) {
    if (Ext.getCmp('kyc_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("kyc_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'KYC Report',
            layout: 'fit',
            closable: true,
            id: 'kyc_report_tab',
            autoScroll: true,
            items: [kycReportGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function kycReportGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('KYC_REPORT_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'kycSerial',
                type: 'string'
            }, ]
        }),
        proxy: {
            type: 'ajax',
            url: '/getKycReportList',
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

    var kyc_report_grid = Ext.create('Ext.grid.Panel', {
        id: 'kyc_report_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        viewConfig: {
            emptyText: 'No records',
            listeners: {
                afterrender: function(self, eOpts) {}
            }
        },
        tbar: [Ext.create('Ext.form.field.Text', {
            name: 'kyc_serial',
            id: 'kyc_serial_report_search',
            emptyText: 'Search By KYC Serial...',
            padding: 5,
            listeners: {
                change: {
                    fn: function(field, value) {
                        kyc_report_grid.paramsReload({
                            kyc_serial: value
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
                Ext.getCmp('kyc_serial_report_search').setValue(undefined);
                Ext.getCmp('kyc_report_grid').getStore().load();
            }
        }, {
            xtype: 'button',
            icon: '/public/icons/excel.png',
            hidden: (UN.role < 2) ? true : false,
            tooltip: 'Download As EXCEL',
            border: 1,
            style: {
                borderColor: 'green',
                borderStyle: 'solid'
            },
            handler: function() {
                if (Ext.getCmp('kyc_report_grid')) {
                    var param = Ext.getCmp('kyc_report_grid').getStore().lastOptions.params;
                    tab_panel.setLoading(true);
                    Ext.Ajax.request({
                        url: '/DownloadKYCReportExcel',
                        method: 'POST',
                        params: param,
                        success: function(response, option) {
                            Ext.MessageBox.alert('success', 'Click Here  <a href = "/public/excel/DownloadKYCReportExcel.xlsx" target="_blank"> View Excel sheet</a>');
                            tab_panel.setLoading(false);
                        },
                        failure: function(response, option) {},
                        warning: function(response, option) {
                            Ext.MessageBox.alert('waring ', 'There is no data aviable');
                        },
                    });
                }
            }
        }, {
            xtype: 'button',
            tooltip: 'Download As PDF',
            icon: '/public/icons/pdf_dowload.png',
            hidden: (UN.role < 2) ? true : false,
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                if (Ext.getCmp('kyc_report_grid')) {
                    var params = Ext.getCmp('kyc_report_grid').getStore().lastOptions.params;
                    tab_panel.setLoading(true);
                    Ext.Ajax.request({
                        url: '/PrintKycArchiveSingleData',
                        method: 'POST',
                        params: params,
                        success: function(response, option) {
                            Ext.MessageBox.alert('success', 'Click Here  <a href = "/public/pdf/PrintKycArchiveSingleData.pdf" target="_blank"> View Printed sheet</a>');
                            tab_panel.setLoading(false);
                        },
                        failure: function(response, option) {},
                        warning: function(response, option) {
                            Ext.MessageBox.alert('waring ', 'There is no data aviable');
                        },
                        scope: this
                    });
                }
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
                Ext.getCmp('kyc_report_grid').paramsReload();
            }
        }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50
        }), {
            header: 'KYC SERIAL',
            dataIndex: 'KycSerial',
            align: 'right',
            width: 140
        }, {
            header: 'BATCH NO',
            dataIndex: 'BatchNo',
            align: 'left',
            width: 110
        }, {
            header: 'BOX NUMBER',
            dataIndex: 'BoxNo',
            align: 'left',
            width: 180
        }, {
            header: 'OPERATOR',
            dataIndex: 'operator',
            align: 'left',
            width: 120,
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.toUpperCase();
            },
        }, {
            header: 'DATE',
            dataIndex: 'Date',
            tdCls: 'x-change-cell',
            renderer: Ext.util.Format.dateRenderer('d-M-Y'),
            align: 'center',
            width: 120
        }, {
            header: 'SERIAL NO',
            dataIndex: 'Serial_no',
            align: 'center',
            width: 150
        }, {
            header: 'ZONE/FLOOR',
            dataIndex: 'Floor',
            align: 'left',
            width: 120
        }, {
            header: 'TRAIN',
            dataIndex: 'Train',
            align: 'left',
            width: 120
        }, {
            header: 'RACK',
            dataIndex: 'Rack',
            align: 'left',
            width: 120
        }, {
            header: 'LEVEL',
            dataIndex: 'Level',
            align: 'left',
            width: 120
        }, {
            header: 'COLUMN',
            dataIndex: 'Column',
            align: 'left',
            width: 120
        }, {
            header: 'SIDE',
            dataIndex: 'Side',
            align: 'left',
            width: 120
        }, ],
        selModel: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            autoCancel: false
        })],
    });
    store.loadPage(1);
    return kyc_report_grid;
}
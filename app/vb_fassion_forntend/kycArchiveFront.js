function kycArchiveListTab(UN) {
    if (Ext.getCmp('kyc_archive_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("kyc_archive_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'KYC Archive',
            layout: 'fit',
            closable: true,
            id: 'kyc_archive_tab',
            autoScroll: true,
            items: [KycArchiveGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function KycArchiveGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('KYC_ARCHIVE_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'box_no',
                type: 'string'
            }]
        }),
        proxy: {
            type: 'ajax',
            url: '/getKycArchiveList',
            reader: {
                root: 'rows',
                totalProperty: 'count'
            },
            simpleSortMode: true
        },
        sorters: [{
            property: 'id',
            direction: 'DESC'
        }]
    });

    var gridPaging = Ext.create('Ext.toolbar.Paging', {
        override: 'Ext.toolbar.Paging',
        store: store,
        displayInfo: true,
        displayMsg: 'DISPLAYING {0} - {1} OF {2}',
        emptyMsg: "No records to display",
    });

    var kyc_archive_grid = Ext.create('Ext.grid.Panel', {
        id: 'kyc_archive_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        viewConfig: {
            emptyText: 'No records',
            listeners: {
                afterrender: function(self, eOpts) {}
            }
        },
        tbar: [Ext.create('Ext.Button', {
            icon: '/public/icons/search.png',
            tooltip: 'Download KYC Archive Grid List',
            arrowAlign: 'right',
            style: {
                borderColor: '#99bce8',
                borderStyle: 'solid'
            },
            menu: Ext.create('Ext.menu.Menu', {
                plain: true,
                bodyPadding: 5,
                items: [Ext.create('Ext.form.field.Text', {
                    name: 'box_no',
                    id: 'kyc_box_number_search',
                    emptyText: 'Search By BOX Number...',
                    padding: 5,
                    listeners: {
                        change: {
                            fn: function(field, value) {
                                kyc_archive_grid.paramsReload({
                                    box_no: value
                                });
                            }
                        }
                    }
                }), Ext.create('Ext.form.field.Text', {
                    name: 'operator',
                    id: 'employee_operator_name_search',
                    emptyText: 'Search By Operator...',
                    padding: 5,
                    listeners: {
                        change: {
                            fn: function(field, value) {
                                kyc_archive_grid.paramsReload({
                                    operator: value
                                });
                            }
                        }
                    }
                }), Ext.create('Ext.form.field.Month', {
                    id: 'kyc_archive_date_search',
                    name: 'date',
                    padding: 5,
                    format: 'F, Y',
                    emptyText: 'Select Month...',
                    listeners: {
                        change: {
                            fn: function(combo, value) {
                                kyc_archive_grid.paramsReload({
                                    date: value
                                });
                            }
                        }
                    }
                }), {
                    xtype: 'button',
                    text: 'Clear Search',
                    icon: '/public/icons/clear.png',
                    tooltip: 'Clear The Search Boxes',
                    margin: '5 10',
                    handler: function() {
                        Ext.getCmp('kyc_box_number_search').setValue(undefined);
                        Ext.getCmp('employee_operator_name_search').setValue(undefined);
                        Ext.getCmp('kyc_archive_date_search').setValue(undefined);
                        Ext.getCmp('kyc_archive_grid').getStore().load();
                    }
                }, ]
            })
        }), {
            xtype: 'button',
            hidden: (UN.role < 2) ? true : false,  
            icon: '/public/icons/create.png',
            tooltip: 'Add New KYC Archive',
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                kycArchiveFormWindow();
            }
        }, {
            xtype: 'button',
            hidden: (UN.role < 2) ? true : false, 
            style: {
                borderColor: 'green',
                borderStyle: 'solid'
            },
            icon: '/public/icons/excel.png',
            tooltip: 'Download As Excel',
            handler: function() {
                var param = Ext.getCmp('kyc_archive_grid').getStore().lastOptions.params;
                tab_panel.setLoading(true);
                Ext.Ajax.request({
                    url: '/DownloadKYCArchiveExcel',
                    method: 'POST',
                    params: param,
                    success: function(response, option) {
                        Ext.MessageBox.alert('success', 'Click Here  <a href = "/public/excel/DownloadKYCArchiveExcel.xlsx" target="_blank"> View Excel sheet</a>');
                        tab_panel.setLoading(false);
                    },
                    failure: function(response, option) {},
                    warning: function(response, option) {
                        Ext.MessageBox.alert('waring ', 'There is no data aviable');
                    },
                });
            }
        }, {
            xtype: 'button',
            // text: 'PDF',
            tooltip: 'Download As PDF',
            icon: '/public/icons/pdf_dowload.png',
            hidden: (UN.role < 2) ? true : false, 
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                var param = Ext.getCmp('kyc_archive_grid').getStore().lastOptions.params;
                tab_panel.setLoading(true);
                Ext.Ajax.request({
                    url: '/DownloadKYCArchivePDF',
                    method: 'POST',
                    params: param,
                    success: function(response, option) {
                        Ext.MessageBox.alert('success', 'Click Here  <a href = "/public/pdf/DownloadKYCArchivePDF.pdf" target="_blank"> View Excel sheet</a>');
                        tab_panel.setLoading(false);
                    },
                    failure: function(response, option) {},
                    warning: function(response, option) {
                        Ext.MessageBox.alert('waring ', 'There is no data aviable');
                    },
                });
            }
        }, {
            xtype: 'button',
            // text: 'Refresh',
            icon: '/public/icons/refresh.png',
            tooltip: 'Reload',
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                Ext.getCmp('kyc_archive_grid').paramsReload();
            }
        }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50
        }), {
            header: 'KYC SERIAL',
            dataIndex: 'kyc_serial',
            align: 'left',
            editor: 'textfield',
            flex: 1,
            align: 'right',
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'BATCH NO',
            dataIndex: 'batch_no',
            align: 'center',
            editor: 'textfield',
            width: 100,
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'BOX NUMBER',
            dataIndex: 'box_no',
            align: 'left',
            flex: 1.5
        }, {
            header: 'OPERATOR',
            dataIndex: 'operator',
            align: 'left',
            editor: 'textfield',
            flex: 1.5,
            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                return value.toUpperCase();
            },
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
            width: 110,
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
    return kyc_archive_grid;
}

function kycArchiveFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New KYC Archive ',
        modal: true,
        id: 'kycArchiveFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'numberfield',
                name: 'kyc_serial',
                fieldLabel: 'KYC Serial',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                minValue: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give KYC Serial...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'numberfield',
                name: 'batch_no',
                fieldLabel: 'Batch No',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Batch No...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'box_no',
                fieldLabel: 'Box No',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Box No...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'operator',
                fieldLabel: 'Operator',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Operator Name...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
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
                        url: '/CreateKycArchive',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            Ext.getCmp('kyc_archive_grid').getStore().load();
                            Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                            Ext.getCmp('kycArchiveFormWindow').close()
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
                    Ext.getCmp('kycArchiveFormWindow').close()
                }
            }]
        })]
    }).show();
}
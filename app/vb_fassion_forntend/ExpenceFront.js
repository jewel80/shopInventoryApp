function ExpenceListTab(UN) {
    if (Ext.getCmp('expence_list')) {
        tab_panel.setActiveTab(Ext.getCmp("expence_list"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Expence List',
            layout: 'fit',
            closable: true,
            id: 'expence_list',
            autoScroll: true,
            items: [ExpenceListGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function ExpenceListGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('EXPENCE_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }]
        }),
        proxy: {
            type: 'ajax',
            url: '/getExpenceList',
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

    var expence_list_grid = Ext.create('Ext.grid.Panel', {
        id: 'expence_list_grid',
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
        tbar: [Ext.create('Ext.form.field.Date', {
                id: 'expence_start_date_search',
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
                            expence_list_grid.paramsReload({
                                from_date: value
                            });
                        }
                    }
                }
            }), Ext.create('Ext.form.field.Date', {
                id: 'expence_end_date_search',
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
                            expence_list_grid.paramsReload({
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
                    Ext.getCmp('expence_start_date_search').setValue(undefined);
                    Ext.getCmp('expence_end_date_search').setValue(undefined);
                    Ext.getCmp('expence_list_grid').getStore().load();
                }
            }, {
                xtype: 'button',
                icon: '/public/icons/create.png',
                tooltip: 'Add New Expence',
                hidden: (UN.role < 2) ? true : false,
                border: 1,
                style: {
                    borderColor: 'green',
                    borderStyle: 'solid'
                },
                handler: function() {
                    expenceFormWindow();
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
                    Ext.getCmp('expence_list_grid').paramsReload();
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
            flex: .5,
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
            header: 'EXPENCE COST',
            dataIndex: 'expence_money',
            align: 'right',
            editor: 'textfield',
            flex: .5,
            summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return '<b><big>৳' + value.formatMoney(2, '.', ',') + '</big></b> ';
            },
            renderer: function(value, meta, record, rowIdx, colIdx, store, view) {
                // meta.style = "background-color: rgb(155 140 167)";
                meta.style = "background-color: #c9dee7";
                return value.formatMoney(2, '.', ',');
            },
        }, {
            header: 'REMARKS',
            dataIndex: 'remark',
            align: 'left',
            editor: 'textfield',
            flex: .5,
        }, {
            xtype: 'actioncolumn',
            header: 'DELETE',
            width: 75,
            // hidden: (UN.role < 2) ? false : true,
            hideable: true,
            icon: '/public/icons/delete.png',
            tooltip: 'Delete',
            handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                Ext.Msg.show({
                    title: 'Delete Confirm?',
                    msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.WARNING,
                    fn: function(btn, text) {
                        if (btn == 'yes') {
                            var QUERY = {}
                            QUERY.id = record.data.id;
                            Ext.Ajax.request({
                                url: '/DestroyExpence',
                                method: 'POST',
                                params: QUERY,
                                success: function(response) {
                                    if (response.responseText == 'success') {
                                        if (Ext.getCmp('expence_list_grid')) {
                                            Ext.getCmp('expence_list_grid').getStore().load();
                                        }
                                        Ext.MessageBox.alert('Success', 'Successfully data Deleted');
                                    } else {
                                        Ext.MessageBox.alert('Error', 'It Has Been Alocated In Another Functions');
                                    }
                                },
                                failure: function(response) {
                                    Ext.MessageBox.alert('Error',
                                        'Something is Worng! Please contact with the developer');
                                }
                            });
                        }
                    }
                });
            },
            align: 'center'
        }],
        selModel: 'cellmodel',
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            autoCancel: false
        })],
    });
    store.loadPage(1);
    return expence_list_grid;
}

function expenceFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Expence',
        modal: true,
        id: 'expenceFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'datefield',
                name: 'date',
                fieldLabel: 'Date ',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Date ...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'numberfield',
                name: 'expence_money',
                fieldLabel: 'Cost',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Expence Cost...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'remarks',
                fieldLabel: 'Remarks ',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Remarks ...',
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
                        url: '/CreateExpence',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            if (Ext.getCmp('expence_list_grid')) {
                                Ext.getCmp('expence_list_grid').getStore().load();
                            }
                            Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                            Ext.getCmp('expenceFormWindow').close()
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
                    Ext.getCmp('expenceFormWindow').close()
                }
            }]
        })]
    }).show();
}
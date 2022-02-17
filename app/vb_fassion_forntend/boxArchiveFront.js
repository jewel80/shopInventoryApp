function boxArchiveListTab(UN) {
    if (Ext.getCmp('box_archive_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("box_archive_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'BOX Archive',
            layout: 'fit',
            closable: true,
            id: 'box_archive_tab',
            autoScroll: true,
            items: [boxArchiveGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function boxArchiveGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('BOX_ARCHIVE_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, {
                name: 'floor',
                type: 'string',
                mapping: 'Floor_Table.name'
            }, {
                name: 'kyc_box_no',
                type: 'string',
                mapping: 'Kyc_Archive_Table.box_no'
            }, ]
        }),
        proxy: {
            type: 'ajax',
            url: '/getBoxArchiveList',
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

    var box_archive_grid = Ext.create('Ext.grid.Panel', {
        id: 'box_archive_grid',
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
            name: 'serial_no',
            id: 'box_serial_no_search',
            emptyText: 'Search By Serial Number...',
            padding: 5,
            listeners: {
                change: {
                    fn: function(field, value) {
                        box_archive_grid.paramsReload({
                            serial_no: value
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
                Ext.getCmp('box_serial_no_search').setValue(undefined);
                Ext.getCmp('box_archive_grid').getStore().load();
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
                boxArchiveFormWindow();
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
                Ext.getCmp('box_archive_grid').paramsReload();
            }
        }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50
        }), {
            header: 'SERIAL NO',
            dataIndex: 'serial_no',
            align: 'left',
            flex: 1,
        }, {
            header: 'ZONE/FLOOR',
            dataIndex: 'floor',
            align: 'left',
            editor: 'textfield',
            width: 110,
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
            flex: 1
        }, {
            header: 'TRAIN',
            dataIndex: 'train',
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
            header: 'RACK',
            dataIndex: 'rack',
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
            header: 'LEVEL',
            dataIndex: 'level',
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
            header: 'COLUMN',
            dataIndex: 'column',
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
            header: 'SIDE',
            dataIndex: 'side',
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
    return box_archive_grid;
}

function boxArchiveFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New BOX Archive ',
        modal: true,
        id: 'boxArchiveFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'textfield',
                name: 'serial_no',
                fieldLabel: 'Serial No',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                minValue: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Serial Number...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'combo',
                anyMatch: true,
                typeAhead: true,
                transform: 'stateSelect',
                forceSelection: true,
                fieldLabel: ' Box No',
                editable: true,
                multiSelect: true,
                // delimiter: ' OR ', 
                name: 'box_no',
                // allowBlank: false,
                editable: true,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Box Number...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                width: 300,
                labelWidth: 80,
                queryMode: 'local',
                displayField: 'box_no',
                valueField: 'box_no',
                selectOnFocus: true,
                triggerAction: 'all',
                store: {
                    fields: ['id', 'box_no'],
                    proxy: {
                        type: 'ajax',
                        url: '/getKycArchiveListDatas'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'combo',
                anyMatch: true,
                typeAhead: true,
                transform: 'stateSelect',
                forceSelection: true,
                name: 'floor',
                fieldLabel: 'Floor',
                allowBlank: false,
                editable: false,
                labelAlign: 'left',
                labelSeparator: '',
                width: 300,
                labelWidth: 80,
                emptyText: 'Select Floor...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                selectOnFocus: true,
                triggerAction: 'all',
                store: {
                    fields: ['id', 'name'],
                    pageSize: 0,
                    limit: 0,
                    proxy: {
                        type: 'ajax',
                        url: '/getFloorNameList',
                        reader: {
                            root: 'rows'
                        }
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, /*{
                xtype: 'combo',
                anyMatch: true,
                typeAhead: true,
                transform: 'stateSelect',
                forceSelection: true,
                fieldLabel: ' Floor',
                name: 'floor',
                allowBlank: false,
                editable: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Floor ...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                selectOnFocus: true,
                triggerAction: 'all',
                store: {
                    fields: ['id', 'name'],
                    proxy: {
                        type: 'ajax',
                        url: '/getFloorNameList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            },*/ {
                xtype: 'textfield',
                name: 'train',
                fieldLabel: 'Train',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Train...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'rack',
                fieldLabel: 'Rack',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Rack...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'level',
                fieldLabel: 'Level',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Level...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'column',
                fieldLabel: 'Column',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Column...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'side',
                fieldLabel: 'Side',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Side...',
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
                        url: '/CreateBoxArchive',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            if (response.responseText == 'Success') {
                                Ext.getCmp('box_archive_grid').getStore().load();
                                Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                                Ext.getCmp('boxArchiveFormWindow').close()
                            } else {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
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
                    Ext.getCmp('boxArchiveFormWindow').close()
                }
            }]
        })]
    }).show();
}
function floorListTab(UN) {
    if (Ext.getCmp('floor_no_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("floor_no_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Floor List',
            layout: 'fit',
            closable: true,
            id: 'floor_no_tab',
            autoScroll: true,
            items: [floorNoGrid(UN)]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function floorNoGrid(UN) {
    var store = Ext.create('Ext.data.Store', {
        pageSize: 30,
        remoteSort: true,
        autoLoad: true,
        autoSync: true,
        model: Ext.define('FLOOR_NO_MODEL', {
            extend: 'Ext.data.Model',
            fields: [{
                name: 'id',
                type: 'int'
            }, ]
        }),
        proxy: {
            type: 'ajax',
            url: '/getFloorNoList',
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

    var floor_no_grid = Ext.create('Ext.grid.Panel', {
        id: 'floor_no_grid',
        store: store,
        loadMask: true,
        columnLines: true,
        viewConfig: {
            emptyText: 'No records',
            listeners: {
                afterrender: function(self, eOpts) {}
            }
        },
        tbar: [{
            xtype: 'button',
            icon: '/public/icons/create.png',
            tooltip: 'Add New Floor',
            hidden: (UN.role < 2) ? true : false,
            border: 1,
            style: {
                borderColor: 'blue',
                borderStyle: 'solid'
            },
            handler: function() {
                floorNoFormWindow();
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
                Ext.getCmp('floor_no_grid').paramsReload();
            }
        }, gridPaging],
        columns: [Ext.create('Ext.grid.RowNumberer', {
            width: 50
        }), {
            header: 'FLOOR NAME',
            dataIndex: 'name',
            flex: 1,
            editor: 'textfield',
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'FLOOR CODE',
            dataIndex: 'code',
            flex: 1,
            editor: 'textfield',
            listeners: {
                beforerender: function(self, eOpts) {
                    if (UN.role < 2)
                        self.editor = false;
                }
            },
        }, {
            header: 'WAREHOUSE',
            dataIndex: 'warehouse_name',
            flex: 1,
            editor: 'textfield',
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
    return floor_no_grid;
}

function floorNoFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Floor List ',
        modal: true,
        id: 'floorNoFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Floor Name',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                minValue: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Floor Name...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'code',
                fieldLabel: 'Floor Code',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                minValue: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Floor Code...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'warehouse_name',
                fieldLabel: 'Warehouse',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                minValue: 0,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Warehouse Name...',
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
                        url: '/CreateFloor',
                        method: 'POST',
                        params: values,
                        success: function(response) {
                            Ext.getCmp('floor_no_grid').getStore().load();
                            Ext.MessageBox.alert('Success', 'Successfully data Inserted');
                            Ext.getCmp('floorNoFormWindow').close()
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
                    Ext.getCmp('floorNoFormWindow').close()
                }
            }]
        })]
    }).show();
}
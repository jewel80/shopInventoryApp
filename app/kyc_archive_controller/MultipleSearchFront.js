function kycMultipuleSearchUploadWindow() {
    return Ext.create('Ext.window.Window', {
        id: 'kycMultiSearchUpload',
        title: 'KYC Multiple Search',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            url: '/KYCArchiveMultipleSearch',
            bodyPadding: 20,
            border: false,
            items: [Ext.create('Ext.form.field.File', {
                name: 'multiple_search',
                filedAlign: 'top',
                allowBlank: false,
                fieldLabel: 'Excel File',
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Excel File...',
                clearOnSubmit: false,
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                // listeners: {
                //     afterrender: function(cmp) {
                //         cmp.fileInputEl.set({
                //             multiple: 'multiple'
                //         });
                //     }
                // },
                buttonConfig: {
                    icon: '/public/icons/upload.png',
                },
                autoScroll: true
            })],
            buttons: [{
                text: 'Download',
                icon: '/public/icons/excel.png',
                formBind: true,
                handler: function() {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            success: function(response, option) {
                                Ext.MessageBox.alert('success', 'Click Here  <a href = "/public/excel/KYCArchiveMultipleSearch.xlsx" target="_blank"> View Excel sheet</a>');
                                // tab_panel.setLoading(false);
                            },
                            failure: function(response, option) {},
                            warning: function(response, option) {
                                Ext.MessageBox.alert('waring ', 'There is no data aviable');
                            },
                        });
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('kycMultiSearchUpload').close();
                }
            }]
        })]
    }).show();
}
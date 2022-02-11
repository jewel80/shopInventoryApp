function XlUploadDuplicateRemoveWindow(UN) {
    return Ext.create('Ext.window.Window', {
        id: 'XlUploadDuplicateRemove',
        title: 'Upload for KYC Archive File',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            url: '/XlUploadDuplicateRemove',
            bodyPadding: 20,
            border: false,
            items: [Ext.create('Ext.form.field.File', {
                name: 'duplicate_data',
                filedAlign: 'top',
                allowBlank: false,
                fieldLabel: 'Excel File',
                width: 280,
                labelWidth: 70,
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
                text: 'Submit',
                formBind: true,
                handler: function() {
                    var form = this.up('form').getForm();
                    if (form.isValid()) {
                        form.submit({
                            waitMsg: 'Uploading your Excel file...',
                            success: function(a, b) {
                                if (b.response.responseText == 'success')
                                    Ext.MessageBox.alert('Success', 'File Upload Successfully Completed.');
                                else
                                    Ext.MessageBox.alert('Error',
                                        'Please contact with the developer');
                            },
                            failure: function(a, b) {
                                if (b.response.responseText == 'success')
                                    Ext.MessageBox.alert('Success', 'File Upload Successfully Completed.');
                                else
                                    Ext.MessageBox.alert('Error',
                                        'Please contact with the developer');
                            }
                        });
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('XlUploadDuplicateRemove').close();
                }
            }]
        })]
    }).show();
}
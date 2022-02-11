function kycArchiveFileUploadWindow(UN) {
    return Ext.create('Ext.window.Window', {
        id: 'AddNewKYCArchiveExcelFile',
        title: 'Upload KYC Archive File',
        modal: true,
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '100%',
            url: '/CreateKYCArchiveBulkUpload',
            bodyPadding: 20,
            border: false,
            items: [Ext.create('Ext.form.field.File', {
                name: 'att_file',
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
                                    Ext.MessageBox.alert('Error', 'Data not Insert. \nPossible problem could be duplicate entry');
                            },
                            failure: function(a, b) {
                                if (b.response.responseText == 'success')
                                    Ext.MessageBox.alert('Success', 'File Upload Successfully Completed.');
                                else
                                    Ext.MessageBox.alert('Error', 'Data not Insert. \nPossible problem could be duplicate entry');
                            }
                        });
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('AddNewKYCArchiveExcelFile').close();
                }
            }]
        })]
    }).show();
}
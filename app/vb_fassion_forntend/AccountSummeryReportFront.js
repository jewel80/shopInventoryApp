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
            items: []
        });
        tab_panel.setActiveTab(new_tab);
    }
}


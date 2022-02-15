var footer_panel = Ext.create('Ext.toolbar.Toolbar', {
    region: 'south',
    border: false,
    items: [{
        xtype: 'tbtext',
        text: '<b><i>Developed By Jewel Rana (Email: jewel.rana@orogenicgroup-bd.com, Contact: +880 1844-495373 )</i></b>'
    }, '->', {
        xtype: 'tbtext',
        text: '<b><i>©2019 Orogenic Resources BD Ltd. All rights reserved</i></b>'
    }]
});

var tab_panel = Ext.create('Ext.tab.Panel', {
    region: 'center',
    layout: 'border',
    bodyStyle: {
        color: '#000000',
        // backgroundImage: 'url(/public/images/orogonic_logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50% 90%',
        backgroundPosition: 'center center'
    },
    id: 'tab_panel',
    items: []
});

var navigation_panel = Ext.create('Ext.panel.Panel', {
    region: 'west',
    title: title,
    tbar: [Ext.create('Ext.Img', {
        src: '/public/icons/user.png',
        height: 30,
        width: 30,
        margins: '5 5 5 5'
    }), {
        xtype: 'tbtext',
        text: user.username
    }, '->', {
        icon: '/public/icons/shut_down.png',
        iconCls: 'add',
        name: 'sign_out',
        tooltip: 'Sign Out',
        handler: function() {
            window.location.href = site_url + 'logout';
        }
    }],
    icon: '/public/images/orogonic_logo.png',
    width: 200,
    split: true,
    collapsible: true,
    collapsed: false,
    floatable: false,
    header: false,
    layout: 'accordion',
    layoutConfig: {
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    items: [nagadNavigation(user)]
});

function nagadNavigation(user) {
    return Ext.create('Ext.tree.Panel', {
        title: title,
        icon: '/public/icons/form.png',
        collapsible: true,
        collapsed: false,
        animate: true,
        rootVisible: false,
        autoScroll: true,
        border: false,
        store: {
            proxy: {
                type: 'ajax',
                api: {
                    read: '/getNavigationTree/' + user.id
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    idProperty: 'id',
                },
            },
            root: {
                expanded: true,
                loaded: true,
            },
            autoLoad: true
        },
        listeners: {
            itemclick: function(s, r) {
                switch (r.data.text) {
                    case "User List":
                        userTab(r.data.menuData);
                        break;
                    case "Navigation List":
                        navigationTab(r.data.menuData);
                        break;
                        /////////////////////////////////
                        /////////////////////////////////
                        // case "KYC Upload File":
                        //     kycArchiveFileUploadWindow(r.data.menuData);
                        //     break;
                        //     case "Upload duplicate remove":

                    case "KYC Upload File":
                        XlUploadDuplicateRemoveWindow(r.data.menuData);
                        break;
                        /////////////////////////////////
                        /////////////////////////////////  
                    case "KYC Archive":
                        kycArchiveListTab(r.data.menuData);
                        break;
                    case "BOX Archive":
                        boxArchiveListTab(r.data.menuData);
                        break;
                    case "Floor Number":
                        floorListTab(r.data.menuData);
                        break;
                    case "KYC Report":
                        kycReportListTab(r.data.menuData);
                        break;
                    case "Multiple Search":
                        kycMultipuleSearchUploadWindow(r.data.menuData);
                        break;

                    case "Inventory Product":
                        inventoryProductTab(r.data.menuData);
                        break;
                    case "Sales Product":
                        SalesProductTab(r.data.menuData);
                        break;
                }
            }
        }
    });
}









Date.prototype.monthDays = function() {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

var site_url = window.location.href;

var changingImage = Ext.create('Ext.Img', {
    src: '/public/images/orogonic_logo.png',
    height: 25,
    width: 22,
    margins: '8 10 0 0'
});

function popFromArray(myArray, value) {
    var index = myArray.indexOf(value);
    if (index > -1) {
        myArray.splice(index, 1);
    }
}

var myRender = function(value, metaData, record, rowIndex, colIndex, store, view) {
    if (parseInt(value) == 1) {
        metaData.attr = 'style="background-color:#ffaaaa !important;"';
    }
    return value
};

var grossIncome;
var grossExpense;


Ext.define('Ext.form.field.Month', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.monthfield',
    requires: ['Ext.picker.Month'],
    alternateClassName: ['Ext.form.MonthField', 'Ext.form.Month'],
    selectMonth: null,
    emptyText: 'Select Month',
    editable: false,
    allowBlank: true,
    createPicker: function() {
        var me = this,
            format = Ext.String.format;
        return Ext.create('Ext.picker.Month', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                select: {
                    scope: me,
                    fn: me.onSelect
                },
                monthdblclick: {
                    scope: me,
                    fn: me.onOKClick
                },
                yeardblclick: {
                    scope: me,
                    fn: me.onOKClick
                },
                OkClick: {
                    scope: me,
                    fn: me.onOKClick
                },
                CancelClick: {
                    scope: me,
                    fn: me.onCancelClick
                }
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },
    onCancelClick: function() {
        var me = this;
        me.selectMonth = null;
        me.collapse();
    },
    onOKClick: function() {
        var me = this;
        if (me.selectMonth) {
            me.setValue(me.selectMonth);
            me.fireEvent('select', me, me.selectMonth);
        }
        me.collapse();
    },
    onSelect: function(m, d) {
        var me = this;
        me.selectMonth = new Date((d[0] + 1) + '/1/' + d[1]);
    }
});
Ext.override(Ext.grid.Panel, {
    paramsReload: function(a) {
        var me = this;
        var p = me.getStore().lastOptions.params,
            x = (a) ? a : {},
            y = (p) ? p : {},
            r = {};
        Object.keys(y).forEach(k => r[k] = y[k]);
        Object.keys(x).forEach(k => r[k] = x[k]);
        me.getStore().load({
            params: r,
            scope: this
        })
    }
});


Number.prototype.formatMoney = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
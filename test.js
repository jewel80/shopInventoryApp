Ext.application({
    name: 'Fiddle',

    launch: function() {

        Ext.create({
            xtype: 'polar',
            renderTo: document.body,
            width: 400,
            height: 400,
            theme: 'green',
            interactions: ['rotate', 'itemhighlight'],
            store: {
                fields: ['name', 'data1'],
                data: [{
                    name: 'metric one',
                    data1: 14
                }, {
                    name: 'metric two',
                    data1: 16
                }, {
                    name: 'metric three',
                    data1: 14
                }, {
                    name: 'metric four',
                    data1: 6
                }, {
                    name: 'metric five',
                    data1: 36
                }]
            },
            series: {
                type: 'pie',
                highlight: true,
                angleField: 'data1',
                label: {
                    field: 'name',
                    display: 'rotate'
                },
                donut: 30,
                tooltip: {
                    trackMouse: true,
                    width: 140,
                    renderer: function(tip, item) {
                        tip.setTitle(item.get('name'));
                        tip.update('Count: ' + item.get('data1'));
                    }
                }
            }
        });
    }
});
{
	"id": 1,
	"product_type": 1,
	"item_name": "Couple Ring with Box",
	"item_code": "JW003",

	"buying_price": 50,
	"buying_quantity": 9,

	"buying_quantity": 450, ["buying_price X buying_quantity"]

	"selling_price": 80,
	"Sold_Quantity": 2,  ['Total_price']

	"remaining": 7,
	"discount": 25,

	"in_date": "2022-02-11T18:01:05.462Z",
	"remark": "na",
	"Product_Type_Table": {
		"id": 1,
		"name": "Juwellery",
		"description": "Juwellery"
	},
}


------Sales--------
{
	"id": 1,
	
	"item_name": "Couple Ring with Box",
	"item_code": "JW003",

	"id": "Product__Table_ID", ['item_code { item_name will show }']
	"sales_price": 80,
	"quantity": 2,
	"discount": 25,
	'Total_price': 160 
}



------Expence(Shop)--------
{
	"id": 1,
	"date": "2022-02-11T18:01:05.462Z",
	"Reason": "kost",
	'Expence_money': 160 
}


listeners: {
                                        change: function(combo, newValue, oldValue) {
                                            // console.log({combo})
                                            // console.log({newValue})
                                            // console.log({oldValue})
                                            //combo have method get selected record using {combo.getSelection()}
                                            // var selectedRecord = combo.getSelection().data
                                            var buying_price = combo.getSelection().data.buying_price;
                                            var item_name = combo.getSelection().data.item_name;
                                            console.log({buying_price})
                                            console.log({item_name})
                                            //Instead of using Ext.getCmp() you can use up or down inside of component.
                                            // combo.up('panel').down('#fieldGroup').setValue(buying_price);
                                            combo.up('panel').down('#fieldGroup').setValue(selectedRecord.get("item_code"));
                                        }
                                    }
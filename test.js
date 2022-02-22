{
    "id": 60,
    "date": "2022-02-15T18:00:00.000Z",
    "products": 3,
    "item_name": "Genji 32 Size",
    "item_code": "jJ30",
    "sales_price": 200,
    "quantity": 1,
    "discount": 50,
    "total_price": 150,
    "remark": "NA",
    "memo_e_n": "20",
    "Inv_Product_Table": {
        "id": 3,
        "product_type": 3,
        "item_name": "Genji 32 Size",
        "item_code": "jJ30",
        "buying_price": 100,
        "buying_quantity": 5,
        "selling_price": 200,
        "sold_quantity": 5,
        "remaining": null,
        "discount": 0,
        "in_date": "2022-02-14T18:00:00.000Z",
        "remark": "HH"
    }
},

1. date
2. memo_e_n
3. item_name
4. item_code

5. quantity
6. sales_price (total_price)

7. discount
8. profit

9. remark
9. product_type (products)
9. Inv_products 













-- -- --Expence(Shop) -- -- -- --{
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
        console.log({
            buying_price
        })
        console.log({
                item_name
            })
            //Instead of using Ext.getCmp() you can use up or down inside of component.
            // combo.up('panel').down('#fieldGroup').setValue(buying_price);
        combo.up('panel').down('#fieldGroup').setValue(selectedRecord.get("item_code"));
    }
}









product_type: 1
product_item_code: 1
item_name: "Couple Ring with Box"
CurrentStock: "8"
BuyingPrice: "50"



date: "02/03/2022"
discount: "10"
quantity: "1"
remark: "na"
sales_price: "80"
const Sequelize = require('sequelize')

const sequelize = new Sequelize('feathers_db2','arief','arief',{
    operatorsAliases:false,
    dialect:'mysql'
})

class ProductModel {
    constructor(){
        this.defineSchema()
        sequelize.sync()
    }
    defineSchema(){
        this.Product = sequelize.define('product',{
            product_id:{
                type:Sequelize.STRING,
                primaryKey:true,
            },
            product_name:{
                type:Sequelize.STRING,
                allowNull:false
            },
            product_stock: {
                type:Sequelize.INTEGER,
                allowNull:false
            }
        },{
            tableName:'product',
            timestamps:false
        })
    }
    async buyProduct(productId){
        let gProduct = await this.Product.findById(productId)
        if(gProduct.product_stock <= 0 ){
             return false
        } 
        await gProduct.decrement('product_stock',{by : 1})
        return true
    }
}

module.exports = ProductModel
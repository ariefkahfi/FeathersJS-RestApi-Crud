const Sequelize = require('sequelize')

const sequelize = new Sequelize('feathers_db2','arief','arief',{
    operatorsAliases:false,
    dialect:'mysql'
})

class PersonModel { 
    constructor(){
        this.defineSchema()
        sequelize.sync()
    }
    defineSchema(){
        this.Person = sequelize.define('person',{
            person_id:{
                type:Sequelize.STRING,
                primaryKey:true,
            },
            person_name:{
                type:Sequelize.STRING,
                allowNull:false
            },
            person_age: {
                type:Sequelize.INTEGER,
                allowNull:false
            }
        },{
            tableName:'person',
            timestamps:false
        })
    }
}

module.exports = PersonModel
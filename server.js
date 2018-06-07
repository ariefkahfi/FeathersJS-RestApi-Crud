const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const fService = require('feathers-sequelize')
const PersonModel = require('./models/person')
const ProductModel = require('./models/product')
const app = express(feathers())


const productModel = new ProductModel()
const personModel = new PersonModel()



app.configure(express.rest())

app.use(express.json())
app.use('api/product',fService({
    Model:productModel.Product,
    id:'product_id'
}))
app.service('api/product').hooks({
    after:{
        find:(hookCtx)=>{
            let cResult = hookCtx.result
            hookCtx.result = {
                code: 200,
                message: cResult
            }
        },
        get:(hookCtx)=>{
            let cResult = hookCtx.result
            hookCtx.result = {
                code: 200,
                message: cResult
            }
        },
        create:(hookCtx)=>{
            hookCtx.result = {
                code: 201,
                message:'Create new product success'
            }
            return hookCtx
        },
        update:(hookCtx)=>{
            hookCtx.result = {
                code: 200,
                message:'Update product success'
            }
            return hookCtx
        }
    }
})

app.put('/api/product/:id/buy',(req,res)=>{
    productModel.buyProduct(req.params.id)
        .then(r=>{
            console.log('r::',r)
            if(!r){
                res.json({
                    code: 200,
                    message: 'Buy product fail , out of stock'
                })
                return;
            }
            res.json({
                code: 200,
                message: 'Buy product success'
            })
        })
        .catch(err=>{
            console.error('error /api/product/:id/buy')
            res.status(500).json({
                code: 500,
                message: 'ERR_INTERNAL_SERVER'
            })
            console.error(err)
        })
})



app.use('api/person',fService({
    Model: personModel.Person,
    id:'person_id'
}))
app.service('api/person').hooks({
    before:{
        create:(hookCtx)=>{
            let dPerson =  hookCtx.data
            
            dPerson.person_id = require('uniqid')()
            console.log('person::',JSON.stringify(hookCtx))
            return hookCtx
        },
        update:(hookCtx)=>{
            console.log('before_update::',hookCtx)
            return hookCtx
        }
    },
    after:{
        find:(hookCtx)=>{
            let cResult = hookCtx.result
            hookCtx.result = {
                code: 200,
                message: cResult
            }
        },
        get:(hookCtx)=>{
            let cResult = hookCtx.result
            hookCtx.result = {
                code: 200,
                message: cResult
            }
            return hookCtx
        },
        create:(hookCtx)=>{ 
            hookCtx.statusCode = 200
            hookCtx.result = {
                code: 200,
                message: 'create new person [OK]'
            }
            return hookCtx
        },
        update:(hookCtx)=>{
            hookCtx.statusCode = 200
            hookCtx.result =  {
                code: 200,
                message: 'update person [OK]'
            }
            return hookCtx
        },
        remove:(hookCtx)=>{
            hookCtx.statusCode = 200,
            hookCtx.result = {
                code: 200,
                message: 'delete person [OK]'
            }
            return hookCtx
        }
    },
    error:{
        create:(hookCtx)=>{
            return hookCtx
        },
        remove:(hookCtx)=>{
            hookCtx.statusCode = 404
            hookCtx.result = {
                code: 404,
                message: 'Data not found in our database'
            }
            return hookCtx
        }
    }
})

app.listen(9600 , ()=> console.log('listening on port 9600'))
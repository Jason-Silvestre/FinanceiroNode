const express = require("express");
const MercadoPago = require("mercadopago");
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token:"TEST-8069843486273788-012219-d8b9c8aac4ab8a3f4c5b3a925687104c-148888633"
});

app.get("/", (req, res) => {
    res.send("Olá mundo!" + Date.now());
});

app.get("/pagar",async (req, res) => {


var id = "" + Date.now();
var emailDoPagador = "jasonsilvestre34@gmail.com";
    var dados = {
        items: [
            item = {
                //UUID && Data
                id: id,
                title: "2 bíblias",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer:{
           email: emailDoPagador
        },
        external_reference:id,
    }

    try{
        var pagamento = await MercadoPago.preferences.create(dados);
        console.log(pagamento);
        //Banco.SalvarPagamento({id: id, pagador: email});
        return res.redirect(pagamento.body.init_point);
    }catch(err){
        return res.send(err.message);
    }    
});

app.post("/not",(req, res) => {
    var id = req.query.id;

    setTimeout(() => {

        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
           qs: filtro 
        }).then(data => {
         var pagamento = data.body.results[0];

         if(pagamento != undefined){
            console.log(pagamento.external_reference);
            console.log(pagamento.status);
         }else{
            console.log("Pagamento não existe")
         }
      }).catch(err => {
            console.log(err);
        });

    },20000)

    res.send("ok");
});

app.listen(80,(req, res) =>{

    console.log("Servidor rodando!");
});
var http = require("http");
var mongoose = require("mongoose")
  , Schema = mongoose.Schema;
 
mongoose.connect('mongodb://localhost/workshop-bh');
 
var db = mongoose.connection;
db.on('error', function(err){
    console.log('Erro de conexao.', err)
});
 
db.once('open', function () {
  console.log('Conexão aberta.')
});
 
var BeerSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, default: '' },
  price: { type: Number, default: '' }
});
 
var Beer = mongoose.model('Beer', BeerSchema);
 
http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("<h1>Hello World</h1>");
 
  switch(request.url){
    //Create
    case '/create':
      var dados = {
        name: "Erdinger",
        description: "Eh boa",
        type: "Dunkel",
        price: 24
      };
 
      var beer = new Beer(dados);
 
      beer.save(function(err) {
        if(err){
          console.log(err);
        } else {
          console.log('Cerveja cadastrada com sucesso');
          response.write("Cerveja cadastrada com sucesso");
        }
      });
      break;

    //Update
    case '/update':
      var dadosup = {
        description: "Eh boa, pra kario"
      };
       
      Beer.update({name: "Erdinger"}, dadosup, function(err, beer) {
        if(err) {
          console.log(err);
        } else {
          console.log(" Cerveja atualizada com sucesso");
          response.write(" Cerveja atualizada com sucesso");
        }
       });
    break;

    case '/retrieve':
    //RETRIEVE
    Beer.findOne({ "name": "Erdinger"}, function (err, beers) {
     console.log('achou algo?');
      if(err) {
        console.log('Houve algum erro, tente novamente', err);
      } else {
        console.log('Ask: '+beers.name);
        response.write('Ask: '+beers.name);
      }
    });
    break;

    case '/delete':
    Beer.remove({name: "Erdinger"}, function(err) {
      if(err) {
        console.log(err);
      } else {
        response.write('Cerveja deletada com sucesso!');
        console.log('Cerveja deletada com sucesso!');
      }
    });
    break;

    default:
      response.write('Be MEAN');
  }
  response.end();
 
  console.log(request.url);
}).listen(3000);

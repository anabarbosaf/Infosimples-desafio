const cheerio = require('cheerio');
 const request = require('request');
 // Bibliotecas nativas do Node.js
 const fs = require('fs');
 // URL do site
 const url = 'https://infosimples.com/vagas/desafio/commercia/product.html';
 // Objeto contendo a resposta final
 const respostaFinal = {};
 // Faz o request e manipula o corpo de resposta
 request(url, function (error, response, body) {
 const parsedHtml = cheerio.load(body);
 
 
 
 // Vamos pegar o título do produto, na tag H2, com ID "product_title"
 respostaFinal['title'] = parsedHtml('h2#product_title').text();


 // Aqui você adiciona os outros campos...
 const categoriesString = parsedHtml('nav.current-category').text();
 const categoriesArray = categoriesString.trim().split(/\s*>\s*/);
 respostaFinal['categories'] = categoriesArray;
 respostaFinal['brand'] = parsedHtml('div.brand').text();
 respostaFinal['description'] = parsedHtml('meta[itemprop=description]').attr('content')

respostaFinal['skus'] = [];

parsedHtml('div.card-container').each(function(index, element){
    const sku = {};
    sku['name'] = parsedHtml(this).find('div.prod-nome').eq(0).text().trim();
    sku['current-price'] = parsedHtml(this).find('div.prod-pnow').eq(0).text().trim();
    sku['old_price'] = parsedHtml(this).find('div.prod-pold').eq(0).text().trim();
    sku['available'] = parsedHtml(this).find('i').eq(0).text().trim() || 'Disponivel';
    respostaFinal['skus'].push(sku);
});

 respostaFinal['properties'] = [];

    parsedHtml('div#propadd tbody tr').each(function (index, element) {
        const property = {};
        property['label'] = parsedHtml(this).find('td').eq(0).text().trim();
        property['value'] = parsedHtml(this).find('td').eq(1).text().trim();
        respostaFinal['properties'].push(property);
    });


    parsedHtml('div#comments').each(function (index, element) {
        const property = {};
        property['label'] = parsedHtml(this).find('td').eq(0).text().trim();
        property['value'] = parsedHtml(this).find('td').eq(1).text().trim();
        respostaFinal['properties'].push(property);
    });

    const reviews = [];

    parsedHtml('div#comments').each(function(index, element) {
        const review = {};
        review['name'] = parsedHtml(this).find('.analiseusername').eq(0).text().trim();
        review['date'] = parsedHtml(this).find('.analisedate').eq(0).text().trim();
        const scoreText = parsedHtml(this).find('.analisestars').eq(0).text().trim();
        const starCount = scoreText.split('★').length - 1;
        review['score'] = parseInt(starCount);
        review['text'] = parsedHtml(this).find('p').eq(0).text().trim();
        reviews.push(review);
       
    });

    parsedHtml('div#comments').each(function(index, element) {
        const review = {};
        review['name'] = parsedHtml(this).find('.analiseusername').eq(1).text().trim();
        review['date'] = parsedHtml(this).find('.analisedate').eq(1).text().trim();
        const scoreText = parsedHtml(this).find('.analisestars').eq(1).text().trim();
        const starCount = scoreText.split('★').length - 1;
        review['score'] = parseInt(starCount);
        review['text'] = parsedHtml(this).find('p').eq(1).text().trim();
        reviews.push(review);
       
    });

    parsedHtml('div#comments').each(function(index, element) {
        const review = {};
        review['name'] = parsedHtml(this).find('.analiseusername').eq(2).text().trim();
        review['date'] = parsedHtml(this).find('.analisedate').eq(2).text().trim();
        const scoreText = parsedHtml(this).find('.analisestars').eq(2).text().trim();
        const starCount = scoreText.split('★').length - 1;
        review['score'] = parseInt(starCount);
        review['text'] = parsedHtml(this).find('p').eq(2).text().trim();
        reviews.push(review);
       
    });
    
    
    respostaFinal['reviews'] = reviews;
   

    let totalScore = 0;
    let numberOfReviews = reviews.length;
    
    reviews.forEach(function(review) {
        totalScore += review['score'];
    });
    
    const averageScore = numberOfReviews > 0 ? Math.round(totalScore / numberOfReviews) : null;
    
    respostaFinal['reviews_average_score'] = averageScore !== null ? averageScore.toFixed(1) : null;
    

    const jsonRespostaFinal = JSON.stringify(respostaFinal);

 fs.writeFile('produto.json', jsonRespostaFinal, function (err) {
 if (err) {
 // Loga o erro (caso ocorra)
 console.log(err);
 } else {
 console.log('Arquivo salvo com sucesso!');
 }
 });
 });

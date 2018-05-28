
var templateInfo = document.getElementById("header-template").innerHTML;
var template = Handlebars.compile(templateInfo);

Handlebars.registerPartial("header",
	'<div class="row" style="margin-top:5px;">'
		+'<div class="col" align="center">'
			+'<a href="index.html"><img src={{img}}></a>'
			+'<h1 class="text-center">{{title}}</h1>'
		+'</div>'
	+'</div>');
var context = template({
	title : "Générateur de fichier svg pour découpe de présentoir",
	img : "assets/img/logo_transparent.png"
}) ;

document.getElementById('content-header').innerHTML += context;

var templateInfo = document.getElementById("footer-template").innerHTML;
var template = Handlebars.compile(templateInfo);

Handlebars.registerPartial("footer",
	'<div class="footer-clean">'
		+'<footer>'
			+'<div class="container">'
				+'<div class="row justify-content-center">'
					+'<div class="col-sm-4 col-md-3 item">'
						+'<h3>Liens</h3>'
						+'<ul>'
						+'{{#each links}}'
							+'<li><a href="{{link}}">{{name}}</a></li>'
						+'{{/each}}'
						+'</ul>'
					+'</div>'
				+'<div class="col-sm-4 col-md-3 item">'
					+'<h3>Développeurs</h3>'
					+'<ul>'
					+'{{#each developpers}}'
						+'<li>{{name}}</li>'
					+'{{/each}}'
					+'</ul>'
				+'</div>'
				+'<div class="col-sm-4 col-md-3 item">'
					+'<h3>Copyright</h3>'
					+'<a rel={{copyright.rel}} href={{copyright.href}}><img alt={{copyright.img.alt}} style={{copyright.img.style}} src={{copyright.img.src}}></a>'
				+'</div>'
			+'</div>'
		+'</footer>'
	+'</div>');
var context = template({
	links : [{
		link : "http://uboopenfactory.univ-brest.fr/",
		name : "Ubo OpenFactory"
	},{
		link : "https://github.com/AlexP20000/fablab.web.plandecoupe/",
		name : "Github"
	}],
	developpers : [{
		name : "Murat Axel"
	},{
		name : "Mailliu Alexandre"
	}],
	copyright : {
		rel : "license",
		href : "http://creativecommons.org/licenses/by/4.0/",
		img : {
			alt : "Licence Creative Commons",
			style : "border-width:0",
			src : "https://i.creativecommons.org/l/by/4.0/88x31.png"
		}
		
	}
}) ;

document.getElementById('content-footer').innerHTML += context;
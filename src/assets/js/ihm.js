/**
*@module ihm
*@version 1.0
*@date 24/04/2018
*@author Axel Murat & Alexandre Mailliu
*/

/**Function to add a plank in the plank select*/

function addPlank(){

  var name = document.getElementById('pName').value;
  var lenght = Number(document.getElementById("pLenght").value);
  var width = Number(document.getElementById("pWidth").value);
  var thick = Number(document.getElementById("pThick").value);
  var planche = new Planche(name,lenght,width,thick);

  selectPlanche.push(planche);
  removeOptions(document.getElementById("selectP"));
  updateSelectPlank(selectPlanche);
}
/** Function to remove all element in the select
* @param {HTMLElement} selectbox - The select that we want to remove all element
*/
function removeOptions(selectbox)
{
  var i;
  for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
  {
    selectbox.remove(i);
  }
}
/** Function to add an option in the select
*@param {HTMLElement} selectbox - The select that we want to add an element
*@param {String} element - The String of the plank
*/
function addOption(selectBox,element){
  var option = document.createElement("option");
  option.text = element;
  selectBox.add(option);
}

/** Function that's update the select with the data of the plank array
* @param {Planche[]}
*/
function updateSelectPlank(array){
  select = document.getElementById("selectP");
  removeOptions(document.getElementById("selectP"));
  var i = 0;
  for(i = select.options.lenght - 1; i >=0; i--){
    console.log("�a remove");
    selectBox.remove(i);
  }
  for(i = 0;i<array.length;i++){
    addOption(select,array[i].name+"("+array[i].width+"x"+array[i].length+"x"+array[i].thickness+"mm)");
    select.options[i].setAttribute("id",array[i].id);
  }
}

/**
 * function to load an image in the modal for better view
 * @param {HTMLComposant} img - Image you want to load in the modal
 */
function loadImage(img){
  var modal = document.getElementById("myModal2");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");
  img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  }
}


/**
*Represent a plank
*@constructor
*@param {string} name - Name or id of the plank
*@param {integer} witdh - Witdh of the plank
*@param {integer} length - Length of the plank
*@param {integer} thickness - Thickness of the plankId
*/
var Planche = (function(){
  /** @member{integer} NextId - value for the next plank Id */
  var nextId = 1;
  return function Planche(name,width,length,thickness){
    this.name = name;
    this.width = width;
    this.length  = length;
    this.thickness = thickness;
    this.id = nextId++;
  }

})();


var modal = document.getElementById("myModal2");
var planche1 = new Planche("planche1",700,800,3);
var planche2 = new Planche("planche2",700,800,5);
/** Store the selected index in the plank select*/
var indexSelection = 0;
/** Array of planks */
var selectPlanche = [];
selectPlanche = [];
selectPlanche.push(planche1);
selectPlanche.push(planche2);
updateSelectPlank(selectPlanche);

document.getElementById("genButton").disabled = true;
document.getElementById("pButton").disabled = true;

var imgP = document.getElementById("myImg");
loadImage(imgP)
// Get the modal
if(document.getElementById("img_shema_tool_box")){
  var img = document.getElementById("img_shema_tool_box");
  loadImage(img);
}
if(document.getElementById("img_shema_boite_ouverte")){
  var img = document.getElementById("img_shema_boite_ouverte");
  loadImage(img);
}
if(document.getElementById("img_shema_boite_ferme")){
  var img = document.getElementById("img_shema_boite_ferme");
  loadImage(img);
}
if(document.getElementById("img_shema_paper_stand")){
  var img = document.getElementById("img_shema_paper_stand");
  loadImage(img);
}




/*
*Function to load the values in the form after uploading an user model
*/
function fileChangeEvent(){
  var files = document.getElementById('fileid').files;
  console.log(files);
  if (files.length <= 0) {
    return false;
  }

  var fr = new FileReader();

  fr.onload = function(e) { 
    console.log(e);
    var result = JSON.parse(e.target.result);
    selectPlanche = result.planches;
    document.getElementById("longueur").value = result.length;
    document.getElementById("largeur").value = result.width;
    document.getElementById("hauteur").value = result.height;
    document.getElementById("encoche").value = result.notch;
    document.getElementById("formCheck-1").checked = result.close;
    document.getElementById("selectP").selectedIndex = result.selectedIndex;
    document.getElementById("ormCheck-2").checked;
    document.getElementById("nombreEtage").value = result.nombreEtage;
    document.getElementById("hauteurPartieAvant").value = result.hauteurPartieAvant;
    document.getElementById("hauteurSeparation").value = result.hauteurSeparation;
    document.getElementById("angle").value = result.angle;
    updateSelectPlank(selectPlanche);
    checkValue();

  }

  fr.readAsText(files.item(0));
}


/*
* Function that's check if the data is num�ric
* @param Value - The value we want to check
* @return {Boolean} Return True or False
*/
function isNumeric(a) {
  var b = a && a.toString();
  return !$.isArray(a) && b - parseFloat(b) + 1 >= 0;
};

/*
*Function to save the user Model in JSON format and download the file
*/
function saveModelJson(){
  var jsonObj = new Object();
  jsonObj.planches = selectPlanche;
  jsonObj.length = document.getElementById("longueur").value;
  jsonObj.width = document.getElementById("largeur").value;
  jsonObj.height = document.getElementById("hauteur").value;
  jsonObj.notch = document.getElementById("encoche").value;
  if(document.getElementById("formCheck-1")){
    jsonObj.close = document.getElementById("formCheck-1").checked;
  }
  jsonObj.checkPLank = document.getElementById("formCheck-2").checked;
  if(document.getElementById("nose")){
    jsonObj.nose = document.getElementById("nose").value;
  }

  if(document.getElementById("nombreEtage")){
    jsonObj.nombreEtage = document.getElementById("nombreEtage").value;
  }

  if(document.getElementById("hauteurPartieAvant")){
    jsonObj.hauteurPartieAvant = document.getElementById("hauteurPartieAvant").value;
  }

  if(document.getElementById("hauteurSeparation")){
    jsonObj.hauteurSeparation = document.getElementById("hauteurSeparation").value;
  }

  if(document.getElementById("angle")){
    jsonObj.angle = document.getElementById("angle").value;
  }




  jsonObj.selectedIndex = indexSelection;

  var myJSON = JSON.stringify(jsonObj); 
  var encodedData = "data:image/txt;base64," + window.btoa(myJSON);
  document.getElementById("json").setAttribute("href", encodedData);
  document.getElementById("json").setAttribute("download", "model.json");
  document.getElementById("json").click();

}

/*
*Function that's check the values within the form of the modal and allow or not the user to click on the button to add plank in the select
*/
function checkValueModal(){
  var name = document.getElementById('pName').value;
  var length = Number(document.getElementById("pLenght").value);
  var width = Number(document.getElementById("pWidth").value);
  var thick = Number(document.getElementById("pThick").value);
  var valid = isNumeric(length) && isNumeric(width) && isNumeric(thick) && name && length > 0 && width > 0 && thick >0;
  document.getElementById("pButton").disabled = !valid;

}

/**
 * Function that's check the values within the form of the box and allow or not the user to click on the button to generate a svg 
 */
function checkValue() {
	var valid = true;
	for( var i = 0 ; i <  arguments.length ; i++ ) {
		var currentParameter = document.getElementById(arguments[i]).value;
		valid = valid && isNumeric(currentParameter) && currentParameter >= 0;
	}
	document.getElementById("genButton").disabled = !valid;
	return valid;
}

/*
* Function to set the var IndexSelection to the selected index of the plank select
*/
function getSelectedPlankIndex(){
  var select = document.getElementById('selectP');
  selectedOption = select.options[select.selectedIndex];
  var plankId = Number(selectedOption.getAttribute("id"));
  var i = 0;
  for(i=0;i<selectPlanche.length;i++){
    if(selectPlanche[i].id == plankId){
      indexSelection = i;
    }
  }
  svg_builder.show_layer2(); // to dynamicly change the blue wooden plate we draw when we select an other one in the list
}

/**
 *	function that return the value of the current selected option
 */
function selectedModel() {
	var select = document.getElementById('selectP2');
	selectedOption = select.options[select.selectedIndex].value;
	return selectedOption;
}

//checkValue();

/**
 * Gestion de l'affichage des erreurs.
 * @param title	: Message box title (Erreur de saisie" if null )
 * @param message	: Message to display.
 * @returns none
 */
$('.alert').alert().hide();
function DisplayError(title, message){
	// Set Title
	if( title == "") { 	$('#ErrorBoxTitle').text("Erreur de saisie");
	} else {			$('#ErrorBoxTitle').text(title);
	}
	
	// Set content
	$('#ErrorBoxMessage').html(message);
	
	// Display and close after 10 secondes
	$('.alert').fadeIn("slow");
	setTimeout(function(){
	    $(".alert").fadeOut("fast");
	}, 5000);
}
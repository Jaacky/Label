var tabItID;

function alertIt() {
  window.console.log("Button clicked");
}

function createFolder(folderName, labelFlag) {

	if (labelFlag === undefined) { // labelFlag was not passed and so creating TabIt folder
		chrome.bookmarks.create(
			{'title': folderName},
			function(newFolder) {

			}
		);
	} else { // labelFlag was passed and so create folder with TabIt folder as parent
		chrome.bookmarks.create(
			{
				'parentId': tabItID,
				'title': folderName
			},
			function(newFolder){

			}
		);
	}
	
	window.console.log(folderName + " folder created");
}

function checkTabIt() {
	chrome.bookmarks.search(
		{'title': "TabIt",
		 'url': null
		},
		function(result) {
			window.console.log("The length of TabIt is " + result.length);
			if (!result.length) {
				createFolder("TabIt");
			}

			tabItID = result[0].id;
			window.console.log("The id of TabIt is " + tabItID);
		}
	);
}

function createLabel() {
	var tabLabel = $('#tabLabel').val();
	window.console.log("Input in label field: " + !!tabLabel);
	window.console.log("The label name is: " + tabLabel);
	createFolder(tabLabel, true);
}

function tabItClick() {
	var queryInfo = {
	    currentWindow: true
  	};

	chrome.tabs.query(queryInfo, function(tabs) {
		createLabel();
		html = "";
		for (i=0; i < tabs.length; i++) {
			//window.console.log(tabs[i].url);
			var url = tabs[i].url;
			html += tabs[i].url + "</br>";
		}
		//window.console.log("html is " + html);
		addToPopup(html);

	});

	//$('#tabIt').html("<h1>open!</h1>");
}

function addToPopup(urlString) {
	$('#tabIt').html(urlString);
}

function tabIt() {
	var queryInfo = {
	    currentWindow: true
  	};

	chrome.tabs.query(queryInfo, function(tabs) {

	    var length = tabs.length;
	    console.log(length);
	    callback(length);
	});
}


function clearTabItClick() {
	chrome.bookmarks.getSubTree(tabItID, function(tabItTree) {
		var tabItSubFolders = tabItTree[0].children;
		for (i=0; i < tabItSubFolders.length; i++) {
			chrome.bookmarks.removeTree(tabItSubFolders[i].id);
		}
	});
	window.console.log("Removed all subfolders of TabIt");
}

$(document).ready(function() {
	checkTabIt();
	document.getElementById('tabItButton').addEventListener('click', tabItClick);
	document.getElementById('clearTabIt').addEventListener('click', clearTabItClick);
});
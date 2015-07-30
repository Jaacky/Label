var tabItID;

function alertIt() {
  window.console.log("Button clicked");
}

function createFolder(folderName, tabs, labelFlag) {

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
				for (i=0; i < tabs.length; i++) {
					window.console.log(tabs[i].url);
					var url = tabs[i].url;
					html += tabs[i].url + "</br>";
				}
			}
		);
	}

	window.console.log(folderName + " folder created");
}

function checkTabIt(callback) {
	chrome.bookmarks.search(
		{'title': "TabIt",
		 'url': null
		},
		function(result) {
			//window.console.log("The length of TabIt is " + result.length);
			if (!result.length) {
				createFolder("TabIt");
			}

			tabItID = result[0].id;
			//window.console.log("The id of TabIt is " + tabItID);
			console.log(typeof tabItID);
			callback();
		}
	);
}

function getAllLabels() {
	var labelNames = [];
	chrome.bookmarks.getSubTree(tabItID, function(tabItTree) {
		var tabItSubFolders = tabItTree[0].children;
		for (i=0; i < tabItSubFolders.length; i++) {
			chrome.bookmarks.get(tabItSubFolders[i].id, function(folders) {
				console.log(folders[0].title);
				$('#currentLabels').append('<option value="' + folders[0].title + '">' + folders[0].title + '</option>')
			});
		}
	});
}

/*function createLabel() {
	var tabLabel = $('#tabLabel').val();
	window.console.log("Input in label field: " + !!tabLabel);
	window.console.log("The label name is: " + tabLabel);
	createFolder(tabLabel, true);
}*/

function createBookmark(urlString) {

}

function tabItClick() {
	var queryInfo = {
	    currentWindow: true
  	};

	chrome.tabs.query(queryInfo, function(tabs) {

		//createLabel();

		// Get label value
		var tabLabel = $('tabLabel').val();
		createFolder(tabLabel, tabs, true);
		console.log(tabLabel);

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

function addToPopup(string) {
	$('#tabIt').html(string);
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
	addToPopup('');
	renderStatus('Removed all tab it folders');
	window.console.log("Removed all subfolders of TabIt");
}

$(document).ready(function() {
	checkTabIt(getAllLabels);
	document.getElementById('tabItButton').addEventListener('click', tabItClick);
	document.getElementById('clearTabIt').addEventListener('click', clearTabItClick);
});
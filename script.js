var tabItID;

function alertIt() {
  window.console.log("Button clicked");
}

function createFolder(_callback, folderName, tabs, labelFlag) {

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
					addBookmark(newFolder, tabs[i]);
				}
				_callback();
			}
		);
	}

	window.console.log(folderName + " folder created");
}

// Need to recheck if it still runs properly when no TabIt is found

function checkTabIt(callback) {
	chrome.bookmarks.search(
		{'title': "TabIt",
		 'url': null
		},
		function(result) {
			//window.console.log("The length of TabIt is " + result.length);
			if (!result.length) {
				createFolder(function(){}, "TabIt");
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
	$('#currentLabels').empty();
	$('#currentLabels').append('<option value="" disabled selected>Current Labels</option>');
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

function addBookmark(labelNode, tab) {
	chrome.bookmarks.create(
		{
			'parentId' : labelNode.id,
			'title' :  tab.title,
			'url' : tab.url
		},
		function() {
			console.log(tab.title + " bookmark created!");
		}
	);
}


function tabItClick() {
	var queryInfo = {
	    currentWindow: true
  	};

	chrome.tabs.query(queryInfo, function(tabs) {

		//createLabel();

		// Get label value
		var tabLabel;
		if ($('#tabLabel').val()) {
			tabLabel = $('#tabLabel').val();
		} else {
			var now = new Date();
			tabLabel = now.toLocaleTimeString() + now.toLocaleDateString();
		}
		console.log("tabLabel: " + tabLabel);
		createFolder(getAllLabels, tabLabel, tabs, true);
		window.console.log(tabLabel);

		html = "";
		for (i=0; i < tabs.length; i++) {
			//window.console.log(tabs[i].url);
			var url = tabs[i].url;
			html += tabs[i].url + "</br>";
		}
		//window.console.log("html is " + html);
		//addToPopup(html);
		addToPopup("Tabs saved to " + tabLabel);

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
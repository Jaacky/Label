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

function addBookmark(labelNode, tab) {
	chrome.bookmarks.create(
		{
			'parentId' : labelNode.id,
			'title' :  tab.title,
			'url' : tab.url
		},
		function() {
			//console.log(tab.title + " bookmark created!");
		}
	);
}

function checkTabIt(callback) {
	chrome.bookmarks.search(
		{'title': "TabIt",
		 'url': null
		},
		function(result) {
			if (!result.length) {
				createFolder(function(){}, "TabIt");
			}

			tabItID = result[0].id;
			console.log(typeof tabItID);
			callback();
		}
	);
}

function getAllLabels() {
	var labelNames = [];
	$('#currentLabels').empty();
	$('#currentLabels').append('<option selected value="" disabled>Current Labels</option>');
	chrome.bookmarks.getSubTree(tabItID, function(tabItTree) {
		var tabItSubFolders = tabItTree[0].children;
		for (i=0; i < tabItSubFolders.length; i++) {
			chrome.bookmarks.get(tabItSubFolders[i].id, function(folders) {
				console.log(folders[0].title);
				$('#currentLabels').append('<option class="labelOptions" id="label' + folders[0].id + '" value="' + folders[0].title + '">' + folders[0].title + '</option>')
			});
		}
	});
}

function tabItClick() {
	var queryInfo = {
	    currentWindow: true
  	};

	chrome.tabs.query(queryInfo, function(tabs) {

		// Get label value
		var tabLabel;
		if ($('#tabLabel').val()) {
			tabLabel = $('#tabLabel').val();
		} else {
			var now = new Date();
			tabLabel = now.toLocaleTimeString() + now.toLocaleDateString();
		}
		$('#tabLabel').val("");
		console.log("tabLabel: " + tabLabel);
		createFolder(getAllLabels, tabLabel, tabs, true);

		updateStatus("Tabs saved to " + tabLabel + ".");

	});
}

function clearTabItClick() {

}

function TOTALclearTabItClick() {
	chrome.bookmarks.getSubTree(tabItID, function(tabItTree) {
		var tabItSubFolders = tabItTree[0].children;
		for (i=0; i < tabItSubFolders.length; i++) {
			chrome.bookmarks.removeTree(tabItSubFolders[i].id);
		}
		getAllLabels();
	});
	updateStatus('Removed all TabIt labels and bookmarks');
}

function deleteLabel() {
	if ($('#currentLabels option:selected').val()) {
		$('#labelName').html($('#currentLabels option:selected').val());
		$('.mask').css('display', 'block');
	} else {
		updateStatus('Please choose a label to delete.');
	}
}

function confirmDeleteLabel() {
	console.log("deleteing");
	var label = $('#currentLabels option:selected').val();
	var labelID = $('#currentLabels option:selected').attr('id');
	var id = labelID.substring(5);

	chrome.bookmarks.removeTree(id, function() {
		updateStatus('Deleted ' + label + ".");
		getAllLabels();
		$('.mask').css('display', 'none');
	});

}

function openLabel() {
	if ($('#currentLabels option:selected').val()) {
		var label = $('#currentLabels option:selected').val();
		var labelID = $('#currentLabels option:selected').attr('id');
		var id = labelID.substring(5);

		chrome.bookmarks.getChildren(id, function(result) {
			var tabs = []
			for (var i=0; i<result.length; i++) {
				tabs.push(result[i].url);
			}
			chrome.windows.create({url : tabs});
		});
	} else {
		updateStatus('Please choose a label to open.');
	}
}

function findLabel(id, label) {
	chrome.bookmarks.getChildren(id,
		function(result) {
			console.log('Result length: ' + result.length);
			chrome.windows.create();
	});
}

function updateStatus(string) {
	$('#status').html(string);
}

$(document).ready(function() {
	checkTabIt(getAllLabels);
	//document.getElementById('tabItButton').addEventListener('click', tabItClick);
	//document.getElementById('clearTabIt').addEventListener('click', clearTabItClick);
	$('#tabItButton').click(function() {
		tabItClick();
	});
	$('#clearTabIt').click(function() {
		clearTabItClick();
	});
	$('#openLabel').click(function() {
		openLabel();
	});
	$('#deleteLabel').click(function() {
		deleteLabel();
	});
	$('#confirmDeleteLabel').click(function() {
		confirmDeleteLabel();
	});
});
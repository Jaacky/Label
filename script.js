var labelID;

function createFolder(_callback, folderName, tabs, labelFlag) {

	if (labelFlag === undefined) { // labelFlag was not passed and so creating Label folder
		chrome.bookmarks.create(
			{'title': folderName},
			function(newFolder) {
        labelID = newFolder.id;
        _callback();
			}
		);
	} else { // labelFlag was passed and so create folder with Label folder as parent
		chrome.bookmarks.create(
			{
				'parentId': labelID,
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

	// window.console.log(folderName + " folder created");
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

function checkLabel(callback) {
	chrome.bookmarks.search(
		{ 'title': "Label", 'url': null },
		function(result) {
			if (!result.length) {
				createFolder(callback, "Label");
        return;
			}
			labelID = result[0].id;
			callback();
		}
	);
}

function getAllLabels() {
	var labelNames = [];
	$('#currentLabels').empty();
	chrome.bookmarks.getSubTree(labelID, function(labelTree) {
		var labelSubFolders = labelTree[0].children;
    if (labelSubFolders.length == 0) {
  		$('#currentLabels').append('<option selected value="" disabled>No Labels</option>');
    } else {
      $('#currentLabels').append('<option selected value="" disabled>Current Labels</option>');
      for (i=0; i < labelSubFolders.length; i++) {
				chrome.bookmarks.get(labelSubFolders[i].id, function(folders) {
					$('#currentLabels').append('<option class="labelOptions" id="label' + folders[0].id + '" value="' + folders[0].title + '">' + folders[0].title + '</option>')
				});
			}
    }
	});
}

function addLabelClick() {
	var queryInfo = {
	    currentWindow: true
  	};
  	checkLabel(function() {
  		chrome.tabs.query(queryInfo, function(tabs) {
			// Get label value
			var labelName;

			if ($('#labelName').val()) {
				labelName = $('#labelName').val();
			} else {
				var now = new Date();
				labelName = now.toLocaleTimeString() + now.toLocaleDateString();
			}
			$('#labelName').val("");
			createFolder(getAllLabels, labelName, tabs, true);

			updateStatus("Tabs saved to " + labelName + ".");

		});
  	});
}

/*
  NOT USED, used to completely erase the label folder
*/
function TOTALclearLabelClick() {
	chrome.bookmarks.getSubTree(labelID, function(labelTree) {
		var labelSubFolders = labelTree[0].children;
		for (i=0; i < labelSubFolders.length; i++) {
			chrome.bookmarks.removeTree(labelSubFolders[i].id);
		}
		getAllLabels();
	});
	updateStatus('Removed all label bookmarks');
}

function confirmDeleteLabel() {
	var label = $('#currentLabels option:selected').val();
	var labelID = $('#currentLabels option:selected').attr('id');
	var id = labelID.substring(5);

	chrome.bookmarks.removeTree(id, function() {
		updateStatus('Deleted ' + label + ".");
		getAllLabels();
		$('.mask, .confirmContainer, .btn-confirm').css('display', 'none');
	});
}

function confirmUpdateLabel() {
	var labelName = $('#currentLabels option:selected').val();
	var labelID = $('#currentLabels option:selected').attr('id');
	var id = labelID.substring(5);

	chrome.bookmarks.removeTree(id, function() {
		var queryInfo = {
			currentWindow: true
		  };
		  checkLabel(function() {
			  chrome.tabs.query(queryInfo, function(tabs) {
				// Get label value
				createFolder(function() {
					updateStatus('Updated ' + labelName + ".");
					getAllLabels();
					$('.mask, .confirmContainer, .btn-confirm').css('display', 'none');
				}, labelName, tabs, true);
			});
		});
	});
}

function getConfirmation(action) {
	let selectedLabel = $('#currentLabels option:selected').val();
	let toDisplay = '.mask, .confirmContainer, #confirm' + action + 'Label';
	if (selectedLabel) {
		$('#maskLabelName').html(selectedLabel);
		$('#maskAction').html(action);
		$(toDisplay).css('display', 'inline-block');
	} else {
		updateStatus('Please choose a label to ' + action.toLowerCase() + '.');
	}
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
			// console.log('Result length: ' + result.length);
			chrome.windows.create();
	});
}

function updateStatus(string) {
	$('#status').html(string);
}

$(document).ready(function() {
	checkLabel(getAllLabels);

	$('#addLabelButton').click(function() {
		addLabelClick();
	});
	$('#openLabel').click(function() {
		openLabel();
	});
	$('#deleteLabel').click(function() {
		getConfirmation("Delete");
	});
	$('#updateLabel').click(function() {
		getConfirmation("Update");
	});
	$('#confirmDeleteLabel').click(function() {
		confirmDeleteLabel();
	});
	$('#confirmUpdateLabel').click(function() {
		confirmUpdateLabel();
	});
	$('.mask').click(function() {
		$('.mask').css('display', 'none');
		$('.confirmDeleteContainer, .confirmReplaceContainer, .btn-confirm').css('display', 'none');
	});
});

let LABEL_ID;
const labelIdPrefix = 'label';

function createRoot(_callback) {
	chrome.bookmarks.create(
		{ 'title': folderName },
		(newFolder) => {
			LABEL_ID = newFolder.id;
			_callback();
		}
	);
}

function createFolder(folderName, tabs, _callback) {
	chrome.bookmarks.create(
		{
			'parentId': LABEL_ID,
			'title': folderName
		},
		(newFolder) => {
			for (i=0; i < tabs.length; i++) {
				addBookmark(newFolder, tabs[i]);
			}
			_callback();
		}
	);
}

function addBookmark(labelNode, tab) {
	chrome.bookmarks.create(
		{
			'parentId' : labelNode.id,
			'title' :  tab.title,
			'url' : tab.url
		}
	);
}

function checkLabel(_callback) {
	chrome.bookmarks.search(
		{ 'title': "Label", 'url': null },
		(result) => {
			if (!result.length) {
				createRoot(_callback);
        		return;
			}
			LABEL_ID = result[0].id;
			_callback();
		}
	);
}

function getAllLabels() {
	let labelNames = [];
	$('#currentLabels').empty();
	chrome.bookmarks.getSubTree(LABEL_ID, populateDropdown);
}

function populateDropdown(labelTree) {
	let labelSubFolders = labelTree[0].children;
	if (labelSubFolders.length == 0) {
		$('#currentLabels').append(
			'<option selected value="" disabled>No Labels</option>'
		);
	} else {
		$('#currentLabels').append(
			'<option selected value="" disabled>Current Labels</option>'
		);
		for (i=0; i < labelSubFolders.length; i++) {
			chrome.bookmarks.get(labelSubFolders[i].id, addToDropdown);
		}
	}
}

function addToDropdown(folders) {
	let folder = folders[0];
	let id = labelIdPrefix + folder.id;
	$('#currentLabels').append(
		'<option class="labelOptions" id="' + id + '" value="' + folder.title + '">' + folder.title + '</option>'
	); 
}

function createLabel() {
	var queryInfo = { currentWindow: true };
  	checkLabel(() => {
  		chrome.tabs.query(queryInfo, (tabs) => {
			let labelName;

			if ($('#labelName').val()) {
				labelName = $('#labelName').val();
			} else {
				let now = new Date();
				labelName = now.toLocaleTimeString() + now.toLocaleDateString();
			}
			$('#labelName').val("");
			createFolder(labelName, tabs, getAllLabels);
			updateStatus("Tabs saved to " + labelName + ".");
		});
  	});
}

/*
  NOT USED, used to completely erase the label folder
*/
function TOTALclearLabelClick() {
	chrome.bookmarks.getSubTree(LABEL_ID, function(labelTree) {
		var labelSubFolders = labelTree[0].children;
		for (i=0; i < labelSubFolders.length; i++) {
			chrome.bookmarks.removeTree(labelSubFolders[i].id);
		}
		getAllLabels();
	});
	updateStatus('Removed all label bookmarks');
}

function deleteLabel(id, labelName) {
	chrome.bookmarks.removeTree(id, () => {
		postAction("Delete", labelName);
	});
}

function updateLabel(id, labelName) {
	chrome.bookmarks.removeTree(id, () => {
		let queryInfo = { currentWindow: true };
		checkLabel(() => {
			chrome.tabs.query(queryInfo, (tabs) => {
				createFolder(labelName, tabs, () => {
					postAction("Update", labelName); });
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

function confirmAction(action) {
	let labelName = $('#currentLabels option:selected').val();
	let labelID = $('#currentLabels option:selected').attr('id');
	let id = labelID.substring(labelIdPrefix.length);

	action(id, labelName);
}

function postAction(action, labelName) {
	updateStatus(action + 'd ' + labelName + ".");
	getAllLabels();
	$('.mask, .confirmContainer, .btn-confirm').css('display', 'none');
}

function openLabel() {
	if ($('#currentLabels option:selected').val()) {
		let label = $('#currentLabels option:selected').val();
		let labelID = $('#currentLabels option:selected').attr('id');
		let id = labelID.substring(labelIdPrefix.length);

		chrome.bookmarks.getChildren(id, (result) => {
			let tabs = []
			for (let i=0; i<result.length; i++) {
				tabs.push(result[i].url);
			}
			chrome.windows.create({ url : tabs });
		});
	} else {
		updateStatus('Please choose a label to open.');
	}
}

function updateStatus(string) {
	$('#status').html(string);
}

$(document).ready(function() {
	checkLabel(getAllLabels);

	$('#createLabel').click(function() {
		createLabel();
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
		confirmAction(deleteLabel);
	});
	$('#confirmUpdateLabel').click(function() {
		confirmAction(updateLabel);
	});
	$('.mask').click(function() {
		$('.mask').css('display', 'none');
		$('.confirmDeleteContainer, .confirmReplaceContainer, .btn-confirm').css('display', 'none');
	});
});

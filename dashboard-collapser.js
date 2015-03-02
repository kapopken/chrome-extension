var dashboardCollapser = {
	chooserId: "project-chooser",
	allGroupsValue: "~all~",
	projectGroupIds: [],

	groupingId: function(groupName) {
		return groupName.toLowerCase().replace(/[^a-z0-9]/g,'') + "-grouping";
	},

	createChooser: function ()
	{
		var chooser = document.createElement("select");
		chooser.id = this.chooserId;
		chooser.onchange = this.showOnlygroup;
		chooser.className = "grouping-chooser";
		
		var item = document.createElement("option");
		item.value = this.allGroupsValue;
		item.innerHTML = "~ All ~";

		chooser.appendChild(item);

		return chooser;
	},

	addGroupToChooser: function(node)
	{
		var projectHeader = node.getElementsByTagName("H3")[0];
		var groupName = projectHeader.innerText;

		node.id = this.groupingId(groupName);
		var item = document.createElement("option");
		item.value = node.id;
		item.innerHTML = groupName;
		
		var chooser = document.getElementById(this.chooserId);
		chooser.appendChild(item);

		this.projectGroupIds.push(node.id);

		console.debug('Project group added: ' + groupName);
	},

	showOnlygroup: function(event) {
		var showGroups = [];

		var groupingId = event.target.value;
		if (groupingId == dashboardCollapser.projectGroupIds)
		{
			showGroups = dashboardCollapser.projectGroupIds;
		}
		else
		{
			showGroups.push(groupingId);
		}

		commonpygmy.showItems(dashboardCollapser.projectGroupIds, showGroups,
			'block', 'none');
	},

	nodeInsertion: function(event)
	{
		// Catch Angular messing with the DOM.
		var node = event.target;
		if (node.nodeType != 1) return;

		if (node.parentNode.tagName == 'FASTBOARD')
		{
			dashboardCollapser.addGroupToChooser(node);
		}
		
		if (node.tagName == 'H1' && node.innerText == 'Dashboard') {
			console.log('Setting up dashboard filter');
			var filterInput = dashboardCollapser.createChooser();
			commonpygmy.addFilterInput(filterInput, node.parentNode);
		}
	}

}

function startDashboardCollapser()
{
	if (window.location.pathname != '/app' || document.title.indexOf("Octopus Deploy") < 0) return; // Only run for the dashboard

	console.debug("Adding dom listener.")
	var body = document.getElementById("body");
	body.addEventListener("DOMNodeInserted", function(event)
	{
		dashboardCollapser.nodeInsertion(event);
		environmentCollapser.nodeInsertion(event);
		environmentRoleNameFilter.nodeInsertion(event);
	});
}

startDashboardCollapser();
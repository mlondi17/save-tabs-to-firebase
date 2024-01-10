const iframe = document.getElementById('iframe')


function getTabPropsForSaving(chromeTab) {
  return {
    groupId: chromeTab.groupId,
    pinned: chromeTab.pinned,
    url: chromeTab.url,
    windowId: chromeTab.windowId,
  };
}
function getGroupPropsForSaving(group) {
  return {
    collapsed: group.collapsed,
    color: group.color,
    title: group.title,
  };
}

async function getDataForSaving(tabs) {
  const allTabData = { tabs: []};

  for (let i = 0; i < tabs.length; ++i) {
    // get tabs data
    const newTab = getTabPropsForSaving(tabs[i]);
    allTabData.tabs.push(newTab);
    
    // get groups data
    if (
      newTab.groupId == -1 ||
      Object.prototype.hasOwnProperty.call(allTabData.groups, newTab.groupId)
    ) {
      continue;
    }
    const chromeGroup = await chrome.tabGroups.get(newTab.groupId);
    allTabData.groups[newTab.groupId] = getGroupPropsForSaving(chromeGroup);
  };
  console.log(allTabData);
  return allTabData;
  
}



document.getElementById("init").onclick = async() => {
  const tabs = await chrome.tabs.query({});
  const allTabData = await getDataForSaving(tabs);

  // Send data to sandbox.js using postMessage
  iframe.contentWindow.postMessage({ action: "saveData", data: allTabData }, "*");
};



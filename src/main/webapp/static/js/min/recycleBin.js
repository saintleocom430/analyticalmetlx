var RecycleBin=function(){var e=[],d={},h={},f=function(){d.jsGrid("loadData");var a=d.jsGrid("getSorting");"field"in a&&d.jsGrid("sort",a)};$(function(){d=$("#recycleBinDatagrid");h=d.find(".actionButtons").clone();d.empty();var a=function(b){jsGrid.Field.call(this,b)};a.prototype=new jsGrid.Field({sorter:function(b,a){return new Date(b)-new Date(a)},itemTemplate:function(b){return(new Date(b)).toLocaleString()},insertTemplate:function(b){return""},editTemplate:function(b){return""},insertValue:function(){return""},
editValue:function(){return""}});jsGrid.fields.dateField=a;d.jsGrid({width:"100%",height:"auto",inserting:!1,editing:!1,sorting:!0,paging:!0,noDataContent:"No deleted content",controller:{loadData:function(b){if("sortField"in b){var a=_.sortBy(g(),function(a){return a[b.sortField]});"sortOrder"in b&&"desc"==b.sortOrder&&(a=_.reverse(a));return a}return g()}},pageLoading:!1,fields:[{name:"url",type:"text",title:"Preview",readOnly:!0,sorting:!1,itemTemplate:function(a,c){return $("<img/>",{src:c.canvas,
"class":"stanzaThumbnail",style:"width:100%;height:160px;cursor:zoom-in"}).on("click",function(){var a=sprintf("Deleted content from %s at %s on slide %s",c.author,new Date(c.timestamp),c.slide);$.jAlert({title:a,closeOnClick:!0,width:"90%",content:$("<img/>",{src:c.canvas})[0].outerHTML})})}},{name:"slide",type:"number",title:"Slide",readOnly:!0},{name:"timestamp",type:"dateField",title:"When",readOnly:!0},{name:"author",type:"text",title:"Who",readOnly:!0},{name:"privacy",type:"text",title:"Privacy",
readOnly:!0},{name:"identity",type:"text",title:"actions",readOnly:!0,sorting:!1,itemTemplate:function(a,c){var d=h.clone();d.find(".restoreContent").on("click",function(){var a=c.clone(),b=sprintf("%s_%s",(new Date).getTime(),c.identity).substr(0,64);a.identity=b;b={type:"undeletedCanvasContent",author:UserSettings.getUsername(),timestamp:(new Date).getTime(),slide:c.slide,privacy:c.privacy,target:c.target,elementType:c.type,oldIdentity:c.identity,newIdentity:b};sendStanza(a);sendStanza(b)});return d}}]});
d.jsGrid("sort",{field:"timestamp",order:"desc"});f()});var g=function(){if(Conversations.shouldModifyConversation())return e;var a=UserSettings.getUsername();_.filter(e,function(b){return b.author=a})},k=function(){e=[]},l=function(a,b){e.push(a);f()};Progress.onConversationJoin.RecycleBin=k;Progress.historyReceived.RecycleBin=function(a){try{"type"in a&&"history"==a.type&&(k(),_.forEach(a.deletedCanvasContents,function(a){l(a,!0)}),f())}catch(b){console.log("RecycleBin.historyReceivedFunction",
b)}};Progress.onCanvasContentDeleted.RecycleBin=l;Progress.stanzaReceived.RecycleBin=function(a){void 0!=a&&"type"in a&&"undeletedCanvasContent"==a.type&&(e=_.filter(e,function(b){return"elementType"in a&&"oldIdentity"in a&&a.elementType!=b.type&&a.oldIdentity!=b.identity}),f())};$(function(){$("#menuRecycleBin").on("click",function(){showBackstage("recycleBin");f()})});return{getAllDeletedContent:function(){return g()},reRender:f}}();
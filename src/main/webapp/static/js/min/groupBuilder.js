var GroupBuilder=function(){var k={},h={},l=[],d="byMaximumSize",q=!1,e={byTotalGroups:5,byMaximumSize:4},r=function(a){return $("<div />",{"class":"groupBuilderMember",text:a})},v=function(a){var c=a.foreignRelationship;return c?sprintf("%s@%s",c.key,c.system):a.name},u=function(){return _.flatMap(k,function(a){return _.map(a.groups,function(a){var b={};_.each(a.members,function(a){b[a.name]=!0});return b})})},w=function(){var a=$(".jAlert .groupSlideDialog").find(".importGroups").empty();$("<input />",
{type:"radio",name:"groupSetSelector",id:"clearGroups"}).on("click",function(){k={};m()}).appendTo(a).prop("checked",!0);$("<label />",{"for":"clearGroups"}).append($("<span />",{"class":"icon-txt",text:"No long-term groups"})).appendTo(a);var c=0;console.log(h);_.each(h,function(b){_.each(b,function(b){var f=b.orgUnit;if(f){var n=$("<div />",{}).appendTo(a),t=b.groupSet,d=$("<div />",{}).appendTo(n),n=$("<div />",{"class":"flex-container-responsive"}).appendTo(d),h=sprintf("structuralGroup_%s",c),
e=v(t);$("<input />",{type:"radio",name:"groupSetSelector",id:h}).on("click",function(){e in k?delete k[e]:k={cacheKey:t};m()}).appendTo(n).prop("checked",e in k);$("<label />",{"for":h}).append($("<span />",{"class":"icon-txt",text:sprintf("Copy %s from %s",t.name,f.name)})).appendTo(n);_.each(b.groups,function(a){var b=$("<div />",{"class":"groupBuilderGroup"}).appendTo(d);_.each(a.members,function(a){r(a.name).appendTo(b)})});c++}})})},x=function(a,c,b){console.log(a,c,b);var g=u();switch(b){case "allPresent":b=
Participants.getParticipants();break;default:b=Participants.getPossibleParticipants()}b=_.without(b,Conversations.getCurrentConversation().author);b=_.omitBy(b,function(a){return _.some(g,function(b){return a in b})});var f;switch(a){case "byTotalGroups":for(a=g.length;a<parseInt(c);a++)g.push({});f=function(a){_.sortBy(g,function(a){return _.keys(a).length})[0][a]=!0};break;case "byMaximumSize":f=function(a){var b=_.find(g,function(a){return _.keys(a).length<parseInt(c)});b||(b={},g.push(b));b[a]=
!0}}_.each(b,f);console.log(g);return _.map(g,_.keys)},y=function(a){_.each([["Show me all my enrolled students","allEnrolled"],["Only show me students who are here right now","allPresent"]],function(c){$("<option />",{text:c[0],value:c[1]}).appendTo(a)})},z=function(a){_.each([["there are","byTotalGroups"],["each has","byMaximumSize"]],function(c){$("<option />",{text:c[0],value:c[1]}).appendTo(a)})},p=function(){var a=$("#groupsPopup");$("#groupComposition");a.find(".importGroups").empty();var c=
a.find(".groups").empty(),b=Conversations.getCurrentSlide();b&&_.each(b.groupSets,function(a){_.each(_.sortBy(a.groups,"title"),function(f){var d=$("<div />",{"class":"groupBuilderGroup"}).appendTo(c).droppable({drop:function(c,d){var e=$(d.draggable).find(".groupBuilderMember").addBack(".groupBuilderMember");console.log("Dropped",$(d.draggable),e);_.each(e,function(c){var d=$(c).text();console.log("Drop member",d);_.includes(f.members,d)||(_.each(a.groups,function(a){a.members=_.without(a.members,
d)}),f.members.push(d),p(),Conversations.overrideAllocation(b))});c.preventDefault()}});$("<div />",{"class":"title",text:sprintf("Group %s",f.title)}).appendTo(d);_.each(f.members,function(a){r(a).appendTo(d).draggable()})})})},m=function(a){var c=$(".jAlert .groupSlideDialog").find(".groups");a=a||x(d,e[d],q);c.empty();_.each(a,function(b){console.log(b);var d=$("<div />",{"class":"groupBuilderGroup ghost"});_.each(b,function(a){r(a).draggable().appendTo(d)});d.droppable({drop:function(c,d){var e=
$(d.draggable).text();_.each(a,function(a){_.includes(a,e)&&a.splice(a.indexOf(e),1)});b.push(e);l=a;m(a);c.preventDefault()}});d.appendTo(c)});l=a};Progress.groupProvidersReceived.GroupBuilder=function(a){var c=$(".jAlert .ouSelector").empty();$("<option />",{text:"no starting groups",value:"NONE",selected:!0}).appendTo(c);_.each(a.groupsProviders,function(a){$("<option />",{text:a,value:a}).appendTo(c)});c.on("change",function(){var a=$(this).val();"NONE"!=a&&getOrgUnitsFromGroupProviders(a)})};
Progress.groupsReceived.GroupBuilder=function(a){var c=h[a.orgUnit.name];void 0===c&&(c={},h[a.orgUnit.name]=c);c[a.groupSet.name]=a;w()};Progress.onBackstageShow.GroupBuilder=function(a){"groups"==a&&p()};Progress.currentSlideJidReceived.GroupBuilder=function(){"groups"==currentBackstage&&p()};Progress.conversationDetailsReceived.GroupBuilder=function(){"groups"==currentBackstage&&p()};return{showAddGroupSlideDialog:function(){getGroupsProviders();var a=$("#groupSlideDialog").clone().show();$.jAlert({title:"Add Group page",
width:"75%",content:a[0].outerHTML,btns:[{text:"Add page",theme:"green",closeAlert:!0,onClick:function(){var a=0<l.length?l:_.map(u(),_.keys);Conversations.addGroupSlide(d,parseInt(e[d]),a);k={};l=[];h={}}}]});var a=$(".jAlert .groupSlideDialog"),c=a.find(".strategySelect"),b=a.find(".parameterSelect"),g=a.find(".presentStudentsOnly");a.find(".groups");z(c);y(g);a.on("change",".presentStudentsOnly",function(){q=$(this).val();console.log(q);m()});a.on("change",".strategySelect",function(){d=$(this).val();
console.log("Strategy set:",d);b.empty();switch(d){case "byTotalGroups":_.each(_.range(2,10),function(a){$("<option />",{text:sprintf("%s groups in total",a),value:a.toString()}).appendTo(b)});b.val(e[d]).change();break;case "byMaximumSize":_.each(_.range(1,10),function(a){$("<option />",{text:1==a?"only one member":sprintf("at most %s members",a),value:a.toString()}).appendTo(b)}),b.val(e[d]).change()}});a.on("change",".parameterSelect",function(){console.log("change parameter",e);e[d]=$(this).val();
m()});c.val(d).change()},getExternalGroups:function(){return h}}}();
